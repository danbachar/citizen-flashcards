# Flashcard picker and viewer — design

Date: 2026-08-09

A learner picks a tier, then a level, then (only where the level has them) a
type. The cards below narrow with each choice. From any point they can open a
viewer that drills whatever set is on screen.

## Routes

```
/                        picker — fetches the curriculum, renders the client picker
/viewer?tier=&level=&pack=   viewer — refetches the filtered set from the params
/health                  system health as JSON, for the smoke test and for humans
```

`/` replaces the current placeholder home page.

## Data flow

`/` runs one Prisma query built on the existing `tierWithLevels` include in
`src/lib/curriculum.ts`, extended to bring each level's words. The whole
curriculum is roughly 230 words, small enough to send to the client in full, so
every dropdown change filters instantly with no round-trip. This adds no new
data-access module: both this work and the seeding work in the other session
derive their types from `prisma/schema.prisma`.

Selection lives in React state and is mirrored to `localStorage` under
`citizen:flashcards` as `{ tierSlug, levelSlug, packPosition }`. It is restored
in an effect *after* mount — a `useState` initializer would run during the
server render too and desync hydration. The restored value is validated against
the fetched curriculum, so a slug the admin has since renamed is dropped rather
than silently producing an empty grid.

Opening the viewer encodes the current filter into the URL:
`/viewer?level=indigo&pack=3`, `/viewer?tier=freedom`, or bare `/viewer` for
everything. The viewer resolves those params server-side and fetches its own
words, so a refresh or a shared link works without any transferred state.

## The picker

Three controls, each narrowing the next:

- **Tier** — every tier. Changing it clears the level and type below.
- **Level** — narrows to the chosen tier's levels. With no tier chosen it lists
  every level, grouped by tier, so the control is never dead.
- **Type** — rendered only when the chosen level has content packs. The test is
  `isPackedLevel()` from `src/lib/curriculum.ts`, never a check against the name
  "freedom" — which tiers pack their levels is `Tier.hasContentPacks`, a row the
  admin owns.

Below the controls, the card grid filters live. The **Open viewer** call to
action is always enabled and always studies whatever is currently on screen,
labelled with the count — "Study 10 cards", "Study 230 cards" — so the deck size
is never a surprise.

### The card

A raised white surface with a thick level-colour edge along the top, the Hebrew
centred in the serif voice, and a meta row carrying the level name and type pips
(`●●●○○○` reads as type 3 of 6). Clicking flips to the English through the
existing `FlipCard`, so the card morphs to fit the translation rather than
rotating a fixed-size face. The meta row appears on both faces, which holds it
still through the flip.

`Level.colour` is required — see "Schema prerequisite" below — so the card has no
missing-colour branch.

## The viewer

One card, large. On mount the deck shuffles — again in an effect, to keep the
server render and hydration agreed — so the first card shown is random.

- **Next** advances through the shuffled order. At the end the viewer shows a
  *Set complete* state offering Shuffle or Back to the picker. It does not wrap.
- **Shuffle** re-orders the deck and returns to card 1.

A `7 / 20` counter and the level chip sit beneath the card. Tap to flip works as
it does in the grid.

## /health

A route handler at `src/app/health/route.ts`, `force-dynamic`, returning JSON:

```json
{
  "status": "ok",
  "env": "development",
  "database": { "reachable": true, "latencyMs": 3 },
  "curriculum": { "tiers": 3, "levels": 12, "contentPacks": 14, "words": 230 },
  "timestamp": "2026-08-09T18:00:00.000Z"
}
```

`status` is `"ok"` when the database answers, `"degraded"` when it does not, with
a matching 200 or 503. An unreachable database is reported, never thrown — the
endpoint's job is to describe the failure, not to become one.

`public/sw.js` must never cache it. The worker already skips `/api/*`; `/health`
needs the same exclusion, or a stale cached body would report health that no
longer holds.

## Testing

`tests/smoke.test.ts` currently asserts that `/` contains the string "Database
connected", which this work removes. The database check moves to `/health`: the
test asserts 200 with `status: "ok"` when `DATABASE_URL` is set, and 503 with
`status: "degraded"` when it is not — so it makes a real assertion in a bare
checkout instead of skipping. `/` and `/viewer` get status-only checks, since
their content now depends on seeded data.

Unit tests cover `src/lib/flashcards.ts`, which is pure: filtering a word list
by tier/level/pack, encoding and decoding the viewer's search params (round-trip
and rejection of unknown slugs), and shuffle — that the result is a permutation
of the input, and that with an injected deterministic random source it produces a
known order.

## Files

| File | Role |
|---|---|
| `src/app/page.tsx` | Replaced: fetches the curriculum, renders the picker |
| `src/app/viewer/page.tsx` | Resolves search params, fetches the set, renders the viewer |
| `src/app/health/route.ts` | Health JSON |
| `src/lib/flashcards.ts` | Pure: filter, param encode/decode, shuffle |
| `src/components/flashcards/picker.tsx` | Client: the three controls and the grid |
| `src/components/flashcards/vocab-card.tsx` | The colour-edged flip card |
| `src/components/flashcards/viewer.tsx` | Client: deck state, next, shuffle, complete |
| `src/components/ui/select.tsx` | shadcn Select (`radix-ui` is already a dependency) |
| `public/sw.js` | Add the `/health` cache exclusion |
| `tests/smoke.test.ts` | Point the database check at `/health` |

## Schema prerequisite — satisfied

`Level.colour` is `String`, not `String?`: every card is identified by its level
colour, so a level without one is not a state the UI should be able to
represent. The user made this change directly, with migration
`20260809163802_level_colour_required` backfilling the existing rows before
adding the `NOT NULL`. Nothing here needs to touch the schema.

## Coordination

The other session owns `src/lib/curriculum.ts`, `prisma/`, and `src/components/ui/`.
This work does not modify `curriculum.ts`, does not touch `prisma/`, and only
*adds* `select.tsx`. The files it changes in place are `src/app/page.tsx`,
`public/sw.js`, and `tests/smoke.test.ts`, none of which the seeding work needs.
