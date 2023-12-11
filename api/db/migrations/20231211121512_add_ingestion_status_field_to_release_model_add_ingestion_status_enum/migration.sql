-- CreateEnum
CREATE TYPE "ingestionStatus" AS ENUM ('pending', 'processing', 'complete', 'error');

-- AlterTable
ALTER TABLE "Release" ADD COLUMN     "ingestionStatus" "ingestionStatus" NOT NULL DEFAULT 'pending';
