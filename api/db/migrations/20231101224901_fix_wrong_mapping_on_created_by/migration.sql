/*
  Warnings:

  - You are about to drop the column `created_by` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_created_by_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "created_by",
ADD COLUMN     "createdBy" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
