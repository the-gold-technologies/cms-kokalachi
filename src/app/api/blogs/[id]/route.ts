import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  cleanupObsoleteCloudinaryAssets,
  deleteCloudinaryAssetsFromData,
} from "@/lib/cloudinaryCleanup";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const post = await prisma.blogPost.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error: any) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { success: false, error: error?.message ?? "Failed to fetch blog post" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existingPost = await prisma.blogPost.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 },
      );
    }

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

    // Check slug uniqueness if changed
    if (slug && slug !== existingPost.slug) {
      const cleanSlug = slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      const slugCheck = await prisma.blogPost.findUnique({
        where: { slug: cleanSlug },
      });
      if (slugCheck && slugCheck.id !== existingPost.id) {
        return NextResponse.json(
          { success: false, error: "Slug is already used by another blog post" },
          { status: 400 },
        );
      }
    }

    const updated = await prisma.blogPost.update({
      where: { id: existingPost.id },
      data: {
        title: title !== undefined ? title : existingPost.title,
        slug: slug !== undefined ? slug : existingPost.slug,
        heroLead: heroLead !== undefined ? heroLead : existingPost.heroLead,
        heroAccent: heroAccent !== undefined ? heroAccent : existingPost.heroAccent,
        excerpt: excerpt !== undefined ? excerpt : existingPost.excerpt,
        category: category !== undefined ? category : existingPost.category,
        publishedAt: publishedAt !== undefined ? publishedAt : existingPost.publishedAt,
        author: author !== undefined ? author : existingPost.author,
        heroImage: heroImage !== undefined ? heroImage : existingPost.heroImage,
        heroAlt: heroAlt !== undefined ? heroAlt : existingPost.heroAlt,
        ogImage: ogImage !== undefined ? ogImage : existingPost.ogImage,
        marginNote: marginNote !== undefined ? marginNote : existingPost.marginNote,
        intro:
          intro !== undefined
            ? Array.isArray(intro)
              ? intro
              : []
            : (existingPost.intro as any) ?? [],
        sections:
          sections !== undefined
            ? Array.isArray(sections)
              ? sections
              : []
            : (existingPost.sections as any) ?? [],
        ctaEyebrow: ctaEyebrow !== undefined ? ctaEyebrow : (existingPost as any).ctaEyebrow ?? "Your first chai stop is waiting",
        ctaTitle: ctaTitle !== undefined ? ctaTitle : existingPost.ctaTitle,
        ctaText: ctaText !== undefined ? ctaText : existingPost.ctaText,
        ctaPrimaryBtnText:
          ctaPrimaryBtnText !== undefined ? ctaPrimaryBtnText : (existingPost as any).ctaPrimaryBtnText ?? "Explore Upcoming Trips",
        ctaPrimaryBtnUrl:
          ctaPrimaryBtnUrl !== undefined ? ctaPrimaryBtnUrl : (existingPost as any).ctaPrimaryBtnUrl ?? "/#upcoming-journeys",
        ctaSecondaryBtnText:
          ctaSecondaryBtnText !== undefined ? ctaSecondaryBtnText : (existingPost as any).ctaSecondaryBtnText ?? "Read our FAQs",
        ctaSecondaryBtnUrl:
          ctaSecondaryBtnUrl !== undefined ? ctaSecondaryBtnUrl : (existingPost as any).ctaSecondaryBtnUrl ?? "/faqs",
        shareBtnText:
          shareBtnText !== undefined ? shareBtnText : (existingPost as any).shareBtnText ?? "Share on WhatsApp",
        relatedCategory:
          relatedCategory !== undefined ? relatedCategory : existingPost.relatedCategory,
        sidebarBadge:
          sidebarBadge !== undefined ? sidebarBadge : (existingPost as any).sidebarBadge ?? "First-timer pick",
        shareTitle:
          shareTitle !== undefined ? shareTitle : (existingPost as any).shareTitle ?? "psst…",
        shareNote:
          shareNote !== undefined ? shareNote : (existingPost as any).shareNote ?? "Know a nervous first-timer? Send this their way.",
        isPublished:
          typeof isPublished === "boolean" ? isPublished : existingPost.isPublished,
        isFeatured:
          typeof isFeatured === "boolean" ? isFeatured : existingPost.isFeatured,
        order: typeof order === "number" ? order : existingPost.order,
        metaTitle: metaTitle !== undefined ? metaTitle : existingPost.metaTitle,
        metaDescription:
          metaDescription !== undefined ? metaDescription : existingPost.metaDescription,
        targetKeywords:
          targetKeywords !== undefined ? targetKeywords : existingPost.targetKeywords,
        canonicalUrl:
          canonicalUrl !== undefined ? canonicalUrl : existingPost.canonicalUrl,
        noIndex: typeof noIndex === "boolean" ? noIndex : existingPost.noIndex,
      },
    });

    // Clean up replaced / removed Cloudinary images upon clicking "Save"
    cleanupObsoleteCloudinaryAssets(existingPost, updated).catch((err) =>
      console.error("Cleanup error on saving blog post:", err),
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { success: false, error: error?.message ?? "Failed to update blog post" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const existingPost = await prisma.blogPost.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 },
      );
    }

    await prisma.blogPost.delete({ where: { id: existingPost.id } });

    // Clean up all images from Cloudinary upon blog post deletion
    deleteCloudinaryAssetsFromData(existingPost).catch((err) =>
      console.error("Cleanup error on deleting blog post:", err),
    );

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { success: false, error: error?.message ?? "Failed to delete blog post" },
      { status: 500 },
    );
  }
}
