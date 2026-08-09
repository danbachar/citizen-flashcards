"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  type IdOption,
  type IdOptionGroup,
  IdSelect,
} from "@/components/flashcards/id-select";
import { VocabCard } from "@/components/flashcards/vocab-card";
import { Button } from "@/components/ui/button";
import { useStoredSelection } from "@/hooks/use-stored-selection";
import {
  type Flashcard,
  type PickerCurriculum,
  type PickerLevel,
  filterFlashcards,
  findLevel,
  selectionToPath,
} from "@/lib/flashcards";

export function FlashcardPicker({
  curriculum,
  cards,
}: {
  curriculum: PickerCurriculum;
  cards: Flashcard[];
}) {
  const [selection, choose] = useStoredSelection(curriculum);

  const tier = curriculum.find((entry) => entry.id === selection.tierId);
  const level = findLevel(curriculum, selection.levelId)?.level;
  const visible = useMemo(
    () => filterFlashcards(cards, selection),
    [cards, selection],
  );

  // Narrowed to the chosen tier, or grouped by tier so the control still works
  // — and still reads as a progression — before one is chosen.
  const levelOptions: IdOption[] | IdOptionGroup[] = tier
    ? tier.levels.map(toLevelOption)
    : curriculum.map((entry) => ({
        label: entry.name,
        options: entry.levels.map(toLevelOption),
      }));

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <IdSelect
          id="tier"
          label="Tier"
          placeholder="Every tier"
          value={selection.tierId}
          options={curriculum.map((entry) => ({
            id: entry.id,
            label: entry.name,
          }))}
          triggerClassName="md:w-52"
          // A new tier invalidates everything below it.
          onChange={(tierId) => choose({ tierId, levelId: null, packId: null })}
        />

        <IdSelect
          id="level"
          label="Level"
          placeholder="Every level"
          value={selection.levelId}
          options={levelOptions}
          triggerClassName="md:w-52"
          onChange={(levelId) =>
            choose({
              // The level names its own tier, so picking one from the grouped
              // list fills the tier in rather than contradicting it.
              tierId: findLevel(curriculum, levelId)?.tier.id ?? selection.tierId,
              levelId,
              packId: null,
            })
          }
        />

        {/* Only levels split into content packs get a third control. */}
        {level && level.packs.length > 0 ? (
          <IdSelect
            id="type"
            label="Type"
            placeholder="Every type"
            value={selection.packId}
            options={level.packs.map((pack) => ({
              id: pack.id,
              label: `Type ${pack.position}`,
            }))}
            triggerClassName="md:w-40"
            className="animate-in fade-in slide-in-from-left-2"
            onChange={(packId) => choose({ ...selection, packId })}
          />
        ) : null}

        <div className="md:ml-auto">
          {/* An anchor cannot be disabled, so an empty set gets a real button
              instead of a link that still navigates. */}
          {visible.length === 0 ? (
            <Button size="lg" className="h-11 px-6" disabled>
              No cards to study
            </Button>
          ) : (
            <Button asChild size="lg" className="h-11 px-6">
              <Link
                href={`/viewer${selectionToPath(selection)}`}
                transitionTypes={["nav-forward"]}
              >
                Study {visible.length} cards
              </Link>
            </Button>
          )}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No cards here yet — seed the curriculum, or widen the selection.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((card) => (
            <VocabCard key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}

function toLevelOption(level: PickerLevel): IdOption {
  return { id: level.id, label: level.name, colour: level.colour };
}
