"use client";

import { ArrowRight, Shuffle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { VocabCard } from "@/components/flashcards/vocab-card";
import { Button } from "@/components/ui/button";
import { type Flashcard, shuffle } from "@/lib/flashcards";

/**
 * One card at a time from a fixed set.
 *
 * The deck arrives already shuffled — the route does it, because a shuffle on
 * the client would either have to run during render (where the server and the
 * client would disagree) or in an effect (a cascading render). Reshuffling
 * afterwards happens in an event handler, where randomness is safe.
 *
 * The route keys this component by its query string, so a different set
 * remounts rather than leaving `deck` stale.
 */
export function FlashcardViewer({
  cards,
  backHref,
}: {
  cards: Flashcard[];
  backHref: string;
}) {
  const [deck, setDeck] = useState(cards);
  const [index, setIndex] = useState(0);
  function reshuffle() {
    setDeck(shuffle(deck));
    setIndex(0);
  }

  if (deck.length === 0) {
    return (
      <Empty>
        <p className="text-muted-foreground">There are no cards in this set.</p>
        <div className="mt-6">
          <BackLink href={backHref} />
        </div>
      </Empty>
    );
  }

  // Past the last card the set is finished. It does not wrap — reaching the end
  // should feel like reaching the end.
  if (index >= deck.length) {
    return (
      <Empty>
        <h2 className="text-3xl">Set complete</h2>
        <p className="mt-2 text-muted-foreground">
          {deck.length} cards, all the way through.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" className="h-11 px-6" onClick={reshuffle}>
            <Shuffle /> Shuffle and go again
          </Button>
          <BackLink href={backHref} />
        </div>
      </Empty>
    );
  }

  const card = deck[index];

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
      {/* Keyed by card, so every card arrives Hebrew-side up. */}
      <VocabCard key={card.id} card={card} size="feature" />

      <p className="text-sm tabular-nums text-muted-foreground">
        {card.levelName}
        {card.packPosition === null ? "" : ` · Type ${card.packPosition}`} ·{" "}
        {index + 1} / {deck.length}
      </p>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="lg"
          className="h-11 px-6"
          onClick={reshuffle}
        >
          <Shuffle /> Shuffle
        </Button>
        {/* Functional update: two clicks landing in one batch would both read
            the same `index` and advance a single card. */}
        <Button
          size="lg"
          className="h-11 px-6"
          onClick={() => setIndex((current) => current + 1)}
        >
          Next card <ArrowRight data-icon="inline-end" />
        </Button>
      </div>

      <BackLink href={backHref} />
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-xl py-10 text-center">{children}</div>;
}

function BackLink({ href }: { href: string }) {
  return (
    <Button asChild variant="ghost" size="lg">
      <Link href={href} transitionTypes={["nav-back"]}>
        Back to the picker
      </Link>
    </Button>
  );
}
