import { FlipCard } from "@/components/motion/flip-card";
import type { Flashcard } from "@/lib/flashcards";
import { cn } from "@/lib/utils";

/**
 * A vocabulary card: Hebrew on the front, English on the back.
 *
 * Colour identifies the level. The design bible keeps colour as a marker
 * rather than a flood (§5), so the swatch is a band along the top edge and the
 * surface stays the raised white — which also keeps the Hebrew at full contrast
 * whatever colour the admin picks for a level.
 *
 * Each face is a complete card: its own surface, ring, and colour band. That
 * is what the turn shows you — the same object from the other side, with the
 * level's colour reading continuously across the rotation.
 */
export function VocabCard({
  card,
  size = "grid",
  className,
}: {
  card: Flashcard;
  /** `feature` is the single large card in the viewer. */
  size?: "grid" | "feature";
  className?: string;
}) {
  const feature = size === "feature";

  return (
    <FlipCard
      label={`${card.hebrew} — show the translation`}
      labelBack={`${card.english} — show the Hebrew`}
      className={cn("text-left", className)}
      front={
        <Face card={card} feature={feature}>
          <span
            lang="he"
            dir="rtl"
            className={cn(
              "font-brand leading-tight",
              feature ? "text-5xl md:text-6xl" : "text-3xl",
            )}
          >
            {card.hebrew}
          </span>
        </Face>
      }
      back={
        <Face card={card} feature={feature}>
          {/* The answer is the point of the interaction, so it carries full
              contrast. The sans against the Hebrew serif is what marks it as
              the other side, without dimming it. */}
          <span
            className={cn(
              "font-medium leading-snug text-balance",
              feature ? "text-3xl md:text-4xl" : "text-xl",
            )}
          >
            {card.english}
          </span>
        </Face>
      }
    />
  );
}

/** Everything but the word itself — shared by both faces. */
function Face({
  card,
  feature,
  children,
}: {
  card: Flashcard;
  feature: boolean;
  children: React.ReactNode;
}) {
  return (
    <span className="flex h-full flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-[box-shadow,outline] group-hover:ring-foreground/25">
      <span
        className={cn("block shrink-0", feature ? "h-3" : "h-2")}
        style={{ backgroundColor: card.colour }}
      />
      <span
        className={cn(
          "flex flex-1 items-center justify-center px-5 text-center",
          feature ? "min-h-56 py-14" : "min-h-32 py-8",
        )}
      >
        {children}
      </span>
      <span className="flex shrink-0 items-center justify-between gap-3 border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
        <span>{card.levelName}</span>
        <TypePips card={card} />
      </span>
    </span>
  );
}

/**
 * `●●●○○○` — type 3 of 6. Levels with a single content set show nothing, which
 * is the whole point of `packCount`: the card never claims a type it lacks.
 */
function TypePips({ card }: { card: Flashcard }) {
  if (card.packCount === 0 || card.packPosition === null) return null;

  return (
    <>
      <span className="sr-only">
        Type {card.packPosition} of {card.packCount}
      </span>
      <span aria-hidden className="flex items-center gap-1">
        {Array.from({ length: card.packCount }, (_, index) => {
          const filled = index < (card.packPosition ?? 0);
          return (
            <span
              key={index}
              className={cn(
                "size-1.5 rounded-full",
                !filled && "bg-foreground/20",
              )}
              style={filled ? { backgroundColor: card.colour } : undefined}
            />
          );
        })}
      </span>
    </>
  );
}
