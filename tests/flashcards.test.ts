import { describe, expect, test } from "vitest";
import {
  EMPTY_SELECTION,
  type Flashcard,
  type PickerCurriculum,
  filterFlashcards,
  findLevel,
  parseId,
  sanitizeSelection,
  selectionFromParams,
  selectionToPath,
  selectionToQuery,
  shuffle,
  toFlashcards,
  toPickerCurriculum,
} from "@/lib/flashcards";

/** Two tiers, three levels, one of which is split into two packs. */
function deck(): Flashcard[] {
  const card = (
    id: number,
    tierId: number,
    levelId: number,
    packId: number | null,
    packPosition: number | null,
  ): Flashcard => ({
    id,
    hebrew: `עברית-${id}`,
    english: `english-${id}`,
    tierId,
    levelId,
    levelName: `level-${levelId}`,
    colour: "#123456",
    packId,
    packPosition,
    packCount: packId === null ? 0 : 2,
  });

  return [
    card(1, 1, 10, null, null),
    card(2, 1, 10, null, null),
    card(3, 1, 11, null, null),
    card(4, 2, 20, 100, 1),
    card(5, 2, 20, 101, 2),
  ];
}

const ids = (cards: Flashcard[]) => cards.map((card) => card.id);

describe("filterFlashcards", () => {
  test("returns every card when nothing is selected", () => {
    expect(ids(filterFlashcards(deck(), EMPTY_SELECTION))).toEqual([
      1, 2, 3, 4, 5,
    ]);
  });

  test("narrows to one tier", () => {
    const result = filterFlashcards(deck(), {
      tierId: 1,
      levelId: null,
      packId: null,
    });

    expect(ids(result)).toEqual([1, 2, 3]);
  });

  test("narrows to one level", () => {
    const result = filterFlashcards(deck(), {
      tierId: 1,
      levelId: 10,
      packId: null,
    });

    expect(ids(result)).toEqual([1, 2]);
  });

  test("narrows to one pack within a level", () => {
    const result = filterFlashcards(deck(), {
      tierId: 2,
      levelId: 20,
      packId: 101,
    });

    expect(ids(result)).toEqual([5]);
  });

  test("does not mutate the deck it was given", () => {
    const original = deck();

    filterFlashcards(original, { tierId: 1, levelId: null, packId: null });

    expect(original).toHaveLength(5);
  });
});

/** `foundation/red` is a single set, `freedom/indigo` has two types. */
function curriculum(): PickerCurriculum {
  return [
    {
      id: 1,
      name: "Foundation",
      levels: [
        { id: 10, name: "Red", colour: "#D6483B", packs: [] },
        { id: 11, name: "Orange", colour: "#E8792B", packs: [] },
      ],
    },
    {
      id: 2,
      name: "Freedom",
      levels: [
        {
          id: 20,
          name: "Indigo",
          colour: "#4B4B9E",
          packs: [
            { id: 100, position: 1 },
            { id: 101, position: 2 },
          ],
        },
      ],
    },
  ];
}

describe("sanitizeSelection", () => {
  test("keeps a selection that matches the curriculum", () => {
    const selection = { tierId: 2, levelId: 20, packId: 101 };

    expect(sanitizeSelection(selection, curriculum())).toEqual(selection);
  });

  test("drops a tier the curriculum no longer has", () => {
    const result = sanitizeSelection(
      { tierId: 99, levelId: null, packId: null },
      curriculum(),
    );

    expect(result.tierId).toBeNull();
  });

  test("drops a level the curriculum no longer has, and its pack", () => {
    const result = sanitizeSelection(
      { tierId: 2, levelId: 99, packId: 101 },
      curriculum(),
    );

    expect(result).toEqual({ tierId: 2, levelId: null, packId: null });
  });

  test("infers the tier from the level when only a level is given", () => {
    const result = sanitizeSelection(
      { tierId: null, levelId: 20, packId: null },
      curriculum(),
    );

    expect(result.tierId).toBe(2);
  });

  test("drops a level belonging to a different tier", () => {
    const result = sanitizeSelection(
      { tierId: 1, levelId: 20, packId: 100 },
      curriculum(),
    );

    expect(result).toEqual({ tierId: 1, levelId: null, packId: null });
  });

  test("drops a pack the level does not have", () => {
    const result = sanitizeSelection(
      { tierId: 2, levelId: 20, packId: 999 },
      curriculum(),
    );

    expect(result.packId).toBeNull();
  });

  test("drops a pack on a level that has no types at all", () => {
    const result = sanitizeSelection(
      { tierId: 1, levelId: 10, packId: 100 },
      curriculum(),
    );

    expect(result.packId).toBeNull();
  });
});

