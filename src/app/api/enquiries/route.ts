import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEnquiryNotificationEmail } from "@/lib/mail";
import { checkAdminSession } from "@/lib/auth-check";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) {
      return authCheck.response;
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");

    const enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: "desc" },
      ...(limit ? { take: parseInt(limit, 10) } : {}),
    });

    return NextResponse.json({ success: true, data: enquiries });
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Rate limit public submissions: 10 per 15 minutes per IP
    const clientIp = getClientIp(request);
    const limitResult = rateLimit(`enquiry_${clientIp}`, 10, 15 * 60 * 1000);
    if (!limitResult.success) {
      return NextResponse.json(
        { success: false, error: "Too many enquiries submitted. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      journey,
      travelDate,
      groupSize,
      message,
      hearAboutUs,
      status = "Pending",
    } = body;

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        {
          success: false,
          error: "Name and at least one contact method (email or phone) are required",
        },
        { status: 400 }
      );
    }

    // Basic sanitization
    const cleanName = String(name).slice(0, 120).trim();
    const cleanEmail = email ? String(email).slice(0, 150).trim() : "noemail@provided.com";
    const cleanPhone = phone ? String(phone).slice(0, 40).trim() : "";
    const cleanJourney = journey ? String(journey).slice(0, 150).trim() : null;
    const cleanTravelDate = travelDate ? String(travelDate).slice(0, 100).trim() : null;
    const cleanGroupSize = groupSize ? String(groupSize).slice(0, 50).trim() : null;
    const cleanMessage = message ? String(message).slice(0, 3000).trim() : "";
    const cleanHearAboutUs = hearAboutUs ? String(hearAboutUs).slice(0, 100).trim() : null;

    const created = await prisma.enquiry.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        journey: cleanJourney,
        travelDate: cleanTravelDate,
        groupSize: cleanGroupSize,
        message: cleanMessage,
        hearAboutUs: cleanHearAboutUs,
        status: status || "Pending",
      },
    });

    sendEnquiryNotificationEmail(created).catch((mailErr) => {
      console.error("Async email dispatch failed for enquiry:", mailErr);
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error("Error submitting enquiry:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) {
      return authCheck.response;
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "id and status are required" },
        { status: 400 }
      );
    }

    const updated = await prisma.enquiry.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating enquiry:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) {
      return authCheck.response;
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "id is required" }, { status: 400 });
    }

    await prisma.enquiry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
