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

    const domain = process.env.NEXT_PUBLIC_WEBSITE_URL || "https://kokalachi.com";
    const baseUrl = domain.replace(/\/$/, "");

    // Static core pages
    const staticSlugs: string[] = ["", "/about", "/journeys", "/faqs", "/contact"];

    // Fetch dynamic trips
    const trips = await prisma.trip.findMany({
      where: { noIndex: false },
      select: { slug: true, updatedAt: true },
    });

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

    const tripsXml = trips
      .map(
        (t) => `  <url>
    <loc>${baseUrl}/journeys/${t.slug}</loc>
    <lastmod>${t.updatedAt ? new Date(t.updatedAt).toISOString().split("T")[0] : now.split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`,
      )
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticXml}
${tripsXml}
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
