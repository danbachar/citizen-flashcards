/**
 * Environment resolution, in one place.
 *
 * Local development  → Postgres in Docker (docker-compose.yml)
 * Preview/Production → Neon (set DATABASE_URL in the Vercel dashboard)
 *
 * Vercel sets VERCEL_ENV to "production" | "preview" | "development"; it is
 * absent locally, where NODE_ENV decides instead.
 */

export type DeployEnv = "development" | "preview" | "production";

export const deployEnv: DeployEnv =
  (process.env.VERCEL_ENV as DeployEnv | undefined) ??
  (process.env.NODE_ENV === "production" ? "production" : "development");

export const isProduction = deployEnv === "production";
export const isPreview = deployEnv === "preview";

/**
 * Runtime connection string. In production this is Neon's *pooled* URL
 * (the one containing `-pooler`); migrations use `DIRECT_URL` instead.
 */
export function databaseUrl(): string {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error(
      deployEnv === "development"
        ? "DATABASE_URL is not set. Copy .env.example to .env and run `npm run db:up`."
        : `DATABASE_URL is not set for the ${deployEnv} environment. Add it in Vercel → Settings → Environment Variables.`,
    );
  }

  return url;
}

/** Neon hostnames are self-describing, so the driver choice needs no extra flag. */
export function isNeonUrl(url: string): boolean {
  try {
    return new URL(url).hostname.endsWith(".neon.tech");
  } catch {
    return false;
  }
}
