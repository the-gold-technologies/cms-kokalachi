import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const KOKALACHI_NAV_DEFAULT = [
  {
    id: "nav-about",
    label: "About Us",
    title: "ABOUT US",
    url: "/about",
    type: "Main Link",
    parent: "-",
    order: 1,
    isStatic: true,
    description: "Our philosophy, story, and values behind Kokalachi.",
  },
  {
    id: "nav-destinations",
    label: "Destinations",
    title: "DESTINATIONS",
    url: "/journeys",
    type: "Dropdown",
    parent: "-",
    order: 2,
    isStatic: true,
    description: "Curated destinations categorized by travel vibe.",
  },
  // Destinations children
  {
    id: "nav-dest-all",
    label: "All Journeys",
    title: "ALL JOURNEYS",
    url: "/journeys",
    type: "Dropdown Item",
    parent: "nav-destinations",
    order: 1,
    isStatic: true,
    description: "Browse our complete slow-travel collection.",
  },
  {
    id: "nav-dest-adventure",
    label: "Mountains & Treks",
    title: "MOUNTAINS & TREKS",
    url: "/journeys?category=Adventure",
    type: "Dropdown Item",
    parent: "nav-destinations",
    order: 2,
    isStatic: true,
    description: "High altitude treks, alpine trails & pine canyons.",
  },
  {
    id: "nav-dest-slow",
    label: "Slow Travel",
    title: "SLOW TRAVEL",
    url: "/journeys?category=SlowTravel",
    type: "Dropdown Item",
    parent: "nav-destinations",
    order: 3,
    isStatic: true,
    description: "Riverside cabins, tea estates & mindful living.",
  },
  {
    id: "nav-dest-beach",
    label: "Beaches & Islands",
    title: "BEACHES & ISLANDS",
    url: "/journeys?category=BeachEscape",
    type: "Dropdown Item",
    parent: "nav-destinations",
    order: 4,
    isStatic: true,
    description: "Coastal sunsets, tropical waters & ocean breezes.",
  },
  {
    id: "nav-dest-first",
    label: "First-Timer Friendly",
    title: "FIRST-TIMER FRIENDLY",
    url: "/journeys?category=FirstTimers",
    type: "Dropdown Item",
    parent: "nav-destinations",
    order: 5,
    isStatic: true,
    description: "Gentle introductory trips for new group travellers.",
  },
  {
    id: "nav-dest-women",
    label: "Women Only",
    title: "WOMEN ONLY",
    url: "/journeys?category=WomenOnly",
    type: "Dropdown Item",
    parent: "nav-destinations",
    order: 6,
    isStatic: true,
    description: "Curated safe, empowering travel circles for women.",
  },

  // Tours
  {
    id: "nav-tours",
    label: "Tours",
    title: "TOURS",
    url: "/#upcoming-journeys",
    type: "Dropdown",
    parent: "-",
    order: 3,
    isStatic: true,
    description: "Upcoming fixed-date departures and travel flows.",
  },
  // Tours children
  {
    id: "nav-tours-departures",
    label: "Upcoming Departures",
    title: "UPCOMING DEPARTURES",
    url: "/#upcoming-journeys",
    type: "Dropdown Item",
    parent: "nav-tours",
    order: 1,
    isStatic: true,
    description: "Handcrafted dates & itineraries for travellers.",
  },
  {
    id: "nav-tours-works",
    label: "How Kokalachi Works",
    title: "HOW KOKALACHI WORKS",
    url: "/#how-it-works",
    type: "Dropdown Item",
    parent: "nav-tours",
    order: 2,
    isStatic: true,
    description: "Simple 3-step frictionless booking & travel flow.",
  },
  {
    id: "nav-tours-awkward",
    label: "Zero-Awkwardness Tribe",
    title: "ZERO-AWKWARDNESS TRIBE",
    url: "/about#what-we-believe",
    type: "Dropdown Item",
    parent: "nav-tours",
    order: 3,
    isStatic: true,
    description: "Vetted, curated small groups of like-minded travellers.",
  },
  {
    id: "nav-tours-custom",
    label: "Custom Group Trips",
    title: "CUSTOM GROUP TRIPS",
    url: "/contact",
    type: "Dropdown Item",
    parent: "nav-tours",
    order: 4,
    isStatic: true,
    description: "Private handcrafted journeys tailored for your circle.",
  },

  // Blogs & Stories
  {
    id: "nav-blogs",
    label: "Blogs & Stories",
    title: "BLOGS & STORIES",
    url: "/#moments",
    type: "Dropdown",
    parent: "-",
    order: 4,
    isStatic: true,
    description: "Reflections, photo diaries & travel advice.",
  },
  // Blogs children
  {
    id: "nav-blogs-memoirs",
    label: "Traveler Memoirs",
    title: "TRAVELER MEMOIRS",
    url: "/#moments",
    type: "Dropdown Item",
    parent: "nav-blogs",
    order: 1,
    isStatic: true,
    description: "Unfiltered stories and reflections from past travellers.",
  },
  {
    id: "nav-blogs-moments",
    label: "Moments Captured",
    title: "MOMENTS CAPTURED",
    url: "/#moments",
    type: "Dropdown Item",
    parent: "nav-blogs",
    order: 2,
    isStatic: true,
    description: "Visual memories, polaroids & community moments.",
  },
  {
    id: "nav-blogs-why",
    label: "Why We Started",
    title: "WHY WE STARTED",
    url: "/about#why-we-started",
    type: "Dropdown Item",
    parent: "nav-blogs",
    order: 3,
    isStatic: true,
    description: "The founding vision & story behind our tribe.",
  },
  {
    id: "nav-blogs-guides",
    label: "Packing & Route Guides",
    title: "PACKING & ROUTE GUIDES",
    url: "/about#what-we-believe",
    type: "Dropdown Item",
    parent: "nav-blogs",
    order: 4,
    isStatic: true,
    description: "Essential advice for high mountain & slow trails.",
  },

  // Community
  {
    id: "nav-community",
    label: "Community",
    title: "COMMUNITY",
    url: "/#good-company",
    type: "Main Link",
    parent: "-",
    order: 5,
    isStatic: true,
    description: "Real friendships and good company that last beyond the trip.",
  },

  // Contact Us
  {
    id: "nav-contact",
    label: "Contact Us",
    title: "CONTACT US",
    url: "/contact",
    type: "Action Button",
    parent: "-",
    order: 6,
    isStatic: true,
    description: "Direct enquiry & instant team support.",
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sync = searchParams.get("sync");

    let links = await prisma.navLink.findMany({
      orderBy: { order: "asc" },
    });

    // If sync requested or no links exist or only flat legacy links exist
    const hasDropdownItems = links.some((l) => l.parent !== "-" && l.parent !== "");
    if (sync === "true" || links.length === 0 || !hasDropdownItems) {
      await prisma.navLink.deleteMany();
      for (const item of KOKALACHI_NAV_DEFAULT) {
        await prisma.navLink.create({
          data: {
            id: item.id,
            label: item.label,
            title: item.title,
            url: item.url,
            type: item.type,
            parent: item.parent,
            order: item.order,
            description: item.description,
            isStatic: item.isStatic ?? true,
          },
        });
      }
      links = await prisma.navLink.findMany({ orderBy: { order: "asc" } });
    }

    return NextResponse.json({ success: true, data: links });
  } catch (error: any) {
    console.error("Error fetching nav links:", error);
    return NextResponse.json(
      { success: false, error: error?.message ?? "Failed to fetch nav links" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { label, url, type, parent, order, description, title } = body;

    if (!label || !url) {
      return NextResponse.json(
        { success: false, error: "Label and URL are required" },
        { status: 400 },
      );
    }

    const created = await prisma.navLink.create({
      data: {
        label,
        title: title || label.toUpperCase(),
        url,
        type: type || (parent && parent !== "-" ? "Dropdown Item" : "Main Link"),
        parent: parent || "-",
        order: typeof order === "number" ? order : 0,
        description: description || null,
        isStatic: false,
      },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    console.error("Error creating nav link:", error);
    return NextResponse.json(
      { success: false, error: error?.message ?? "Failed to create link" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // Check if sync action requested
    if (body.action === "sync_default") {
      await prisma.navLink.deleteMany();
      for (const item of KOKALACHI_NAV_DEFAULT) {
        await prisma.navLink.create({
          data: {
            id: item.id,
            label: item.label,
            title: item.title,
            url: item.url,
            type: item.type,
            parent: item.parent,
            order: item.order,
            description: item.description,
            isStatic: item.isStatic ?? true,
          },
        });
      }
      const links = await prisma.navLink.findMany({ orderBy: { order: "asc" } });
      return NextResponse.json({ success: true, data: links });
    }

    // Single link update
    if (body.id) {
      const { id, label, url, type, parent, order, description, title } = body;
      const updated = await prisma.navLink.update({
        where: { id },
        data: {
          label: label !== undefined ? label : undefined,
          title: title !== undefined ? title : label ? label.toUpperCase() : undefined,
          url: url !== undefined ? url : undefined,
          type: type !== undefined ? type : undefined,
          parent: parent !== undefined ? parent : undefined,
          order: order !== undefined ? order : undefined,
          description: description !== undefined ? description : undefined,
        },
      });
      return NextResponse.json({ success: true, data: updated });
    }

    // Bulk links array update
    if (Array.isArray(body.links)) {
      for (const item of body.links) {
        if (!item.id) continue;
        await prisma.navLink.update({
          where: { id: item.id },
          data: {
            label: item.label,
            url: item.url,
            type: item.type,
            parent: item.parent,
            order: item.order,
            description: item.description,
          },
        });
      }
      const all = await prisma.navLink.findMany({ orderBy: { order: "asc" } });
      return NextResponse.json({ success: true, data: all });
    }

    return NextResponse.json({ success: false, error: "Invalid update payload" }, { status: 400 });
  } catch (error: any) {
    console.error("Error updating nav links:", error);
    return NextResponse.json(
      { success: false, error: error?.message ?? "Failed to update link" },
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
        { success: false, error: "id parameter is required" },
        { status: 400 },
      );
    }

    // Delete child links if any
    await prisma.navLink.deleteMany({ where: { parent: id } });
    await prisma.navLink.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting nav link:", error);
    return NextResponse.json(
      { success: false, error: error?.message ?? "Failed to delete link" },
      { status: 500 },
    );
  }
}
