import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        metaTitle: true,
        metaDescription: true,
        type: true,
        visibility: true,
        headingOptions: true,
        order: true,
        parent: true,
        description: true,
        isStatic: true,
      },
      orderBy: { order: "asc" },
    });

    const links = await prisma.navLink.findMany({
      orderBy: { order: "asc" },
    });

    const mergedData: any[] = [];
    const seenSlugs = new Set<string>();

    // 1. Process Navigation Links first (Main Website Order: Home, About Us, Products, Events, Blogs, Contact)
    let navIndex = 1;
    for (const link of links) {
      const urlMatchesSlug = (url: string, slug: string) => {
        if (url === "/" && slug === "home") return true;
        if ((url === "/products/industrial-oils" || url === "/products") && slug === "products")
          return true;
        return url === `/${slug}`;
      };

      const matchedPage = pages.find((p: any) => urlMatchesSlug(link.url, p.slug));
      const targetSlug = matchedPage
        ? matchedPage.slug
        : link.url === "/"
          ? "home"
          : link.url.replace(/^\//, "");

      const normalizedSlug = targetSlug.toLowerCase().trim();
      if (seenSlugs.has(normalizedSlug)) {
        continue;
      }
      seenSlugs.add(normalizedSlug);

      const isProd = link.url === "/products" || link.label.toLowerCase().includes("product");
      const assignedOrder = link.order !== undefined && link.order >= 0 ? link.order : navIndex++;

      if (matchedPage) {
        mergedData.push({
          id: link.id,
          pageId: matchedPage.id,
          title: link.label || matchedPage.title,
          slug: matchedPage.slug,
          metaTitle: matchedPage.metaTitle,
          metaDescription: matchedPage.metaDescription,
          type: isProd ? "Dropdown" : link.type || matchedPage.type,
          visibility: matchedPage.visibility,
          parent: link.parent,
          order: assignedOrder,
          description: link.description,
          navTitle: link.title,
          isStatic: link.isStatic,
          headingOptions: matchedPage.headingOptions,
        });
      } else {
        mergedData.push({
          id: link.id,
          pageId: null as string | null,
          title: link.label,
          slug: targetSlug,
          metaTitle: null as string | null,
          metaDescription: null as string | null,
          type: isProd ? "Dropdown" : link.type || "Main Link",
          visibility: "published",
          parent: link.parent,
          order: assignedOrder,
          description: link.description,
          navTitle: link.title,
          isStatic: link.isStatic,
        });
      }
    }

    // 2. Include Non-Navigation / Legal Pages (e.g. Privacy Policy, Terms of Service) after main nav links
    let secondaryIndex = 50;
    for (const page of pages) {
      const normalizedSlug = page.slug.toLowerCase().trim();
      if (!seenSlugs.has(normalizedSlug)) {
        seenSlugs.add(normalizedSlug);
        mergedData.push({
          id: `page-${page.id}`,
          pageId: page.id,
          title:
            page.title ||
            page.slug.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
          slug: page.slug,
          metaTitle: page.metaTitle,
          metaDescription: page.metaDescription,
          type: page.type === "standard" ? "Main Link" : page.type,
          visibility: page.visibility,
          parent: page.parent || "-",
          order: secondaryIndex++,
          description: page.description || `Configure SEO for ${page.title || page.slug}`,
          navTitle: page.title,
          isStatic: page.isStatic,
          headingOptions: page.headingOptions,
        });
      }
    }

    // 3. Find Products parent ID and nest categories under Products
    let prodParentIdx = mergedData.findIndex((m: any) => m.slug === "products");
    let prodParentId = prodParentIdx !== -1 ? mergedData[prodParentIdx].id : "products";

    const categoriesList = await prisma.productCategory.findMany({
      orderBy: { order: "asc" },
    });

    for (const cat of categoriesList) {
      const catSlug = `products/${cat.slug}`;
      const existing = mergedData.find((m: any) => m.slug === catSlug);
      if (existing) {
        existing.parent = prodParentId;
        existing.type = "Category";
        existing.title = cat.name;
        existing.order = cat.order;
      } else {
        const matchedPage = pages.find((p: any) => p.slug === catSlug);
        mergedData.push({
          id: matchedPage ? `page-${matchedPage.id}` : `cat-${cat.id}`,
          pageId: matchedPage?.id || cat.id,
          title: cat.name,
          slug: catSlug,
          metaTitle: matchedPage?.metaTitle || null,
          metaDescription: matchedPage?.metaDescription || null,
          type: "Category",
          visibility: matchedPage?.visibility || "published",
          parent: prodParentId,
          order: cat.order,
          description: matchedPage?.description || null,
          navTitle: cat.name,
          isStatic: false,
          headingOptions: matchedPage?.headingOptions || null,
        });
      }
    }

    // 4. Categories are nested directly under Products without injecting individual products
    // (Individual product SEO is managed directly in each product's add/edit form)

    // 5. Automatically inject Dynamic Blog Posts from DB under Blogs parent
    let blogParentIdx = mergedData.findIndex((m: any) => m.slug === "blogs" || m.slug === "blog");
    let blogParentId = "blogs-seo-parent-id";

    if (blogParentIdx !== -1) {
      blogParentId = mergedData[blogParentIdx].id;
    }

    const blogPosts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });

    for (const blog of blogPosts) {
      const blogPageSlug = `blogs/${blog.slug}`;
      const normalizedBlogSlug = blogPageSlug.toLowerCase().trim();

      if (!seenSlugs.has(normalizedBlogSlug)) {
        seenSlugs.add(normalizedBlogSlug);
        const matchedBlogPage = pages.find(
          (p: any) => p.slug === blogPageSlug || p.slug === blog.slug,
        );

        mergedData.push({
          id: `blog-post-${blog.id}`,
          pageId: blog.id,
          title: blog.title || "Untitled Blog",
          slug: blogPageSlug,
          metaTitle: matchedBlogPage?.metaTitle || blog.title,
          metaDescription: matchedBlogPage?.metaDescription || blog.excerpt,
          type: "Blog Article",
          visibility: blog.isPublished ? "published" : "draft",
          parent: blogParentId,
          order: 0,
          description: `SEO Configuration for blog article: "${blog.title}".`,
          navTitle: blog.title,
          isStatic: false,
          headingOptions: matchedBlogPage?.headingOptions,
        });
      }
    }

    return NextResponse.json({ success: true, data: mergedData });
  } catch (error) {
    console.error("Error fetching pages for SEO:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
