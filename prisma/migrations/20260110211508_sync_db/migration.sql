/*
  Warnings:

  - You are about to drop the column `subjectId` on the `Lesson` table. All the data in the column will be lost.
  - Added the required column `learningObjectiveId` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_subjectId_fkey";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "subjectId",
ADD COLUMN     "learningObjectiveId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_learningObjectiveId_fkey" FOREIGN KEY ("learningObjectiveId") REFERENCES "learning_objectives"("id") ON DELETE CASCADE ON UPDATE CASCADE;
