/**
 * The one query behind both the picker and the viewer.
 *
 * The whole curriculum is ~230 words, so fetching it entire and narrowing in
 * memory is cheaper than a query per selection — and it means the picker
 * filters instantly on the client while the viewer applies the *same* pure
 * functions on the server. One code path, no chance of the two disagreeing.
 */
import { db } from "@/lib/db";
import {
  type Flashcard,
  type PickerCurriculum,
  toFlashcards,
  toPickerCurriculum,
} from "@/lib/flashcards";

export type Deck = {
  curriculum: PickerCurriculum;
  cards: Flashcard[];
};

export async function loadDeck(): Promise<Deck> {
  const tiers = await db.tier.findMany({
    orderBy: { position: "asc" },
    include: {
      levels: {
        orderBy: { position: "asc" },
        include: {
          contentPacks: { orderBy: { position: "asc" } },
          words: { orderBy: { position: "asc" } },
        },
      },
    },
  });

  return { curriculum: toPickerCurriculum(tiers), cards: toFlashcards(tiers) };
}
