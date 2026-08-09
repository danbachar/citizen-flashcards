// `next dev` reads .env on its own; this is so the skip check below sees it too.
import "dotenv/config";
import { spawn, type ChildProcess } from "node:child_process";
import { createServer } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

/**
 * Smoke tests: boot the real app and prove the routes that must never be broken
 * still answer. This is a "does it start" check, not a unit test suite — it
 * catches the failures that only appear once Next, the service worker headers,
 * and the Prisma client are wired together.
 *
 * The page tests need a reachable database (`npm run db:up`). The /health
 * check runs either way: it asserts against whichever state the endpoint
 * reports, so a bare checkout still makes a real assertion.
 */

const BOOT_TIMEOUT_MS = 180_000;

let server: ChildProcess;
let baseUrl: string;
let bootLog = "";

/** Ask the OS for a free port so a running `npm run dev` never collides. */
function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.on("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address();
      if (typeof address === "string" || address === null) {
        probe.close();
        reject(new Error("could not determine a free port"));
        return;
      }
      const { port } = address;
      probe.close(() => resolve(port));
    });
  });
}

/** Poll until the server answers at all — readiness, not correctness. */
async function waitForServer(url: string, deadline: number): Promise<void> {
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(
        `next dev exited with code ${server.exitCode} before serving:\n${bootLog}`,
      );
    }
    try {
      await fetch(url, { signal: AbortSignal.timeout(5_000) });
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw new Error(`next dev did not answer within the timeout:\n${bootLog}`);
}

/**
 * Next allows one dev server per project directory, so spawning a second one
 * while `npm run dev` is up just fails. Reuse the running one instead — it
 * serves the same working tree, which is exactly what these tests check.
 *
 * Identified by /health's shape rather than by the port alone, so an unrelated
 * app on 3000 is not mistaken for this one.
 */
async function runningServer(): Promise<string | null> {
  const candidate = `http://127.0.0.1:${process.env.PORT ?? 3000}`;

  try {
    const response = await fetch(`${candidate}/health`, {
      signal: AbortSignal.timeout(3_000),
    });
    const body = await response.json();
    return typeof body?.database === "object" ? candidate : null;
  } catch {
    return null;
  }
}

beforeAll(async () => {
  const running = await runningServer();
  if (running) {
    baseUrl = running;
    return;
  }

  const port = await freePort();
  baseUrl = `http://127.0.0.1:${port}`;

  server = spawn(
    "node_modules/.bin/next",
    ["dev", "--port", String(port), "--hostname", "127.0.0.1"],
    // Own process group, so killing it takes the compiler workers with it.
    { detached: true, stdio: ["ignore", "pipe", "pipe"] },
  );

  const record = (chunk: Buffer) => {
    bootLog += chunk.toString();
  };
  server.stdout?.on("data", record);
  server.stderr?.on("data", record);

  await waitForServer(baseUrl, Date.now() + BOOT_TIMEOUT_MS);
}, BOOT_TIMEOUT_MS);

// Only ever kills a server this file started; a reused one is left alone.
afterAll(() => {
  if (server?.pid && server.exitCode === null) {
    try {
      process.kill(-server.pid, "SIGTERM");
    } catch {
      server.kill("SIGTERM");
    }
  }
});

describe("the app starts and serves its core routes", () => {
  it("renders the offline shell without touching the database", async () => {
    const response = await fetch(`${baseUrl}/offline`);
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain("offline");
    expect(html).toContain("<h1");
  }, 60_000);

  it("emits the apple-touch-icon from the app directory", async () => {
    // Guards the file-convention placement: an apple-icon left in `public/`
    // is served but produces no <link>, so iOS installs get a screenshot.
    const html = await fetch(`${baseUrl}/offline`).then((r) => r.text());
    expect(html).toContain("apple-touch-icon");

    const icon = await fetch(`${baseUrl}/apple-icon.png`);
    expect(icon.status).toBe(200);
    expect(icon.headers.get("content-type")).toContain("image/png");
  }, 60_000);

  it("serves the web app manifest", async () => {
    const response = await fetch(`${baseUrl}/manifest.webmanifest`);
    const manifest = await response.json();

    expect(response.status).toBe(200);
    expect(manifest.name).toBe("Citizen Café");
    expect(manifest.start_url).toBe("/");
    expect(manifest.icons.length).toBeGreaterThan(0);
  }, 60_000);

  it("serves the service worker uncached", async () => {
    const response = await fetch(`${baseUrl}/sw.js`);

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(await response.text()).toContain("citizen-precache");
  }, 60_000);

  it("applies the security headers", async () => {
    const response = await fetch(`${baseUrl}/offline`);

    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(response.headers.get("x-frame-options")).toBe("DENY");
  }, 60_000);

  it(
    "reports its database state at /health",
    async () => {
      const response = await fetch(`${baseUrl}/health`);
      const body = await response.json();

      expect(response.headers.get("cache-control")).toContain("no-store");

      // Keyed on reachability, not on DATABASE_URL: development falls back to
      // the local Docker URL, so an unset variable no longer means no database.
      if (body.database.reachable) {
        expect(response.status).toBe(200);
        expect(body.status).toBe("ok");
        // Counts, not exact numbers: the seed file grows, an empty database is
        // still the failure worth catching.
        expect(body.curriculum.tiers).toBeGreaterThan(0);
        expect(body.curriculum.levels).toBeGreaterThan(0);
        expect(body.curriculum.words).toBeGreaterThan(0);
      } else {
        expect(response.status).toBe(503);
        expect(body.status).toBe("degraded");
      }
    },
    60_000,
  );

  it.skipIf(!process.env.DATABASE_URL)(
    "renders the picker and the viewer through Prisma",
    async () => {
      const picker = await fetch(`${baseUrl}/`);
      expect(picker.status).toBe(200);
      expect(await picker.text()).toContain("Flashcards");

      // The viewer takes its set from the URL, so a hand-written one must work.
      const viewer = await fetch(`${baseUrl}/viewer?level=red`);
      expect(viewer.status).toBe(200);
    },
    60_000,
  );
});
