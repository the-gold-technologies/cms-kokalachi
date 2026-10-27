import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/auth-check";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { isWebsiteRequest } from "@/lib/revalidateWebsite";
import { sendAdminLeadAlert, sendCustomerConfirmation } from "@/lib/websiteMail";
import { after } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) {
      return authCheck.response;
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? "";
    const status = searchParams.get("status") ?? "";

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { tripName: { contains: search, mode: "insensitive" } },
      ];
    }

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

// Bookings are created only by the website's server (it prices the trip), never by browsers directly
export async function POST(request: Request) {
  try {
    if (!isWebsiteRequest(request)) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const clientIp = request.headers.get("x-client-ip") || getClientIp(request);
    const limitResult = rateLimit(`booking_${clientIp}`, 10, 15 * 60 * 1000);
    if (!limitResult.success) {
      return NextResponse.json(
        { success: false, error: "Too many bookings submitted. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      guests,
      tripId,
      tripName,
      departureId,
      departureDate,
      totalAmount,
      specialRequests,
    } = body;

    if (!name || !email || !phone || !tripId || !tripName || typeof totalAmount !== "number") {
      return NextResponse.json(
        {
          success: false,
          error: "name, email, phone, tripId, tripName and totalAmount are required",
        },
        { status: 400 },
      );
    }

    const created = await prisma.booking.create({
      data: {
        name: String(name).slice(0, 120).trim(),
        email: String(email).slice(0, 150).trim(),
        phone: String(phone).slice(0, 40).trim(),
        guests: Number.isInteger(guests) && guests > 0 ? guests : 1,
        tripId: String(tripId).slice(0, 150),
        tripName: String(tripName).slice(0, 200),
        departureId: departureId ? String(departureId).slice(0, 150) : null,
        departureDate: departureDate ? String(departureDate).slice(0, 100) : null,
        totalAmount,
        specialRequests: specialRequests ? String(specialRequests).slice(0, 3000).trim() : null,
      },
    });

    // Admin alert (ADMIN_NOTIFICATION_EMAIL) + confirmation to the traveller, sent after the response
    // so a slow or failing mail server never delays or loses a booking
    const mailData = {
      ...created,
      departureDate: created.departureDate ?? undefined,
      specialRequests: created.specialRequests ?? undefined,
    };
    after(async () => {
      const results = await Promise.allSettled([
        sendAdminLeadAlert(mailData),
        sendCustomerConfirmation(mailData),
      ]);
      results.forEach((r) => {
        if (r.status === "rejected") console.error("[mail] Booking email failed:", r.reason);
      });
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) {
      return authCheck.response;
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "ID and status are required" },
        { status: 400 },
      );
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating booking status:", error);
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
      return NextResponse.json(
        { success: false, error: "Booking ID is required" },
        { status: 400 },
      );
    }

    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
