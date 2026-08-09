import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Only our own tests — the default glob would also sweep .next/ and
    // vendored agent skills.
    include: ["tests/**/*.test.ts"],
    // One Next dev server per run; parallel files would race for it.
    fileParallelism: false,
    hookTimeout: 180_000,
  },
});
