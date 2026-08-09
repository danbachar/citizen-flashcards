/**
 * Seeds the curriculum, all-or-nothing: an empty database gets the whole seed
 * file, a populated one is left alone. Run at startup from
 * `src/instrumentation.ts` and from the CLI via `npm run db:seed`.
 */
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import seedData from "../../data/seed";

/**
 * Shape of `data/seed.ts`, which declares `satisfies CurriculumSeed` so a
 * malformed entry is a compile error rather than a half-finished seed run.
 * A level with packs appears once per pack, each with its own `type` number.
 */
export type SeedWordPair = { hebrew: string; english: string };
export type SeedLevel = {
  level: string;
  type: number | null;
  pairs: SeedWordPair[];
};
export type SeedTier = { tier: string; levels: SeedLevel[] };
export type CurriculumSeed = SeedTier[];

/**
 * Two instances can boot at once — on Vercel that is normal. Both would see an
 * empty database and insert, and words have no natural key to collide on.
 */
const SEED_LOCK_KEY = 4_815_162_342;

/** 230 inserts on a cold serverless connection. */
const SEED_TIMEOUT_MS = 60_000;

/** Placeholders until the real brand swatches land; `Level.colour` is required. */
const LEVEL_COLOURS: Record<string, string> = {
  red: "#D6483B",
  orange: "#E8792B",
  pink: "#E0709A",
  yellow: "#EFC93D",
  "light-blue": "#7EC4E0",
  blue: "#2F6FB5",
  lime: "#A8C93A",
  green: "#4E9A51",
  "dark-green": "#2E6B45",
  turquoise: "#3FB3A6",
  indigo: "#4B4B9E",
  purple: "#7A4E9B",
};

const FALLBACK_COLOUR = "#B3ACA6";

/** "Dark Green" → "dark-green", the key LEVEL_COLOURS is written in. */
function colourKey(levelName: string): string {
  return levelName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export type SeedResult = { seeded: boolean; summary: string };

/** Distinct levels in first-appearance order, each with its content sets. */
function groupByLevel(levels: SeedLevel[]): Map<string, SeedLevel[]> {
  const grouped = new Map<string, SeedLevel[]>();
  for (const entry of levels) {
    const existing = grouped.get(entry.level);
    if (existing) existing.push(entry);
    else grouped.set(entry.level, [entry]);
  }
  return grouped;
}

/** Only ever called against an empty database. */
async function populate(tx: Prisma.TransactionClient): Promise<SeedResult> {
  let tiers = 0;
  let levels = 0;
  let contentPacks = 0;
  let words = 0;

  for (const [tierIndex, tierEntry] of seedData.entries()) {
    // Derived from the data, so a new tier needs no code change.
    const hasContentPacks = tierEntry.levels.some((entry) => entry.type !== null);

    const tier = await tx.tier.create({
      data: {
        name: tierEntry.tier,
        position: tierIndex + 1,
        hasContentPacks,
      },
    });
    tiers += 1;

    const grouped = [...groupByLevel(tierEntry.levels).entries()];

    for (const [levelIndex, [levelName, contentSets]] of grouped.entries()) {
      const colour = LEVEL_COLOURS[colourKey(levelName)];

      if (!colour) {
        console.warn(
          `[seed] no swatch for "${levelName}" — using ${FALLBACK_COLOUR}. ` +
            "Add it to LEVEL_COLOURS in src/lib/seed.ts.",
        );
      }

      const level = await tx.level.create({
        data: {
          name: levelName,
          colour: colour ?? FALLBACK_COLOUR,
          position: levelIndex + 1,
          tierId: tier.id,
        },
      });
      levels += 1;

      for (const contentSet of contentSets) {
        // `type` is the pack number; null means one content set for the level.
        let contentPackId: number | null = null;

        if (contentSet.type !== null) {
          const pack = await tx.contentPack.create({
            data: {
              levelId: level.id,
              position: contentSet.type,
              name: `Pack ${contentSet.type}`,
            },
          });
          contentPackId = pack.id;
          contentPacks += 1;
        }

        await tx.word.createMany({
          data: contentSet.pairs.map((pair, index) => ({
            levelId: level.id,
            contentPackId,
            hebrew: pair.hebrew,
            english: pair.english,
            position: index + 1,
          })),
        });
        words += contentSet.pairs.length;
      }
    }
  }

  return {
    seeded: true,
    summary: `seeded ${tiers} tiers, ${levels} levels, ${contentPacks} content packs, ${words} words`,
  };
}

/** Safe to call on every start: a populated database costs one `count`. */
export async function seedIfEmpty(): Promise<SeedResult> {
  if (seedData.length === 0) {
    return { seeded: false, summary: "seed file is empty — nothing to seed" };
  }

  const skipped = {
    seeded: false,
    summary: "database already has content — skipped",
  };

  // Cheap pre-check, so the common case never opens a transaction.
  if ((await db.tier.count()) > 0) return skipped;

  return db.$transaction(
    async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(${SEED_LOCK_KEY}::bigint)`;
      // Another instance may have seeded while we waited for the lock.
      if ((await tx.tier.count()) > 0) return skipped;
      return populate(tx);
    },
    { timeout: SEED_TIMEOUT_MS, maxWait: 10_000 },
  );
}
