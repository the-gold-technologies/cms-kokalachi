// One-off production update for the Nov 2026 website changes. It only touches these changes,
// never a full reseed, so everything else edited in the CMS stays as it is:
//
//   1. Trip slugs renamed to "<destination>-group-trip" (the website redirects the old URLs)
//   2. Navbar links that still point at an old trip URL
//   3. Trip region: Bhutan, Sri Lanka, Almaty, Thailand → "international"
//   4. Home hero: Travellers dropdown → "How are you travelling?" (Solo / Group / Custom)
//
// Safe to run more than once: each step skips what is already done.
//
//   Dry run (shows what would change, writes nothing):  npm run update:nov-2026
//   Apply:                                             npm run update:nov-2026 -- --apply
//
// Uses DATABASE_URL from .env (or the environment), so check it points at the right database.

const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

require("dotenv").config();
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}
const pool = new Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const APPLY = process.argv.includes("--apply");

// Same list as the website's src/data/tripSlugRedirects.ts
const SLUG_RENAMES = {
  udaipur: "udaipur-group-trip",
  kashmir: "kashmir-group-trip",
  manali: "manali-group-trip",
  kerala: "kerala-group-trip",
  meghalaya: "meghalaya-group-trip",
  "sri-lanka": "sri-lanka-group-trip",
  bhutan: "bhutan-group-trip",
  almaty: "almaty-kazakhstan-group-trip",
};

const INTERNATIONAL_SLUGS = [
  "bhutan-group-trip",
  "sri-lanka-group-trip",
  "almaty-kazakhstan-group-trip",
  "the-island-diaries-thailand",
];

const TRAVEL_STYLES = [
  { key: "solo", label: "Solo", desc: "Join a group trip on your own" },
  { key: "group", label: "Group", desc: "With friends, a partner or family" },
  { key: "custom", label: "Custom", desc: "A private trip on your own dates" },
];

let changes = 0;
function log(msg) {
  changes++;
  console.log(`  ${APPLY ? "✓" : "→"} ${msg}`);
}

async function renameSlugs() {
  console.log("\n1. Trip slugs");
  for (const [oldSlug, newSlug] of Object.entries(SLUG_RENAMES)) {
    const [oldTrip, newTrip] = await Promise.all([
      prisma.trip.findUnique({ where: { slug: oldSlug }, select: { id: true } }),
      prisma.trip.findUnique({ where: { slug: newSlug }, select: { id: true } }),
    ]);
    if (!oldTrip) continue; // already renamed (or never existed)
    if (newTrip) {
      console.log(`  ! skipped ${oldSlug}: a trip with slug "${newSlug}" already exists, fix by hand`);
      continue;
    }
    if (APPLY) await prisma.trip.update({ where: { id: oldTrip.id }, data: { slug: newSlug } });
    log(`${oldSlug} → ${newSlug}`);
  }
}

async function updateNavLinks() {
  console.log("\n2. Navbar links");
  const links = await prisma.navLink.findMany({ select: { id: true, label: true, url: true } });
  for (const link of links) {
    // Matches /journeys/<old>, /journeys/<old>/, /journeys/<old>?x, /journeys/<old>#x
    const match = link.url.match(/^(.*\/journeys\/)([^/?#]+)(.*)$/);
    const newSlug = match && SLUG_RENAMES[match[2]];
    if (!newSlug) continue;
    const url = `${match[1]}${newSlug}${match[3]}`;
    if (APPLY) await prisma.navLink.update({ where: { id: link.id }, data: { url } });
    log(`"${link.label}": ${link.url} → ${url}`);
  }
}

async function setRegions() {
  console.log("\n3. Trip regions");
  const trips = await prisma.trip.findMany({
    where: { slug: { in: INTERNATIONAL_SLUGS }, NOT: { region: "international" } },
    select: { id: true, slug: true },
  });
  for (const trip of trips) {
    if (APPLY) {
      await prisma.trip.update({ where: { id: trip.id }, data: { region: "international" } });
    }
    log(`${trip.slug} → international`);
  }
  // Trips created before the region column existed
  const blank = await prisma.trip.count({ where: { region: null } });
  if (blank > 0) {
    if (APPLY) await prisma.trip.updateMany({ where: { region: null }, data: { region: "domestic" } });
    log(`${blank} trip(s) with no region → domestic`);
  }
}

async function updateHero() {
  console.log("\n4. Home hero search box");
  const sections = await prisma.section.findMany({
    where: { type: "HeroSection", page: { slug: "home" } },
  });
  for (const section of sections) {
    const content = section.content && typeof section.content === "object" ? section.content : {};
    const next = { ...content };
    const notes = [];

    // Only replace the old default wording; anything an admin already changed is kept
    if (!content.travellersLabel || content.travellersLabel === "Travellers") {
      next.travellersLabel = "Travelling";
      notes.push(`travellersLabel "${content.travellersLabel ?? ""}" → "Travelling"`);
    }
    if (!content.groupSizeTitle || content.groupSizeTitle === "Group Size") {
      next.groupSizeTitle = "How are you travelling?";
      notes.push(`groupSizeTitle "${content.groupSizeTitle ?? ""}" → "How are you travelling?"`);
    }
    if (!content.customButtonText) {
      next.customButtonText = "Plan My Trip";
      notes.push(`customButtonText → "Plan My Trip"`);
    }
    const options = Array.isArray(content.travellerOptions) ? content.travellerOptions : [];
    if (!options.some((o) => o && typeof o === "object" && o.key)) {
      next.travellerOptions = TRAVEL_STYLES;
      notes.push(`travellerOptions (${options.length} old) → Solo / Group / Custom`);
    }

    if (notes.length === 0) continue;
    if (APPLY) await prisma.section.update({ where: { id: section.id }, data: { content: next } });
    notes.forEach(log);
  }
}

async function main() {
  const host = new URL(connectionString).host;
  console.log(`${APPLY ? "APPLYING" : "DRY RUN (nothing is written)"} on database: ${host}`);

  await renameSlugs();
  await updateNavLinks();
  await setRegions();
  await updateHero();

  if (changes === 0) console.log("\nNothing to change: the database is already up to date.");
  else if (APPLY) console.log(`\nDone: ${changes} change(s) applied.`);
  else console.log(`\n${changes} change(s) to make. Run again with --apply to write them.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
