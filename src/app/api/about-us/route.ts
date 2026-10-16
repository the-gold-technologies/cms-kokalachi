import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cleanupObsoleteCloudinaryAssets } from "@/lib/cloudinaryCleanup";

const ABOUT_SLUG = "about-us";

export async function GET() {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: ABOUT_SLUG },
      include: { sections: true },
    });

    if (!page) {
      return NextResponse.json({ success: true, data: {}, seo: null });
    }

    const sectionsMap: Record<string, any> = {};
    for (const section of page.sections) {
      sectionsMap[section.type] = section.content;
    }

    // SEO object outside data
    const seo = {
      title: page.metaTitle || page.title,
      metaTitle: page.metaTitle || page.title,
      metaDescription: page.metaDescription,
      targetKeywords: page.targetKeywords,
      canonicalUrl: page.canonicalUrl,
      noIndex: page.noIndex,
      schema: page.schema,
      headingOptions: page.headingOptions,
    };

    return NextResponse.json({ success: true, data: sectionsMap, seo });
  } catch (error) {
    console.error("Error fetching about-us:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const page = await prisma.page.upsert({
      where: { slug: ABOUT_SLUG },
      create: {
        title: "About Us",
        slug: ABOUT_SLUG,
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
        cleanupObsoleteCloudinaryAssets(existing.content, content).catch((err) =>
          console.error("Cleanup error:", err),
        );
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
    console.error("Error saving about-us sections:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
