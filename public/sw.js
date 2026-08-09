/**
 * Citizen Café service worker.
 *
 * Strategies, by request kind:
 *   navigations        network-first, then runtime cache, then the /offline shell
 *   /_next/static/*    cache-first (content-hashed, immutable)
 *   images + fonts     stale-while-revalidate
 *
 * Never cached: non-GET (Server Actions, mutations), cross-origin, /api,
 * /health, and RSC payload requests — those must stay fresh or fail loudly.
 * Nor is anything the server marked `no-store` or `private`; see `isStorable`.
 */

/**
 * Cache namespace, from the `?v=` the page registered with. A new value per
 * deploy is what lets `activate` evict the previous deploy's caches.
 */
const VERSION =
  new URL(self.location.href).searchParams.get("v") || "unversioned";
const PRECACHE = `citizen-precache-${VERSION}`;
const RUNTIME = `citizen-runtime-${VERSION}`;
const OFFLINE_URL = "/offline";

const PRECACHE_URLS = [OFFLINE_URL, "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== PRECACHE && key !== RUNTIME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isCacheable(request, url) {
  return (
    request.method === "GET" &&
    url.origin === self.location.origin &&
    !url.pathname.startsWith("/api/") &&
    // A cached health check would report health that no longer holds.
    url.pathname !== "/health" &&
    !url.searchParams.has("_rsc")
  );
}

/**
 * Honours the server's caching decision: storing a `no-store` page leaves one
 * visitor's HTML in a device-wide cache that outlives their session.
 * `Set-Cookie` is a forbidden response-header name and invisible here, so
 * `Vary: Cookie` is the signal that a response was personalised.
 */
function isStorable(response) {
  const control = response.headers.get("Cache-Control") ?? "";
  if (/\bno-store\b|\bprivate\b/i.test(control)) return false;

  const vary = response.headers.get("Vary") ?? "";
  if (vary.trim() === "*") return false;
  if (vary.split(",").some((header) => header.trim().toLowerCase() === "cookie"))
    return false;

  return true;
}

async function networkFirst(request) {
  const cache = await caches.open(RUNTIME);
  try {
    const response = await fetch(request);
    if (response.ok && isStorable(response)) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    const offline = await caches.match(OFFLINE_URL, { cacheName: PRECACHE });
    if (offline) return offline;
    return Response.error();
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok && isStorable(response)) {
    const cache = await caches.open(RUNTIME);
    cache.put(request, response.clone());
  }
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response.ok && isStorable(response)) {
        cache.put(request, response.clone());
      }
      return response;
    })
    // Nothing cached and the network down: a synthetic network error.
    .catch(() => cached ?? Response.error());
  return cached || network;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (!isCacheable(request, url)) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (["image", "font", "style", "script"].includes(request.destination)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
