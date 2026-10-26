import { checkAdminSession } from "@/lib/auth-check";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string | string[] }> },
) {
  try {
    const { slug: rawSlug } = await params;
    const slug = Array.isArray(rawSlug) ? rawSlug.join("/") : rawSlug;

    const page = await prisma.page.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        metaTitle: true,
        metaDescription: true,
        targetKeywords: true,
        canonicalUrl: true,
        noIndex: true,
        featuredImage: true,
        ogTitle: true,
        ogDescription: true,
        ogImage: true,
        schema: true,
        headingOptions: true,
      },
    });

    if (!page) {
      return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    console.error("Error fetching page SEO data:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string | string[] }> },
) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) {
      return authCheck.response;
    }
    const { slug: rawSlug } = await params;
    const slug = Array.isArray(rawSlug) ? rawSlug.join("/") : rawSlug;

    const body = await request.json();
    const { seo } = body;

    if (!seo) {
      return NextResponse.json({ success: false, error: "SEO data is required" }, { status: 400 });
    }

    const updatedPage = await prisma.page.upsert({
      where: { slug },
      update: {
        metaTitle: seo.metaTitle,
        metaDescription: seo.metaDescription,
        targetKeywords: seo.targetKeywords,
        canonicalUrl: seo.canonicalUrl,
        noIndex: seo.noIndex,
        featuredImage: seo.featuredImage,
        ogTitle: seo.ogTitle,
        ogDescription: seo.ogDescription,
        ogImage: seo.ogImage,
        headingOptions: seo.headingOptions,
        schema: seo.schema,
      },
      create: {
        slug,
        title: seo.metaTitle || slug.charAt(0).toUpperCase() + slug.slice(1),
        metaTitle: seo.metaTitle,
        metaDescription: seo.metaDescription,
        targetKeywords: seo.targetKeywords,
        canonicalUrl: seo.canonicalUrl,
        noIndex: seo.noIndex || false,
        featuredImage: seo.featuredImage,
        ogTitle: seo.ogTitle,
        ogDescription: seo.ogDescription,
        ogImage: seo.ogImage,
        headingOptions: seo.headingOptions || "h1",
        visibility: "published",
        schema: seo.schema,
      },
    });

    return NextResponse.json({ success: true, data: updatedPage });
  } catch (error) {
    console.error("Error updating page SEO data:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
