import { describe, expect, test } from "vitest";
import { EMPTY_SELECTION } from "@/lib/flashcards";
import { parseStoredSelection } from "@/hooks/use-stored-selection";

/**
 * The storage format is a contract with every browser that has already
 * written to this key, including builds that stored a different shape.
 */
describe("parseStoredSelection", () => {
  test("reads a stored selection back", () => {
    expect(
      parseStoredSelection('{"tierId":2,"levelId":20,"packId":101}'),
    ).toEqual({ tierId: 2, levelId: 20, packId: 101 });
  });

  test("an absent value is no selection", () => {
    expect(parseStoredSelection(null)).toEqual(EMPTY_SELECTION);
  });

  test("ignores the slug-shaped value written by an older build", () => {
    expect(
      parseStoredSelection(
        '{"tierSlug":"freedom","levelSlug":"indigo","packPosition":3}',
      ),
    ).toEqual(EMPTY_SELECTION);
  });

  test("keeps the fields it recognises and drops the rest", () => {
    expect(parseStoredSelection('{"tierId":2,"levelId":"indigo"}')).toEqual({
      tierId: 2,
      levelId: null,
      packId: null,
    });
  });

  test("survives malformed json", () => {
    expect(parseStoredSelection("{not json")).toEqual(EMPTY_SELECTION);
  });

  test("survives json that is not an object", () => {
    expect(parseStoredSelection("5")).toEqual(EMPTY_SELECTION);
    expect(parseStoredSelection("null")).toEqual(EMPTY_SELECTION);
  });
});
