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

    // Check by exact slug first
    let page = await prisma.page.findUnique({
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

    // If not found and starts with products/, check product table
    if (!page && (slug.startsWith("products/") || slug.startsWith("product/"))) {
      const parts = slug.split("/");
      const lastSlug = parts[parts.length - 1];
      const product = await prisma.product.findUnique({
        where: { slug: lastSlug },
      });

      if (product) {
        return NextResponse.json({
          success: true,
          data: {
            id: product.id,
            title: product.name,
            slug: slug,
            metaTitle: product.metaTitle,
            metaDescription: product.metaDescription,
            targetKeywords: product.targetKeywords,
            canonicalUrl: product.canonicalUrl,
            noIndex: product.noIndex || false,
            headingOptions: product.headingOptions,
            schema: product.schema,
          },
        });
      }
    }

    // If not found and starts with blogs/, check blog post or stripped slug
    if (!page && (slug.startsWith("blogs/") || slug.startsWith("blog/"))) {
      const pureBlogSlug = slug.replace(/^(blogs|blog)\//, "");
      page = await prisma.page.findUnique({
        where: { slug: pureBlogSlug },
      });

      // If still not in Page table, check BlogPost table to generate default SEO
      if (!page) {
        const blogPost = await prisma.blogPost.findUnique({
          where: { slug: pureBlogSlug },
        });

        if (blogPost) {
          return NextResponse.json({
            success: true,
            data: {
              id: blogPost.id,
              title: blogPost.title,
              slug: slug,
              metaTitle: blogPost.title,
              metaDescription: blogPost.excerpt,
              targetKeywords: blogPost.category,
              canonicalUrl: `https://mahalaxmilubricants.com/${slug}`,
              noIndex: false,
              headingOptions: "h1",
            },
          });
        }
      }
    }

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
    const { slug: rawSlug } = await params;
    const slug = Array.isArray(rawSlug) ? rawSlug.join("/") : rawSlug;

    const body = await request.json();
    const { seo } = body;

    if (!seo) {
      return NextResponse.json({ success: false, error: "SEO data is required" }, { status: 400 });
    }

    // If updating a product SEO page, keep Product record in sync
    if (slug.startsWith("products/") || slug.startsWith("product/")) {
      const parts = slug.split("/");
      if (parts.length >= 2) {
        const lastSlug = parts[parts.length - 1];
        await prisma.product.updateMany({
          where: { slug: lastSlug },
          data: {
            metaTitle: seo.metaTitle,
            metaDescription: seo.metaDescription,
            targetKeywords: seo.targetKeywords,
            canonicalUrl: seo.canonicalUrl,
            noIndex: seo.noIndex || false,
            headingOptions: seo.headingOptions,
            schema: seo.schema,
          },
        });
      }
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
