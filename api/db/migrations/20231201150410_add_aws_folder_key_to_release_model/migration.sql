/*
  Warnings:

  - Added the required column `AWSFolderKey` to the `Release` table without a default value. This is not possible if the table is not empty.
  - Added the required column `songArtworkReference` to the `Release` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Release` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Release" ADD COLUMN     "AWSFolderKey" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "label" TEXT DEFAULT 'JIGSAW',
ADD COLUMN     "songArtworkReference" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
