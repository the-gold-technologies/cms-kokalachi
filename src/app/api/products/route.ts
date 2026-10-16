import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  cleanupObsoleteCloudinaryAssets,
  deleteCloudinaryAssetsFromData,
} from "@/lib/cloudinaryCleanup";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const slug = searchParams.get("slug");
    const id = searchParams.get("id");

    if (id) {
      const product = await prisma.product.findUnique({
        where: { id },
      });
      if (!product) {
        return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
      }
      const seo = {
        metaTitle: product.metaTitle,
        metaDescription: product.metaDescription,
        targetKeywords: product.targetKeywords,
        canonicalUrl: product.canonicalUrl,
        noIndex: product.noIndex,
        schema: product.schema,
        headingOptions: product.headingOptions,
      };
      return NextResponse.json({ success: true, data: product, seo });
    }

    if (slug) {
      const product = await prisma.product.findUnique({
        where: { slug },
      });
      if (!product) {
        return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
      }
      const seo = {
        metaTitle: product.metaTitle,
        metaDescription: product.metaDescription,
        targetKeywords: product.targetKeywords,
        canonicalUrl: product.canonicalUrl,
        noIndex: product.noIndex,
        schema: product.schema,
        headingOptions: product.headingOptions,
      };
      return NextResponse.json({ success: true, data: product, seo });
    }

    const where: any = {};
    if (categorySlug && categorySlug !== "all") {
      where.categorySlug = categorySlug;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { order: "asc" },
    });

    const categories = await prisma.productCategory.findMany({
      orderBy: { order: "asc" },
    });

    let seo = null;
    if (categorySlug && categorySlug !== "all") {
      const seoPage = await prisma.page.findUnique({
        where: { slug: `products/${categorySlug}` },
      });
      if (seoPage) {
        seo = {
          metaTitle: seoPage.metaTitle,
          metaDescription: seoPage.metaDescription,
          targetKeywords: seoPage.targetKeywords,
          canonicalUrl: seoPage.canonicalUrl,
          noIndex: seoPage.noIndex,
          schema: seoPage.schema,
          headingOptions: seoPage.headingOptions,
        };
      }
    } else {
      const productsPage = await prisma.page.findUnique({
        where: { slug: "products" },
      });
      if (productsPage) {
        seo = {
          title: productsPage.metaTitle || productsPage.title,
          metaTitle: productsPage.metaTitle || productsPage.title,
          metaDescription: productsPage.metaDescription,
          targetKeywords: productsPage.targetKeywords,
          canonicalUrl: productsPage.canonicalUrl,
          noIndex: productsPage.noIndex,
          schema: productsPage.schema,
          headingOptions: productsPage.headingOptions,
        };
      }
    }

    return NextResponse.json({
      success: true,
      data: { products, categories },
      seo,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, ...rest } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: "Name and slug are required" },
        { status: 400 },
      );
    }

    const highestOrder = await prisma.product.aggregate({
      _max: { order: true },
    });
    const order = (highestOrder._max.order ?? -1) + 1;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        order,
        ...rest,
      },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 },
      );
    }

    const existing = await prisma.product.findUnique({
      where: { id },
    });

    const product = await prisma.product.update({
      where: { id },
      data,
    });

    if (existing) {
      // Automatically clean up older replaced assets from Cloudinary after saving form
      cleanupObsoleteCloudinaryAssets(existing, product).catch((err) =>
        console.error("Cleanup error:", err),
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 },
      );
    }

    const existing = await prisma.product.findUnique({
      where: { id },
    });

    await prisma.product.delete({
      where: { id },
    });

    if (existing) {
      // Clean up assets on entity deletion
      deleteCloudinaryAssetsFromData(existing).catch((err) => console.error("Cleanup error:", err));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
