/*
  Warnings:

  - You are about to drop the column `reviewerId` on the `Review` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clientId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `freelancerId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_reviewerId_fkey";

-- AlterTable
ALTER TABLE "ClientProfile" ADD COLUMN     "moneySpent" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "reviewerId",
ADD COLUMN     "clientId" TEXT NOT NULL,
ADD COLUMN     "freelancerId" TEXT NOT NULL,
ADD COLUMN     "projectId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Review_projectId_key" ON "Review"("projectId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
