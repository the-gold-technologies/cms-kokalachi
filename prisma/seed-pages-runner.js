// Runs a page seed file on its own (prisma/seed-trips.js, prisma/seed-shared.js).
//
// Safe for production by default: only adds what's missing. A page that already exists keeps its
// SEO and content, and only sections it doesn't have yet are created. So it can be run any number
// of times without touching edits made in the CMS.
//
// With --reset, it overwrites instead: SEO fields and every section go back to the seed data.

const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
require("dotenv").config();

async function seedPages(pagesData, { label }) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL environment variable is required");
  const reset = process.argv.includes("--reset");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    console.log(`Seeding ${label} (${reset ? "reset: overwriting" : "adding only what's missing"})...`);

    for (const { sections, ...pageData } of pagesData) {
      const existing = await prisma.page.findUnique({
        where: { slug: pageData.slug },
        include: { sections: { select: { type: true } } },
      });

      if (!existing) {
        await prisma.page.create({
          data: {
            ...pageData,
            isStatic: true,
            visibility: "published",
            sections: { create: sections },
          },
        });
        console.log(`  + ${pageData.slug}: created with ${sections.length} section(s)`);
        continue;
      }

      if (reset) {
        await prisma.$transaction([
          prisma.page.update({ where: { id: existing.id }, data: { ...pageData, isStatic: true } }),
          prisma.section.deleteMany({ where: { pageId: existing.id } }),
          ...sections.map((sec) =>
            prisma.section.create({ data: { pageId: existing.id, ...sec } }),
          ),
        ]);
        console.log(`  ↺ ${pageData.slug}: reset to the seed data`);
        continue;
      }

      const have = new Set(existing.sections.map((s) => s.type));
      const missing = sections.filter((sec) => !have.has(sec.type));
      for (const sec of missing) {
        await prisma.section.create({ data: { pageId: existing.id, ...sec } });
      }
      console.log(
        missing.length
          ? `  + ${pageData.slug}: added ${missing.map((s) => s.type).join(", ")}`
          : `  = ${pageData.slug}: already there, left as it is`,
      );
    }

    console.log(`✓ ${label} done.`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

module.exports = { seedPages };
