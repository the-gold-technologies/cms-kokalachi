import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: any = {};
    if (category && category !== "All") {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { destinationSlug: { contains: search, mode: "insensitive" } },
      ];
    }

    const trips = await prisma.trip.findMany({
      where,
      include: {
        departures: {
          orderBy: { startDate: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, data: trips });
  } catch (error: any) {
    console.error("Error fetching trips:", error);
    return NextResponse.json(
      { success: false, error: error?.message ?? "Failed to fetch trips" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      subtitle,
      destinationSlug,
      location,
      duration,
      rating,
      price,
      originalPrice,
      gstAmount,
      image,
      category,
      tag,
      tagColor,
      hook,
      groupSize,
      overview,
      itinerary,
      inclusions,
      exclusions,
      meals,
      whatToPack,
      weather,
      faqs,
      highlights,
      gallery,
      vibeTags,
      isFeatured,
      order,
      metaTitle,
      metaDescription,
      targetKeywords,
      noIndex,
      departures,
    } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { success: false, error: "Title and slug are required" },
        { status: 400 }
      );
    }

    // Check unique slug
    const existing = await prisma.trip.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A journey with this slug already exists" },
        { status: 400 }
      );
    }

    const trip = await prisma.trip.create({
      data: {
        title,
        slug,
        subtitle: subtitle ?? null,
        destinationSlug: destinationSlug ?? null,
        location: location ?? "",
        duration: duration ?? "",
        rating: typeof rating === "number" ? rating : 5.0,
        price: typeof price === "number" ? price : parseFloat(price) || 0,
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        gstAmount: gstAmount ? parseFloat(gstAmount) : 0,
        image: image ?? "",
        category: category ?? "Trending",
        tag: tag ?? null,
        tagColor: tagColor ?? null,
        hook: hook ?? null,
        groupSize: groupSize ?? "Intimate Group",
        overview: overview ?? [],
        itinerary: itinerary ?? [],
        inclusions: inclusions ?? [],
        exclusions: exclusions ?? [],
        meals: meals ?? [],
        whatToPack: whatToPack ?? [],
        weather: weather ?? [],
        faqs: faqs ?? [],
        highlights: highlights ?? [],
        gallery: gallery ?? [],
        vibeTags: vibeTags ?? [],
        isFeatured: typeof isFeatured === "boolean" ? isFeatured : false,
        order: typeof order === "number" ? order : 0,
        metaTitle: metaTitle ?? null,
        metaDescription: metaDescription ?? null,
        targetKeywords: targetKeywords ?? null,
        noIndex: typeof noIndex === "boolean" ? noIndex : false,
      },
    });

    // Create departures if provided
    if (Array.isArray(departures) && departures.length > 0) {
      for (const dep of departures) {
        if (!dep.startDate || !dep.endDate) continue;
        const depId = dep.id && dep.id.trim() !== "" ? dep.id : `${slug}-${dep.startDate}`;
        await prisma.departure.create({
          data: {
            id: depId,
            tripId: trip.id,
            startDate: dep.startDate,
            endDate: dep.endDate,
            price: dep.price ? parseFloat(dep.price) : null,
            originalPrice: dep.originalPrice ? parseFloat(dep.originalPrice) : null,
            spotsLeft: typeof dep.spotsLeft === "number" ? dep.spotsLeft : parseInt(dep.spotsLeft, 10) || 10,
            status: dep.status ?? "open",
            label: dep.label ?? null,
            note: dep.note ?? null,
          },
        });
      }
    }

    const completeTrip = await prisma.trip.findUnique({
      where: { id: trip.id },
      include: { departures: true },
    });

    return NextResponse.json({ success: true, data: completeTrip });
  } catch (error: any) {
    console.error("Error creating trip:", error);
    return NextResponse.json(
      { success: false, error: error?.message ?? "Failed to create journey" },
      { status: 500 }
    );
  }
}
