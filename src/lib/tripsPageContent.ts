// Content for the website's /trips pages, edited in Static Pages → Trips Pages.
// The content lives in the database (seeded by prisma/seed-trips.js); this file only describes
// which sections and fields exist, for the editor and for checking what gets saved.
//
// - The "trips" page (/trips) holds the All Trips content.
//   (The Upcoming Journeys strip shown across the site is in Static Pages → Shared Sections.)
// - Each sub-page (/trips/upcoming, /trips/past…) is its own page, "trips/<slug>", with one
//   TripsSubPageSection. Admins can edit and reorder them; they can't be added or removed
//   because each has its own website route.
//
// Counts, dates and search words inside messages ("3 trips", "Departing 2 Nov – 9 Nov") are
// built by the website, so they aren't edited here.
// SEO (meta title, description…) for each page is edited in SEO → Page Settings, not here.

import {
  heading,
  image,
  normalizeSection,
  row,
  text,
  textarea,
  type SectionConfig,
  type SectionField,
  type WhenValue,
} from "@/lib/sectionFields";

export const TRIPS_PAGE_SLUG = "trips";
export const TRIPS_SUB_PAGE_PREFIX = "trips/";
export const TRIPS_SUB_PAGE_SECTION = "TripsSubPageSection";

// ---------- Content shapes (what the website will read) ----------

// A headline ending in handwritten, underlined words: "Come solo," + "leave with friends."
export interface HeadlineText {
  headline: string; // plain text before the handwritten part
  scriptAccent: string; // handwritten words, drawn with the orange underline
}

export interface TitleText {
  title: string;
  text: string;
}

// Hero banner and trip list shared by /trips and its sub-pages
export interface TripsPageText extends HeadlineText {
  tabLabel: string; // tab under every trips hero, and the footer link
  tagline: string; // orange pill above the headline
  description: string; // under the headline (~120 characters fits on two lines)
  heroImage: string; // the hero photo behind this page
  listTitle: string; // heading above the trip grid
  listSubtitle: string;
}

export type TripsSubPageLayout = "list" | "enquiry";
export type TripsListKind = "all" | "upcoming" | "past";

export interface TripsSubPageContent extends TripsPageText {
  layout: TripsSubPageLayout; // a list of trips, or the private-trip enquiry form
  list: TripsListKind; // list layout: which trips it shows
  notes: TitleText[]; // list layout: optional cards above the trip list
  howItWorksLabel: string; // enquiry layout
  howItWorksTitle: string;
  steps: TitleText[];
  enquiryTag: string; // added to enquiries sent from the page
  menuTag: string; // navbar Trips dropdown tile
  menuDesc: string;
  menuImage: string;
}

export interface TripsSections {
  AllTripsSection: TripsPageText & {
    menuFooterText: string; // bottom-left of the navbar's Trips dropdown, next to "Explore all"
  };
}

export type TripsSectionKey = keyof TripsSections;

// ---------- Editor layout ----------

// Hero banner, in the order it appears on the page: pill, headline, description
const heroFields = (where: string): SectionField[] => [
  heading("Hero banner", `The banner at the top of ${where}`),
  row([
    text("tagline", "Tagline Pill", {
      tooltip: "Small orange pill above the headline",
      placeholder: "e.g. Upcoming Trips",
    }),
    text("tabLabel", "Tab Label", {
      tooltip: "This page's name in the tabs under every trips hero, and in the footer",
      placeholder: "e.g. Upcoming Trips",
    }),
  ]),
  { kind: "headline", label: "Headline" },
  textarea("description", "Description", {
    help: "Keep it short (about 120 characters) so it fits on two lines",
  }),
  image("heroImage", "Hero Photo", {
    help: "Keep the subject on the right; the headline sits on the left",
  }),
];

const listFields = (when?: WhenValue): SectionField[] => [
  heading(
    "Trip list",
    "Heading on the left above the trip cards (the tabs sit on the right)",
    when,
  ),
  row(
    [
      text("listTitle", "List Heading", { placeholder: "e.g. Upcoming trips" }),
      text("listSubtitle", "List Subtitle", { placeholder: "e.g. Departures you can book now" }),
    ],
    when,
  ),
];

