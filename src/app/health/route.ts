/**
 * System health as JSON.
 *
 * The smoke test asserts against this rather than against page copy: the pages
 * render seeded content now, so their text is data, but health is a contract.
 * A database that will not answer is reported, never thrown — describing the
 * failure is the endpoint's entire job.
 */
import { deployEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = performance.now();

  try {
    // Imported here, not at module scope: the Prisma client resolves its
    // connection string as it is constructed, so a deployment missing
    // DATABASE_URL would crash this route on load and report nothing. Inside
    // the try, that misconfiguration is just another degraded answer.
    const { db } = await import("@/lib/db");

    const [tiers, levels, contentPacks, words] = await Promise.all([
      db.tier.count(),
      db.level.count(),
      db.contentPack.count(),
      db.word.count(),
    ]);

    return json({
      status: "ok",
      env: deployEnv,
      database: {
        reachable: true,
        latencyMs: Math.round(performance.now() - startedAt),
      },
      curriculum: { tiers, levels, contentPacks, words },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return json(
      {
        status: "degraded",
        env: deployEnv,
        database: {
          reachable: false,
          error: error instanceof Error ? error.message : String(error),
        },
        timestamp: new Date().toISOString(),
      },
      503,
    );
  }
}

function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    // A cached health check reports health that no longer holds.
    headers: { "cache-control": "no-store" },
  });
}
