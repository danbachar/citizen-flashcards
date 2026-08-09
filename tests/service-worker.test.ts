import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { describe, expect, it } from "vitest";

/**
 * `public/sw.js` ships unbundled, so nothing else type-checks or exercises it,
 * and both rules below fail silently. Evaluated here in a VM with a minimal
 * worker global so its functions can be called directly.
 */

const SOURCE = readFileSync(
  fileURLToPath(new URL("../public/sw.js", import.meta.url)),
  "utf8",
);

/** Evaluates the worker as if registered at `scriptUrl`. */
function loadWorker(scriptUrl: string) {
  const context: Record<string, unknown> = {
    self: {
      location: { href: scriptUrl, origin: new URL(scriptUrl).origin },
      addEventListener: () => {},
      skipWaiting: () => {},
      clients: { claim: () => {} },
    },
    caches: {
      open: async () => ({ put: () => {}, match: async () => undefined }),
      keys: async () => [],
      delete: async () => true,
      match: async () => undefined,
    },
    URL,
    Response: { error: () => "network-error" },
    fetch: async () => ({ ok: true }),
    console,
  };
  vm.createContext(context);
  vm.runInContext(SOURCE, context);

  return {
    evaluate: <T>(expression: string): T =>
      vm.runInContext(expression, context) as T,
  };
}

/** A response carrying only the headers a caching decision depends on. */
function responseWith(headers: Record<string, string>) {
  const lookup = new Map(
    Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]),
  );
  return {
    ok: true,
    headers: { get: (name: string) => lookup.get(name.toLowerCase()) ?? null },
  };
}

const worker = loadWorker("https://citizen.example/sw.js?v=abc123def456");

describe("cache namespace", () => {
  it("takes its version from the registration query string", () => {
    expect(worker.evaluate("VERSION")).toBe("abc123def456");
    expect(worker.evaluate("RUNTIME")).toBe("citizen-runtime-abc123def456");
    expect(worker.evaluate("PRECACHE")).toBe("citizen-precache-abc123def456");
  });

  it("changes namespace when the build stamp changes, so activate can evict", () => {
    const next = loadWorker("https://citizen.example/sw.js?v=zzz999");
    expect(next.evaluate("RUNTIME")).not.toBe(worker.evaluate("RUNTIME"));
  });

  it("still names its caches when registered with no stamp", () => {
    const bare = loadWorker("https://citizen.example/sw.js");
    expect(bare.evaluate("RUNTIME")).toBe("citizen-runtime-unversioned");
  });
});

describe("isStorable", () => {
  // Called through `evaluate`, so the function under test is the shipped one.
  function isStorable(headers: Record<string, string>): boolean {
    const fn = worker.evaluate<(response: unknown) => boolean>("isStorable");
    return fn(responseWith(headers));
  }

  it("stores an ordinary cacheable response", () => {
    expect(isStorable({ "Cache-Control": "public, max-age=3600" })).toBe(true);
    expect(isStorable({})).toBe(true);
  });

  it("refuses what Next sends for a dynamic page", () => {
    // The exact header Next serves with `export const dynamic = "force-dynamic"`.
    expect(
      isStorable({
        "Cache-Control": "private, no-cache, no-store, max-age=0, must-revalidate",
      }),
    ).toBe(false);
  });

  it("refuses no-store and private independently", () => {
    expect(isStorable({ "Cache-Control": "no-store" })).toBe(false);
    expect(isStorable({ "Cache-Control": "private, max-age=60" })).toBe(false);
  });

  it("does not mistake no-cache for no-store", () => {
    // `no-cache` means revalidate, not "never write to disk".
    expect(isStorable({ "Cache-Control": "no-cache" })).toBe(true);
  });

  it("refuses anything varying on the cookie", () => {
    expect(isStorable({ Vary: "Cookie" })).toBe(false);
    expect(isStorable({ Vary: "Accept-Encoding, Cookie" })).toBe(false);
    expect(isStorable({ Vary: "*" })).toBe(false);
  });

  it("allows a vary that has nothing to do with identity", () => {
    expect(isStorable({ Vary: "Accept-Encoding" })).toBe(true);
  });
});

describe("isCacheable", () => {
  function isCacheable(url: string, method = "GET"): boolean {
    const fn = worker.evaluate<(request: unknown, url: URL) => boolean>(
      "isCacheable",
    );
    return fn({ method }, new URL(url));
  }

  it("caches ordinary same-origin GETs", () => {
    expect(isCacheable("https://citizen.example/offline")).toBe(true);
  });

  it("never caches mutations, other origins, the API, health, or RSC payloads", () => {
    expect(isCacheable("https://citizen.example/", "POST")).toBe(false);
    expect(isCacheable("https://elsewhere.example/thing")).toBe(false);
    expect(isCacheable("https://citizen.example/api/anything")).toBe(false);
    expect(isCacheable("https://citizen.example/health")).toBe(false);
    expect(isCacheable("https://citizen.example/viewer?_rsc=abc")).toBe(false);
  });
});
