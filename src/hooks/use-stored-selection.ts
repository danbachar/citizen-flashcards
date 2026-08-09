"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  EMPTY_SELECTION,
  type PickerCurriculum,
  type Selection,
  sanitizeSelection,
} from "@/lib/flashcards";

const STORAGE_KEY = "citizen:flashcards";

/**
 * The learner's last selection, remembered across visits.
 *
 * The awkward part this hides is hydration: `localStorage` does not exist on
 * the server, so the value cannot be read during the first render without the
 * two renders disagreeing. `useSyncExternalStore` is the sanctioned way out —
 * the server snapshot is null, and React swaps the real value in as it
 * hydrates, with no effect and no cascading render.
 *
 * Returns the current selection and a setter that also persists it. Once the
 * learner chooses anything, their choice outranks whatever was stored.
 */
export function useStoredSelection(
  curriculum: PickerCurriculum,
): [Selection, (next: Selection) => void] {
  const storedRaw = useSyncExternalStore(subscribe, readStored, serverStored);
  const [chosen, setChosen] = useState<Selection | null>(null);

  // Sanitised against the curriculum, so a level the admin has since deleted
  // drops out instead of filtering the grid down to nothing.
  const selection = useMemo(
    () => chosen ?? sanitizeSelection(parseStoredSelection(storedRaw), curriculum),
    [chosen, storedRaw, curriculum],
  );

  function choose(next: Selection) {
    setChosen(next);
    writeStoredSelection(next);
  }

  return [selection, choose];
}

/**
 * Nothing outside this tab writes the key, so there is nothing to subscribe to
 * — the snapshot is read once at hydration and this tab owns it after that.
 */
function subscribe() {
  return () => {};
}

function readStored(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // A private-mode denial is not worth a broken page.
    return null;
  }
}

/** There is no localStorage on the server, so the first render has no choice. */
function serverStored(): string | null {
  return null;
}

/**
 * The stored value, as far as it can be trusted. Anything unrecognisable —
 * hand-edited, or the slug-shaped value written before ids became the identity
 * — reads as no selection rather than as a broken one.
 *
 * Exported because this is the storage contract with every browser that has
 * already written to the key.
 */
export function parseStoredSelection(raw: string | null): Selection {
  if (!raw) return EMPTY_SELECTION;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return EMPTY_SELECTION;

    const { tierId, levelId, packId } = parsed as Partial<Selection>;
    return {
      tierId: typeof tierId === "number" ? tierId : null,
      levelId: typeof levelId === "number" ? levelId : null,
      packId: typeof packId === "number" ? packId : null,
    };
  } catch {
    return EMPTY_SELECTION;
  }
}

function writeStoredSelection(selection: Selection) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
  } catch {}
}
