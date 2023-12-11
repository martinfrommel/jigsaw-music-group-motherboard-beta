/*
  Warnings:

  - You are about to drop the column `iscUpcCode` on the `Release` table. All the data in the column will be lost.
  - The `artist` column on the `Release` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `secondaryGenre` column on the `Release` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `isrcCode` to the `Release` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `primaryGenre` on the `Release` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PrimaryGenre" AS ENUM ('Alternative', 'Blues', 'ChildrensMusic', 'Classical', 'Comedy', 'Country', 'Dance', 'Electronic', 'Folk', 'HipHopRap', 'Holiday', 'Jazz', 'Latin', 'NewAge', 'Pop', 'RBSoul', 'Reggae', 'Rock', 'SingerSongwriter', 'Soundtrack', 'World');

-- CreateEnum
CREATE TYPE "SecondaryGenre" AS ENUM ('AlternativeIndieRock', 'DanceBreakbeat', 'DanceElectroHouse', 'DanceHouse', 'DanceTechno', 'ElectronicAmbient', 'ElectronicElectronica', 'ElectronicExperimental', 'HipHopRapAlternativeRap', 'HolidayChristmas', 'LatinRegionalMexicano', 'LatinSalsa', 'PopAdultContemporary', 'PopKPop', 'PopPopRock', 'PopSoftRock', 'RBSoulFunk', 'RockMetal', 'WorldAfroBeat');

-- AlterTable
ALTER TABLE "Release" DROP COLUMN "iscUpcCode",
ADD COLUMN     "isrcCode" TEXT NOT NULL,
DROP COLUMN "artist",
ADD COLUMN     "artist" TEXT[],
DROP COLUMN "primaryGenre",
ADD COLUMN     "primaryGenre" "PrimaryGenre" NOT NULL,
DROP COLUMN "secondaryGenre",
ADD COLUMN     "secondaryGenre" "SecondaryGenre";
