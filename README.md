# Citizen Café — Hebrew flashcards

Pick a tier, then a level, then a content pack where one exists; tap a card to
flip between the Hebrew prompt and the English answer.

Next.js App Router · Postgres (Neon in production, Docker locally) · Prisma ·
Tailwind · shadcn/ui · Vercel.

```bash
npm install
npm run db:up     # Postgres 17 in Docker on :5432
npm run dev       # http://localhost:3000
```

No `.env` is needed locally — the app falls back to the Docker connection
string, and an empty database seeds itself on first boot.

| Route | What it is |
|---|---|
| `/` | Picker: tier, level, and — only where the level has them — type, over a live card grid |
| `/viewer` | One card at a time, with Next and Shuffle |
| `/admin` | Curriculum editor (see below) |
| `/health` | JSON status for the smoke tests and for humans |

## Key decisions

**The taxonomy is data, not code.** Tiers, levels, and packs are rows, not
enums. Adding a tier or a colour is an admin action, never a code change. The one
place this is visible: `Tier.hasContentPacks` records whether a tier is *allowed*
to split its levels into packs, so nothing anywhere tests for the string
`"freedom"`. The learner UI goes one step further and keys off the packs a level
actually has, so a Freedom level with no packs yet — Purple — correctly shows no
type selector.

**One query, filtered in memory.** The whole curriculum is ~230 words. Fetching
it entire and narrowing with pure functions is cheaper than a query per
selection, and it lets the picker filter instantly on the client while the
viewer applies the *same* functions on the server. One code path, so the two
cannot disagree. This stops being the right call somewhere around a few thousand
words.

**Integer primary keys, and everything filters on them.** Selection, the
viewer's query string, and the admin routes all travel as IDs, so renaming a
level never breaks a shared link. `name` is unique on tiers and levels, which
stops two of them sharing one.

**`Level.colour` is required.** A card is identified by its level's colour, so a
level without one is not a state the UI should be able to represent — the
column is `NOT NULL` rather than nullable-with-a-fallback.

**The database seeds itself when empty.** `src/instrumentation.ts` runs once per
server instance, before the first request. A fresh Neon branch or a teammate's
Docker comes up with content instead of blank screens. It is all-or-nothing —
any existing content and it does nothing — because once the admin owns the data,
a partial re-seed would fight it.

## Schema

```
Tier          Foundation → Flow → Freedom        tiers
  Level       a colour: red, orange, pink, …     levels
    ContentPack   optional parallel word sets    content_packs
      Word        hebrew / english pair          words
```

A content pack is the same mastery level with different words, so a learner can
keep going without repeating vocabulary — Dark Green ×4, Turquoise ×4, Indigo ×6.

Packs are rows rather than a `type` column on `Word` because they are things the
admin names, orders, and deletes; a bare integer on each word could not carry
that, and would let two words at "type 3" disagree about what type 3 is.

`Word` belongs to a level always and to a pack optionally, via a **composite
foreign key** onto `(ContentPack.id, levelId)`. That is what makes it impossible
for a word to point at a pack from a different level — the database rejects it
rather than trusting application code. A composite FK needs a matching unique
key on its target, which is why `ContentPack` carries `@@unique([id, levelId])`.
`Level` carries the same shape, `@@unique([id, tierId])`, but no relation
currently points at it.

Every type in the app is derived from this schema through Prisma's generated
types, so a column rename breaks compilation rather than production.

## Trade-offs

**Scope.** The brief asked for one well-considered screen in about four hours.
This repo also has an admin dashboard, an offline PWA, and a health endpoint.
The admin dashboard is the honest consequence of "the taxonomy is data" — that
claim is empty if there's no way to edit it — but it is more than was asked for,
and if I had to cut one thing to fit the brief, it would go first.

**The admin gate is not authentication.** A shared password from
`ADMIN_PASSWORD` exchanged for an httpOnly cookie. No accounts, no roles, no
audit trail. It exists so the dashboard is never reachable unauthenticated on a
deployed URL, and it fails closed: with no password set, `/admin` is open locally
and returns 404 everywhere else. It should be replaced before a second person
needs access.

**Startup seeding couples boot to the database.** It buys a working preview
branch with no manual step; it costs one `count` query per cold start, and it
means an empty production database would be filled with sample vocabulary. That
is the intended behaviour here, but it is a decision worth re-taking once real
content exists.

