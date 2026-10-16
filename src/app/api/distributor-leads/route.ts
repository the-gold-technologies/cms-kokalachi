import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendDistributorLeadNotificationEmail } from "@/lib/mail";

export async function GET(request: Request) {
  try {
    const leads = await prisma.distributorApplication.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: leads });
  } catch (error) {
    console.error("Error fetching distributor leads:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      firmName,
      email,
      phone,
      city,
      state,
      existingBusiness,
      annualTurnover,
      experienceYears,
      message,
    } = body;

    if (!name || !firmName || !phone) {
      return NextResponse.json(
        { success: false, error: "Name, firm name, and phone number are required" },
        { status: 400 },
      );
    }

    const created = await prisma.distributorApplication.create({
      data: {
        name,
        firmName,
        email: email || "noemail@provided.com",
        phone,
        city: city || "N/A",
        state: state || "N/A",
        existingBusiness: existingBusiness || null,
        annualTurnover: annualTurnover || null,
        experienceYears: experienceYears || null,
        message: message || null,
        status: "Pending",
      },
    });

    // Fire email notifications asynchronously without blocking the response
    sendDistributorLeadNotificationEmail(created).catch((mailErr) => {
      console.error("Async email dispatch failed for distributor lead:", mailErr);
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error("Error submitting distributor lead:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "id and status are required" },
        { status: 400 },
      );
    }

    const updated = await prisma.distributorApplication.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating lead status:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "id is required" }, { status: 400 });
    }

    await prisma.distributorApplication.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting lead:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
