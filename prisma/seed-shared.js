// Seed data for sections shown across the website (Static Pages → Shared Sections in the CMS),
// stored on the "shared" page. Field names match src/lib/sharedSections.ts.
//
// prisma/seed.js includes sharedPagesData in the full seed.

const sharedPagesData = [
  {
    title: "Shared Sections",
    slug: "shared",
    description: "Sections shown on many pages of the website.",
    order: 99,
    type: "Shared",
    sections: [
      {
        type: "UpcomingJourneysStripSection",
        order: 1,
        content: {
          tag: "Upcoming Journeys",
          headline: "Your next trip is",
          scriptAccent: "waiting.",
          description: "Small-group trips with dates open now. Find one that fits your calendar.",
          viewAllText: "View all",
          // Every page that shows the strip today
          showOn: [
            "about",
            "community",
            "blogs",
            "blog-post",
            "journeys",
            "journey-detail",
            "trips",
          ],
        },
      },
    ],
  },
];

module.exports = { sharedPagesData };
