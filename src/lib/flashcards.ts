/**
 * Flashcard selection: the pure half of the picker and the viewer.
 *
 * Everything here is a plain function over plain data, so both the client
 * picker and the server-rendered viewer run the *same* filtering and agree on
 * what a given selection means. Nothing in this file touches Prisma or React.
 *
 * Identity is the numeric primary key throughout — rows, params, and stored
 * state all say the same thing, so nothing has to be translated at a boundary.
 */

/** One card, flattened so the UI needs no lookups to render it. */
export type Flashcard = {
  id: number;
  hebrew: string;
  english: string;
  tierId: number;
  levelId: number;
  levelName: string;
  /** The level's swatch, already resolved — `Level.colour` is required. */
  colour: string;
  /** The pack this card belongs to, or null on a single-set level. */
  packId: number | null;
  /** That pack's number within the level — what "Type 3" means to a learner. */
  packPosition: number | null;
  /** How many types the level has, so the card can draw its pips. */
  packCount: number;
};

/** How far the learner has narrowed the curriculum. */
export type Selection = {
  tierId: number | null;
  levelId: number | null;
  packId: number | null;
};

export const EMPTY_SELECTION: Selection = {
  tierId: null,
  levelId: null,
  packId: null,
};

/**
 * The cards a selection describes. Each field narrows the last, and a null
 * field means "not narrowed" rather than "match nothing" — so an untouched
 * picker shows the whole curriculum.
 */
export function filterFlashcards(
  cards: readonly Flashcard[],
  selection: Selection,
): Flashcard[] {
  return cards.filter((card) => {
    if (selection.tierId !== null && card.tierId !== selection.tierId) {
      return false;
    }
    if (selection.levelId !== null && card.levelId !== selection.levelId) {
      return false;
    }
    if (selection.packId !== null && card.packId !== selection.packId) {
      return false;
    }
    return true;
  });
}

/* -------------------------------------------------------------------------
   The curriculum as the picker needs it: ids, names, swatches, and the types
   each level offers. Derived from the database rows once, on the server, so
   the client never reasons about Prisma shapes.
   ------------------------------------------------------------------------- */

export type PickerPack = {
  id: number;
  /** Its number within the level, shown as "Type 3". */
  position: number;
};

export type PickerLevel = {
  id: number;
  name: string;
  colour: string;
  /** Empty when the level has a single content set. */
  packs: PickerPack[];
};

export type PickerTier = {
  id: number;
  name: string;
  levels: PickerLevel[];
};

export type PickerCurriculum = PickerTier[];

/**
 * The level an id names, wherever it sits, with its tier. Null ids are the
 * common case at call sites — "no level chosen" — so they are answered here
 * rather than guarded against three times over.
 */
export function findLevel(
  curriculum: PickerCurriculum,
  levelId: number | null,
): { tier: PickerTier; level: PickerLevel } | null {
  if (levelId === null) return null;

  for (const tier of curriculum) {
    const level = tier.levels.find((candidate) => candidate.id === levelId);
    if (level) return { tier, level };
  }
  return null;
}

/**
 * A selection the current curriculum can actually satisfy.
 *
 * Both untrusted sources go through this: a URL someone typed, and a selection
 * restored from `localStorage` after the admin deleted a level. Each field is
 * dropped rather than the whole selection, so a stale pack still leaves the
 * learner on the right level instead of back at the start.
 *
 * A level names its tier, so `?level=20` alone repairs to the full selection
 * rather than being thrown away.
 */
export function sanitizeSelection(
  selection: Selection,
  curriculum: PickerCurriculum,
): Selection {
  const tierExists = curriculum.some((tier) => tier.id === selection.tierId);
  let tierId = tierExists ? selection.tierId : null;

  const found = findLevel(curriculum, selection.levelId);

  // A level from another tier is the stale half of the pair — keep the tier the
  // learner is looking at and drop the level.
  if (!found || (tierId !== null && found.tier.id !== tierId)) {
    return { tierId, levelId: null, packId: null };
  }

  tierId ??= found.tier.id;

  const packId = found.level.packs.some((pack) => pack.id === selection.packId)
    ? selection.packId
    : null;

  return { tierId, levelId: found.level.id, packId };
}

