/*
  Warnings:

  - You are about to drop the column `artist` on the `Release` table. All the data in the column will be lost.
  - You are about to drop the column `cLine` on the `Release` table. All the data in the column will be lost.
  - You are about to drop the column `explicitLyrics` on the `Release` table. All the data in the column will be lost.
  - You are about to drop the column `featuredArtist` on the `Release` table. All the data in the column will be lost.
  - You are about to drop the column `iscUpcCode` on the `Release` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `Release` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `Release` table. All the data in the column will be lost.
  - You are about to drop the column `length` on the `Release` table. All the data in the column will be lost.
  - You are about to drop the column `pLine` on the `Release` table. All the data in the column will be lost.
  - You are about to drop the column `previouslyReleased` on the `Release` table. All the data in the column will be lost.
  - You are about to drop the column `primaryGenre` on the `Release` table. All the data in the column will be lost.
  - You are about to drop the column `productTitle` on the `Release` table. All the data in the column will be lost.
  - You are about to drop the column `releaseDate` on the `Release` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryGenre` on the `Release` table. All the data in the column will be lost.
  - You are about to drop the column `songTitle` on the `Release` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Release" DROP COLUMN "artist",
DROP COLUMN "cLine",
DROP COLUMN "explicitLyrics",
DROP COLUMN "featuredArtist",
DROP COLUMN "iscUpcCode",
DROP COLUMN "label",
DROP COLUMN "language",
DROP COLUMN "length",
DROP COLUMN "pLine",
DROP COLUMN "previouslyReleased",
DROP COLUMN "primaryGenre",
DROP COLUMN "productTitle",
DROP COLUMN "releaseDate",
DROP COLUMN "secondaryGenre",
DROP COLUMN "songTitle";

-- CreateTable
CREATE TABLE "Metadata" (
    "releaseId" INTEGER NOT NULL,
    "songTitle" TEXT NOT NULL,
    "productTitle" TEXT,
    "artist" TEXT NOT NULL,
    "featuredArtist" TEXT,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "previouslyReleased" BOOLEAN NOT NULL,
    "language" TEXT NOT NULL,
    "primaryGenre" TEXT NOT NULL,
    "secondaryGenre" TEXT,
    "explicitLyrics" BOOLEAN NOT NULL,
    "iscUpcCode" TEXT NOT NULL,
    "pLine" TEXT,
    "cLine" TEXT,
    "length" INTEGER NOT NULL,

    CONSTRAINT "Metadata_pkey" PRIMARY KEY ("releaseId")
);

-- CreateTable
CREATE TABLE "Label" (
    "metadataId" INTEGER NOT NULL,
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Label_pkey" PRIMARY KEY ("metadataId")
);

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "Release"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Label" ADD CONSTRAINT "Label_metadataId_fkey" FOREIGN KEY ("metadataId") REFERENCES "Metadata"("releaseId") ON DELETE RESTRICT ON UPDATE CASCADE;
