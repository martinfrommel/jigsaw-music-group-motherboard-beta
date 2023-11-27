/*
  Warnings:

  - You are about to drop the column `labelId` on the `Release` table. All the data in the column will be lost.
  - You are about to drop the column `labelId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Label` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Release" DROP CONSTRAINT "Release_labelId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_labelId_fkey";

-- AlterTable
ALTER TABLE "ApiToken" ADD COLUMN     "expired" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Release" DROP COLUMN "labelId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "labelId";

-- DropTable
DROP TABLE "Label";
