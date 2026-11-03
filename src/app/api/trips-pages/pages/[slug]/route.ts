import { checkAdminSession } from "@/lib/auth-check";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cleanupObsoleteCloudinaryAssets } from "@/lib/cloudinaryCleanup";
import { TRIPS_SUB_PAGE_SECTION, normalizeSubPage } from "@/lib/tripsPageContent";
import { revalidateTripsPages, subPageSlug } from "@/lib/tripsSubPages";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

const bad = (error: string, status = 400) =>
  NextResponse.json({ success: false, error }, { status });

// Saves a trips sub-page's content: { content: {...} }
export async function PUT(request: Request, { params }: Params) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const { slug } = await params;
    const page = await prisma.page.findUnique({
      where: { slug: subPageSlug(slug) },
      include: { sections: { where: { type: TRIPS_SUB_PAGE_SECTION } } },
    });
    if (!page) return bad(`/trips/${slug} doesn't exist`, 404);

    const body = await request.json().catch(() => null);
    if (typeof body?.content !== "object" || body.content === null) {
      return bad("Missing content");
    }
    const content = normalizeSubPage(body.content);
    const existing = page.sections[0];

    if (existing) {
      await prisma.section.update({
        where: { id: existing.id },
        data: { content: content as any },
      });
      cleanupObsoleteCloudinaryAssets(existing.content, content).catch((err) =>
        console.error("Cleanup error:", err),
      );
    } else {
      await prisma.section.create({
        data: { pageId: page.id, type: TRIPS_SUB_PAGE_SECTION, content: content as any, order: 1 },
      });
    }

    revalidateTripsPages(slug);
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error("Error saving trips sub-page:", error);
    return bad("Internal Server Error", 500);
  }
}
