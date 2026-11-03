import { checkAdminSession } from "@/lib/auth-check";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { listTripsSubPages, revalidateTripsPages, subPageSlug } from "@/lib/tripsSubPages";

export const dynamic = "force-dynamic";

const bad = (error: string, status = 400) =>
  NextResponse.json({ success: false, error }, { status });

// Reorders the trips tabs: { slugs: ["upcoming", "past", ...] } in the new order.
// The sub-pages themselves are fixed (each has a website route), so they can't be added or removed.
export async function PATCH(request: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const body = await request.json().catch(() => null);
    const slugs: unknown = body?.slugs;
    const current = await listTripsSubPages();
    const known = new Set(current.map((p) => p.slug));
    if (
      !Array.isArray(slugs) ||
      slugs.length !== known.size ||
      !slugs.every((s) => typeof s === "string" && known.has(s)) ||
      new Set(slugs).size !== slugs.length
    ) {
      return bad("Send every sub-page once, in the new order");
    }

    // Keep the numbers after the main trips page's, so SEO → Page Settings stays in order
    const base = Math.min(...current.map((p) => p.order));
    await prisma.$transaction(
      (slugs as string[]).map((slug, i) =>
        prisma.page.update({ where: { slug: subPageSlug(slug) }, data: { order: base + i } }),
      ),
    );

    revalidateTripsPages();
    return NextResponse.json({ success: true, data: await listTripsSubPages() });
  } catch (error) {
    console.error("Error reordering trips sub-pages:", error);
    return bad("Internal Server Error", 500);
  }
}
