// Production data update: trip pages moved from /journeys to /tour-details.
// Runs automatically in `npm run build` (see package.json), against the DB in DATABASE_URL.
//
// It works on the data that is actually in the database (not on the seed files):
//   1. Every stored website link "/journeys..." → "/tour-details..." in all text / JSON
//      columns of every table (CTA buttons, SEO canonical URLs, schema, menu links,
//      page sections, blog/trip content, ...). "/api/journeys" and words like
//      "journeys" without the leading slash are left alone.
//   2. The top menu item "Journeys" is renamed to "Tour Details".
// Nothing is added or deleted, and everything runs in one transaction.
//
// Safe on every build: after the first run there is nothing left to match.
// Preview without changing anything: node prisma/update-tour-details.js --dry-run

const { Pool } = require("pg");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

const DRY_RUN = process.argv.includes("--dry-run");

// "/journeys" as a whole path segment, either at the start of a link or after kokalachi.com.
// The lookbehind skips "/api/journeys", "/components/journeys", etc.
const PATTERN = "(kokalachi\\.com|(?<![A-Za-z0-9_.-]))/journeys(?![A-Za-z0-9_-])";
const REPLACEMENT = "\\1/tour-details";

// Tables never touched
const SKIPPED_TABLES = new Set(["_prisma_migrations", "User"]);

const MENU_RENAME_WHERE = `label = 'Journeys' AND (id = 'nav-journeys' OR url IN ('/journeys', '/tour-details'))`;

const q = (name) => `"${name.replace(/"/g, '""')}"`;

async function main() {
  const pool = new Pool({ connectionString });
  const client = await pool.connect();
  console.log(`Updating /journeys → /tour-details${DRY_RUN ? " (dry run)" : ""}...`);

  let total = 0;
  let renamed = 0;
  try {
    await client.query("BEGIN");

    const { rows: columns } = await client.query(`
      SELECT table_name, column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND data_type IN ('text', 'character varying', 'json', 'jsonb')
      ORDER BY table_name, column_name
    `);

    for (const { table_name: table, column_name: column, data_type: type } of columns) {
      if (SKIPPED_TABLES.has(table)) continue;

      const col = q(column);
      const isJson = type === "json" || type === "jsonb";
      const source = isJson ? `${col}::text` : col;

      let count;
      if (DRY_RUN) {
        const res = await client.query(
          `SELECT count(*)::int AS n FROM ${q(table)} WHERE ${source} ~ $1`,
          [PATTERN],
        );
        count = res.rows[0].n;
      } else {
        const replaced = `regexp_replace(${source}, $1, $2, 'g')`;
        const newValue = isJson ? `${replaced}::${type}` : replaced;
        const res = await client.query(
          `UPDATE ${q(table)} SET ${col} = ${newValue} WHERE ${source} ~ $1`,
          [PATTERN, REPLACEMENT],
        );
        count = res.rowCount;
      }

      if (count > 0) {
        console.log(`  ${table}.${column}: ${count} row(s)`);
        total += count;
      }
    }

    const hasNavLink = columns.some((c) => c.table_name === "NavLink");
    if (hasNavLink) {
      const res = DRY_RUN
        ? await client.query(`SELECT count(*)::int AS n FROM "NavLink" WHERE ${MENU_RENAME_WHERE}`)
        : await client.query(
            `UPDATE "NavLink" SET label = 'Tour Details', "updatedAt" = now() WHERE ${MENU_RENAME_WHERE}`,
          );
      renamed = DRY_RUN ? res.rows[0].n : res.rowCount;
      if (renamed > 0) console.log(`  NavLink: menu "Journeys" → "Tour Details"`);
    }

    await client.query(DRY_RUN ? "ROLLBACK" : "COMMIT");
    console.log(
      `✓ ${total} value(s) ${DRY_RUN ? "would be " : ""}updated, ${renamed} menu label(s) ${DRY_RUN ? "would be " : ""}renamed.`,
    );
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
    await pool.end();
  }

  // Refresh the website cache so the new links show right away
  const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;
  const sharedSecret = process.env.CMS_SHARED_SECRET;
  if (!DRY_RUN && (total > 0 || renamed > 0) && websiteUrl && sharedSecret) {
    try {
      await fetch(`${websiteUrl.replace(/\/$/, "")}/api/revalidate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-cms-secret": sharedSecret },
        body: JSON.stringify({ tags: ["site", "page:home", "page:contact", "blogs", "trips"] }),
        signal: AbortSignal.timeout(5000),
      });
      console.log("✓ Website cache revalidated.");
    } catch {
      console.log("Website cache not revalidated (website offline); it refreshes on its own.");
    }
  }
}

main().catch((e) => {
  console.error("Update failed:", e);
  process.exit(1);
});
