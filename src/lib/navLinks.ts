import { prisma } from "@/lib/prisma";

// The website navbar's menu. Admins can rename links (label) in Navigation → Menu Links;
// everything else here (ids, URLs, types, order) is fixed, because the website builds its
// menus around these ids. The website falls back to these labels if a link is missing.
// Keep in sync with NAV_LABELS in kokalachi/src/components/layout/Navbar.tsx.

export interface NavLinkDefault {
  id: string;
  label: string;
  url: string;
  type: "Main Link" | "Dropdown" | "Dropdown Item" | "Action Button";
  parent: string; // "-" for top-level links
  order: number;
}

export const NAV_LABEL_MAX_LENGTH = 40;

export const KOKALACHI_NAV: NavLinkDefault[] = [
  { id: "nav-about", label: "About Us", url: "/about", type: "Main Link", parent: "-", order: 1 },

  {
    id: "nav-journeys",
    label: "Journeys",
    url: "/journeys",
    type: "Dropdown",
    parent: "-",
    order: 2,
  },
  {
    id: "nav-journeys-all",
    label: "All Journeys",
    url: "/journeys",
    type: "Dropdown Item",
    parent: "nav-journeys",
    order: 1,
  },
  {
    id: "nav-journeys-adventure",
    label: "Mountains & Treks",
    url: "/journeys?category=Adventure",
    type: "Dropdown Item",
    parent: "nav-journeys",
    order: 2,
  },
  {
    id: "nav-journeys-slow",
    label: "Slow Travel",
    url: "/journeys?category=SlowTravel",
    type: "Dropdown Item",
    parent: "nav-journeys",
    order: 3,
  },
  {
    id: "nav-journeys-beach",
    label: "Beaches & Islands",
    url: "/journeys?category=BeachEscape",
    type: "Dropdown Item",
    parent: "nav-journeys",
    order: 4,
  },
  {
    id: "nav-journeys-first",
    label: "First-Timer Friendly",
    url: "/journeys?category=FirstTimers",
    type: "Dropdown Item",
    parent: "nav-journeys",
    order: 5,
  },
  {
    id: "nav-journeys-women",
    label: "Women Only",
    url: "/journeys?category=WomenOnly",
    type: "Dropdown Item",
    parent: "nav-journeys",
    order: 6,
  },

  { id: "nav-trips", label: "Trips", url: "/trips", type: "Dropdown", parent: "-", order: 3 },
  {
    id: "nav-trips-upcoming",
    label: "Upcoming Trips",
    url: "/trips/upcoming",
    type: "Dropdown Item",
    parent: "nav-trips",
    order: 1,
  },
  {
    id: "nav-trips-past",
    label: "Past Trips",
    url: "/trips/past",
    type: "Dropdown Item",
    parent: "nav-trips",
    order: 2,
  },
  {
    id: "nav-trips-custom",
    label: "Custom Group Trip",
    url: "/trips/custom-group-trip",
    type: "Dropdown Item",
    parent: "nav-trips",
    order: 3,
  },
  {
    id: "nav-trips-solo",
    label: "Solo Travellers",
    url: "/trips/solo-travellers",
    type: "Dropdown Item",
    parent: "nav-trips",
    order: 4,
  },

  { id: "nav-blogs", label: "Blogs", url: "/blogs", type: "Dropdown", parent: "-", order: 4 },
  {
    id: "nav-blogs-all",
    label: "The Kokalachi Journal",
    url: "/blogs",
    type: "Dropdown Item",
    parent: "nav-blogs",
    order: 1,
  },
  {
    id: "nav-blogs-moments",
    label: "Moments Captured",
    url: "/#moments",
    type: "Dropdown Item",
    parent: "nav-blogs",
    order: 2,
  },
  {
    id: "nav-blogs-why",
    label: "Why We Started",
    url: "/about#why-we-started",
    type: "Dropdown Item",
    parent: "nav-blogs",
    order: 3,
  },

  {
    id: "nav-community",
    label: "Community",
    url: "/community",
    type: "Main Link",
    parent: "-",
    order: 5,
  },

  {
    id: "nav-contact",
    label: "Contact Us",
    url: "/contact",
    type: "Action Button",
    parent: "-",
    order: 6,
  },
];

const NAV_IDS = new Set(KOKALACHI_NAV.map((l) => l.id));

// Menu links that open a page listed in SEO → Pages (Page.slug). Renaming one of these links
// renames the page there too, so admins see the same name in both places.
export const NAV_PAGE_SLUGS: Record<string, string> = {
  "nav-about": "about",
  "nav-journeys": "journeys",
  "nav-blogs": "blogs",
  "nav-community": "community",
  "nav-contact": "contact",
};

/** Page names taken from the menu, by page slug ("journeys" → "Journeys"). */
export async function navPageTitles(): Promise<Record<string, string>> {
  const rows = await prisma.navLink.findMany({
    where: { id: { in: Object.keys(NAV_PAGE_SLUGS) } },
    select: { id: true, label: true },
  });
  return Object.fromEntries(rows.map((r) => [NAV_PAGE_SLUGS[r.id], r.label]));
}

export const isNavLinkId = (id: unknown): id is string => typeof id === "string" && NAV_IDS.has(id);

/**
 * Brings the NavLink table in line with KOKALACHI_NAV: adds missing links, removes links the
 * website no longer has, and resets URL/type/parent/order to the fixed values. Labels that
 * admins have changed are kept. Only writes when something actually differs.
 */
export async function syncNavLinks() {
  const rows = await prisma.navLink.findMany();
  const byId = new Map(rows.map((r) => [r.id, r]));

  const stale = rows.filter((r) => !NAV_IDS.has(r.id)).map((r) => r.id);
  const writes = [];
  if (stale.length > 0) writes.push(prisma.navLink.deleteMany({ where: { id: { in: stale } } }));

  for (const link of KOKALACHI_NAV) {
    const row = byId.get(link.id);
    if (!row) {
      writes.push(
        prisma.navLink.create({
          data: { ...link, title: link.label.toUpperCase(), isStatic: true },
        }),
      );
    } else if (
      row.url !== link.url ||
      row.type !== link.type ||
      row.parent !== link.parent ||
      row.order !== link.order ||
      !row.isStatic
    ) {
      writes.push(
        prisma.navLink.update({
          where: { id: link.id },
          data: {
            url: link.url,
            type: link.type,
            parent: link.parent,
            order: link.order,
            isStatic: true,
          },
        }),
      );
    }
  }

  if (writes.length > 0) await prisma.$transaction(writes);
  return prisma.navLink.findMany({ orderBy: { order: "asc" } });
}
