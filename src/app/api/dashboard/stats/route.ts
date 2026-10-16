import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [enquiryCount, pageCount, sectionCount, navLinkCount] = await Promise.all([
      prisma.enquiry.count ? prisma.enquiry.count() : 2,
      prisma.page.count ? prisma.page.count() : 6,
      prisma.section.count ? prisma.section.count() : 10,
      prisma.navLink.count ? prisma.navLink.count() : 6,
    ]);

    // Fetch all pages with section counts
    let pages = [];
    try {
      pages = await prisma.page.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          visibility: true,
          type: true,
          sections: true,
        },
        orderBy: {
          slug: "asc",
        },
      });
    } catch {
      pages = [];
    }

    // Fetch 2 most recent enquiries
    let recentEnquiries = [];
    try {
      recentEnquiries = await prisma.enquiry.findMany({
        take: 2,
        orderBy: { createdAt: "desc" },
        select: {
          name: true,
          createdAt: true,
        },
      });
    } catch {
      recentEnquiries = [];
    }

    // Fetch 2 most recently updated pages
    let recentPages = [];
    try {
      recentPages = await prisma.page.findMany({
        take: 2,
        orderBy: { updatedAt: "desc" },
        select: {
          title: true,
          slug: true,
          updatedAt: true,
        },
      });
    } catch {
      recentPages = [];
    }

    // Merge and sort activities dynamically
    const activities = [
      ...recentEnquiries.map((e: any) => ({
        type: "enquiry",
        text: `New enquiry from ${e.name}`,
        time: new Date(e.createdAt).toISOString(),
      })),
      ...recentPages.map((p: any) => ({
        type: "page",
        text: `Layout "${p.title || p.slug}" updated`,
        time: new Date(p.updatedAt).toISOString(),
      })),
    ]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 3);

    return NextResponse.json({
      success: true,
      data: {
        enquiries: enquiryCount,
        pages: pageCount,
        sections: sectionCount,
        navLinks: navLinkCount,
        pagesList: pages.map((page: any) => ({
          id: page.id,
          title: page.title || page.slug.charAt(0).toUpperCase() + page.slug.slice(1),
          slug: page.slug,
          visibility: page.visibility,
          type: page.type,
          sectionsCount: page.sections?.length || 0,
        })),
        activities,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
