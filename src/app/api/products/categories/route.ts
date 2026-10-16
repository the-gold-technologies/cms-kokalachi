import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  cleanupObsoleteCloudinaryAssets,
  deleteCloudinaryAssetsFromData,
} from "@/lib/cloudinaryCleanup";

export async function GET() {
  try {
    const categories = await prisma.productCategory.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, shortDesc, fullDesc, coverImage, isFeatured } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: "Category name and slug are required" },
        { status: 400 },
      );
    }

    const count = await prisma.productCategory.count();

    const created = await prisma.productCategory.create({
      data: {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        shortDesc: shortDesc || null,
        fullDesc: fullDesc || null,
        coverImage: coverImage || null,
        isFeatured: isFeatured ?? true,
        order: count,
      },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    console.error("Error creating category:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "A category with this slug already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { success: false, error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, slug, shortDesc, fullDesc, coverImage, isFeatured, order } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID is required for update" },
        { status: 400 },
      );
    }

    const existing = await prisma.productCategory.findUnique({
      where: { id },
    });

    const updated = await prisma.productCategory.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(slug && { slug: slug.trim().toLowerCase() }),
        ...(shortDesc !== undefined && { shortDesc }),
        ...(fullDesc !== undefined && { fullDesc }),
        ...(coverImage !== undefined && { coverImage }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(order !== undefined && { order: Number(order) }),
      },
    });

    if (existing) {
      // Automatically clean up older replaced assets from Cloudinary after saving form
      cleanupObsoleteCloudinaryAssets(existing, updated).catch((err) =>
        console.error("Cleanup error:", err),
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
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

    const existing = await prisma.productCategory.findUnique({
      where: { id },
    });

    await prisma.productCategory.delete({
      where: { id },
    });

    if (existing) {
      deleteCloudinaryAssetsFromData(existing).catch((err) => console.error("Cleanup error:", err));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
