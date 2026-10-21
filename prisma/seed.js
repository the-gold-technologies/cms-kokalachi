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
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    },
  });
  console.log("✓ Admin user created (admin@kokalachi.com / Admin@123).");

  // 2. Global Brand Configuration (Navbar, Footer, Social Media)
  await prisma.globalConfig.upsert({
    where: { id: "global" },
    update: {
      siteTitle: "Kokalachi - Journeys Become Friendships",
      siteDescription:
        "Kokalachi designs immersive, slow-paced journeys for conscious travelers, dreamers, and storytellers. We replace tourist traps with authentic human connection.",
      logo: "/logo-clean.png",
      phone: "+91 97118 45700",
      email: "hello@kokalachi.com",
      address: "91 Springboard, C-2, Sector 1, Noida - 201301",
      instagramUrl: "https://www.instagram.com/kokalachi/",
      facebookUrl: "https://www.facebook.com/share/1MA2Wf52Cr/?mibextid=wwXIfr",
      youtubeUrl: "https://youtube.com/@kokalachi",
      linkedinUrl: "",
      socialLinks: {
        navbarLightLogo: "/clean_logo_lighter.png",
        footerLogo: "/logo-footer.png",
        twitter: "",
        whatsapp: "+91 97118 45700",
        copyrightText: "© 2026 kokalachitravel.com",
      },
      robotsTxt: "User-agent: *\nAllow: /\n\nSitemap: https://kokalachi.com/sitemap.xml",
      sitemapEnabled: true,
    },
    create: {
      id: "global",
      siteTitle: "Kokalachi - Journeys Become Friendships",
      siteDescription:
        "Kokalachi designs immersive, slow-paced journeys for conscious travelers, dreamers, and storytellers. We replace tourist traps with authentic human connection.",
      logo: "/logo-clean.png",
      phone: "+91 97118 45700",
      email: "hello@kokalachi.com",
      address: "91 Springboard, C-2, Sector 1, Noida - 201301",
      instagramUrl: "https://www.instagram.com/kokalachi/",
      facebookUrl: "https://www.facebook.com/share/1MA2Wf52Cr/?mibextid=wwXIfr",
      youtubeUrl: "https://youtube.com/@kokalachi",
      linkedinUrl: "",
      socialLinks: {
        navbarLightLogo: "/clean_logo_lighter.png",
        footerLogo: "/logo-footer.png",
        twitter: "",
        whatsapp: "+91 97118 45700",
        copyrightText: "© 2026 kokalachitravel.com",
      },
      robotsTxt: "User-agent: *\nAllow: /\n\nSitemap: https://kokalachi.com/sitemap.xml",
      sitemapEnabled: true,
    },
  });
  console.log("✓ Global brand configuration seeded.");

  // 3. Destinations
  const destinationsData = [
    {
      name: "Manali",
      slug: "manali",
      description: "Pine valleys, snow-capped peaks, mountain cafés, and scenic trails.",
      coverImage:
        "https://images.unsplash.com/photo-1597167231350-d057a45dc868?auto=format&fit=crop&q=85&w=800",
      order: 1,
    },
    {
      name: "Kashmir",
      slug: "kashmir",
      description: "The paradise on earth with pristine Dal Lake, houseboats, and alpine meadows.",
      coverImage:
        "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=85&w=800",
      order: 2,
    },
    {
      name: "Meghalaya",
      slug: "meghalaya",
      description: "Abode of clouds, living root bridges, turquoise natural pools, and waterfalls.",
      coverImage:
        "https://images.unsplash.com/photo-1625826415766-001bd75aaf52?auto=format&fit=crop&q=85&w=800",
      order: 3,
    },
    {
      name: "Kerala",
      slug: "kerala",
      description: "Gods own country: serene backwaters, tea plantations, and coastal warmth.",
      coverImage:
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=85&w=800",
      order: 4,
    },
    {
      name: "Bhutan",
      slug: "bhutan",
      description: "The mystical Thunder Dragon trail, Tigers Nest, and ancient Himalayan culture.",
      coverImage:
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=85&w=800",
      order: 5,
    },
    {
      name: "Udaipur",
      slug: "udaipur",
      description: "City of lakes, royal palaces, heritage havelis, and sunset boat rides.",
      coverImage:
        "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&q=85&w=800",
      order: 6,
    },
    {
      name: "Sri Lanka",
      slug: "sri-lanka",
      description: "Tropical paradise, surf coastlines, tea trails, and scenic train rides.",
      coverImage:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=85&w=800",
      order: 7,
    },
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
      const priceNum =
        typeof tp.price === "number"
          ? tp.price
          : parseFloat(String(tp.price).replace(/[^0-9.]/g, "")) || 0;
      const origPriceNum = tp.originalPrice
        ? typeof tp.originalPrice === "number"
          ? tp.originalPrice
          : parseFloat(String(tp.originalPrice).replace(/[^0-9.]/g, ""))
        : null;

      const tripRecord = await prisma.trip.upsert({
        where: { slug: item.slug },
        update: {
          title: tp.title,
          subtitle: tp.subtitle || "",
          destinationSlug: item.slug.includes("manali")
            ? "manali"
            : item.slug.includes("kashmir")
              ? "kashmir"
              : item.slug.includes("meghalaya")
                ? "meghalaya"
                : item.slug.includes("kerala")
                  ? "kerala"
                  : item.slug.includes("bhutan")
                    ? "bhutan"
                    : item.slug.includes("udaipur")
                      ? "udaipur"
                      : item.slug.includes("sri-lanka")
                        ? "sri-lanka"
                        : null,
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
          destinationSlug: item.slug.includes("manali")
            ? "manali"
            : item.slug.includes("kashmir")
              ? "kashmir"
              : item.slug.includes("meghalaya")
                ? "meghalaya"
                : item.slug.includes("kerala")
                  ? "kerala"
                  : item.slug.includes("bhutan")
                    ? "bhutan"
                    : item.slug.includes("udaipur")
                      ? "udaipur"
                      : item.slug.includes("sri-lanka")
                        ? "sri-lanka"
                        : null,
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
      const departuresToSeed =
        Array.isArray(tp.departures) && tp.departures.length > 0
          ? tp.departures
          : item.slug === "meghalaya"
            ? [
                {
                  id: "meghalaya-2026-11-15",
                  startDate: "2026-11-15",
                  endDate: "2026-11-20",
                  spotsLeft: 12,
                  status: "open",
                  label: "Autumn Circle",
                  note: "Fly into Guwahati (GAU) by 11:00 AM",
                },
              ]
            : item.slug === "bhutan"
              ? [
                  {
                    id: "bhutan-2026-12-05",
                    startDate: "2026-12-05",
                    endDate: "2026-12-11",
                    spotsLeft: 10,
                    status: "open",
                    label: "Winter Heritage",
                    note: "Paro arrival & departure",
                  },
                ]
              : [];

      for (const dep of departuresToSeed) {
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
    console.log("✓ All 10 Trips and their dated Departures seeded.");
  }

  // 5. Testimonials
  const testimonials = [
    {
      name: "Riya Sharma",
      location: "Mumbai",
      tripName: "The Houseboat Diaries (Kashmir)",
      rating: 5,
      quote:
        "Traveling solo for the first time was daunting, but Kokalachi made it feel like a family road trip from day one.",
      avatarImage:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      landmark: "Taj Mahal",
      isFeatured: true,
      order: 1,
    },
    {
      name: "Rohan Verma",
      location: "Bengaluru",
      tripName: "Roots & Rainbows (Meghalaya)",
      rating: 5,
      quote:
        "The living root bridges in Meghalaya with this group was pure magic. Unforgettable memories and real lifelong friends.",
      avatarImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      landmark: "Burj Khalifa",
      isFeatured: true,
      order: 2,
    },
    {
      name: "Priya Patel",
      location: "Ahmedabad",
      tripName: "Tides & Tea Gardens (Kerala)",
      rating: 5,
      quote:
        "Backwaters, quiet sunsets, and the best travel companions. Best decision I made this year.",
      avatarImage:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      isFeatured: true,
      order: 3,
    },
    {
      name: "Ankit Mehta",
      location: "Delhi",
      tripName: "The Thunder Dragon Trail (Bhutan)",
      rating: 5,
      quote:
        "Bhutan was a dream, but exploring it with this crew elevated the experience to another level.",
      avatarImage:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
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
        {
          type: "HeroSection",
          order: 1,
          content: {
            tagline: "FOR TRAVELLERS WHO WERE ONLY EVER RESTING",
            headline: "Find your circle. Find your next",
            scriptAccent: "journey.",
            subtitle1: "Curated group trips for solo travellers.",
            subtitle2: "Real people. Real stories. Real connections.",
            backgroundImage: "/hero_bg.png",
            destPlaceholder: "Where to?",
            popularDestinations: [
              "Himachal Pradesh",
              "Uttarakhand",
              "Ladakh",
              "Kerala",
              "Rajasthan",
              "Kashmir",
              "Meghalaya",
              "Spiti Valley",
            ],
            quickDatePresets: [
              "Flexible Dates",
              "Next 30 Days",
              "Upcoming Weekends",
              "Autumn 2026",
            ],
          },
        },
        {
          type: "WhyWeExistSection",
          order: 2,
          content: {
            tag: "WHY WE EXIST",
            headline: "Why do so many dream trips never",
            scriptAccent: "happen?",
            description:
              "Most bucket list trips get postponed when schedules clash and life gets in the way. Finding the right travel companions should not be this hard.",
            oldWayBadge: "THE OLD WAY",
            oldWayTitle: "Kashmir Trip? 🏔️",
            newWayBadge: "THE KOKALACHI WAY",
            newWayTitle: "Curated groups. Fixed dates. Verified travellers.",
            photos: [
              {
                image:
                  "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=85&w=1200",
                alt: "Kashmir Houseboat & Mountains",
                captionTitle: "Real people.",
                captionSub: "Real connections.",
                badge: "Kashmir Circle",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1625826415766-001bd75aaf52?auto=format&fit=crop&q=85&w=1200",
                alt: "Meghalaya Waterfalls & Trails",
                captionTitle: "Mountain trails.",
                captionSub: "Unforgettable laughs.",
                badge: "Meghalaya Expedition",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1583513645242-25a32d451084?auto=format&fit=crop&q=85&w=1200",
                alt: "Kerala Tea Gardens & Backwaters",
                captionTitle: "Shared feasts.",
                captionSub: "Endless stories.",
                badge: "Kerala Slow Trail",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=85&w=1200",
                alt: "Vietnam Halong Bay & Lanterns",
                captionTitle: "Scenic routes.",
                captionSub: "Lifelong bonds.",
                badge: "Vietnam Odyssey",
              },
            ],
          },
        },
        {
          type: "HowItWorksSection",
          order: 3,
          content: {
            tag: "HOW IT WORKS",
            headline: "Three steps to your next",
            scriptAccent: "unforgettable",
            headlineSuffix: "journey.",
            description:
              "Joining Kokalachi is simple. We take care of the planning, so you can focus on the experience.",
            steps: [
              {
                stepNumber: 1,
                title: "Discover a Journey",
                tag: "Choose your vibe & destination! 🌴✨",
                description:
                  "Browse upcoming journeys and choose the one that excites you the most.",
                image:
                  "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=85&w=800",
              },
              {
                stepNumber: 2,
                title: "Connect Before You Go",
                tag: "Pre-trip WhatsApp Circle",
                description:
                  "Meet your travel circle in a private group before departure. Break the ice and plan together.",
                image:
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=85&w=800",
              },
              {
                stepNumber: 3,
                title: "Pack & Experience",
                tag: "Meet your tribe",
                description:
                  "Show up, immerse in authentic local culture, and make memories with lifelong friends.",
                image:
                  "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=85&w=800",
              },
            ],
          },
        },
        {
          type: "DifferenceSection",
          order: 4,
          content: {
            tag: "WHY KOKALACHI",
            headline: "More than a trip. Here's what",
            scriptAccent: "makes",
            headlineSuffix: "us different.",
            subtitleStatement:
              "Every journey is designed around one simple belief: great destinations become unforgettable when shared with the right people.",
            leftDoodleText: "Pack your bags & leave the details to us! ✈️♡",
            rightDoodleText: "“Memories > Monuments” 🌿✨",
            features: [
              {
                title: "Curated, Not Crowded",
                tag: "01. Intimate Circles",
                description:
                  "Groups are built around compatibility, not just headcount — so conversations happen naturally and no one's left on the sidelines.",
                image:
                  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=85&w=800",
                caption: "Sri Lanka Table Conversations ✨",
              },
              {
                title: "Designed for Connection, Not Just Sightseeing",
                tag: "02. Real Connection",
                description:
                  "Our itineraries build in the moments that actually bring a group together — shared meals, downtime, activities that spark conversation — not just a checklist of monuments.",
                image:
                  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=85&w=800",
                caption: "Unfiltered Shared Moments ♡",
              },
              {
                title: "Hosted, End to End",
                tag: "03. Seamless Hosting",
                description:
                  "A dedicated trip host travels with your group, handling logistics and looking out for the group's experience, so you can stay present instead of managing details.",
                image:
                  "https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?auto=format&fit=crop&q=85&w=800",
                caption: "Host Accompanied ⛰️",
              },
              {
                title: "Every Detail, Thoughtfully Planned",
                tag: "04. Intention & Care",
                description:
                  "From the pace of the itinerary to the choice of stays, every journey is built with intention — not stitched together from a template.",
                image:
                  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=85&w=800",
                caption: "Built With Pure Intention 🌊",
              },
            ],
          },
        },
        {
          type: "GoodCompanySection",
          order: 5,
          content: {
            tag: "TRAVEL WITH CONFIDENCE",
            headline: "You're in",
            scriptAccent: "good",
            headlineSuffix: "company.",
            description:
              "Every Kokalachi journey is thoughtfully curated so you can focus on the experience, not the uncertainty.",
            leftMarginTag: "✨ 100% vetted circles",
            rightMarginTag: "♡ verified solo safety",
            cards: [
              {
                title: "Small, Curated Groups",
                hashtag: "#curatedgroups",
                description:
                  "We keep our groups intentionally small, making it easier to connect, feel included and truly enjoy the journey.",
                image:
                  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=85&w=800",
              },
              {
                title: "Meet Before You Travel",
                hashtag: "#meetfirst",
                description:
                  "Join a dedicated group chat before departure to break the ice and get to know your fellow travellers.",
                image:
                  "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=85&w=800",
              },
              {
                title: "A Safe & Welcoming Space",
                hashtag: "#safespaces",
                description:
                  "Carefully vetted travellers and supportive hosts ensure an inclusive environment where solo travellers feel secure.",
                image:
                  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=85&w=800",
              },
              {
                title: "Shared Experiences, Not Rigid Schedules",
                hashtag: "#slowtravel",
                description:
                  "Balanced itineraries with plenty of free time to relax, explore at your own pace, and form organic connections.",
                image:
                  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=85&w=800",
              },
            ],
          },
        },
        {
          type: "MomentsThatStayedSection",
          order: 6,
          content: {
            tag: "MOMENTS THAT STAYED",
            headline: "Every journey leaves with stories. Some leave with",
            scriptAccent: "lifelong friendships.",
            subtitle:
              "Real stories and unfiltered memories captured by travellers across Kokalachi journeys.",
            featuredMediaUrl:
              "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=85&w=1200",
            featuredQuote:
              "I almost cancelled this trip. Now I am planning my next one with the exact same group.",
            featuredLocation: "The Slow Island, Sri Lanka - March 2026",
            annotationLeft: "✨ 100% Unfiltered Memories",
            annotationRight: "♡ Captured by Real Travellers",
            cards: [
              {
                quote:
                  "I came alone, nervous and quiet. Left with 9 people I now consider close friends.",
                author: "Pooja S.",
                trip: "Kashmir Autumn Circle",
                image:
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=85&w=600",
              },
              {
                quote:
                  "The slow mornings in Meghalaya listening to local legends were the highlight of my year.",
                author: "Rohan M.",
                trip: "Meghalaya Living Roots",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=85&w=600",
              },
              {
                quote:
                  "Everything was taken care of seamlessly. Zero stress, just pure adventure and great food.",
                author: "Sneha K.",
                trip: "Spiti High Passes",
                image:
                  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=85&w=600",
              },
            ],
          },
        },
        {
          type: "WhoTravelsSection",
          order: 7,
          content: {
            tag: "WHO TRAVELS WITH US",
            headline: "Different stories, same",
            scriptAccent: "curiosity.",
            description:
              "From solo explorers to busy professionals, our community welcomes anyone who values genuine human connection and shared adventures.",
            personas: [
              {
                title: "Women Explorers",
                badge: "Supportive & Safe",
                age: "20s - 45s",
                description:
                  "Women-only journeys designed for connection, comfort and confidence. Travel, laugh, and create memories that last a lifetime.",
                image:
                  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=85&w=600",
              },
              {
                title: "Working Professionals",
                badge: "Weekend Getaways",
                age: "23s - 40s",
                description:
                  "Short escapes that fit your busy schedule and recharge you completely. Come back refreshed, inspired and ready to take on more.",
                image:
                  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=85&w=600",
              },
              {
                title: "Adventure Seekers",
                badge: "Trails & High Passes",
                age: "20s - 38s",
                description:
                  "Active trails, summit sunrises, hidden waterfalls and off-the-beaten-path expeditions with high-energy companions.",
                image:
                  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=85&w=600",
              },
              {
                title: "Creative Souls",
                badge: "Stories & Vibe",
                age: "22s - 42s",
                description:
                  "Photographers, writers, artists and thinkers who love slow mornings, inspiring stays, journal conversations and starry nights.",
                image:
                  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=85&w=600",
              },
            ],
          },
        },
        {
          type: "UpcomingJourneysSection",
          order: 8,
          content: {
            tag: "UPCOMING JOURNEYS",
            headline: "Find your next",
            scriptAccent: "escape.",
            subtitle:
              "Handcrafted itineraries ready to book with confirmed departures and verified travellers.",
            filterTags: [
              "All",
              "Mountains",
              "Slow Travel",
              "First Timers",
              "Weekend",
              "International",
            ],
            ctaText: "Explore All Journeys",
            ctaLink: "/journeys",
          },
        },
      ],
    },
    {
      title: "About Us",
      slug: "about",
      description: "Learn more about Kokalachi, our mission, vision, and team.",
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
      sections: [
        {
          type: "AboutHeroSection",
          order: 1,
          content: {
            tagline: "ABOUT KOKALACHI",
            headline: "Built on Friendships. Made for",
            scriptAccent: "Meaningful",
            headlineSuffix: "Journeys.",
            handwrittenSubtitle: "Same Roads. New People. Greater Stories.",
            backgroundImage: "/aboutherobg.png",
            primaryCtaText: "Our Story",
            primaryCtaLink: "#why-we-started",
            secondaryCtaText: "Watch Our Journey",
            secondaryCtaLink: "#video",
            polaroid1Title: "New Places",
            polaroid1Image: "/hero_friends_mountain_peak.jpg",
            polaroid2Title: "Bigger Stories",
            polaroid2Image: "/about_hero_polaroid.jpg",
            polaroid3Title: "Real Connections",
            polaroid3Image: "/hero_group_sunset_bg.jpg",
            doodleNote: "More Than Just Destinations",
          },
        },
        {
          type: "WhyWeStartedSection",
          order: 2,
          content: {
            tagline: "WHY WE STARTED",
            headline: "The problem we couldn't",
            scriptAccent: "ignore.",
            description:
              "Big travel plans often stay on hold, not because the desire fades but because life gets busy and the right people are hard to find.",
            mainImage: "/about_why_started.jpg",
            polaroidImage: "/about_hero_polaroid.jpg",
            polaroidNote: "Plans are easy. People make it real.",
            item1Title: "Big plans, left on hold.",
            item2Title: "Schedules don't always align.",
            item3Title: "The right people are hard to find.",
            conclusionPrefix: "So we built",
            conclusionBrand: "Kokalachi.",
            conclusionText:
              "A way to bring together people who share the same pull toward the world so a trip doesn't need to wait for the stars to align.",
          },
        },
        {
          type: "WhatWeBelieveSection",
          order: 3,
          content: {
            tagline: "WHAT WE BELIEVE",
            headline: "The Kokalachi",
            scriptAccent: "Way",
            description:
              "Everything we design every itinerary, every group, every detail comes back to a handful of things we simply won't compromise on.",
            mainImage: "/hero_group_sunset_bg.jpg",
            polaroidImage: "/about_belief_respect.jpg",
            polaroidCaption: "Always a better way to travel",
            footerNote: "BETTER PEOPLE. BRIGHTER JOURNEYS.",
            pillars: [
              {
                title: "Curated travel groups, real connection.",
                desc: "We keep our journeys in alignment with the interests of travellers. Curated groups make it easy to actually know the people you're travelling with.",
              },
              {
                title: "The people matter as much as the place.",
                desc: "A great destination and the wrong group can still make for a forgettable trip. We curate for compatibility first, because that's what makes a journey unforgettable.",
              },
              {
                title: "Trust is earned before the trip starts.",
                desc: "From verified travellers to pre-trip introductions, we believe the first hello shouldn't happen at the airport — comfort and trust are built long before departure.",
              },
              {
                title: "Respect is non-negotiable.",
                desc: "For fellow travellers, for hosts, for local communities. Every Kokalachi journey is built on the expectation that everyone shows up with kindness.",
              },
              {
                title: "We won't compromise your experience to fill a seat.",
                desc: "We'll always choose the right group over a full one. That's a promise, not a slogan.",
              },
            ],
          },
        },
        {
          type: "MeetFounderSection",
          order: 4,
          content: {
            tagline: "MEET THE FOUNDERS",
            headline: "Some ideas take decades to find their",
            scriptAccent: "moment.",
            badge: "CO-FOUNDERS",
            founderNames: "Rachit & Hitesh",
            founderFullName: "Rachit Ahuja & Hitesh Kalra",
            founderTitle: "Co-Founders, Kokalachi ♡",
            founderPhoto: "/founders.png",
            leadQuote: "Kokalachi is one of them.",
            story:
              "We've been friends for over 35 years through countless conversations, road trips, family holidays, and adventures along the way. And somewhere in all of it, we noticed the same thing, again and again: the destination was rarely what stayed with us. It was always the people we shared it with.\n\nHitesh has spent 28 years in the travel industry, designing holidays and helping thousands of travellers explore the world. Rachit has spent his own years chasing curiosity hiking mountains, riding scenic highways, chasing adventure sports, and finding the hidden stays most travellers never discover.\n\nBetween the two of us, one thing became clear travel isn't just about seeing new places. It's about finding the people who make those places unforgettable.\n\nThat's why we built Kokalachi. Not as another travel company but as a community where meaningful journeys begin with meaningful people.",
            closingNote: "We hope you'll join us on one.",
          },
        },
        {
          type: "ExploreJourneysSection",
          order: 5,
          content: {
            tagline: "UPCOMING TRIPS",
            headline: "Explore Our",
            scriptAccent: "Journeys.",
            description: "Find your next adventure with these handcrafted experiences.",
          },
        },
        {
          type: "JoinTribeSection",
          order: 6,
          content: {
            tagline: "JOIN THE TRIBE",
            headline: "Your next journey is waiting. So are your people.",
            description:
              "Somewhere out there is a group of travellers who are just as ready to explore, connect, and make memories as you are.",
            primaryButtonText: "Explore Upcoming Trips",
            primaryButtonLink: "/#upcoming-journeys",
            secondaryButtonText: "Find your Next Journey",
            secondaryButtonLink: "/#upcoming-journeys",
            blobImage: "/about_why_started.jpg",
            polaroidNote: "Good People Brighter Journeys ♡",
            footerTag: "TRAVEL • PEOPLE • PURPOSE",
          },
        },
      ],
    },
    {
      title: "Contact Us",
      slug: "contact",
      description:
        "Get in touch with the Kokalachi team. Ask questions, plan a group trip, or just say hello.",
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
      sections: [
        {
          type: "ContactHeroSection",
          order: 1,
          content: {
            tagline: "Get In Touch",
            headline: "Got a question before you",
            scriptAccent: "join the tribe?",
            bannerImage:
              "https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
          },
        },
        {
          type: "ContactFormSection",
          order: 2,
          content: {
            heading: "Tell us a little about your next journey",
            subtitle: "The more we know, the better we can help — but even a quick hello works.",
            successTitle: "Enquiry Sent Successfully",
            successSubtitle:
              "Thanks for reaching out! We\'ve received your message and our team will get back to you within 24 hours.",
            journeyOptions: [
              "The Houseboat Diaries (Kashmir)",
              "Roots & Rainbows (Meghalaya)",
              "Tides & Tea Gardens (Kerala)",
              "The Thunder Dragon Trail (Bhutan)",
              "Not sure yet — help me pick",
              "Something else entirely",
            ],
            hearAboutOptions: [
              "Instagram",
              "A friend",
              "Google Search",
              "Kokalachi Traveller",
              "Other",
            ],
            submitButtonText: "Send Enquiry",
            urgencyNote:
              "We typically respond within 24 hours. For anything urgent, Instagram is your fastest bet.",
          },
        },
        {
          type: "ContactSidebarSection",
          order: 3,
          content: {
            trust1Title: "Real humans reply, not bots",
            trust1Desc: "Our team personally reads and replies to every single enquiry.",
            trust2Title: "No spam, ever",
            trust2Desc: "We\'ll only reach out about what you asked. Your inbox is safe.",
            trust3Title: "Your details are safe with us",
            trust3Desc: "We respect your privacy and protect your data rigorously.",
            altCardTitle: "Prefer to skip the form?",
            emailTitle: "Email",
            emailDesc:
              "For detailed questions, group bookings, or anything you\'d rather put in writing.",
            emailAddress: "hello@kokalachi.com",
            instaTitle: "Instagram",
            instaDesc: "Follow the journeys as they happen, or DM us directly for quick questions.",
            instaHandle: "@kokalachi",
            instaLink: "https://www.instagram.com/kokalachi/",
          },
        },
      ],
    },
    {
      title: "All Journeys",
      slug: "journeys",
      description: "Explore our complete collection of handcrafted, slow-travel experiences.",
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
      sections: [
        {
          type: "JourneysHeroSection",
          order: 1,
          content: {
            tagline: "Find Your Next Adventure",
            title: "All",
            scriptAccent: "Journeys",
            description:
              "From the misty mountains of Meghalaya to the backwaters of Kerala. Explore our complete collection of handcrafted, slow-travel experiences.",
            bannerImage:
              "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
          },
        },
        {
          type: "JourneysFilterSection",
          order: 2,
          content: {
            sidebarTitle: "Filter by Vibe",
            emptyStateText: "No journeys found for this category yet.",
            categories: [
              { id: "All", label: "All Journeys" },
              { id: "Trending", label: "Trending" },
              { id: "FirstTimers", label: "First Timers" },
              { id: "WomenOnly", label: "Women Only" },
              { id: "Adventure", label: "Adventure" },
              { id: "SlowTravel", label: "Slow Travel" },
              { id: "BeachEscape", label: "Beach Escape" },
            ],
          },
        },
      ],
    },
    {
      title: "FAQ Page",
      slug: "faqs",
      description: "Everything you might want to know before you join a Kokalachi journey.",
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
      sections: [
        {
          type: "FaqsHeroSection",
          order: 1,
          content: {
            tagline: "FAQs",
            headline: "Questions? ",
            scriptAccent: "We've got you.",
            description:
              "Everything you might want to know before you join a journey, from how it works to what's included. Can't find your answer? Just ask us.",
            bannerImage:
              "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
          },
        },
        {
          type: "FaqsAccordionSection",
          order: 2,
          content: {
            sidebarTitle: "Browse by topic",
            categories: [
              {
                id: "about-kokalachi",
                title: "About Kokalachi",
                items: [
                  {
                    question: "What is Kokalachi?",
                    answer:
                      "Kokalachi brings together people who love travelling but don't always have the right people to travel with. We run curated group journeys so you can explore the world alongside like-minded travellers.",
                  },
                  {
                    question: "Is Kokalachi a travel company?",
                    answer:
                      "Yes, and a little more. We plan and run the trips, but the heart of what we do is the group: small, curated, and designed so that you leave with friends, not just photos.",
                  },
                  {
                    question: "Who travels with Kokalachi?",
                    answer:
                      "Working professionals, first-time solo travellers, long-time explorers, and everyone in between. What they share is curiosity, respect for others, and an easygoing, up-for-it attitude.",
                  },
                  {
                    question: "Do I need to know anyone to join?",
                    answer:
                      "Not at all. Most of our travellers join on their own. You can also join with a friend.",
                  },
                ],
              },
              {
                id: "joining-a-journey",
                title: "Joining a Journey",
                items: [
                  {
                    question: "How do I book a trip?",
                    answer:
                      "Browse Upcoming Trips, choose your journey, pick your room type, and hit Book Now. Questions before booking? Message us on WhatsApp.",
                  },
                  {
                    question: 'What does "curated group" mean?',
                    answer:
                      "We keep groups intentionally small and think about the mix of people, so conversations come naturally and nobody is left on the sidelines.",
                  },
                  {
                    question: "Can I join a trip with a friend or in a pair?",
                    answer:
                      "Yes. You can book multiple guests in one booking and choose a double-sharing or private room.",
                  },
                  {
                    question: "Are there women-only trips?",
                    answer:
                      "Some journeys may be designated women-only. Look for the Women Only tag on the trip card.",
                  },
                  {
                    question: "Will I meet the group before the trip?",
                    answer:
                      "Yes. After you book, you're introduced to your fellow travellers through a dedicated pre-trip community, so the first hello doesn't happen at the airport.",
                  },
                ],
              },
              {
                id: "safety-and-comfort",
                title: "Safety & Comfort",
                items: [
                  {
                    question: "Is Kokalachi safe for solo travellers?",
                    answer:
                      "Safety comes first on every journey. That means small groups, verified travellers, trusted travel partners, clear community guidelines, and responsive support throughout your trip.",
                  },
                  {
                    question: "What are the community guidelines?",
                    answer:
                      "Every traveller is expected to treat fellow travellers, local communities, and shared experiences with kindness and respect. We share the full guidelines when you book.",
                  },
                  {
                    question: "What if I don't get along with someone in the group?",
                    answer:
                      "Our host is there to help. If something doesn't feel right, speak to your host at any point in the trip and we'll work it out with you.",
                  },
                  {
                    question: "Who will I share a room with?",
                    answer:
                      "If you're travelling solo, you'll be matched with a fellow solo traveller of the same gender in a double- or triple-sharing room, depending on the trip. Prefer your own space? Choose the Private Room option where it's available.",
                  },
                  {
                    question: "What if I have dietary requirements or a health concern?",
                    answer: "Tell us when you book and we'll do our best to plan around it.",
                  },
                ],
              },
              {
                id: "pricing-and-payments",
                title: "Pricing & Payments",
                items: [
                  {
                    question: "How much do trips cost?",
                    answer:
                      "Prices vary by destination and trip length, and each trip page shows the price per person with a clear breakdown. Domestic road trips like Udaipur and Manali start from a lower price point than longer or international journeys.",
                  },
                  {
                    question: "What's included in the price?",
                    answer:
                      "Each trip page has an Included & Excluded section listing exactly what's covered (stays, transfers, specific meals, guided experiences, and your Trip Host) and what isn't.",
                  },
                  {
                    question: "Are taxes included?",
                    answer:
                      "Taxes and fees are shown in the booking summary before you pay (for example GST, and TCS where applicable, plus payment gateway charges).",
                  },
                  {
                    question: "What payment methods do you accept?",
                    answer:
                      "Paying by UPI or bank transfer saves you the 3% payment gateway charge.",
                  },
                  {
                    question: "What is the cancellation and refund policy?",
                    answer: "The policy for each trip is shown at checkout.",
                  },
                ],
              },
              {
                id: "travel-logistics",
                title: "Travel Logistics",
                items: [
                  {
                    question: "Are flights included?",
                    answer:
                      "For most journeys, no. Flights are not included unless the trip page says so. Our team can help you plan flights, and you can always ask us on WhatsApp.",
                  },
                  {
                    question: "Where do trips start and end?",
                    answer:
                      "It depends on the trip. Some begin at an airport (for example Srinagar, Guwahati, Kochi, Paro, or Colombo), and our Udaipur and Manali road trips depart from Delhi by Tempo Traveller. The start and end points are on each trip page.",
                  },
                  {
                    question: "Do I need a visa or any permits?",
                    answer:
                      "For domestic trips, Indian travellers generally don't need special permits. For international journeys such as Bhutan and Sri Lanka, entry requirements apply, and we guide you through them when you book.",
                  },
                  {
                    question: "Do I need travel insurance?",
                    answer:
                      "Travel insurance isn't included, and we strongly recommend it for every trip.",
                  },
                  {
                    question: "What should I pack?",
                    answer:
                      "Every trip page has a What To Pack & Carry section with a list tailored to that destination, plus the Expected Weather & Temperature for your dates.",
                  },
                  {
                    question: "What meals are included?",
                    answer:
                      "Each trip page lists the meals included under Meals Included. Meals not listed are left open so you can explore local food with your group.",
                  },
                  {
                    question: "What if my flight is delayed or I miss the group?",
                    answer:
                      "Message your Trip Host or our WhatsApp support straight away and we'll help you rejoin the group where possible.",
                  },
                ],
              },
              {
                id: "during-and-after",
                title: "During & After Your Trip",
                items: [
                  {
                    question: "Is there a plan for each day?",
                    answer:
                      "Yes. Each journey has a chapter-by-chapter itinerary with the places you'll visit and the community experiences built in, from icebreakers to bonfire evenings.",
                  },
                  {
                    question: "Are the community activities compulsory?",
                    answer:
                      "No. They're designed to be fun, never forced. Join as much or as little as feels comfortable.",
                  },
                  {
                    question: "What happens after the trip?",
                    answer:
                      "You join the Kokalachi alumni network, with a shared photo vault and a group chat that tends to stay active long after the trip ends. Many travellers meet again on later journeys.",
                  },
                ],
              },
            ],
          },
        },
        {
          type: "FaqsCtaSection",
          order: 3,
          content: {
            tagline: "Still Have Questions?",
            headline: "We're a message away.",
            whatsappText: "Chat with Us on WhatsApp",
            whatsappUrl: "https://wa.me/919711845700",
            enquiryText: "Send an Enquiry",
            enquiryUrl: "/contact",
          },
        },
      ],
    },
  ];

  for (const pageData of pagesData) {
    const page = await prisma.page.upsert({
      where: { slug: pageData.slug },
      update: {
        title: pageData.title,
        description: pageData.description,
        order: pageData.order || 0,
        type: pageData.type || "Main Page",
        metaTitle: pageData.metaTitle || null,
        metaDescription: pageData.metaDescription || null,
        targetKeywords: pageData.targetKeywords || null,
        canonicalUrl: pageData.canonicalUrl || null,
        headingOptions: pageData.headingOptions || "h1",
        schema: pageData.schema || null,
      },
      create: {
        title: pageData.title,
        slug: pageData.slug,
        description: pageData.description,
        isStatic: true,
        visibility: "published",
        order: pageData.order || 0,
        type: pageData.type || "Main Page",
        metaTitle: pageData.metaTitle || null,
        metaDescription: pageData.metaDescription || null,
        targetKeywords: pageData.targetKeywords || null,
        canonicalUrl: pageData.canonicalUrl || null,
        headingOptions: pageData.headingOptions || "h1",
        schema: pageData.schema || null,
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

  // 7. Navigation Links (100% matched to Kokalachi website navbar)
  const navLinksData = [
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

  await prisma.navLink.deleteMany();
  for (const link of navLinksData) {
    await prisma.navLink.create({ data: link });
  }
  console.log("✓ Navigation links seeded.");

  // 8. Sample Travel Enquiries
  const sampleEnquiries = [
    {
      name: "Rohan Sharma",
      email: "rohan.sharma@gmail.com",
      phone: "+91 98201 12345",
      journey: "The Houseboat Diaries (Kashmir)",
      travelDate: "2026-11-15",
      groupSize: "2 people",
      message:
        "Hi Kokalachi team! Me and my partner want to join the Kashmir houseboat departure in November. Are flights included or should we book directly?",
      hearAboutUs: "Instagram",
      status: "Pending",
    },
    {
      name: "Ananya Iyer",
      email: "ananya.iyer@outlook.com",
      phone: "+91 98450 67890",
      journey: "Roots & Rainbows (Meghalaya)",
      travelDate: "2026-12-05",
      groupSize: "Just me",
      message:
        "Hey! Travelling solo for the first time. Wanted to check what the accommodation arrangements are for solo travellers.",
      hearAboutUs: "Kokalachi Traveller",
      status: "Contacted",
    },
    {
      name: "Vikram Malhotra",
      email: "vikram.m@techcorp.io",
      phone: "+91 99887 54321",
      journey: "The Thunder Dragon Trail (Bhutan)",
      travelDate: "2026-10-28",
      groupSize: "4 people",
      message:
        "Looking to book for a group of 4 close friends. Could you share the visa processing requirements for Bhutan?",
      hearAboutUs: "Google Search",
      status: "Resolved",
    },
  ];

  await prisma.enquiry.deleteMany();
  for (const enq of sampleEnquiries) {
    await prisma.enquiry.create({ data: enq });
  }
  console.log("✓ Sample travel enquiries seeded.");

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
