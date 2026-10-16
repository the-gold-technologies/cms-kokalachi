import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const EVENTS_SLUG = "events";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug && slug !== EVENTS_SLUG) {
      const event = await prisma.event.findUnique({ where: { slug } });
      return NextResponse.json({ success: true, data: event, seo: null });
    }

    // 1. Fetch static Page Sections for events page
    const page = await prisma.page.findUnique({
      where: { slug: EVENTS_SLUG },
      include: { sections: true },
    });

    const sectionsMap: Record<string, any> = {};
    if (page?.sections) {
      for (const section of page.sections) {
        sectionsMap[section.type] = section.content;
      }
    }

    const seo = page
      ? {
          title: page.metaTitle || page.title,
          metaTitle: page.metaTitle || page.title,
          metaDescription: page.metaDescription,
          targetKeywords: page.targetKeywords,
          canonicalUrl: page.canonicalUrl,
          noIndex: page.noIndex,
          schema: page.schema,
          headingOptions: page.headingOptions,
        }
      : null;

    return NextResponse.json({
      success: true,
      data: sectionsMap,
      seo,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // 1. Ensure the Events Page exists
    const page = await prisma.page.upsert({
      where: { slug: EVENTS_SLUG },
      create: {
        title: "Events & Activities",
        slug: EVENTS_SLUG,
        type: "static",
        visibility: "published",
      },
      update: {},
    });

    let sectionsToSave: Record<string, any> = {};

    if (body.section && body.content !== undefined) {
      sectionsToSave[body.section] = body.content;
    } else if (body.sections && typeof body.sections === "object") {
      sectionsToSave = body.sections;
    } else {
      sectionsToSave = body;
    }

    for (const [sectionType, content] of Object.entries(sectionsToSave)) {
      if (
        sectionType === "sections" ||
        sectionType === "section" ||
        sectionType === "content" ||
        sectionType === "seo"
      )
        continue;
      const existing = await prisma.section.findFirst({
        where: { pageId: page.id, type: sectionType },
      });

      if (existing) {
        await prisma.section.update({
          where: { id: existing.id },
          data: { content: content as any },
        });
      } else {
        const count = await prisma.section.count({ where: { pageId: page.id } });
        await prisma.section.create({
          data: {
            pageId: page.id,
            type: sectionType,
            content: content as any,
            order: count,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving events sections:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
