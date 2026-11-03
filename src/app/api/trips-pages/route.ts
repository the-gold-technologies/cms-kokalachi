import { checkAdminSession } from "@/lib/auth-check";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cleanupObsoleteCloudinaryAssets } from "@/lib/cloudinaryCleanup";
import { revalidateWebsite, WebsiteTag } from "@/lib/revalidateWebsite";
import {
  TRIPS_PAGE_SLUG,
  TRIPS_SECTION_KEYS,
  isTripsSectionKey,
  normalizeTripsSection,
} from "@/lib/tripsPageContent";
import { PAGE_SEO_SELECT, listTripsSubPages } from "@/lib/tripsSubPages";

export const dynamic = "force-dynamic";

// Content for the website's /trips pages, straight from the database (seeded by prisma/seed-trips.js).
// sections: { [sectionType]: content } for the All Trips page; seo: its SEO (SEO → Page Settings).
// pages: the sub-pages (/trips/<slug>) in tab order, each with its content and SEO.
// Public: the website reads this.
export async function GET() {
  try {
    const [page, pages] = await Promise.all([
      prisma.page.findUnique({
        where: { slug: TRIPS_PAGE_SLUG },
        select: { ...PAGE_SEO_SELECT, sections: { orderBy: { order: "asc" } } },
      }),
      listTripsSubPages(),
    ]);

    const sections: Record<string, unknown> = {};
    for (const section of page?.sections ?? []) {
      sections[section.type] = section.content;
    }

    const seo = page ? (({ sections: _sections, ...rest }) => rest)(page) : null;
    return NextResponse.json({ success: true, data: { sections, seo, pages } });
  } catch (error) {
    console.error("Error fetching trips page content:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

// Saves an All Trips section: { section: "AllTripsSection", content: {...} }
export async function PUT(request: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) {
      return authCheck.response;
    }
    const body = await request.json().catch(() => null);
    if (
      !isTripsSectionKey(body?.section) ||
      typeof body?.content !== "object" ||
      body.content === null
    ) {
      return NextResponse.json(
        { success: false, error: "Unknown section or missing content" },
        { status: 400 },
      );
    }

    const content = normalizeTripsSection(body.section, body.content);

    const page = await prisma.page.upsert({
      where: { slug: TRIPS_PAGE_SLUG },
      create: {
        title: "Trips",
        slug: TRIPS_PAGE_SLUG,
        type: "Main Page",
        visibility: "published",
        isStatic: true,
      },
      update: {},
    });

    const existing = await prisma.section.findFirst({
      where: { pageId: page.id, type: body.section },
    });
    if (existing) {
      await prisma.section.update({
        where: { id: existing.id },
        data: { content: content as any },
      });
      cleanupObsoleteCloudinaryAssets(existing.content, content).catch((err) =>
        console.error("Cleanup error:", err),
      );
    } else {
      await prisma.section.create({
        data: {
          pageId: page.id,
          type: body.section,
          content: content as any,
          order: TRIPS_SECTION_KEYS.indexOf(body.section) + 1,
        },
      });
    }

    // The navbar's Trips menu and the footer use this content too
    revalidateWebsite(WebsiteTag.page(TRIPS_PAGE_SLUG), WebsiteTag.site);
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error("Error updating trips page content:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
