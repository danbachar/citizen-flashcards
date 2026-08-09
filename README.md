# Citizen Café

Next.js (App Router) · Postgres in Docker · Prisma · Tailwind CSS · shadcn/ui · deployed on Vercel.

Design is governed by [docs/design-bible.md](docs/design-bible.md) — read it before adding UI.

## Getting started

```bash
cp .env.example .env     # already present locally
npm install
npm run db:up            # Postgres 17 in Docker on :5432
npm run dev              # http://localhost:3000
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Next dev server |
| `npm run build` | `prisma migrate deploy` + `prisma generate` + `next build` |
| `npm test` | Smoke tests (boots the app, checks the core routes) |
| `npm run db:up` / `db:down` | Start / stop the Postgres container |
| `npm run db:reset` | Drop the volume and start fresh |
| `npm run db:migrate` | `prisma migrate dev` (create + apply a migration) |
| `npm run db:deploy` | `prisma migrate deploy` (apply migrations in CI/prod) |
| `npm run db:studio` | Prisma Studio |

## Structure

```
prisma/schema.prisma        Data model (Prisma 7, prisma-client generator)
prisma.config.ts            Prisma CLI config; prefers DIRECT_URL for migrations
src/lib/env.ts              Environment + connection-string resolution
src/lib/db.ts               PrismaClient singleton; picks the driver adapter
src/app/globals.css         Design tokens — brand palette, fonts, spacing, radii
src/components/layout/      Container, Section (layout primitives, bible §8)
src/types/                  Reference to React's canary type declarations
src/components/pwa/         Service worker registration, offline banner
src/app/offline/            Offline fallback shell served by the service worker
src/app/apple-icon.png      Apple touch icon (app-dir file convention, not public/)
public/sw.js                Service worker (hand-written, no build plugin)
tests/                      Smoke tests
src/generated/prisma/       Generated client (gitignored; created by prisma generate)
```

## Design system

Brand tokens live in `src/app/globals.css` and shadcn's semantic tokens are mapped onto
them, so components inherit the brand automatically.

- `surface.base` `#F2F1EC` is the page ground — never pure white site-wide.
- `brand.yellow` `#F9E24C` is the CTA/accent, with charcoal text on top (never white).
- `brand.charcoal` `#373230` is text and the dark bands; `Section tone="dark"` renders one.
- **Assistant** is the system font (UI, body, forms); the serif is the editorial voice
  (h1–h3). Fedra is licensed — `--font-fedra` prefers it and falls back to a Hebrew/Latin
  serif until the real webfont is added.
- Spacing tiers (`compact` / `regular` / `spacious` / `feature`) and `rounded-signature`
  for the signature curve.

## Environments

| | Database | Driver adapter | Where config lives |
|---|---|---|---|
| Local dev | Postgres 17 in Docker | `@prisma/adapter-pg` | `.env` |
| Preview | Neon (branch DB) | `@prisma/adapter-neon` | Vercel env vars |
| Production | Neon | `@prisma/adapter-neon` | Vercel env vars |

`src/lib/env.ts` resolves the environment from `VERCEL_ENV`, falling back to
`NODE_ENV` locally. `src/lib/db.ts` picks the driver adapter from the **connection
string host**, not from `NODE_ENV` — any `*.neon.tech` URL uses Neon's serverless
driver, anything else uses node-postgres. A production build pointed at local
Docker therefore still works (it logs a warning), and previews on Neon get the
right driver without extra flags.

Two URLs are used in production:

- `DATABASE_URL` — Neon's **pooled** string (host contains `-pooler`). Used by the app.
- `DIRECT_URL` — Neon's **direct** string. Used only by the Prisma CLI, because
  migrations must not run through a connection pooler. `prisma.config.ts` prefers
  it and falls back to `DATABASE_URL` locally.

## PWA and offline

- `src/app/manifest.ts` → `/manifest.webmanifest`, with 192/512 icons in `public/`
  (the 512 doubles as the maskable icon). The Apple touch icon is
  `src/app/apple-icon.png` — that is an app-directory file convention, and an
  `apple-icon.png` sitting in `public/` emits no `<link>` at all.
- `viewport` in `src/app/layout.tsx` sets `viewport-fit=cover`, so anything later
  pinned to a screen edge must pad with `env(safe-area-inset-*)` itself.
- `public/sw.js` is a hand-written service worker — no build plugin. Strategies:
  network-first for navigations (falling back to the runtime cache, then the
  `/offline` shell), cache-first for `/_next/static/*`, stale-while-revalidate for
  images, fonts, styles, and scripts. Non-GET requests, `/api/*`, RSC payloads, and
  cross-origin requests are never cached.
- It registers in production only (`src/components/pwa/service-worker-register.tsx`);
  a live worker in dev serves stale bundles.
- `experimental.useOffline` is enabled in `next.config.ts`, so failed navigations
  and Server Actions stay pending and retry when the connection returns instead of
  throwing. `OfflineBanner` surfaces that state via the `useOffline` hook.
- `next.config.ts` also sets `nosniff`, `X-Frame-Options: DENY`, a referrer policy,
  and a no-store + CSP header on `/sw.js`.

Test offline behaviour against a production build (`npm run build && npm start`) —
dev mode is not a reliable reference. Then use DevTools → Network → Offline.

## Tests

`npm test` boots the app on a random port and checks the routes that must never
break: the `/offline` shell, `/manifest.webmanifest`, the Apple touch icon link,
`/sw.js` and its no-store headers, the security headers, and `/` rendering
through Prisma. The home-page check is skipped when `DATABASE_URL` is unset;
everything else runs in a bare checkout.

Next allows one dev server per project, so stop `npm run dev` before running the
tests — otherwise the boot fails with "Another next dev server is already
running."