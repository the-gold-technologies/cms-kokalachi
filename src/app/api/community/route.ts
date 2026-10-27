import { checkAdminSession } from "@/lib/auth-check";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cleanupObsoleteCloudinaryAssets } from "@/lib/cloudinaryCleanup";
import { revalidateWebsite, WebsiteTag } from "@/lib/revalidateWebsite";

const COMMUNITY_SLUG = "community";

export async function GET() {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: COMMUNITY_SLUG },
      include: { sections: true },
    });

    if (!page) {
      return NextResponse.json({ success: true, data: {}, seo: null });
    }

    const sectionsMap: Record<string, any> = {};
    for (const section of page.sections) {
      sectionsMap[section.type] = section.content;
    }

    const seo = {
      title: page.metaTitle ?? page.title,
      metaTitle: page.metaTitle ?? page.title,
      metaDescription: page.metaDescription,
      targetKeywords: page.targetKeywords,
      canonicalUrl: page.canonicalUrl,
      noIndex: page.noIndex,
      schema: page.schema,
      headingOptions: page.headingOptions,
    };

    return NextResponse.json({ success: true, data: sectionsMap, seo });
  } catch (error) {
    console.error("Error fetching community page data:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) {
      return authCheck.response;
    }
    const body = await request.json();

    const page = await prisma.page.upsert({
      where: { slug: COMMUNITY_SLUG },
      create: {
        title: "Community",
        slug: COMMUNITY_SLUG,
        type: "Main Page",
        visibility: "published",
        isStatic: true,
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
      if (typeof content !== "object" || content === null) continue;

      const existingSection = await prisma.section.findFirst({
        where: { pageId: page.id, type: sectionType },
      });

      if (existingSection) {
        await prisma.section.update({
          where: { id: existingSection.id },
          data: { content: content as any },
        });
        cleanupObsoleteCloudinaryAssets(existingSection.content, content).catch((err) =>
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

    revalidateWebsite(WebsiteTag.page("community"));
    return NextResponse.json({ success: true, message: "Community content updated successfully" });
  } catch (error) {
    console.error("Error updating community page content:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
