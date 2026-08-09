import "dotenv/config";
import { defineConfig } from "prisma/config";
import { LOCAL_DATABASE_URL } from "./src/lib/env";

/**
 * Migrations must not run through a connection pooler. Neon exposes both a
 * pooled URL (used by the app at runtime, via DATABASE_URL) and a direct one;
 * set DIRECT_URL to the direct connection when deploying migrations.
 * Locally there is no pooler, so DATABASE_URL is used as-is — and with neither
 * set, the CLI targets the Docker Postgres, matching src/lib/env.ts.
 */
const migrationUrl =
  process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? LOCAL_DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: migrationUrl,
  },
});
