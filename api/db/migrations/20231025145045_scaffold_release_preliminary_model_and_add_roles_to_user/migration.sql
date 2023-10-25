-- CreateTable
CREATE TABLE "Release" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "songMasterReference" TEXT NOT NULL,
    "songTitle" TEXT NOT NULL,
    "productTitle" TEXT,
    "artist" TEXT NOT NULL,
    "featuredArtist" TEXT,
    "releaseDate" DATETIME NOT NULL,
    "previouslyReleased" BOOLEAN NOT NULL,
    "language" TEXT NOT NULL,
    "primaryGenre" TEXT NOT NULL,
    "secondaryGenre" TEXT,
    "explicitLyrics" BOOLEAN NOT NULL,
    "isicUpcCode" TEXT NOT NULL,
    "pLine" TEXT,
    "cLine" TEXT,
    "length" INTEGER NOT NULL,
    CONSTRAINT "Release_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiresAt" DATETIME,
    "roles" TEXT NOT NULL DEFAULT 'user'
);
INSERT INTO "new_User" ("email", "firstName", "hashedPassword", "id", "lastName", "resetToken", "resetTokenExpiresAt", "salt") SELECT "email", "firstName", "hashedPassword", "id", "lastName", "resetToken", "resetTokenExpiresAt", "salt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
