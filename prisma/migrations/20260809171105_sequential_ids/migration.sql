/*
  Warnings:

  - The primary key for the `content_packs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `content_packs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `levels` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `levels` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `tiers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `tiers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `words` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `words` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `contentPackId` column on the `words` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `levelId` on the `content_packs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tierId` on the `levels` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `levelId` on the `words` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "content_packs" DROP CONSTRAINT "content_packs_levelId_fkey";

-- DropForeignKey
ALTER TABLE "levels" DROP CONSTRAINT "levels_tierId_fkey";

-- DropForeignKey
ALTER TABLE "words" DROP CONSTRAINT "words_contentPackId_levelId_fkey";

-- DropForeignKey
ALTER TABLE "words" DROP CONSTRAINT "words_levelId_fkey";

-- AlterTable
ALTER TABLE "content_packs" DROP CONSTRAINT "content_packs_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "levelId",
ADD COLUMN     "levelId" INTEGER NOT NULL,
ADD CONSTRAINT "content_packs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "levels" DROP CONSTRAINT "levels_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "tierId",
ADD COLUMN     "tierId" INTEGER NOT NULL,
ADD CONSTRAINT "levels_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tiers" DROP CONSTRAINT "tiers_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "tiers_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "words" DROP CONSTRAINT "words_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "levelId",
ADD COLUMN     "levelId" INTEGER NOT NULL,
DROP COLUMN "contentPackId",
ADD COLUMN     "contentPackId" INTEGER,
ADD CONSTRAINT "words_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "content_packs_levelId_idx" ON "content_packs"("levelId");

-- CreateIndex
CREATE UNIQUE INDEX "content_packs_id_levelId_key" ON "content_packs"("id", "levelId");

-- CreateIndex
CREATE UNIQUE INDEX "content_packs_levelId_position_key" ON "content_packs"("levelId", "position");

-- CreateIndex
CREATE INDEX "levels_tierId_idx" ON "levels"("tierId");

-- CreateIndex
CREATE UNIQUE INDEX "levels_id_tierId_key" ON "levels"("id", "tierId");

-- CreateIndex
CREATE UNIQUE INDEX "levels_tierId_position_key" ON "levels"("tierId", "position");

-- CreateIndex
CREATE INDEX "words_levelId_idx" ON "words"("levelId");

-- CreateIndex
CREATE INDEX "words_contentPackId_idx" ON "words"("contentPackId");

-- AddForeignKey
ALTER TABLE "levels" ADD CONSTRAINT "levels_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "tiers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_packs" ADD CONSTRAINT "content_packs_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "words" ADD CONSTRAINT "words_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "words" ADD CONSTRAINT "words_contentPackId_levelId_fkey" FOREIGN KEY ("contentPackId", "levelId") REFERENCES "content_packs"("id", "levelId") ON DELETE CASCADE ON UPDATE CASCADE;
