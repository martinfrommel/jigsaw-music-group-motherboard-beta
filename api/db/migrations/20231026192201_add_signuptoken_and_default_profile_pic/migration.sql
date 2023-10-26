-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "picture" TEXT DEFAULT 'https://avatars.dicebear.com/api/male/username.svg',
    "hashedPassword" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiresAt" DATETIME,
    "signUpToken" TEXT,
    "signUpTokenExpiresAt" DATETIME,
    "roles" TEXT NOT NULL DEFAULT 'user'
);
INSERT INTO "new_User" ("email", "firstName", "hashedPassword", "id", "lastName", "picture", "resetToken", "resetTokenExpiresAt", "roles", "salt") SELECT "email", "firstName", "hashedPassword", "id", "lastName", "picture", "resetToken", "resetTokenExpiresAt", "roles", "salt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_signUpToken_key" ON "User"("signUpToken");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
