/*
  Warnings:

  - You are about to drop the column `expired` on the `ApiToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ApiToken" DROP COLUMN "expired",
ADD COLUMN     "accessTokenExpired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "refreshTokenExpired" BOOLEAN NOT NULL DEFAULT false;
