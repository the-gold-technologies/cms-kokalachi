import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const CORE_PAGES = [
  {
    slug: "journeys",
    title: "All Journeys",
    order: 1,
    type: "Main Page",
    metaTitle: "All Journeys | Kokalachi - Handcrafted Slow Travel & Group Trips",
    metaDescription:
      "Explore our complete collection of handcrafted slow-travel group trips across mountains, tea estates, coastal escapes, and remote valleys.",
    targetKeywords:
      "all journeys, group trips, slow travel destinations, mountain treks, beach trips, kokalachi itineraries",
    canonicalUrl: "https://kokalachi.com/journeys",
    headingOptions: "h1",
    schema: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "All Journeys | Kokalachi",
        url: "https://kokalachi.com/journeys",
        description:
          "Explore our complete collection of handcrafted slow-travel group trips across mountains, tea estates, coastal escapes, and remote valleys.",
        publisher: {
          "@type": "Organization",
          name: "Kokalachi",
          url: "https://kokalachi.com",
        },
      },
      null,
      2,
    ),
  },
  {
    slug: "about",
    title: "About Us",
    order: 2,
    type: "Main Page",
    metaTitle: "About Us | Kokalachi - Our Philosophy, Story & Tribe",
    metaDescription:
      "Discover why Kokalachi was born: replacing crowded tourist traps with intimate human connection, slow travel, and zero-awkwardness tribe vibes.",
    targetKeywords:
      "about kokalachi, slow travel philosophy, zero awkwardness tribe, founder story, mindful travel",
    canonicalUrl: "https://kokalachi.com/about",
    headingOptions: "h1",
    schema: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About Kokalachi",
        url: "https://kokalachi.com/about",
        description:
          "Discover why Kokalachi was born: replacing crowded tourist traps with intimate human connection.",
        publisher: {
          "@type": "Organization",
          name: "Kokalachi",
          url: "https://kokalachi.com",
        },
      },
      null,
      2,
    ),
  },
  {
    slug: "contact",
    title: "Contact Us",
    order: 3,
    type: "Main Page",
    metaTitle: "Contact Us | Kokalachi - Connect With Our Travel Tribe",
    metaDescription:
      "Have questions or dreaming of a custom group trip? Get in touch with our team via email, WhatsApp, or instant enquiry form.",
    targetKeywords:
      "contact kokalachi, travel enquiry, custom group trip, trip support, plan a journey",
    canonicalUrl: "https://kokalachi.com/contact",
    headingOptions: "h1",
    schema: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact Kokalachi",
        url: "https://kokalachi.com/contact",
        description: "Get in touch with our team via email, WhatsApp, or instant enquiry form.",
        mainEntity: {
          "@type": "ContactPoint",
          telephone: "+919711845700",
          email: "hello@kokalachi.com",
          contactType: "Customer Service",
          availableLanguage: ["English", "Hindi"],
        },
      },
      null,
      2,
    ),
  },
  {
    slug: "faqs",
    title: "FAQ Page",
    order: 4,
    type: "Main Page",
    metaTitle: "FAQs | Kokalachi - Answers on Bookings, Packing & Travel Tribes",
    metaDescription:
      "Everything you might want to know before you join a Kokalachi journey, from how it works to what is included.",
    targetKeywords:
      "kokalachi faqs, group travel questions, solo travel safety, packing advice, booking policies",
    canonicalUrl: "https://kokalachi.com/faqs",
    headingOptions: "h1",
    schema: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How do Kokalachi group journeys work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We curate small group journeys (typically 8–14 travellers) with pre-vetted boutique stays, local hosts, and unhurried slow-travel itineraries.",
            },
          },
          {
            "@type": "Question",
            name: "Are Kokalachi journeys solo-traveler friendly?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Absolutely! Over 70% of our travelers join solo. Our zero-awkwardness tribe design ensures you feel welcome from day one.",
            },
          },
          {
            "@type": "Question",
            name: "What is included in a trip?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "All stays, internal road travel, curated local experiences, permits, dedicated trip leads, and breakfast/dinners as detailed in each itinerary.",
            },
          },
          {
            "@type": "Question",
            name: "Can I request a custom group trip?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes! We design bespoke private group journeys for circles of friends, families, or corporate teams. Reach out via our contact page.",
            },
          },
        ],
      },
      null,
      2,
    ),
  },
];

export async function GET() {
  try {
    // Upsert the 4 core pages with complete metadata if missing
    for (const core of CORE_PAGES) {
      const existing = await prisma.page.findUnique({
        where: { slug: core.slug },
      });

      if (!existing) {
        await prisma.page.create({
          data: {
            slug: core.slug,
            title: core.title,
            order: core.order,
            type: core.type,
            metaTitle: core.metaTitle,
            metaDescription: core.metaDescription,
            targetKeywords: core.targetKeywords,
            canonicalUrl: core.canonicalUrl,
            headingOptions: core.headingOptions,
            schema: core.schema,
            visibility: "published",
            isStatic: true,
          },
        });
      } else {
        await prisma.page.update({
          where: { slug: core.slug },
          data: {
            title: core.title,
            order: core.order,
            type: core.type,
            metaTitle: existing.metaTitle || core.metaTitle,
            metaDescription: existing.metaDescription || core.metaDescription,
            targetKeywords: existing.targetKeywords || core.targetKeywords,
            canonicalUrl: existing.canonicalUrl || core.canonicalUrl,
            headingOptions:
              typeof existing.headingOptions === "string" ? existing.headingOptions : "h1",
            schema: existing.schema || core.schema,
          },
        });
      }
    }

    // Return the 4 distinct pages in order (Home is managed in Global SEO, Journeys detail in Journey editor)
    const pages = await prisma.page.findMany({
      where: {
        slug: { in: ["journeys", "about", "contact", "faqs"] },
      },
      select: {
        id: true,
        slug: true,
        title: true,
        metaTitle: true,
        metaDescription: true,
        order: true,
        type: true,
      },
      orderBy: { order: "asc" },
    });

    const slugOrder = ["journeys", "about", "contact", "faqs"];
    const sorted = [...pages].sort((a, b) => slugOrder.indexOf(a.slug) - slugOrder.indexOf(b.slug));

    return NextResponse.json({
      success: true,
      data: sorted,
    });
  } catch (error) {
    console.error("Error fetching SEO pages:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch SEO pages" },
      { status: 500 },
    );
  }
}
