const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");
const path = require("path");

require("dotenv").config();
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding Kokalachi CMS database with 100% website data...");

  // 1. Admin User
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  await prisma.user.upsert({
    where: { email: "admin@kokalachi.com" },
    update: {},
    create: {
      email: "admin@kokalachi.com",
      name: "Kokalachi Admin",
      password: adminPassword,
      role: "admin",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    },
  });
  console.log("✓ Admin user created (admin@kokalachi.com / Admin@123).");

  // 2. Global Brand Configuration
  await prisma.globalConfig.upsert({
    where: { id: "global" },
    update: {},
    create: {
      id: "global",
      siteTitle: "Kokalachi - Journeys Become Friendships",
      siteDescription: "Curated group travel experiences designed to turn journeys into lasting friendships.",
      phone: "+91 98765 43210",
      email: "hello@kokalachi.com",
      address: "New Delhi & Mumbai, India",
      instagramUrl: "https://instagram.com/kokalachi",
      facebookUrl: "https://facebook.com/kokalachi",
      youtubeUrl: "https://youtube.com/@kokalachi",
      socialLinks: {
        instagram: "https://instagram.com/kokalachi",
        facebook: "https://facebook.com/kokalachi",
        youtube: "https://youtube.com/@kokalachi",
      },
      robotsTxt: "User-agent: *\nAllow: /\n\nSitemap: https://kokalachi.com/sitemap.xml",
      sitemapEnabled: true,
    },
  });
  console.log("✓ Global brand configuration seeded.");

  // 3. Destinations
  const destinationsData = [
    { name: "Manali", slug: "manali", description: "Pine valleys, snow-capped peaks, mountain cafés, and scenic trails.", coverImage: "https://images.unsplash.com/photo-1597167231350-d057a45dc868?auto=format&fit=crop&q=85&w=800", order: 1 },
    { name: "Kashmir", slug: "kashmir", description: "The paradise on earth with pristine Dal Lake, houseboats, and alpine meadows.", coverImage: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=85&w=800", order: 2 },
    { name: "Meghalaya", slug: "meghalaya", description: "Abode of clouds, living root bridges, turquoise natural pools, and waterfalls.", coverImage: "https://images.unsplash.com/photo-1625826415766-001bd75aaf52?auto=format&fit=crop&q=85&w=800", order: 3 },
    { name: "Kerala", slug: "kerala", description: "Gods own country: serene backwaters, tea plantations, and coastal warmth.", coverImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=85&w=800", order: 4 },
    { name: "Bhutan", slug: "bhutan", description: "The mystical Thunder Dragon trail, Tigers Nest, and ancient Himalayan culture.", coverImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=85&w=800", order: 5 },
    { name: "Udaipur", slug: "udaipur", description: "City of lakes, royal palaces, heritage havelis, and sunset boat rides.", coverImage: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&q=85&w=800", order: 6 },
    { name: "Sri Lanka", slug: "sri-lanka", description: "Tropical paradise, surf coastlines, tea trails, and scenic train rides.", coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=85&w=800", order: 7 },
  ];

  for (const dest of destinationsData) {
    await prisma.destination.upsert({
      where: { slug: dest.slug },
      update: dest,
      create: dest,
    });
  }
  console.log("✓ Destinations seeded.");

  // 4. Trips from trips-seed.json
  const tripsFilePath = path.join(__dirname, "trips-seed.json");
  if (fs.existsSync(tripsFilePath)) {
    const rawTrips = JSON.parse(fs.readFileSync(tripsFilePath, "utf8"));
    for (const item of rawTrips) {
      const tp = item.tourPackage;
      const priceNum = typeof tp.price === "number" ? tp.price : parseFloat(String(tp.price).replace(/[^0-9.]/g, "")) || 0;
      const origPriceNum = tp.originalPrice ? (typeof tp.originalPrice === "number" ? tp.originalPrice : parseFloat(String(tp.originalPrice).replace(/[^0-9.]/g, ""))) : null;

      const tripRecord = await prisma.trip.upsert({
        where: { slug: item.slug },
        update: {
          title: tp.title,
          subtitle: tp.subtitle || "",
          destinationSlug: item.slug.includes("manali") ? "manali" : (item.slug.includes("kashmir") ? "kashmir" : (item.slug.includes("meghalaya") ? "meghalaya" : (item.slug.includes("kerala") ? "kerala" : (item.slug.includes("bhutan") ? "bhutan" : (item.slug.includes("udaipur") ? "udaipur" : (item.slug.includes("sri-lanka") ? "sri-lanka" : null)))))),
          location: tp.location,
          duration: tp.duration,
          rating: tp.rating || 5,
          price: priceNum,
          originalPrice: origPriceNum,
          gstAmount: tp.gstAmount || 0,
          image: tp.image,
          category: tp.category || "Trending",
          tag: tp.tag || "",
          tagColor: tp.tagColor || "",
          hook: tp.hook || "",
          groupSize: item.groupSize || "Intimate Group",
          overview: tp.overview || [],
          itinerary: tp.itinerary || [],
          inclusions: tp.inclusions || [],
          exclusions: tp.exclusions || [],
          meals: tp.meals || [],
          whatToPack: tp.whatToPack || [],
          weather: tp.weather || [],
          faqs: tp.faqs || [],
          highlights: tp.highlights || [],
          gallery: tp.gallery || [],
          vibeTags: item.vibeTags || [],
          isFeatured: !!item.featured,
          order: item.id || 0,
        },
        create: {
          title: tp.title,
          slug: item.slug,
          subtitle: tp.subtitle || "",
          destinationSlug: item.slug.includes("manali") ? "manali" : (item.slug.includes("kashmir") ? "kashmir" : (item.slug.includes("meghalaya") ? "meghalaya" : (item.slug.includes("kerala") ? "kerala" : (item.slug.includes("bhutan") ? "bhutan" : (item.slug.includes("udaipur") ? "udaipur" : (item.slug.includes("sri-lanka") ? "sri-lanka" : null)))))),
          location: tp.location,
          duration: tp.duration,
          rating: tp.rating || 5,
          price: priceNum,
          originalPrice: origPriceNum,
          gstAmount: tp.gstAmount || 0,
          image: tp.image,
          category: tp.category || "Trending",
          tag: tp.tag || "",
          tagColor: tp.tagColor || "",
          hook: tp.hook || "",
          groupSize: item.groupSize || "Intimate Group",
          overview: tp.overview || [],
          itinerary: tp.itinerary || [],
          inclusions: tp.inclusions || [],
          exclusions: tp.exclusions || [],
          meals: tp.meals || [],
          whatToPack: tp.whatToPack || [],
          weather: tp.weather || [],
          faqs: tp.faqs || [],
          highlights: tp.highlights || [],
          gallery: tp.gallery || [],
          vibeTags: item.vibeTags || [],
          isFeatured: !!item.featured,
          order: item.id || 0,
        },
      });

      // Departures
      if (tp.departures && Array.isArray(tp.departures)) {
        for (const dep of tp.departures) {
          await prisma.departure.upsert({
            where: { id: dep.id },
            update: {
              startDate: dep.startDate,
              endDate: dep.endDate,
              price: dep.price || null,
              originalPrice: dep.originalPrice || null,
              spotsLeft: dep.spotsLeft ?? 10,
              status: dep.status || "open",
              label: dep.label || null,
              note: dep.note || null,
            },
            create: {
              id: dep.id,
              tripId: tripRecord.id,
              startDate: dep.startDate,
              endDate: dep.endDate,
              price: dep.price || null,
              originalPrice: dep.originalPrice || null,
              spotsLeft: dep.spotsLeft ?? 10,
              status: dep.status || "open",
              label: dep.label || null,
              note: dep.note || null,
            },
          });
        }
      }
    }
    console.log("✓ All 10 Trips and their dated Departures seeded.");
  }

  // 5. Testimonials
  const testimonials = [
    {
      name: "Riya Sharma",
      location: "Mumbai",
      tripName: "The Houseboat Diaries (Kashmir)",
      rating: 5,
      quote: "Traveling solo for the first time was daunting, but Kokalachi made it feel like a family road trip from day one.",
      avatarImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      landmark: "Taj Mahal",
      isFeatured: true,
      order: 1,
    },
    {
      name: "Rohan Verma",
      location: "Bengaluru",
      tripName: "Roots & Rainbows (Meghalaya)",
      rating: 5,
      quote: "The living root bridges in Meghalaya with this group was pure magic. Unforgettable memories and real lifelong friends.",
      avatarImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      landmark: "Burj Khalifa",
      isFeatured: true,
      order: 2,
    },
    {
      name: "Priya Patel",
      location: "Ahmedabad",
      tripName: "Tides & Tea Gardens (Kerala)",
      rating: 5,
      quote: "Backwaters, quiet sunsets, and the best travel companions. Best decision I made this year.",
      avatarImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      isFeatured: true,
      order: 3,
    },
    {
      name: "Ankit Mehta",
      location: "Delhi",
      tripName: "The Thunder Dragon Trail (Bhutan)",
      rating: 5,
      quote: "Bhutan was a dream, but exploring it with this crew elevated the experience to another level.",
      avatarImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      isFeatured: true,
      order: 4,
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }
  console.log("✓ Testimonials seeded.");

  // 6. Static Pages with 1-to-1 matching Component Sections
  const pagesData = [
    {
      title: "Home",
      slug: "home",
      description: "Kokalachi Homepage",
      sections: [
        { type: "HeroSection", order: 1, content: { title: "Journeys become friendships.", subtitle: "Curated group travel for people who crave authentic stories, soulful stays, and real connections.", primaryCta: "Explore Journeys", secondaryCta: "How It Works" } },
        { type: "WhyWeExistSection", order: 2, content: { tag: "WHY WE EXIST", title: "Travel shouldn’t wait for schedules to align.", description: "Big plans often stay on hold because life gets busy and the right travel companions are hard to find." } },
        { type: "HowItWorksSection", order: 3, content: { tag: "HOW IT WORKS", title: "Three simple steps from dream to departure.", steps: ["Pick a curated journey", "Reserve your spot with a single deposit", "Pack your bags & meet your tribe"] } },
        { type: "DifferenceSection", order: 4, content: { tag: "THE KOKALACHI DIFFERENCE", title: "We don’t do tourist buses. We do journeys.", points: ["Small intimate groups of 8-14 travellers", "Handpicked boutique & heritage stays", "Local hosts with real insider access"] } },
        { type: "GoodCompanySection", order: 5, content: { tag: "GOOD COMPANY", title: "Like-minded travellers who share your curiosity.", description: "Curated profiles and pre-trip conversations ensure every group clicks naturally." } },
        { type: "MomentsThatStayedSection", order: 6, content: { tag: "MOMENTS THAT STAYED", title: "Every journey leaves with stories. Some leave with lifelong friendships.", subtitle: "Real stories from real travellers." } },
        { type: "WhoTravelsSection", order: 7, content: { tag: "WHO TRAVELS WITH US", title: "Solo explorers, creative minds, and adventure seekers.", description: "From photographers to engineers, our community welcomes anyone who values genuine human connection." } },
        { type: "UpcomingJourneysSection", order: 8, content: { tag: "UPCOMING JOURNEYS", title: "Find your next unforgettable escape.", subtitle: "Handcrafted itineraries ready to book." } },
      ],
    },
    {
      title: "About Us",
      slug: "about-us",
      description: "Learn more about Kokalachi, our mission, vision, and team.",
      sections: [
        { type: "AboutHeroSection", order: 1, content: { title: "We believe shared roads build the deepest bonds.", subtitle: "Kokalachi was born from a desire to bring together people who seek more than just sightseeing." } },
        { type: "WhyWeStartedSection", order: 2, content: { tag: "WHY WE STARTED", title: "The problem we couldn’t ignore.", description: "Big travel dreams fading away because everyone is waiting for others to be free." } },
        { type: "WhatWeBelieveSection", order: 3, content: { tag: "WHAT WE BELIEVE", title: "Four core pillars behind every itinerary.", pillars: ["Real Connections First", "Slow, Mindful Travel", "Respect for Locals & Land", "Safety & Transparent Pricing"] } },
        { type: "MeetFounderSection", order: 4, content: { title: "Meet the Founder", name: "Ayush", story: "An avid traveller who realized the magic of any journey isn’t just where you go, but who you share it with." } },
        { type: "ExploreJourneysSection", order: 5, content: { title: "Ready to take the leap?", subtitle: "See what journeys are opening up next." } },
        { type: "JoinTribeSection", order: 6, content: { title: "Join the Tribe", subtitle: "Connect on Instagram, WhatsApp, or drop us a line." } },
      ],
    },
    {
      title: "Contact Us",
      slug: "contact-us",
      description: "Get in touch with the Kokalachi team.",
      sections: [
        { type: "ContactHeroSection", order: 1, content: { tag: "GET IN TOUCH", title: "Have a question? We’re always here.", subtitle: "Whether it’s about a trip, dates, or custom groups, we’d love to hear from you." } },
        { type: "ContactFormSection", order: 2, content: { title: "Send us a message", description: "Fill out the quick form below and our trip curator will respond within 24 hours." } },
      ],
    },
  ];

  for (const pageData of pagesData) {
    const page = await prisma.page.upsert({
      where: { slug: pageData.slug },
      update: {
        title: pageData.title,
        description: pageData.description,
      },
      create: {
        title: pageData.title,
        slug: pageData.slug,
        description: pageData.description,
        isStatic: true,
        visibility: "published",
      },
    });

    // Delete old sections for clean seed
    await prisma.section.deleteMany({ where: { pageId: page.id } });

    for (const sec of pageData.sections) {
      await prisma.section.create({
        data: {
          pageId: page.id,
          type: sec.type,
          order: sec.order,
          content: sec.content,
        },
      });
    }
  }
  console.log("✓ Static pages and 1-to-1 Component Sections seeded.");

  // 7. Navigation Links
  const navLinksData = [
    { label: "About Us", url: "/about", type: "Main Link", order: 1, isStatic: true },
    { label: "Destinations", url: "/journeys", type: "Main Link", order: 2, isStatic: true },
    { label: "Tours", url: "/#upcoming-journeys", type: "Main Link", order: 3, isStatic: true },
    { label: "Blogs & Stories", url: "/#moments", type: "Main Link", order: 4, isStatic: true },
    { label: "Community", url: "/#good-company", type: "Main Link", order: 5, isStatic: true },
    { label: "Contact Us", url: "/contact", type: "Main Link", order: 6, isStatic: true },
  ];

  await prisma.navLink.deleteMany();
  for (const link of navLinksData) {
    await prisma.navLink.create({ data: link });
  }
  console.log("✓ Navigation links seeded.");

  console.log("\n🎉 SUCCESS: Kokalachi CMS database fully populated and ready!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
