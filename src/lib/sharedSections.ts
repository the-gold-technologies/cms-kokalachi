// Sections that appear on many website pages, edited once in Static Pages → Shared Sections and
// stored on the "shared" page. Content lives in the database (seeded by prisma/seed.js).

import {
  heading,
  normalizeSection,
  text,
  textarea,
  type FieldOption,
  type SectionConfig,
} from "@/lib/sectionFields";

export const SHARED_PAGE_SLUG = "shared";

// ---------- Content shapes (what the website will read) ----------

export interface UpcomingJourneysStripContent {
  tag: string;
  headline: string; // plain start of the headline
  scriptAccent: string; // handwritten, underlined end
  description: string;
  viewAllText: string;
  showOn: StripPageKey[]; // pages that show the strip
}

export interface SharedSections {
  UpcomingJourneysStripSection: UpcomingJourneysStripContent;
}

export type SharedSectionKey = keyof SharedSections;

// Pages the strip can show on. Home isn't here: it has its own full Upcoming Journeys section
// (Static Pages → Home).
export const STRIP_PAGES = [
  { value: "about", label: "About Us" },
  { value: "community", label: "Community" },
  { value: "blogs", label: "Blogs" },
  { value: "blog-post", label: "Each blog post" },
  { value: "journeys", label: "All Journeys" },
  { value: "journey-detail", label: "Each journey page" },
  { value: "trips", label: "Trips pages (all of them)" },
] as const satisfies readonly FieldOption[];

export type StripPageKey = (typeof STRIP_PAGES)[number]["value"];

// ---------- Editor layout ----------

export const SHARED_SECTIONS: (SectionConfig & { key: SharedSectionKey })[] = [
  {
    key: "UpcomingJourneysStripSection",
    title: "Upcoming Journeys Strip",
    badge: "Site-wide",
    description:
      "The row of upcoming trip cards near the bottom of pages across the site. On a journey page it leaves out the journey being viewed.",
    fields: [
      heading("Content"),
      text("tag", "Section Tag", { placeholder: "e.g. Upcoming Journeys" }),
      { kind: "headline", label: "Headline" },
      textarea("description", "Description"),
      text("viewAllText", "“View All” Link", {
        placeholder: "e.g. View all",
        help: "Opens the Upcoming Trips page",
      }),
      heading("Where it shows"),
      {
        kind: "checklist",
        key: "showOn",
        label: "Show on",
        options: [...STRIP_PAGES],
        help: "Untick a page to hide the strip there. Home has its own Upcoming Journeys section.",
      },
    ],
  },
];

export const SHARED_SECTION_KEYS = SHARED_SECTIONS.map((s) => s.key);

export const isSharedSectionKey = (key: unknown): key is SharedSectionKey =>
  typeof key === "string" && (SHARED_SECTION_KEYS as string[]).includes(key);

export const normalizeSharedSection = (key: SharedSectionKey, input: unknown) =>
  normalizeSection(
    SHARED_SECTIONS.find((s) => s.key === key)!,
    input,
  );
