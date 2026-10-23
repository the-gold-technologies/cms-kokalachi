import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cleanupObsoleteCloudinaryAssets } from "@/lib/cloudinaryCleanup";

export const dynamic = "force-dynamic";

const BLOGS_PAGE_SLUG = "blogs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const isPublished = searchParams.get("isPublished");

    // 1. Fetch Blogs Page Configuration (Hero, CTA, SEO)
    const page = await prisma.page.findUnique({
      where: { slug: BLOGS_PAGE_SLUG },
      include: { sections: true },
    });

    const sectionsMap: Record<string, any> = {};
    if (page?.sections) {
      for (const section of page.sections) {
        sectionsMap[section.type] = section.content;
      }
    }

    const defaultHero = {
      eyebrow: "The Kokalachi Journal",
      titleLead: "Stories for the ",
      titleAccent: "curious traveller.",
      description:
        "Honest guides, little rituals and real stories from the road, for anyone who has a bucket list but not yet a travel buddy.",
      heroImage:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80",
      heroAlt: "The Kokalachi Journal",
    };

    const defaultCta = {
      kicker: "Fresh off the press",
      chaiNote: "grab a chai first ☕",
      brewingTitle: "more stories brewing…",
      brewingDescription:
        "Packing lists, route guides and traveller memoirs are on their way. Until then, the best stories are the ones you go and make.",
      ctaBtnText: "Find your journey",
      ctaBtnUrl: "/journeys",
    };

    const sections = {
      BlogHeroSection: { ...defaultHero, ...(sectionsMap.BlogHeroSection || {}) },
      BlogCtaSection: { ...defaultCta, ...(sectionsMap.BlogCtaSection || {}) },
    };

    const seo = page
      ? {
          title: page.metaTitle || page.title || "The Kokalachi Journal",
          metaTitle: page.metaTitle || page.title || "The Kokalachi Journal",
          metaDescription: page.metaDescription || defaultHero.description,
          targetKeywords: page.targetKeywords || "blogs, journal, slow travel, kokalachi stories",
          canonicalUrl: page.canonicalUrl || "https://kokalachi.com/blogs",
          noIndex: page.noIndex ?? false,
          schema: page.schema || null,
          headingOptions: page.headingOptions || "h1",
        }
      : {
          title: "The Kokalachi Journal",
          metaTitle: "The Kokalachi Journal | Stories for the curious traveller",
          metaDescription: defaultHero.description,
          targetKeywords: "blogs, journal, slow travel, kokalachi stories",
          canonicalUrl: "https://kokalachi.com/blogs",
          noIndex: false,
          schema: null,
          headingOptions: "h1",
        };

    // 2. Fetch Blog Card Information Only (Lightweight for listing & cards)
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
      select: {
        id: true,
        slug: true,
        title: true,
        heroLead: true,
        heroAccent: true,
        excerpt: true,
        category: true,
        publishedAt: true,
        author: true,
        heroImage: true,
        heroAlt: true,
        isPublished: true,
        isFeatured: true,
        order: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({
      success: true,
      data: {
        sections,
        blogs: posts,
      },
      seo,
    });
  } catch (error: any) {
    console.error("Error fetching blog page and posts:", error);
    return NextResponse.json(
      { success: false, error: error?.message ?? "Failed to fetch blogs" },
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
      return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 });
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

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const page = await prisma.page.upsert({
      where: { slug: BLOGS_PAGE_SLUG },
      create: {
        title: "The Kokalachi Journal",
        slug: BLOGS_PAGE_SLUG,
        type: "static",
        visibility: "published",
      },
      update: {},
    });

    // 1. Single Section update (e.g. { section: "BlogHeroSection", content: { ... } })
    if (body.section && body.content !== undefined) {
      const existing = await prisma.section.findFirst({
        where: { pageId: page.id, type: body.section },
      });

      if (existing) {
        await prisma.section.update({
          where: { id: existing.id },
          data: { content: body.content },
        });
        cleanupObsoleteCloudinaryAssets(existing.content, body.content).catch((err) =>
          console.error("Cleanup error:", err),
        );
      } else {
        const count = await prisma.section.count({ where: { pageId: page.id } });
        await prisma.section.create({
          data: {
            pageId: page.id,
            type: body.section,
            content: body.content,
            order: count,
          },
        });
      }

      return NextResponse.json({ success: true });
    }

    // 2. Full object update (e.g. { sections: { BlogHeroSection: {...}, BlogCtaSection: {...} }, seo: {...} })
    const sectionsToSave = body.sections || (body.data && body.data.sections) || {};
    for (const [sectionType, content] of Object.entries(sectionsToSave)) {
      const existing = await prisma.section.findFirst({
        where: { pageId: page.id, type: sectionType },
      });

      if (existing) {
        await prisma.section.update({
          where: { id: existing.id },
          data: { content: content as any },
        });
        cleanupObsoleteCloudinaryAssets(existing.content, content).catch((err) =>
          console.error("Cleanup error:", err),
        );
      } else {
        const count = await prisma.section.count({ where: { pageId: page.id } });
        await prisma.section.create({
          data: {
            pageId: page.id,
            type: sectionType,
            content: content as any,
            order: count,
          },
        });
      }
    }

    // 3. Direct seo update
    if (body.seo) {
      await prisma.page.update({
        where: { id: page.id },
        data: {
          metaTitle: body.seo.metaTitle,
          metaDescription: body.seo.metaDescription,
          targetKeywords: body.seo.targetKeywords,
          canonicalUrl: body.seo.canonicalUrl,
          noIndex: body.seo.noIndex,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating blog page configuration:", error);
    return NextResponse.json(
      { success: false, error: error?.message ?? "Failed to save blog page configuration" },
      { status: 500 },
    );
  }
}
