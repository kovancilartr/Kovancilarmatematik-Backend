/*
  Warnings:

  - A unique constraint covering the columns `[testAssignmentId,questionId]` on the table `student_answers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "student_answers_testAssignmentId_questionId_key" ON "student_answers"("testAssignmentId", "questionId");
