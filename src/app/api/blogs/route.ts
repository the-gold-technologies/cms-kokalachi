import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  cleanupObsoleteCloudinaryAssets,
  deleteCloudinaryAssetsFromData,
} from "@/lib/cloudinaryCleanup";

const BLOGS_SLUG = "blogs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");

    if (id) {
      const blog = await prisma.blogPost.findUnique({ where: { id } });
      if (blog) {
        const blogPage = await prisma.page.findUnique({
          where: { slug: `blogs/${blog.slug}` },
        });
        const seo = {
          title: blogPage?.metaTitle || blog.title,
          metaTitle: blogPage?.metaTitle || blog.title,
          metaDescription: blogPage?.metaDescription || blog.excerpt,
          targetKeywords: blogPage?.targetKeywords || blog.category,
          canonicalUrl:
            blogPage?.canonicalUrl || `https://mahalaxmilubricants.com/blogs/${blog.slug}`,
          noIndex: blogPage?.noIndex ?? false,
          schema: blogPage?.schema,
          headingOptions: blogPage?.headingOptions,
        };
        return NextResponse.json({ success: true, data: blog, seo });
      }
      return NextResponse.json({ success: true, data: blog, seo: null });
    }

    if (slug && slug !== BLOGS_SLUG) {
      const pureSlug = slug.replace(/^blogs\//, "");
      const blog = await prisma.blogPost.findUnique({ where: { slug: pureSlug } });
      if (blog) {
        const blogPage = await prisma.page.findUnique({
          where: { slug: `blogs/${pureSlug}` },
        });
        const seo = {
          title: blogPage?.metaTitle || blog.title,
          metaTitle: blogPage?.metaTitle || blog.title,
          metaDescription: blogPage?.metaDescription || blog.excerpt,
          targetKeywords: blogPage?.targetKeywords || blog.category,
          canonicalUrl:
            blogPage?.canonicalUrl || `https://mahalaxmilubricants.com/blogs/${pureSlug}`,
          noIndex: blogPage?.noIndex ?? false,
          schema: blogPage?.schema,
          headingOptions: blogPage?.headingOptions,
        };
        return NextResponse.json({ success: true, data: blog, seo });
      }
      return NextResponse.json({ success: true, data: blog, seo: null });
    }

    // 1. Fetch blogs list
    const blogs = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });

    // 2. Fetch page sections for Blogs Hero
    const page = await prisma.page.findUnique({
      where: { slug: BLOGS_SLUG },
      include: { sections: true },
    });

    const sectionsMap: Record<string, any> = {};
    if (page?.sections) {
      for (const section of page.sections) {
        sectionsMap[section.type] = section.content;
      }
    }

    const seo = page
      ? {
          title: page.metaTitle || page.title,
          metaTitle: page.metaTitle || page.title,
          metaDescription: page.metaDescription,
          targetKeywords: page.targetKeywords,
          canonicalUrl: page.canonicalUrl,
          noIndex: page.noIndex,
          schema: page.schema,
          headingOptions: page.headingOptions,
        }
      : null;

    return NextResponse.json({
      success: true,
      data: {
        blogs,
        sections: sectionsMap,
      },
      seo,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      category,
      publishDate,
      readTime,
      author,
      excerpt,
      coverImage,
      content,
      recommendedProducts,
      isPublished,
    } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { success: false, error: "Title and slug are required" },
        { status: 400 },
      );
    }

    const created = await prisma.blogPost.create({
      data: {
        title,
        slug,
        category: category || "Automotive",
        publishDate: publishDate || new Date().toISOString().split("T")[0],
        readTime: readTime || "5 min read",
        author: author || "HPCL Technical Team",
        excerpt: excerpt || "",
        coverImage: coverImage || null,
        content: content || {},
        recommendedProducts: recommendedProducts || [],
        isPublished: isPublished !== false,
      },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      slug,
      category,
      publishDate,
      readTime,
      author,
      excerpt,
      coverImage,
      content,
      recommendedProducts,
      isPublished,
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Blog ID is required" }, { status: 400 });
    }

    const existing = await prisma.blogPost.findUnique({ where: { id } });

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        category,
        publishDate,
        readTime,
        author,
        excerpt,
        coverImage,
        content,
        recommendedProducts,
        isPublished,
      },
    });

    if (existing) {
      // Automatically clean up older replaced assets from Cloudinary after saving form
      cleanupObsoleteCloudinaryAssets(existing, updated).catch((err) =>
        console.error("Cleanup error:", err),
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Blog ID is required" }, { status: 400 });
    }

    const existing = await prisma.blogPost.findUnique({ where: { id } });

    await prisma.blogPost.delete({ where: { id } });

    if (existing) {
      deleteCloudinaryAssetsFromData(existing).catch((err) => console.error("Cleanup error:", err));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
