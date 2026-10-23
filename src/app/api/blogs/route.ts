import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const isPublished = searchParams.get("isPublished");

    const where: any = {};
    if (category && category !== "All") {
      where.category = category;
    }
    if (isPublished !== null && isPublished !== undefined && isPublished !== "") {
      where.isPublished = isPublished === "true";
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { heroLead: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ];
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: [
        { isFeatured: "desc" },
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ success: true, data: posts });
  } catch (error: any) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { success: false, error: error?.message ?? "Failed to fetch blog posts" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      heroLead,
      heroAccent,
      excerpt,
      category,
      publishedAt,
      author,
      heroImage,
      heroAlt,
      ogImage,
      marginNote,
      intro,
      sections,
      ctaEyebrow,
      ctaTitle,
      ctaText,
      ctaPrimaryBtnText,
      ctaPrimaryBtnUrl,
      ctaSecondaryBtnText,
      ctaSecondaryBtnUrl,
      shareBtnText,
      relatedCategory,
      sidebarBadge,
      shareTitle,
      shareNote,
      isPublished,
      isFeatured,
      order,
      metaTitle,
      metaDescription,
      targetKeywords,
      canonicalUrl,
      noIndex,
    } = body;

    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 },
      );
    }

    // Auto-generate slug if not provided
    const cleanSlug = (slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    if (!cleanSlug) {
      return NextResponse.json(
        { success: false, error: "Valid slug is required" },
        { status: 400 },
      );
    }

    const existingSlug = await prisma.blogPost.findUnique({
      where: { slug: cleanSlug },
    });
    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: "A blog post with this slug already exists" },
        { status: 400 },
      );
    }

    const todayDate = new Date().toISOString().split("T")[0];

    const newPost = await prisma.blogPost.create({
      data: {
        title: title.trim(),
        slug: cleanSlug,
        heroLead: heroLead || title.trim(),
        heroAccent: heroAccent || "",
        excerpt: excerpt || "",
        category: category || "First-Timer Guide",
        publishedAt: publishedAt || todayDate,
        author: author || "Team Kokalachi",
        heroImage: heroImage || "",
        heroAlt: heroAlt || title.trim(),
        ogImage: ogImage || null,
        marginNote: marginNote || null,
        intro: Array.isArray(intro) ? intro : [],
        sections: Array.isArray(sections) ? sections : [],
        ctaEyebrow: ctaEyebrow || "Your first chai stop is waiting",
        ctaTitle: ctaTitle || "Ready to take the first step?",
        ctaText:
          ctaText ||
          "Browse our upcoming journeys and find the one that makes you a little excited and a little nervous. That's usually the right one.",
        ctaPrimaryBtnText: ctaPrimaryBtnText || "Explore Upcoming Trips",
        ctaPrimaryBtnUrl: ctaPrimaryBtnUrl || "/#upcoming-journeys",
        ctaSecondaryBtnText: ctaSecondaryBtnText || "Read our FAQs",
        ctaSecondaryBtnUrl: ctaSecondaryBtnUrl || "/faqs",
        shareBtnText: shareBtnText || "Share on WhatsApp",
        relatedCategory: relatedCategory || "FirstTimers",
        sidebarBadge: sidebarBadge || "First-timer pick",
        shareTitle: shareTitle || "psst…",
        shareNote: shareNote || "Know a nervous first-timer? Send this their way.",
        isPublished: typeof isPublished === "boolean" ? isPublished : true,
        isFeatured: typeof isFeatured === "boolean" ? isFeatured : false,
        order: typeof order === "number" ? order : 0,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || excerpt || null,
        targetKeywords: targetKeywords || null,
        canonicalUrl: canonicalUrl || `/blogs/${cleanSlug}`,
        noIndex: typeof noIndex === "boolean" ? noIndex : false,
      },
    });

    return NextResponse.json({ success: true, data: newPost }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { success: false, error: error?.message ?? "Failed to create blog post" },
      { status: 500 },
    );
  }
}
