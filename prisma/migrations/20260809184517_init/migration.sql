-- CreateTable
CREATE TABLE "tiers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "hasContentPacks" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "levels" (
    "id" SERIAL NOT NULL,
    "tierId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "colour" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_packs" (
    "id" SERIAL NOT NULL,
    "levelId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_packs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "words" (
    "id" SERIAL NOT NULL,
    "levelId" INTEGER NOT NULL,
    "contentPackId" INTEGER,
    "hebrew" TEXT NOT NULL,
    "english" TEXT NOT NULL,
    "transliteration" TEXT,
    "note" TEXT,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "words_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tiers_name_key" ON "tiers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tiers_position_key" ON "tiers"("position");

-- CreateIndex
CREATE UNIQUE INDEX "levels_name_key" ON "levels"("name");

-- CreateIndex
CREATE INDEX "levels_tierId_idx" ON "levels"("tierId");

-- CreateIndex
CREATE UNIQUE INDEX "levels_id_tierId_key" ON "levels"("id", "tierId");

-- CreateIndex
CREATE UNIQUE INDEX "levels_tierId_position_key" ON "levels"("tierId", "position");

-- CreateIndex
CREATE INDEX "content_packs_levelId_idx" ON "content_packs"("levelId");

-- CreateIndex
CREATE UNIQUE INDEX "content_packs_id_levelId_key" ON "content_packs"("id", "levelId");

-- CreateIndex
CREATE UNIQUE INDEX "content_packs_levelId_position_key" ON "content_packs"("levelId", "position");

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
