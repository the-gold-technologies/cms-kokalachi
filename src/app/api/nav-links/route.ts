import { checkAdminSession } from "@/lib/auth-check";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidateWebsite, WebsiteTag } from "@/lib/revalidateWebsite";
import { isNavLinkId, NAV_LABEL_MAX_LENGTH, NAV_PAGE_SLUGS, syncNavLinks } from "@/lib/navLinks";

export const dynamic = "force-dynamic";

// The website's menu links. Read by the CMS editor and by the website (navbar names).
// The menu's structure and URLs are fixed in src/lib/navLinks.ts; only names can change.
export async function GET() {
  try {
    const links = await syncNavLinks();
    return NextResponse.json({ success: true, data: links });
  } catch (error: any) {
    console.error("Error fetching nav links:", error);
    return NextResponse.json(
      { success: false, error: error?.message ?? "Failed to fetch links" },
      { status: 500 },
    );
  }
}

// Renames links: { links: [{ id, label }] }. Any other field (url, order…) is ignored.
export async function PUT(request: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) {
      return authCheck.response;
    }
    const body = await request.json().catch(() => null);
    if (!Array.isArray(body?.links)) {
      return NextResponse.json(
        { success: false, error: "Invalid update payload" },
        { status: 400 },
      );
    }

    const updates: { id: string; label: string }[] = [];
    for (const item of body.links) {
      if (!isNavLinkId(item?.id)) {
        return NextResponse.json(
          { success: false, error: `Unknown menu link: ${item?.id}` },
          { status: 400 },
        );
      }
      const label = typeof item.label === "string" ? item.label.trim() : "";
      if (!label) {
        return NextResponse.json(
          { success: false, error: "Menu link names can't be empty" },
          { status: 400 },
        );
      }
      if (label.length > NAV_LABEL_MAX_LENGTH) {
        return NextResponse.json(
          { success: false, error: `"${label}" is longer than ${NAV_LABEL_MAX_LENGTH} characters` },
          { status: 400 },
        );
      }
      updates.push({ id: item.id, label });
    }

    await syncNavLinks(); // make sure every link exists before renaming
    // Links that open a page in SEO → Pages rename that page too
    const pageRenames = updates.filter(({ id }) => NAV_PAGE_SLUGS[id]);
    await prisma.$transaction([
      ...updates.map(({ id, label }) =>
        prisma.navLink.update({ where: { id }, data: { label, title: label.toUpperCase() } }),
      ),
      ...pageRenames.map(({ id, label }) =>
        prisma.page.updateMany({ where: { slug: NAV_PAGE_SLUGS[id] }, data: { title: label } }),
      ),
    ]);

    const links = await prisma.navLink.findMany({ orderBy: { order: "asc" } });
    revalidateWebsite(
      WebsiteTag.site,
      ...pageRenames.map(({ id }) => WebsiteTag.page(NAV_PAGE_SLUGS[id])),
    );
    return NextResponse.json({ success: true, data: links });
  } catch (error: any) {
    console.error("Error updating nav links:", error);
    return NextResponse.json(
      { success: false, error: error?.message ?? "Failed to update links" },
      { status: 500 },
    );
  }
}
