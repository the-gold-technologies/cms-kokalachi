import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const config = await prisma.globalConfig.findFirst();

    const robotsContent =
      config?.robotsTxt ||
      "User-agent: *\nAllow: /\n\nSitemap: https://mahalaxmilubricants.com/sitemap.xml";

    return new NextResponse(robotsContent, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (err) {
    console.error("Error generating robots.txt:", err);
    return new NextResponse("User-agent: *\nAllow: /", { status: 500 });
  }
}