describe("selection query params", () => {
  test("round-trips a full selection", () => {
    const selection = { tierId: 2, levelId: 20, packId: 101 };

    const query = selectionToQuery(selection);

    expect(query).toBe("tier=2&level=20&pack=101");
    expect(
      selectionFromParams(Object.fromEntries(new URLSearchParams(query))),
    ).toEqual(selection);
  });

  test("an empty selection is an empty query", () => {
    expect(selectionToQuery(EMPTY_SELECTION)).toBe("");
  });

  test("omits the fields that are not set", () => {
    expect(
      selectionToQuery({ tierId: 5, levelId: null, packId: null }),
    ).toBe("tier=5");
  });

  test("reads a repeated param as its first value", () => {
    expect(selectionFromParams({ tier: ["7", "8"] }).tierId).toBe(7);
  });

  test("treats a non-numeric id as unset", () => {
    expect(selectionFromParams({ level: "indigo" }).levelId).toBeNull();
  });

  test("treats a zero or negative id as unset", () => {
    expect(selectionFromParams({ pack: "0" }).packId).toBeNull();
    expect(selectionFromParams({ pack: "-1" }).packId).toBeNull();
  });

  test("reads missing params as an empty selection", () => {
    expect(selectionFromParams({})).toEqual(EMPTY_SELECTION);
  });
});

describe("parseId", () => {
  test("reads a positive integer", () => {
    expect(parseId("42")).toBe(42);
  });

  test("rejects anything that is not a row id", () => {
    // Autoincrement keys start at 1, so 0, negatives, and words are all unset.
    expect(parseId("0")).toBeNull();
    expect(parseId("-1")).toBeNull();
    expect(parseId("1.5")).toBeNull();
    expect(parseId("indigo")).toBeNull();
    expect(parseId("")).toBeNull();
    expect(parseId(null)).toBeNull();
    expect(parseId(undefined)).toBeNull();
  });
});

describe("findLevel", () => {
  test("finds a level and the tier holding it", () => {
    const found = findLevel(curriculum(), 20);

    expect(found?.level.name).toBe("Indigo");
    expect(found?.tier.name).toBe("Freedom");
  });

  test("is null for a level the curriculum does not have", () => {
    expect(findLevel(curriculum(), 999)).toBeNull();
    expect(findLevel(curriculum(), null)).toBeNull();
  });
});

describe("selectionToPath", () => {
  test("prefixes a question mark only when there is a query", () => {
    expect(selectionToPath({ tierId: 2, levelId: null, packId: null })).toBe(
      "?tier=2",
    );
    expect(selectionToPath(EMPTY_SELECTION)).toBe("");
  });
});

describe("shuffle", () => {
  test("keeps every item exactly once", () => {
    const input = ["a", "b", "c", "d", "e"];

    expect([...shuffle(input)].sort()).toEqual([...input].sort());
  });

  test("does not mutate the input", () => {
    const input = ["a", "b", "c", "d"];

    shuffle(input, () => 0);

    expect(input).toEqual(["a", "b", "c", "d"]);
  });

  test("is driven entirely by the random source it is given", () => {
    // Fisher-Yates walking backwards, always drawing index 0, rotates the list.
    expect(shuffle(["a", "b", "c", "d"], () => 0)).toEqual(["b", "c", "d", "a"]);
  });

  test("handles an empty deck", () => {
    expect(shuffle([])).toEqual([]);
  });
});

/** The database tree as the page queries it. */
function rows() {
  return [
    {
      id: 1,
      name: "Foundation",
      levels: [
        {
          id: 10,
          name: "Red",
          colour: "#D6483B",
          contentPacks: [],
          words: [
            { id: 1, hebrew: "שָׁלוֹם", english: "Hello", contentPackId: null },
            { id: 2, hebrew: "תּוֹדָה", english: "Thanks", contentPackId: null },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Freedom",
      levels: [
        {
          id: 20,
          name: "Indigo",
          colour: "#4B4B9E",
          contentPacks: [
            { id: 100, position: 1 },
            { id: 101, position: 2 },
          ],
          words: [
            { id: 3, hebrew: "כֶּסֶף", english: "Money", contentPackId: 101 },
          ],
        },
      ],
    },
  ];
}

describe("toPickerCurriculum", () => {
  test("keeps tiers and levels in the order the query returned them", () => {
    const result = toPickerCurriculum(rows());

    expect(result.map((tier) => tier.id)).toEqual([1, 2]);
    expect(result[1].levels[0]).toEqual({
      id: 20,
      name: "Indigo",
      colour: "#4B4B9E",
      packs: [
        { id: 100, position: 1 },
        { id: 101, position: 2 },
      ],
    });
  });

  test("a level with a single content set offers no types", () => {
    expect(toPickerCurriculum(rows())[0].levels[0].packs).toEqual([]);
  });
});

describe("toFlashcards", () => {
  test("flattens the tree into cards, in curriculum order", () => {
    expect(toFlashcards(rows()).map((card) => card.id)).toEqual([1, 2, 3]);
  });

  test("carries the level's identity onto the card", () => {
    const [card] = toFlashcards(rows());

    expect(card).toEqual({
      id: 1,
      hebrew: "שָׁלוֹם",
      english: "Hello",
      tierId: 1,
      levelId: 10,
      levelName: "Red",
      colour: "#D6483B",
      packId: null,
      packPosition: null,
      packCount: 0,
    });
  });

  test("resolves a word's pack into its type number and the level's total", () => {
    const card = toFlashcards(rows()).find((entry) => entry.id === 3);

    expect(card).toMatchObject({ packId: 101, packPosition: 2, packCount: 2 });
  });
});
