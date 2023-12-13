/*
  Warnings:

  - Made the column `releaseDate` on table `Release` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Release" ADD COLUMN     "otherParticipants" TEXT[],
ALTER COLUMN "releaseDate" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "lastName" DROP NOT NULL;
