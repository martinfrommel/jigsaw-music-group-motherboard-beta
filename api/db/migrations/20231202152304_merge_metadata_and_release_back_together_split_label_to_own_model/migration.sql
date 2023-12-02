/*
  Warnings:

  - The primary key for the `Label` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `metadataId` on the `Label` table. All the data in the column will be lost.
  - You are about to drop the `Metadata` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `artist` to the `Release` table without a default value. This is not possible if the table is not empty.
  - Added the required column `explicitLyrics` to the `Release` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iscUpcCode` to the `Release` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `Release` table without a default value. This is not possible if the table is not empty.
  - Added the required column `length` to the `Release` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previouslyReleased` to the `Release` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primaryGenre` to the `Release` table without a default value. This is not possible if the table is not empty.
  - Added the required column `releaseDate` to the `Release` table without a default value. This is not possible if the table is not empty.
  - Added the required column `songTitle` to the `Release` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Label" DROP CONSTRAINT "Label_metadataId_fkey";

-- DropForeignKey
ALTER TABLE "Metadata" DROP CONSTRAINT "Metadata_releaseId_fkey";

-- AlterTable
ALTER TABLE "Label" DROP CONSTRAINT "Label_pkey",
DROP COLUMN "metadataId",
ADD CONSTRAINT "Label_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Release" ADD COLUMN     "artist" TEXT NOT NULL,
ADD COLUMN     "cLine" TEXT,
ADD COLUMN     "explicitLyrics" BOOLEAN NOT NULL,
ADD COLUMN     "featuredArtist" TEXT,
ADD COLUMN     "iscUpcCode" TEXT NOT NULL,
ADD COLUMN     "labelId" INTEGER,
ADD COLUMN     "language" TEXT NOT NULL,
ADD COLUMN     "length" INTEGER NOT NULL,
ADD COLUMN     "pLine" TEXT,
ADD COLUMN     "previouslyReleased" BOOLEAN NOT NULL,
ADD COLUMN     "primaryGenre" TEXT NOT NULL,
ADD COLUMN     "productTitle" TEXT,
ADD COLUMN     "releaseDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "secondaryGenre" TEXT,
ADD COLUMN     "songTitle" TEXT NOT NULL;

-- DropTable
DROP TABLE "Metadata";

-- AddForeignKey
ALTER TABLE "Release" ADD CONSTRAINT "Release_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label"("id") ON DELETE SET NULL ON UPDATE CASCADE;
