/** CLI entry point — `npm run db:seed`, and `prisma migrate dev` / `reset`. */
import "dotenv/config";
import { db } from "@/lib/db";
import { seedIfEmpty } from "@/lib/seed";

seedIfEmpty()
  .then((result) => console.log(`[seed] ${result.summary}`))
  .catch((error) => {
    console.error("[seed] failed:", error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
