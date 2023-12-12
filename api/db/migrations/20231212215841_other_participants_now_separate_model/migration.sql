/*
  Warnings:

  - You are about to drop the column `otherParticipants` on the `Release` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Release" DROP COLUMN "otherParticipants";

-- CreateTable
CREATE TABLE "OtherParticipant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "releaseId" INTEGER NOT NULL,

    CONSTRAINT "OtherParticipant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OtherParticipant" ADD CONSTRAINT "OtherParticipant_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "Release"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
