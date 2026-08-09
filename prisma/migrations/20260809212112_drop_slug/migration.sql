-- Drop the slug columns.
--
-- Nothing read them: the learner UI filters on ids, admin routes are id-based,
-- and the seed only ever creates. They were write-only fields.
--
-- Their unique constraints were doing real work, though — they were what kept
-- two tiers or levels from sharing a name. That guard moves onto `name`.

ALTER TABLE "tiers" DROP COLUMN "slug";
ALTER TABLE "levels" DROP COLUMN "slug";

CREATE UNIQUE INDEX "tiers_name_key" ON "tiers"("name");
CREATE UNIQUE INDEX "levels_name_key" ON "levels"("name");
