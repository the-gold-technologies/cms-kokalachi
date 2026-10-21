import { cleanupObsoleteCloudinaryAssets } from "@/lib/cloudinaryCleanup";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const FAQS_SLUG = "faqs";

export async function GET() {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: FAQS_SLUG },
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
      data: {
        sections: sectionsMap,
      },
      seo,
    });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const page = await prisma.page.upsert({
      where: { slug: FAQS_SLUG },
      create: {
        title: "FAQ Page",
        slug: FAQS_SLUG,
        type: "Main Page",
        visibility: "published",
        isStatic: true,
      },
      update: {},
    });

    // 1. Check if single section-level update
    if (body.section && body.content !== undefined) {
      const existing = await prisma.section.findFirst({
        where: { pageId: page.id, type: body.section },
      });

      if (existing) {
        await prisma.section.update({
          where: { id: existing.id },
          data: { content: body.content },
        });
        cleanupObsoleteCloudinaryAssets(existing.content, body.content).catch((err) =>
          console.error("Cleanup error on save:", err),
        );
      } else {
        const count = await prisma.section.count({
          where: { pageId: page.id },
        });
        await prisma.section.create({
          data: {
            pageId: page.id,
            type: body.section,
            content: body.content,
            order: count,
          },
        });
      }

      return NextResponse.json({ success: true });
    }

    // 2. Full object update
    for (const [sectionType, content] of Object.entries(body)) {
      if (sectionType === "sections" || sectionType === "seo" || sectionType === "section") {
        continue;
      }

      const existing = await prisma.section.findFirst({
        where: { pageId: page.id, type: sectionType },
      });

      if (existing) {
        await prisma.section.update({
          where: { id: existing.id },
          data: { content: content as any },
        });
        cleanupObsoleteCloudinaryAssets(existing.content, content).catch((err) =>
          console.error("Cleanup error on save:", err),
        );
      } else {
        const count = await prisma.section.count({
          where: { pageId: page.id },
        });
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
    console.error("Error updating FAQs sections:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
