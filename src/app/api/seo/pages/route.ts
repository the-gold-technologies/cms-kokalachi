import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { navPageTitles } from "@/lib/navLinks";

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
    slug: "blogs",
    title: "Blog Journal",
    order: 2,
    type: "Main Page",
    metaTitle: "The Kokalachi Journal | Stories for the curious traveller",
    metaDescription:
      "Honest guides, little rituals and real stories from the road, for anyone who has a bucket list but not yet a travel buddy.",
    targetKeywords:
      "blogs, journal, slow travel stories, kokalachi memoirs, travel guides, solo traveler tips",
    canonicalUrl: "https://kokalachi.com/blogs",
    headingOptions: "h1",
    schema: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "The Kokalachi Journal",
        url: "https://kokalachi.com/blogs",
        description:
          "Honest guides, little rituals and real stories from the road, for anyone who has a bucket list but not yet a travel buddy.",
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
    order: 3,
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
    order: 4,
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
    slug: "community",
    title: "Community",
    order: 5,
    type: "Main Page",
    metaTitle: "The Kokalachi Community | Strangers once, now family",
    metaDescription:
      "Real stories, photos and videos from Kokalachi travellers. Hear from the people who came as strangers and went home as family.",
    targetKeywords:
      "kokalachi community, traveller stories, slow travel memories, trip photos, travel reviews, group travel letters",
    canonicalUrl: "https://kokalachi.com/community",
    headingOptions: "h1",
    schema: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "The Kokalachi Community",
        url: "https://kokalachi.com/community",
        description:
          "Real stories, photos and videos from Kokalachi travellers. Hear from the people who came as strangers and went home as family.",
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
    slug: "faqs",
    title: "FAQ Page",
    order: 6,
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
  {
    slug: "terms",
    title: "Terms & Conditions",
    order: 7,
    type: "Legal Page",
    metaTitle: "Terms & Conditions | Kokalachi",
    metaDescription:
      "Read the Kokalachi booking terms, cancellation policies, trip conditions, liability waivers, and participant responsibilities.",
    targetKeywords:
      "kokalachi terms, booking terms, cancellation policy, travel terms and conditions",
    canonicalUrl: "https://kokalachi.com/terms",
    headingOptions: "h1",
    schema: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Terms & Conditions",
        url: "https://kokalachi.com/terms",
        description:
          "Read the Kokalachi booking terms, cancellation policies, trip conditions, liability waivers, and participant responsibilities.",
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
    slug: "privacy-policy",
    title: "Privacy Policy",
    order: 8,
    type: "Legal Page",
    metaTitle: "Privacy Policy | Kokalachi",
    metaDescription:
      "Understand how Kokalachi collects, uses, and safeguards your personal information, booking details, and browsing data.",
    targetKeywords:
      "kokalachi privacy policy, data protection, personal data privacy, travel agency privacy",
    canonicalUrl: "https://kokalachi.com/privacy-policy",
    headingOptions: "h1",
    schema: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Privacy Policy",
        url: "https://kokalachi.com/privacy-policy",
        description:
          "Understand how Kokalachi collects, uses, and safeguards your personal information, booking details, and browsing data.",
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
];

export async function GET() {
  try {
    // Pages opened from the navbar take their name from CMS → Navigation → Menu Links
    const menuTitles = await navPageTitles();

    // Upsert the core pages with complete metadata if missing
    for (const core of CORE_PAGES) {
      const title = menuTitles[core.slug] || core.title;
      const existing = await prisma.page.findUnique({
        where: { slug: core.slug },
      });

      if (!existing) {
        await prisma.page.create({
          data: {
            slug: core.slug,
            title,
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
            title,
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

    // Return the distinct pages in order (Home is managed in Global SEO, Journeys detail in Journey editor)
    const slugOrder = [
      "journeys",
      "blogs",
      "about",
      "contact",
      "community",
      "faqs",
      "terms",
      "privacy-policy",
      "trips",
    ];
    const pages = await prisma.page.findMany({
      where: {
        OR: [
          { slug: { in: slugOrder } },
          // Trips sub-pages, including ones added in Static Pages → Trips Pages
          { slug: { startsWith: "trips/" } },
        ],
      },
      select: {
        id: true,
        slug: true,
        title: true,
        metaTitle: true,
        metaDescription: true,
        order: true,
        type: true,
        schema: true,
      },
      orderBy: { order: "asc" },
    });

    // Fixed pages in this order, then the trips sub-pages in their tab order
    const rank = (slug: string) =>
      slugOrder.includes(slug) ? slugOrder.indexOf(slug) : slugOrder.length;
    const sorted = [...pages]
      .sort((a, b) => rank(a.slug) - rank(b.slug) || a.order - b.order)
      .map((p, idx) => ({ ...p, order: idx + 1 }));

    // The trips sub-pages sit inside the Trips row as a dropdown, like the Trips menu in Menu Links
    const tripsId = sorted.find((p) => p.slug === "trips")?.id;
    const grouped = sorted.map((p) =>
      tripsId && p.slug.startsWith("trips/") ? { ...p, parent: tripsId } : p,
    );

    return NextResponse.json({
      success: true,
      data: grouped,
    });
  } catch (error) {
    console.error("Error fetching SEO pages:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch SEO pages" },
      { status: 500 },
    );
  }
}
