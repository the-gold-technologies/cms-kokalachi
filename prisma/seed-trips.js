// Seed data for the website's /trips pages (Static Pages → Trips Pages in the CMS).
// Field names match src/lib/tripsPageContent.ts.
//
// - "trips" (/trips) holds the All Trips content.
// - Each sub-page is its own page, "trips/<slug>", with one TripsSubPageSection. These four are
//   built into the website, so the CMS lets admins edit and reorder them but not add or
//   delete them.
//
// Used two ways:
// - prisma/seed.js includes tripsPagesData in the full seed.
// - `npm run seed:trips` seeds only the trips pages, leaving every other page alone. It only adds
//   what's missing, so it's safe on production; `npm run seed:trips -- --reset` overwrites.

// The hero photo every trips page uses today; each page can have its own in the CMS
const tripsHeroImage =
  "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=2400";

const tripsPage = (slug, title, metaTitle, metaDescription, targetKeywords, order, sections) => ({
  title,
  slug,
  description: metaDescription,
  order,
  type: "Main Page",
  metaTitle,
  metaDescription,
  targetKeywords,
  canonicalUrl: `https://kokalachi.com/${slug}`,
  headingOptions: "h1",
  schema: JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: metaTitle,
      url: `https://kokalachi.com/${slug}`,
      description: metaDescription,
      publisher: { "@type": "Organization", name: "Kokalachi", url: "https://kokalachi.com" },
    },
    null,
    2,
  ),
  sections,
});

// A sub-page's content: every field the editor has. Fields for the other layout stay empty.
const subPage = (content) => [
  {
    type: "TripsSubPageSection",
    order: 1,
    content: {
      layout: "list",
      list: "upcoming",
      tagline: "",
      tabLabel: "",
      headline: "",
      scriptAccent: "",
      description: "",
      heroImage: tripsHeroImage,
      notes: [],
      listTitle: "",
      listSubtitle: "",
      howItWorksLabel: "",
      howItWorksTitle: "",
      steps: [],
      enquiryTag: "",
      menuTag: "",
      menuDesc: "",
      menuImage: "",
      ...content,
    },
  },
];

const tripsPagesData = [
  tripsPage(
    "trips",
    "Trips",
    "All Trips | Kokalachi",
    "Browse every Kokalachi group trip, upcoming and past. Filter by destination, month or date and find a departure that fits.",
    "all trips, group trips, upcoming trips, past trips, kokalachi departures",
    9,
    [
      {
        type: "AllTripsSection",
        order: 1,
        content: {
          tagline: "All Trips",
          tabLabel: "All Trips",
          headline: "Every trip, past &",
          scriptAccent: "upcoming.",
          description:
            "Every Kokalachi trip in one place: the ones you can still book and the ones our travellers have already taken.",
          heroImage: tripsHeroImage,
          listTitle: "All trips",
          listSubtitle: "Every trip we run, upcoming and past",
          menuFooterText: "Every trip we run, upcoming & past",
        },
      },
    ],
  ),

  tripsPage(
    "trips/upcoming",
    "Upcoming Trips",
    "Upcoming Trips | Kokalachi",
    "Upcoming Kokalachi group departures you can book now. Filter by destination, month or date.",
    "upcoming trips, group departures, book a group trip, kokalachi upcoming",
    10,
    subPage({
      layout: "list",
      list: "upcoming",
      tagline: "Upcoming Trips",
      tabLabel: "Upcoming Trips",
      headline: "Your next trip",
      scriptAccent: "starts here.",
      description:
        "Small-group departures you can book right now. Pick a destination and month to find dates that suit you.",
      listTitle: "Upcoming trips",
      listSubtitle: "Departures you can book now",
      menuTag: "Book Now",
      menuDesc: "Small-group departures you can book today.",
      menuImage:
        "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&q=80&w=300",
    }),
  ),

  tripsPage(
    "trips/past",
    "Past Trips",
    "Past Trips | Kokalachi",
    "The Kokalachi group trips that have already run, and when they're running again.",
    "past trips, kokalachi trip history, group trips that ran",
    11,
    subPage({
      layout: "list",
      list: "past",
      tagline: "Past Trips",
      tabLabel: "Past Trips",
      headline: "Where we've",
      scriptAccent: "already been.",
      description:
        "The trips our travellers have already taken. Many run again, so check each one for its next batch.",
      listTitle: "Past trips",
      listSubtitle: "Where our travellers have already been",
      menuTag: "Memories",
      menuDesc: "Trips our travellers have already taken.",
      menuImage:
        "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&q=80&w=300",
    }),
  ),

  tripsPage(
    "trips/custom-group-trip",
    "Custom Group Trip",
    "Custom Group Trip | Kokalachi",
    "Plan a private Kokalachi trip for your friends, family or team. Tell us where and when, and we'll design it around your group.",
    "custom group trip, private group tour, plan a trip for friends, corporate trip",
    12,
    subPage({
      layout: "enquiry",
      tagline: "Custom Group Trip",
      tabLabel: "Custom Group Trip",
      headline: "Your group, your",
      scriptAccent: "itinerary.",
      description:
        "Travelling with friends, family or your team? Tell us where and when, and we'll plan a private trip for you.",
      howItWorksLabel: "How it works",
      howItWorksTitle: "A private trip, planned for your people",
      steps: [
        {
          title: "Tell us about your group",
          text: "Where you'd like to go, roughly when, and who's coming along.",
        },
        {
          title: "We plan it around you",
          text: "We put together an itinerary and quote for your group, then fine-tune it with you.",
        },
        {
          title: "Travel together",
          text: "Once it's confirmed, your group gets the trip to itself.",
        },
      ],
      enquiryTag: "Custom group trip",
      menuTag: "Private",
      menuDesc: "A private trip planned around your group.",
      menuImage:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=300",
    }),
  ),

  tripsPage(
    "trips/solo-travellers",
    "Solo Travellers",
    "Trips for Solo Travellers | Kokalachi",
    "Solo-friendly group trips with Kokalachi. Travel on your own with a small, curated group of like-minded people.",
    "solo travel, solo friendly group trips, travel alone india, kokalachi solo",
    13,
    subPage({
      layout: "list",
      list: "all",
      tagline: "Solo Travellers",
      tabLabel: "Solo Travellers",
      headline: "Come solo,",
      scriptAccent: "leave with friends.",
      description:
        "Every Kokalachi trip is made for solo travellers. Join a small group of like-minded people and we'll handle the rest.",
      notes: [
        {
          title: "Small, curated groups",
          text: "Travel with a handful of like-minded people, not a crowded bus.",
        },
        {
          title: "No awkward start",
          text: "Meet your group before the trip, so day one feels like day three.",
        },
        {
          title: "We handle the plans",
          text: "Stays, transport and the itinerary are sorted, so you just show up.",
        },
      ],
      listTitle: "Trips for solo travellers",
      listSubtitle: "Every trip we run is made for travelling solo",
      menuTag: "Solo Friendly",
      menuDesc: "Every trip we run is made for solo travellers.",
      menuImage:
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=300",
    }),
  ),
];

module.exports = { tripsPagesData };

// `npm run seed:trips`: seed only these pages (see prisma/seed-pages-runner.js)
if (require.main === module) {
  require("./seed-pages-runner")
    .seedPages(tripsPagesData, { label: "Trips pages" })
    .catch((e) => {
      console.error("Seeding error:", e);
      process.exit(1);
    });
}
