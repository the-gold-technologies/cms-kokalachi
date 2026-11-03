// Seed data for sections shown across the website (Static Pages → Shared Sections in the CMS),
// stored on the "shared" page. Field names match src/lib/sharedSections.ts.
//
// Used two ways:
// - prisma/seed.js includes sharedPagesData in the full seed.
// - `npm run seed:shared` seeds only the shared sections, leaving every other page alone. It only
//   adds what's missing, so it's safe on production; `npm run seed:shared -- --reset` overwrites.

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

// `npm run seed:shared`: seed only these pages (see prisma/seed-pages-runner.js)
if (require.main === module) {
  require("./seed-pages-runner")
    .seedPages(sharedPagesData, { label: "Shared sections" })
    .catch((e) => {
      console.error("Seeding error:", e);
      process.exit(1);
    });
}
