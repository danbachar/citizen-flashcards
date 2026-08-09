/**
 * Runs once per server instance, before the first request. Seeds an empty
 * database so a fresh environment comes up with content rather than blank
 * screens. Never blocks boot: an unreachable database should surface as a
 * request-time error, not a server that refuses to start.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { seedIfEmpty } = await import("@/lib/seed");

  try {
    console.log(`[seed] ${(await seedIfEmpty()).summary}`);
  } catch (error) {
    console.error("[seed] failed at startup:", error);
  }
}
