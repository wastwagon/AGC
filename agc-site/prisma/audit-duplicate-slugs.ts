import { prisma } from "../src/lib/db";

type DuplicateRow = {
  slug: string | null;
  count: number;
};

async function duplicatesForTable(table: "events" | "news" | "publications"): Promise<DuplicateRow[]> {
  const rows = await prisma.$queryRawUnsafe<Array<{ slug: string | null; count: bigint }>>(
    `SELECT slug, COUNT(*)::bigint AS count
     FROM "${table}"
     WHERE slug IS NOT NULL
     GROUP BY slug
     HAVING COUNT(*) > 1
     ORDER BY COUNT(*) DESC, slug ASC`
  );
  return rows.map((r) => ({ slug: r.slug, count: Number(r.count) }));
}

async function main() {
  const [events, news, publications] = await Promise.all([
    duplicatesForTable("events"),
    duplicatesForTable("news"),
    duplicatesForTable("publications"),
  ]);

  const sections: Array<[string, DuplicateRow[]]> = [
    ["events", events],
    ["news", news],
    ["publications", publications],
  ];

  let hasDuplicates = false;
  for (const [name, rows] of sections) {
    if (rows.length === 0) {
      console.log(`[ok] ${name}: no duplicate slugs`);
      continue;
    }
    hasDuplicates = true;
    console.log(`[warn] ${name}: ${rows.length} duplicate slug value(s)`);
    for (const row of rows) {
      console.log(`  - ${row.slug} (${row.count})`);
    }
  }

  if (hasDuplicates) {
    console.error("\nDuplicate slugs found. Resolve them before applying unique slug migration.");
    process.exitCode = 1;
    return;
  }

  console.log("\nNo duplicate slugs found. Safe to apply unique slug migration.");
}

main()
  .catch((err) => {
    console.error("Slug duplicate audit failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
