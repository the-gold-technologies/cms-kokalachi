import {
  cleanupObsoleteCloudinaryAssets,
  deleteCloudinaryAssetsFromData,
} from "@/lib/cloudinaryCleanup";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const trip = await prisma.trip.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        departures: {
          orderBy: { startDate: "asc" },
        },
      },
    });

    if (!trip) {
      return NextResponse.json({ success: false, error: "Journey not found" }, { status: 404 });
    }

    const tripJsonLd = {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      name: trip.title,
      description: trip.subtitle || trip.location,
      image: trip.image,
      touristType: "Group Travel",
      offers: {
        "@type": "Offer",
        price: trip.price,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
      },
      provider: {
        "@type": "Organization",
        name: "Kokalachi",
        url: "https://kokalachi.com",
      },
    };

    return NextResponse.json({
      success: true,
      data: {
        ...trip,
        schema: trip.schema || JSON.stringify(tripJsonLd, null, 2),
      },
    });
  } catch (error: any) {
    console.error("Error fetching single trip:", error);
    return NextResponse.json(
      { success: false, error: error?.message ?? "Failed to fetch journey" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existingTrip = await prisma.trip.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!existingTrip) {
      return NextResponse.json({ success: false, error: "Journey not found" }, { status: 404 });
    }

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
      schema,
      departures,
    } = body;

    // Check slug uniqueness if changed
    if (slug && slug !== existingTrip.slug) {
      const slugCheck = await prisma.trip.findUnique({ where: { slug } });
      if (slugCheck && slugCheck.id !== existingTrip.id) {
        return NextResponse.json(
          { success: false, error: "Slug is already used by another journey" },
          { status: 400 },
        );
      }
    }

    // Safely resolve / auto-create destination so foreign key constraint never fails
    let validDestSlug: string | null = existingTrip.destinationSlug;
    if (destinationSlug !== undefined) {
      if (
        !destinationSlug ||
        typeof destinationSlug !== "string" ||
        destinationSlug.trim() === ""
      ) {
        validDestSlug = null;
      } else {
        const cleanDestSlug = destinationSlug
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

        if (cleanDestSlug) {
          const existingDest = await prisma.destination.findUnique({
            where: { slug: cleanDestSlug },
          });

          if (existingDest) {
            validDestSlug = existingDest.slug;
          } else {
            const destName = destinationSlug
              .split(/[-_\s]+/)
              .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
              .join(" ");

            try {
              const newDest = await prisma.destination.create({
                data: {
                  name: destName || "Destination",
                  slug: cleanDestSlug,
                  isFeatured: true,
                },
              });
              validDestSlug = newDest.slug;
            } catch {
              validDestSlug = null;
            }
          }
        }
      }
    }

    const updated = await prisma.trip.update({
      where: { id: existingTrip.id },
      data: {
        title: title !== undefined ? title : existingTrip.title,
        slug: slug !== undefined ? slug : existingTrip.slug,
        subtitle: subtitle !== undefined ? subtitle : existingTrip.subtitle,
        destinationSlug: validDestSlug,
        location: location !== undefined ? location : existingTrip.location,
        duration: duration !== undefined ? duration : existingTrip.duration,
        rating: typeof rating === "number" ? rating : existingTrip.rating,
        price:
          price !== undefined
            ? typeof price === "number"
              ? price
              : parseFloat(price) || 0
            : existingTrip.price,
        originalPrice:
          originalPrice !== undefined
            ? originalPrice
              ? parseFloat(originalPrice)
              : null
            : existingTrip.originalPrice,
        gstAmount:
          gstAmount !== undefined
            ? gstAmount
              ? parseFloat(gstAmount)
              : 0
            : existingTrip.gstAmount,
        image: image !== undefined ? image : existingTrip.image,
        category: category !== undefined ? category : existingTrip.category,
        tag: tag !== undefined ? tag : existingTrip.tag,
        tagColor: tagColor !== undefined ? tagColor : existingTrip.tagColor,
        hook: hook !== undefined ? hook : existingTrip.hook,
        groupSize: groupSize !== undefined ? groupSize : existingTrip.groupSize,
        overview: overview !== undefined ? overview : existingTrip.overview,
        itinerary: itinerary !== undefined ? itinerary : existingTrip.itinerary,
        inclusions: inclusions !== undefined ? inclusions : existingTrip.inclusions,
        exclusions: exclusions !== undefined ? exclusions : existingTrip.exclusions,
        meals: meals !== undefined ? meals : existingTrip.meals,
        whatToPack: whatToPack !== undefined ? whatToPack : existingTrip.whatToPack,
        weather: weather !== undefined ? weather : existingTrip.weather,
        faqs: faqs !== undefined ? faqs : existingTrip.faqs,
        highlights: highlights !== undefined ? highlights : existingTrip.highlights,
        gallery: gallery !== undefined ? gallery : existingTrip.gallery,
        vibeTags: vibeTags !== undefined ? vibeTags : existingTrip.vibeTags,
        isFeatured: typeof isFeatured === "boolean" ? isFeatured : existingTrip.isFeatured,
        order: typeof order === "number" ? order : existingTrip.order,
        metaTitle: metaTitle !== undefined ? metaTitle : existingTrip.metaTitle,
        metaDescription:
          metaDescription !== undefined ? metaDescription : existingTrip.metaDescription,
        targetKeywords: targetKeywords !== undefined ? targetKeywords : existingTrip.targetKeywords,
        noIndex: typeof noIndex === "boolean" ? noIndex : existingTrip.noIndex,
        schema: schema !== undefined ? (schema ? schema.trim() : null) : existingTrip.schema,
      },
    });

    // Sync departures if provided
    if (Array.isArray(departures)) {
      // Delete existing departures for this trip
      await prisma.departure.deleteMany({ where: { tripId: existingTrip.id } });

      for (const dep of departures) {
        if (!dep.startDate || !dep.endDate) continue;
        const depId = dep.id && dep.id.trim() !== "" ? dep.id : `${updated.slug}-${dep.startDate}`;
        await prisma.departure.create({
          data: {
            id: depId,
            tripId: existingTrip.id,
            startDate: dep.startDate,
            endDate: dep.endDate,
            price: dep.price ? parseFloat(dep.price) : null,
            originalPrice: dep.originalPrice ? parseFloat(dep.originalPrice) : null,
            spotsLeft:
              typeof dep.spotsLeft === "number" ? dep.spotsLeft : parseInt(dep.spotsLeft, 10) || 10,
            status: dep.status ?? "open",
            label: dep.label ?? null,
            note: dep.note ?? null,
          },
        });
      }
    }

    const completeTrip = await prisma.trip.findUnique({
      where: { id: existingTrip.id },
      include: {
        departures: {
          orderBy: { startDate: "asc" },
        },
      },
    });

    cleanupObsoleteCloudinaryAssets(existingTrip, completeTrip).catch((err) =>
      console.error("Cleanup error on saving trip:", err),
    );
    return NextResponse.json({ success: true, data: completeTrip });
  } catch (error: any) {
    console.error("Error updating trip:", error);
    return NextResponse.json(
      { success: false, error: error?.message ?? "Failed to update journey" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existingTrip = await prisma.trip.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!existingTrip) {
      return NextResponse.json({ success: false, error: "Journey not found" }, { status: 404 });
    }

    await prisma.trip.delete({ where: { id: existingTrip.id } });
    deleteCloudinaryAssetsFromData(existingTrip).catch((err) =>
      console.error("Cleanup error on deleting trip:", err),
    );
    return NextResponse.json({ success: true, message: "Journey deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting trip:", error);
    return NextResponse.json(
      { success: false, error: error?.message ?? "Failed to delete journey" },
      { status: 500 },
    );
  }
}
