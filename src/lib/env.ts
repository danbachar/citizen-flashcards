/**
 * Environment resolution. Local development uses the Docker Postgres,
 * preview and production use Neon. Vercel sets VERCEL_ENV; locally it is
 * absent and NODE_ENV decides.
 */

export type DeployEnv = "development" | "preview" | "production";

export const deployEnv: DeployEnv =
  (process.env.VERCEL_ENV as DeployEnv | undefined) ??
  (process.env.NODE_ENV === "production" ? "production" : "development");

export const isProduction = deployEnv === "production";

/** Must match docker-compose.yml. */
export const LOCAL_DATABASE_URL =
  "postgresql://citizen:citizen@localhost:5432/citizen?schema=public";

/**
 * Neon's *pooled* URL in production; migrations use `DIRECT_URL` instead.
 * Deployed environments must set it — silently falling back to a local database
 * is worse than failing. Locally it is optional, so a fresh clone runs after
 * `npm run db:up`.
 */
export function databaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (url) return url;

  if (deployEnv === "development") return LOCAL_DATABASE_URL;

  throw new Error(
    `DATABASE_URL is not set for the ${deployEnv} environment. ` +
      "Add it in Vercel → Settings → Environment Variables.",
  );
}

/** Neon hostnames are self-describing, so the driver needs no extra flag. */
export function isNeonUrl(url: string): boolean {
  try {
    return new URL(url).hostname.endsWith(".neon.tech");
  } catch {
    return false;
  }
}
