import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const BLOGS_SLUG = "blogs";
const DEFAULT_CATEGORIES = [
  {
    id: "cat-auto",
    name: "Automotive",
    slug: "automotive",
    description: "Engine oils, gear lubricants, coolants for commercial and passenger vehicles.",
  },
  {
    id: "cat-ind",
    name: "Industrial",
    slug: "industrial",
    description: "Hydraulic oils, turbine oils, and heavy machinery lubrication guides.",
  },
  {
    id: "cat-bike",
    name: "Bike Oils",
    slug: "bike-oils",
    description: "2-wheeler and 4-stroke motorcycle engine maintenance insights.",
  },
  {
    id: "cat-spec",
    name: "Specialties",
    slug: "specialties",
    description: "Transformer oils, cutting fluids, and specialty industrial applications.",
  },
];

async function getStoredCategories() {
  const page = await prisma.page.findUnique({
    where: { slug: BLOGS_SLUG },
    include: { sections: true },
  });

  const categorySection = page?.sections?.find((s: any) => s.type === "BlogCategories");

  if (categorySection && Array.isArray(categorySection.content)) {
    return categorySection.content as Array<{
      id: string;
      name: string;
      slug: string;
      description?: string;
    }>;
  }

  return DEFAULT_CATEGORIES;
}

async function saveStoredCategories(categories: any[]) {
  const page = await prisma.page.upsert({
    where: { slug: BLOGS_SLUG },
    create: {
      title: "Technical Articles & Lubrication Insights",
      slug: BLOGS_SLUG,
      type: "static",
      visibility: "published",
    },
    update: {},
  });

  const existing = await prisma.section.findFirst({
    where: { pageId: page.id, type: "BlogCategories" },
  });

  if (existing) {
    await prisma.section.update({
      where: { id: existing.id },
      data: { content: categories },
    });
  } else {
    await prisma.section.create({
      data: {
        pageId: page.id,
        type: "BlogCategories",
        content: categories,
      },
    });
  }
}

export async function GET() {
  try {
    const categories = await getStoredCategories();

    // Fetch blog posts to attach article count
    const blogs = await prisma.blogPost.findMany({
      select: { category: true },
    });

    const categoriesWithCount = categories.map((cat) => {
      const count = blogs.filter(
        (b: any) =>
          b.category?.toLowerCase() === cat.name.toLowerCase() ||
          b.category?.toLowerCase() === cat.slug.toLowerCase(),
      ).length;
      return { ...cat, count };
    });

    return NextResponse.json({ success: true, data: categoriesWithCount });
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: "Category name and slug are required" },
        { status: 400 },
      );
    }

    const categories = await getStoredCategories();
    const cleanSlug = slug.trim().toLowerCase();

    if (categories.some((c) => c.slug === cleanSlug)) {
      return NextResponse.json(
        { success: false, error: "A category with this slug already exists" },
        { status: 409 },
      );
    }

    const newCategory = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      slug: cleanSlug,
      description: description ? description.trim() : "",
    };

    const updated = [...categories, newCategory];
    await saveStoredCategories(updated);

    return NextResponse.json({ success: true, data: newCategory });
  } catch (error) {
    console.error("Error creating blog category:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, slug, description } = body;

    if (!id || !name) {
      return NextResponse.json(
        { success: false, error: "Category ID and name are required" },
        { status: 400 },
      );
    }

    const categories = await getStoredCategories();
    const index = categories.findIndex((c) => c.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    const updatedCategory = {
      ...categories[index],
      name: name.trim(),
      slug: (slug || categories[index].slug).trim().toLowerCase(),
      description: description !== undefined ? description.trim() : categories[index].description,
    };

    categories[index] = updatedCategory;
    await saveStoredCategories(categories);

    return NextResponse.json({ success: true, data: updatedCategory });
  } catch (error) {
    console.error("Error updating blog category:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 },
      );
    }

    const categories = await getStoredCategories();
    const filtered = categories.filter((c) => c.id !== id);

    await saveStoredCategories(filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog category:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
