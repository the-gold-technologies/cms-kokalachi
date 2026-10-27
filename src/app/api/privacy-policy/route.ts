import { checkAdminSession } from "@/lib/auth-check";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidateWebsite, WebsiteTag } from "@/lib/revalidateWebsite";

const PRIVACY_SLUG = "privacy-policy";
const SECTION_TYPE = "LegalDocumentSection";

export async function GET() {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: PRIVACY_SLUG },
      include: { sections: true },
    });

    if (!page) {
      return NextResponse.json({
        success: true,
        data: {},
        seo: null,
      });
    }

    const sectionsMap: Record<string, any> = {};
    for (const section of page.sections) {
      sectionsMap[section.type] = section.content;
    }

    const seo = {
      title: page.metaTitle || page.title || "",
      metaTitle: page.metaTitle || page.title || "",
      metaDescription: page.metaDescription || "",
      targetKeywords: page.targetKeywords || "",
      canonicalUrl: page.canonicalUrl || "",
      noIndex: page.noIndex || false,
      schema: page.schema || null,
      headingOptions: page.headingOptions || "h1",
    };

    return NextResponse.json({
      success: true,
      data: sectionsMap,
      seo,
    });
  } catch (error) {
    console.error("Error fetching Privacy Policy:", error);
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
      where: { slug: PRIVACY_SLUG },
      create: {
        title: "Privacy Policy",
        slug: PRIVACY_SLUG,
        type: "Legal Page",
        visibility: "published",
        isStatic: true,
        order: 8,
      },
      update: {},
    });

    const docContent =
      body.LegalDocumentSection ||
      body.doc ||
      body.content ||
      (body.sections && body.sections[SECTION_TYPE]) ||
      body;

    const existing = await prisma.section.findFirst({
      where: { pageId: page.id, type: SECTION_TYPE },
    });

    if (existing) {
      await prisma.section.update({
        where: { id: existing.id },
        data: { content: docContent },
      });
    } else {
      await prisma.section.create({
        data: {
          pageId: page.id,
          type: SECTION_TYPE,
          content: docContent,
          order: 0,
        },
      });
    }

    revalidateWebsite(WebsiteTag.page("privacy-policy"));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating Privacy Policy:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
