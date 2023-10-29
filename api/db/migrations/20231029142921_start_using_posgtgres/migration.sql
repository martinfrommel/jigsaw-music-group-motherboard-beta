-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin', 'moderator');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "picture" TEXT DEFAULT 'https://avatars.dicebear.com/api/male/username.svg',
    "hashedPassword" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiresAt" TIMESTAMP(3),
    "signUpToken" TEXT,
    "signUpTokenExpiresAt" TIMESTAMP(3),
    "roles" "Role" NOT NULL DEFAULT 'user',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Release" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "songMasterReference" TEXT NOT NULL,
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
    "isicUpcCode" TEXT NOT NULL,
    "pLine" TEXT,
    "cLine" TEXT,
    "length" INTEGER NOT NULL,

    CONSTRAINT "Release_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_signUpToken_key" ON "User"("signUpToken");

-- AddForeignKey
ALTER TABLE "Release" ADD CONSTRAINT "Release_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
