import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/auth-check";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { isWebsiteRequest } from "@/lib/revalidateWebsite";
import { sendCallBackAlert } from "@/lib/websiteMail";
import { after } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) {
      return authCheck.response;
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};
    if (status && status !== "all") {
      where.status = { equals: status, mode: "insensitive" };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { tripName: { contains: search, mode: "insensitive" } },
      ];
    }

    const callBacks = await prisma.callBackRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      ...(limit ? { take: parseInt(limit, 10) } : {}),
    });

    return NextResponse.json({ success: true, data: callBacks });
  } catch (error) {
    console.error("Error fetching call-backs:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!isWebsiteRequest(request)) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    // Rate limit submissions: 10 per 15 minutes per visitor
    const clientIp = request.headers.get("x-client-ip") || getClientIp(request);
    const limitResult = rateLimit(`callback_${clientIp}`, 10, 15 * 60 * 1000);
    if (!limitResult.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { name, phone, bestTime, tripId, tripName, tripUrl } = body;

    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { success: false, error: "Name and phone number are required" },
        { status: 400 },
      );
    }

    const validTime = ["Anytime", "Morning", "Afternoon", "Evening"].includes(bestTime)
      ? bestTime
      : "Anytime";

    const callBack = await prisma.callBackRequest.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        bestTime: validTime,
        tripId: tripId ?? null,
        tripName: tripName ?? null,
        tripUrl: tripUrl ?? null,
        status: "Pending",
      },
    });

    // Alert admin asynchronously
    after(async () => {
      try {
        await sendCallBackAlert({
          name: callBack.name,
          phone: callBack.phone,
          bestTime: callBack.bestTime,
          tripId: callBack.tripId ?? undefined,
          tripName: callBack.tripName ?? undefined,
          tripUrl: callBack.tripUrl ?? undefined,
        });
      } catch (err) {
        console.error("[callbacks] Failed to send email alert:", err);
      }
    });

    return NextResponse.json({ success: true, callBack });
  } catch (error) {
    console.error("Error creating call-back request:", error);
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
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "id is required" }, { status: 400 });
    }

    const data: any = {};
    if (status !== undefined) data.status = status;
    if (notes !== undefined) data.notes = notes;

    const updated = await prisma.callBackRequest.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating call-back request:", error);
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

    await prisma.callBackRequest.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting call-back request:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

