# Live curriculum updates — deferred

Date: 2026-08-09
Status: **future work.** Designed, partly built, and removed from the tree. No
code from it remains; this is the record so it need not be rediscovered.

## The problem

The admin's Server Actions call `revalidatePath("/", "layout")`, so any learner
who navigates or refreshes sees current content. The gap is a tab that is
already open and idle — it keeps showing words that have since been edited or
deleted.

Freshness required: sub-second, with real learners studying mid-session.

## Facts established

- **Vercel Functions do serve WebSockets.** The Next.js path is
  `experimental_upgradeWebSocket()` from `@vercel/functions`, in a route
  handler, with `ws` installed.
- It requires **Fluid compute** (default for projects created after
  2025-04-23) and the **WebSockets permission** on the account — confirm both
  before starting.
- **Local development requires `vc dev`** (Vercel CLI ≥ 54.14.2). `next dev`
  has no upgrade hook. Next.js is the only framework where this API runs
  locally at all.
- A connection is **pinned to one function instance**, and under Fluid one
  instance serves many connections. So the unit needing a database listener is
  the instance, not the connection.
- Connections close at the function's max duration, so client reconnect with
  backoff is normal operation rather than error handling.
- Every open learner tab bills as an **active function invocation** for its
  whole session, plus data transfer.

## The design

```
admin Server Action
  └─ writes, commits
  └─ after() → NOTIFY curriculum_changed
                    │
              Postgres
                    │ LISTEN — one connection per instance
        ┌───────────┴───────────┐
   instance A              instance B
   └─ learner tabs         └─ learner tabs
        │
   router.refresh() → RSC re-render → loadDeck() → new props
```

**The socket carries no curriculum data.** The only message is
`{"type":"curriculum"}` and the client answers it with `router.refresh()`, so
`loadDeck()` stays the single read path and nothing can go stale in transit.

`NOTIFY` runs inside `after()` from `next/server`: after the response, and
therefore after the write has committed. A listener that refetched first would
read the old rows and never hear about them again.

`NOTIFY` is an ordinary statement and goes over the pooled connection. `LISTEN`
holds a session open, which a transaction-mode pooler cannot do — the listener
needs `DIRECT_URL`.

### Pieces it needed

| Piece | Role |
|---|---|
| `src/lib/curriculum-events.ts` | `notifyCurriculumChanged()` and `subscribeToCurriculumChanges()`, with reconnect |
| `src/lib/curriculum-socket.ts` | Per-instance socket registry; one listener while any client is connected, with an idle grace period |
| `src/app/api/ws/route.ts` | Production adapter — `experimental_upgradeWebSocket` |
| `server.ts` | Local adapter — custom Next server with `ws` on the same port |
| `src/components/flashcards/curriculum-sync.tsx` | Client: connect, backoff, disconnect while the tab is hidden, debounce refreshes |
| `reconcileDeck` / `reconcilePosition` | See below |
| `src/app/admin/actions.ts` | One `after()` call inside the existing `revalidateCurriculum()` |
| deps | `ws`, `@vercel/functions`, `pg`, `@types/ws` |

### The part that actually bites

`FlashcardViewer` holds `useState(cards)`. `router.refresh()` hands it new
props and `useState` ignores them, so a learner would keep studying a word the
admin just deleted. It needs:

- position tracked by **card id**, not index — an index means something
  different after a deletion;
- `reconcileDeck(deck, next)`: survivors keep their shuffled position but take
  the new object (so an edit appears in place), deletions fall out, additions
  go on the end;
- `reconcilePosition(deck, index, next)`: follow the current card if it moved,
  hold the slot if it was deleted, land on the completed state if the deck
  shrank past it;
- applied during render via the store-previous-props pattern, not an effect.

Both functions were written and unit-tested; they are pure and need only the
card list.

## What was proven before removal

Two integration tests passed against local Docker Postgres:

- `NOTIFY` from the write path reaching a real `LISTEN` connection, and no
  longer arriving once the subscription closes;
- the full push — a real `WebSocketServer`, a real client, a real `NOTIFY` —
  delivering `{"type":"curriculum"}` to the browser-facing socket.

So the mechanism works. What was never verified end to end is the upgrade
itself and the client's `router.refresh()`.

## Local-development gotchas found

Making `npm run dev` serve sockets meant a custom `server.ts` wrapping Next.
Three things cost time:

1. `tsx` emits CommonJS for `.ts`, so no top-level await — use
   `app.prepare().then(...)` as Next's own example does.
2. `app.getUpgradeHandler()` throws unless called **after** `prepare()`.
3. Next allows one dev server per project directory, so a custom server cannot
   run beside a `next dev` on another port. With two sessions in one checkout,
   that is a real constraint.

Next's HMR socket must keep working: route `/api/ws` to `ws`, and hand every
other upgrade to `getUpgradeHandler()`.

## If this is picked up again

Consider whether sub-second is still the requirement. If "within ~30s or on
refocus" would do, the same `router.refresh()` client with a visibility
listener and a cheap version poll delivers most of the value for a fraction of
the machinery — no sockets, no listener, no per-tab function billing.
