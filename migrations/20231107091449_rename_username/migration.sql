/*
  Warnings:

  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[usernameOld]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `usernameOld` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User"
RENAME COLUMN "username" TO "usernameOld";

-- CreateIndex
CREATE UNIQUE INDEX "User_usernameOld_key" ON "User"("usernameOld");
