/*
  Warnings:

  - A unique constraint covering the columns `[userType]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_userType_key" ON "users"("userType");