/* -------------------------------------------------------------------------
   URL params. The picker keeps its state in React, but the viewer is its own
   route — the selection travels there as a query string so a refresh or a
   shared link lands on the same deck.
   ------------------------------------------------------------------------- */

/** Next hands `searchParams` over in this shape. */
export type SearchParams = Record<string, string | string[] | undefined>;

export function selectionToQuery(selection: Selection): string {
  const query = new URLSearchParams();
  if (selection.tierId !== null) query.set("tier", String(selection.tierId));
  if (selection.levelId !== null) query.set("level", String(selection.levelId));
  if (selection.packId !== null) query.set("pack", String(selection.packId));
  return query.toString();
}

function first(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

/** The query as it appears in a link: "?tier=2&level=20", or "" for nothing. */
export function selectionToPath(selection: Selection): string {
  const query = selectionToQuery(selection);
  return query ? `?${query}` : "";
}

/**
 * A row id, or null for anything that cannot be one. Autoincrement keys start
 * at 1, so 0, negatives, fractions, and words all read as "unset" — which is
 * also how a select's "any" sentinel resolves.
 */
export function parseId(value: string | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

/**
 * Reads a selection out of query params. Only the shape is checked here —
 * whether the rows still exist is `sanitizeSelection`'s job.
 */
export function selectionFromParams(params: SearchParams): Selection {
  return {
    tierId: parseId(first(params.tier)),
    levelId: parseId(first(params.level)),
    packId: parseId(first(params.pack)),
  };
}

/* -------------------------------------------------------------------------
   Building the view models from database rows.

   The parameter types are structural and list only the columns actually read,
   so the Prisma payloads satisfy them without this file importing Prisma — and
   the tests can pass plain objects.
   ------------------------------------------------------------------------- */

type SourceWord = {
  id: number;
  hebrew: string;
  english: string;
  contentPackId: number | null;
};

type SourceLevel = {
  id: number;
  name: string;
  colour: string;
  contentPacks: readonly { id: number; position: number }[];
  words: readonly SourceWord[];
};

type SourceTier = {
  id: number;
  name: string;
  levels: readonly SourceLevel[];
};

/** Order is the query's: tiers, levels, and packs all come back by position. */
export function toPickerCurriculum(
  tiers: readonly SourceTier[],
): PickerCurriculum {
  return tiers.map((tier) => ({
    id: tier.id,
    name: tier.name,
    levels: tier.levels.map((level) => ({
      id: level.id,
      name: level.name,
      colour: level.colour,
      packs: level.contentPacks.map((pack) => ({
        id: pack.id,
        position: pack.position,
      })),
    })),
  }));
}

/** Every word in the curriculum, flattened and carrying its level's identity. */
export function toFlashcards(tiers: readonly SourceTier[]): Flashcard[] {
  const cards: Flashcard[] = [];

  for (const tier of tiers) {
    for (const level of tier.levels) {
      const positions = new Map(
        level.contentPacks.map((pack) => [pack.id, pack.position]),
      );

      for (const word of level.words) {
        cards.push({
          id: word.id,
          hebrew: word.hebrew,
          english: word.english,
          tierId: tier.id,
          levelId: level.id,
          levelName: level.name,
          colour: level.colour,
          packId: word.contentPackId,
          packPosition:
            word.contentPackId === null
              ? null
              : (positions.get(word.contentPackId) ?? null),
          packCount: level.contentPacks.length,
        });
      }
    }
  }

  return cards;
}

/**
 * Fisher-Yates, returning a new array. The random source is a parameter so the
 * shuffle is testable — and so the caller, not this module, decides when
 * randomness enters (it must not happen during a server render).
 */
export function shuffle<T>(
  items: readonly T[],
  random: () => number = Math.random,
): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}
