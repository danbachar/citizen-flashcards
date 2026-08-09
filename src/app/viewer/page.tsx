import { FlashcardViewer } from "@/components/flashcards/viewer";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { DirectionalTransition } from "@/components/motion/directional-transition";
import { loadDeck } from "@/lib/flashcard-query";
import {
  filterFlashcards,
  sanitizeSelection,
  shuffle,
  selectionFromParams,
  selectionToPath,
} from "@/lib/flashcards";

export const dynamic = "force-dynamic";

export default async function ViewerPage({ searchParams }: PageProps<"/viewer">) {
  const { curriculum, cards } = await loadDeck();

  // The params are a URL — someone may have typed or shared it — so they are
  // sanitised against the curriculum exactly as a restored selection is.
  const selection = sanitizeSelection(
    selectionFromParams(await searchParams),
    curriculum,
  );
  const path = selectionToPath(selection);

  // Shuffled here rather than in the client: this route is force-dynamic, so
  // the order is decided once per request and the client hydrates the same
  // deck it was sent. That is also what makes the first card a random one.
  const deck = shuffle(filterFlashcards(cards, selection));

  return (
    <DirectionalTransition>
      {/* A study surface, not a document: centred in the viewport so the card
          is where the eye already is. */}
      <Section spacing="compact" className="flex min-h-[78svh] items-center">
        <Container width="content" className="flex flex-col gap-8">
          {/* Keyed by the set, so choosing a different one remounts the
              viewer instead of leaving its deck state behind. */}
          <FlashcardViewer
            key={path}
            cards={deck}
            backHref={`/${path}`}
          />
        </Container>
      </Section>
    </DirectionalTransition>
  );
}
