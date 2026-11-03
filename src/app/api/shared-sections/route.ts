import { checkAdminSession } from "@/lib/auth-check";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cleanupObsoleteCloudinaryAssets } from "@/lib/cloudinaryCleanup";
import { revalidateWebsite, WebsiteTag } from "@/lib/revalidateWebsite";
import {
  SHARED_PAGE_SLUG,
  SHARED_SECTION_KEYS,
  isSharedSectionKey,
  normalizeSharedSection,
} from "@/lib/sharedSections";

export const dynamic = "force-dynamic";

// Sections shown on many website pages (see src/lib/sharedSections.ts), straight from the database.
// data: { [sectionType]: content } for the sections that exist.
export async function GET() {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: SHARED_PAGE_SLUG },
      include: { sections: { orderBy: { order: "asc" } } },
    });

    const data: Record<string, unknown> = {};
    for (const section of page?.sections ?? []) {
      data[section.type] = section.content;
    }
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching shared sections:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

// Saves one section: { section: "UpcomingJourneysStripSection", content: {...} }
export async function PUT(request: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) {
      return authCheck.response;
    }
    const body = await request.json().catch(() => null);
    if (
      !isSharedSectionKey(body?.section) ||
      typeof body?.content !== "object" ||
      body.content === null
    ) {
      return NextResponse.json(
        { success: false, error: "Unknown section or missing content" },
        { status: 400 },
      );
    }

    const content = normalizeSharedSection(body.section, body.content);

    const page = await prisma.page.upsert({
      where: { slug: SHARED_PAGE_SLUG },
      create: {
        title: "Shared Sections",
        slug: SHARED_PAGE_SLUG,
        type: "Shared",
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
          order: SHARED_SECTION_KEYS.indexOf(body.section) + 1,
        },
      });
    }

    // Shown across the site, so refresh every page (the site tag is read by the root layout)
    revalidateWebsite(WebsiteTag.page(SHARED_PAGE_SLUG), WebsiteTag.site);
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error("Error updating shared sections:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