**The level colours are placeholders.** Twelve hex values chosen to sit on the
`#F2F1EC` ground, in `LEVEL_COLOURS` in `src/lib/seed.ts`. They are not brand
values.

**The service worker is hand-written.** No build plugin, which keeps the
dependency count down and the behaviour legible, but it means cache correctness
is my problem — hence `tests/service-worker.test.ts`.

## With more time

- Real auth for `/admin`, with accounts and an audit trail.
- Per-learner progress: which cards have been seen, spaced repetition over the
  `Word` rows rather than a fresh shuffle each session.
- Reorder-by-drag in the admin instead of typing position numbers.
- CI running `lint`, `tsc`, and the tests on every push.
- Precache the offline shell's stylesheet — today a first visit that goes offline
  before loading any styled page gets the fallback unstyled.
- Audio for each word, which is the obvious next column on `Word`.

## Structure

```
prisma/schema.prisma        Data model (Prisma 7)
data/seed.ts                Vocabulary, tier → level → content set

src/lib/env.ts              Environment + connection-string resolution
src/lib/db.ts               PrismaClient singleton; picks the driver adapter
src/lib/seed.ts             Seeds the curriculum when the database is empty
src/lib/flashcards.ts       Pure filtering, param encoding, shuffle
src/lib/flashcard-query.ts  The one curriculum query
src/instrumentation.ts      Server-start hook

src/app/page.tsx            Picker
src/app/viewer/             One card at a time
src/app/admin/              Curriculum editor
src/app/health/             JSON status endpoint

src/components/flashcards/  Picker, card, viewer
src/hooks/                  useStoredSelection — the remembered picker state
src/app/globals.css         Design tokens
public/sw.js                Service worker (hand-written)
```

## Environments

`src/lib/env.ts` resolves the environment from `VERCEL_ENV`, falling back to
`NODE_ENV`. **`DATABASE_URL` is required in every deployed environment** and the
app throws without it; locally it is optional and falls back to Docker.

`src/lib/db.ts` picks the Prisma driver adapter from the connection-string host,
not from `NODE_ENV` — any `*.neon.tech` URL uses Neon's serverless driver,
anything else uses node-postgres. So a production build pointed at local Docker
still works, and previews on Neon get the right driver with no extra flag.

In production two URLs are used: `DATABASE_URL` is Neon's **pooled** string,
used by the app, and `DIRECT_URL` is the **direct** one, used by the Prisma
CLI — which must not go through a pooler. Both are read at build time.

Set `ADMIN_PASSWORD` in Vercel, or `/admin` will 404 there.

## Admin dashboard

| Route | Edits |
|---|---|
| `/admin` | Tiers — name, position, whether the tier packs its levels |
| `/admin/tiers/[tierId]` | That tier's levels — name, colour, position, and which tier they belong to |
| `/admin/levels/[levelId]` | That level's packs, and its words grouped by pack |

Plain forms posting to Server Actions, so the dashboard works with JavaScript
disabled; failures come back as `?error=` on the page that submitted. Every
action re-checks access, because an action is a public endpoint whatever guards
the page. Deletes cascade and the button says how far — *"Delete tier, 4 levels
and 40 words"*.

## PWA and offline

`src/app/manifest.ts` plus a hand-written `public/sw.js`: network-first for
navigations falling back to the `/offline` shell, cache-first for
`/_next/static/*`, stale-while-revalidate for assets. Non-GET, cross-origin,
`/api/*`, `/health`, and RSC payloads are never cached, and neither is anything
the server marked `no-store`, `private`, or `Vary: Cookie` — otherwise a dynamic
page would sit in a device-wide cache and outlive the session that produced it.

The cache namespace is the build stamp, so `activate` retires the previous
deploy's caches instead of accumulating them forever. `experimental.useOffline`
keeps failed navigations pending and retrying rather than throwing, surfaced by
`OfflineBanner`.

Test offline behaviour against a production build; dev mode is not a reliable
reference.

## Tests

`npm test` runs unit tests over the pure flashcard logic, the stored picker
selection, the service worker, and the health endpoint's failure paths, plus a
smoke suite that boots the app and checks the routes that must never break. If a dev server is already running it reuses that one, so `npm run dev`
and `npm test` no longer collide.

Design is governed by [docs/design-bible.md](docs/design-bible.md) — brand
tokens live in `src/app/globals.css` and shadcn's semantic tokens are mapped onto
them, so components inherit the brand automatically.
