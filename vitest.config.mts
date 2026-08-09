import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Match the "@/*" paths mapping in tsconfig.json, so tests import app code
  // the same way the app does.
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    // Only our own tests — the default glob would also sweep .next/ and
    // vendored agent skills.
    include: ["tests/**/*.test.ts"],
    // One Next dev server per run; parallel files would race for it.
    fileParallelism: false,
    hookTimeout: 180_000,
  },
});
