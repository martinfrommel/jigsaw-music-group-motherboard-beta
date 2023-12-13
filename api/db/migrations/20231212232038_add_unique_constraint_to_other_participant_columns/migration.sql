/*
  Warnings:

  - A unique constraint covering the columns `[name,role]` on the table `OtherParticipant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OtherParticipant_name_role_key" ON "OtherParticipant"("name", "role");
