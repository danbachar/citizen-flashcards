"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Matches `--transition-duration-calm`; the lift peaks at the halfway point. */
const TURN_MS = 420;

/**
 * A card that turns over.
 *
 * Both faces sit in the same grid cell, so the card is as tall as its tallest
 * side and the two faces are exactly congruent — which is what makes the
 * rotation read as one object rather than a crossfade between two.
 *
 * The bible rules out bouncy motion (§13), so the weight comes from physics
 * rather than springiness: real perspective, a decelerating curve, and a lift
 * toward the viewer that peaks mid-turn and settles. Only transform is
 * animated, so the whole thing stays on the compositor even with 230 cards on
 * the page.
 *
 * Faces are hidden from assistive technology while they face away — the back
 * of a card is in the DOM the whole time, and screen readers would otherwise
 * read both sides at once.
 */
export function FlipCard({
  front,
  back,
  className,
  label = "Flip card",
  labelBack,
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  label?: string;
  /** Accessible name once flipped. Falls back to `label`. */
  labelBack?: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const [turning, setTurning] = useState(false);
  const settle = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (settle.current) clearTimeout(settle.current);
    };
  }, []);

  function flip() {
    setFlipped((value) => !value);

    // Hold the lift for half the turn, so the card is nearest the viewer as it
    // passes edge-on and has settled by the time the new face is square.
    setTurning(true);
    if (settle.current) clearTimeout(settle.current);
    settle.current = setTimeout(() => setTurning(false), TURN_MS / 2);
  }

  return (
    <button
      type="button"
      onClick={flip}
      aria-pressed={flipped}
      aria-label={flipped ? (labelBack ?? label) : label}
      className={cn(
        "group block w-full rounded-xl perspective-midrange outline-none",
        "focus-visible:ring-3 focus-visible:ring-ring",
        className,
      )}
    >
      <span
        className={cn(
          "block transition-transform ease-editorial",
          "group-hover:-translate-y-0.5 group-active:scale-[0.99]",
          turning && "scale-[1.03]",
        )}
      >
        <span
          className={cn(
            "grid transform-3d transition-transform ease-editorial",
            "duration-[var(--transition-duration-calm)]",
            flipped && "rotate-y-180",
          )}
        >
          <span
            aria-hidden={flipped}
            className="col-start-1 row-start-1 backface-hidden"
          >
            {front}
          </span>
          <span
            aria-hidden={!flipped}
            className="col-start-1 row-start-1 rotate-y-180 backface-hidden"
          >
            {back}
          </span>
        </span>
      </span>
    </button>
  );
}
