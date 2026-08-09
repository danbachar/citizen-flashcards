import { FlashcardPicker } from "@/components/flashcards/picker";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { DirectionalTransition } from "@/components/motion/directional-transition";
import { loadDeck } from "@/lib/flashcard-query";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { curriculum, cards } = await loadDeck();

  return (
    <DirectionalTransition>
      <Section spacing="regular">
        <Container width="page" className="flex flex-col gap-10">
          <header className="max-w-content">
            <h1 className="text-4xl md:text-5xl">Flashcards</h1>
            <p className="mt-3 text-muted-foreground">
              Choose a tier, then a level. Tap a card to turn it over.
            </p>
          </header>

          <FlashcardPicker curriculum={curriculum} cards={cards} />
        </Container>
      </Section>
    </DirectionalTransition>
  );
}
