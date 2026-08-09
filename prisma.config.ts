import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Migrations must not run through a connection pooler. Neon exposes both a
 * pooled URL (used by the app at runtime, via DATABASE_URL) and a direct one;
 * set DIRECT_URL to the direct connection when deploying migrations.
 * Locally there is no pooler, so DATABASE_URL is used as-is.
 */
const migrationUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: migrationUrl,
  },
});
