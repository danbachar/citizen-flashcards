import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { databaseUrl, deployEnv, isNeonUrl, isProduction } from "@/lib/env";

/**
 * Prisma 7 requires a driver adapter. Which one is decided by the connection
 * string, not by NODE_ENV, so a production build pointed at local Docker (or a
 * preview pointed at Neon) still does the right thing:
 *
 *   *.neon.tech  → @prisma/adapter-neon over Neon's serverless driver, which
 *                  suits short-lived serverless invocations on Vercel.
 *   anything else → @prisma/adapter-pg over node-postgres (local Docker).
 */
function createAdapter() {
  const url = databaseUrl();

  if (isNeonUrl(url)) {
    return new PrismaNeon({ connectionString: url });
  }

  if (isProduction) {
    console.warn(
      `[db] ${deployEnv} is not using a Neon connection string — falling back to the node-postgres adapter.`,
    );
  }

  return new PrismaPg({ connectionString: url });
}

const createPrismaClient = () =>
  new PrismaClient({
    adapter: createAdapter(),
    log: isProduction ? ["error"] : ["error", "warn"],
  });

// Reuse the client across HMR reloads in dev; production gets one per instance.
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (!isProduction) globalForPrisma.prisma = db;