// The All Trips page, stored on the "trips" page
export const TRIPS_SECTIONS: (SectionConfig & { key: TripsSectionKey })[] = [
  {
    key: "AllTripsSection",
    title: "All Trips Page",
    badge: "/trips",
    description:
      "The main trips page: every trip, upcoming and past. Also the line in the navbar's Trips dropdown that leads here.",
    fields: [
      ...heroFields("/trips"),
      ...listFields(),
      heading(
        "Navbar Trips menu",
        "The navbar's Trips dropdown, whose “Explore all” link opens /trips",
      ),
      text("menuFooterText", "Dropdown Footer Line", {
        help: "Bottom-left of the dropdown, next to “Explore all”",
        placeholder: "e.g. Every trip we run, upcoming & past",
      }),
    ],
  },
];

export const ALL_TRIPS_SECTION: TripsSectionKey = "AllTripsSection";

export const SUB_PAGE_LAYOUTS: { value: TripsSubPageLayout; label: string }[] = [
  { value: "list", label: "Trip list (with filters)" },
  { value: "enquiry", label: "Enquiry form (private trips)" },
];

const isList = { key: "layout", equals: "list" };
const isEnquiry = { key: "layout", equals: "enquiry" };

// A sub-page of /trips: Upcoming, Past, Custom Group Trip or Solo Travellers
export const TRIPS_SUB_PAGE_CONFIG: SectionConfig = {
  key: TRIPS_SUB_PAGE_SECTION,
  title: "Page Content",
  badge: "Sub-page",
  description: "Everything on this page, top to bottom, plus its tile in the navbar's Trips menu.",
  fields: [
    heading("Page type"),
    row([
      { kind: "select", key: "layout", label: "What the page shows", options: SUB_PAGE_LAYOUTS },
      {
        kind: "select",
        key: "list",
        label: "Which trips",
        options: [
          { value: "upcoming", label: "Upcoming trips (bookable dates)" },
          { value: "past", label: "Past trips (already run)" },
          { value: "all", label: "All trips" },
        ],
        when: isList,
      },
    ]),
    ...heroFields("this page"),

    // Trip list pages
    heading(
      "Notes above the list (optional)",
      "Cards between the filters and the trip list",
      isList,
    ),
    {
      kind: "list",
      key: "notes",
      label: "Notes",
      itemLabel: "Note",
      help: "Best with 3",
      max: 6,
      when: isList,
    },
    ...listFields(isList),

    // Enquiry form pages
    heading("How it works", "Left column, next to the enquiry form", isEnquiry),
    row(
      [
        text("howItWorksLabel", "Small Label", {
          tooltip: "Orange uppercase label above the heading",
          placeholder: "e.g. How it works",
        }),
        text("howItWorksTitle", "Heading", {
          placeholder: "e.g. A private trip, planned for your people",
        }),
      ],
      isEnquiry,
    ),
    {
      kind: "list",
      key: "steps",
      label: "Steps",
      itemLabel: "Step",
      help: "Numbered 01, 02, 03… in this order",
      max: 6,
      when: isEnquiry,
    },
    heading("Enquiry form", "The form's fields are edited in Static Pages → Contact Us", isEnquiry),
    text("enquiryTag", "Enquiry Tag", {
      help: "Added to enquiries sent from this page, so the team can see where they came from",
      placeholder: "e.g. Custom group trip",
      when: isEnquiry,
    }),

    heading(
      "Navbar Trips menu tile",
      "This page's photo tile in the navbar's Trips dropdown. The tile's name is edited in Navigation → Menu Links.",
    ),
    row([
      text("menuTag", "Tile Badge", { placeholder: "e.g. Book Now" }),
      text("menuDesc", "Tile Description", { placeholder: "One short line" }),
    ]),
    image("menuImage", "Tile Photo"),
  ],
};

export const TRIPS_SECTION_KEYS = TRIPS_SECTIONS.map((s) => s.key);

export const isTripsSectionKey = (key: unknown): key is TripsSectionKey =>
  typeof key === "string" && (TRIPS_SECTION_KEYS as string[]).includes(key);

export const normalizeTripsSection = (key: TripsSectionKey, input: unknown) =>
  normalizeSection(
    TRIPS_SECTIONS.find((s) => s.key === key)!,
    input,
  );

export const normalizeSubPage = (input: unknown) => normalizeSection(TRIPS_SUB_PAGE_CONFIG, input);
