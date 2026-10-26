import { checkAdminSession } from "@/lib/auth-check";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) {
      return authCheck.response;
    }
    const [tripsCount, bookingsCount, enquiriesCount, pagesCount] = await Promise.all([
      prisma.trip.count(),
      prisma.booking.count(),
      prisma.enquiry.count(),
      prisma.page.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          trips: tripsCount,
          bookings: bookingsCount,
          enquiries: enquiriesCount,
          pages: pagesCount,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
