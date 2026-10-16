import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [productsCount, blogsCount, eventsCount, enquiriesCount] = await Promise.all([
      prisma.product.count ? prisma.product.count() : 12,
      prisma.blogPost.count ? prisma.blogPost.count() : 4,
      prisma.event.count ? prisma.event.count() : 2,
      prisma.enquiry.count ? prisma.enquiry.count() : 2,
    ]);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          products: productsCount,
          categories: 4,
          blogs: blogsCount,
          events: eventsCount,
          enquiries: enquiriesCount,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
