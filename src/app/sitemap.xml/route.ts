import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const config = await prisma.globalConfig.findFirst();

    // If custom sitemap XML was uploaded and sitemap is enabled
    if (config?.sitemapCustomContent && config.sitemapEnabled !== false) {
      return new NextResponse(config.sitemapCustomContent, {
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
      });
    }

    const domain = process.env.NEXT_PUBLIC_WEBSITE_URL || "https://mahalaxmilubricants.com";
    const baseUrl = domain.replace(/\/$/, "");

    // Static core pages
    const staticSlugs: string[] = [
      "",
      "/about-us",
      "/products",
      "/blogs",
      "/events",
      "/contact-us",
      "/privacy-policy",
    ];

    // Fetch dynamic products & blogs
    const [products, blogs] = await Promise.all([
      prisma.product.findMany({ select: { slug: true, categorySlug: true, updatedAt: true } }),
      prisma.blogPost.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const now = new Date().toISOString();

    const staticXml = staticSlugs
      .map(
        (slug: string) => `  <url>
    <loc>${baseUrl}${slug}</loc>
    <lastmod>${now.split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${slug === "" ? "1.0" : "0.8"}</priority>
  </url>`,
      )
      .join("\n");

    const productsXml = (
      products as Array<{ slug: string; categorySlug: string; updatedAt: Date | null }>
    )
      .map(
        (p) => `  <url>
    <loc>${baseUrl}/products/${p.categorySlug}/${p.slug}</loc>
    <lastmod>${p.updatedAt ? new Date(p.updatedAt).toISOString().split("T")[0] : now.split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`,
      )
      .join("\n");

    const blogsXml = (blogs as Array<{ slug: string; updatedAt: Date | null }>)
      .map(
        (b) => `  <url>
    <loc>${baseUrl}/blogs/${b.slug}</loc>
    <lastmod>${b.updatedAt ? new Date(b.updatedAt).toISOString().split("T")[0] : now.split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`,
      )
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticXml}
${productsXml}
${blogsXml}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (err) {
    console.error("Error generating sitemap:", err);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}
