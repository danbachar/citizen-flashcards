-- Make `colour` required on levels.
--
-- Existing rows were created before the column was mandatory, so backfill them
-- first: a bare `SET NOT NULL` fails while any NULL remains. Values are keyed
-- by slug and match prisma/seed.ts; anything unrecognised falls back to a
-- neutral grey so the migration can never fail on an unexpected level.

UPDATE "levels"
SET "colour" = CASE "slug"
  WHEN 'red'         THEN '#D6483B'
  WHEN 'orange'      THEN '#E8792B'
  WHEN 'pink'        THEN '#E0709A'
  WHEN 'yellow'      THEN '#EFC93D'
  WHEN 'light-blue'  THEN '#7EC4E0'
  WHEN 'blue'        THEN '#2F6FB5'
  WHEN 'lime'        THEN '#A8C93A'
  WHEN 'green'       THEN '#4E9A51'
  WHEN 'dark-green'  THEN '#2E6B45'
  WHEN 'turquoise'   THEN '#3FB3A6'
  WHEN 'indigo'      THEN '#4B4B9E'
  WHEN 'purple'      THEN '#7A4E9B'
  ELSE '#B3ACA6'
END
WHERE "colour" IS NULL;

-- AlterTable
ALTER TABLE "levels" ALTER COLUMN "colour" SET NOT NULL;
