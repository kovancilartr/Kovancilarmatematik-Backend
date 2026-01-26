-- AlterTable
ALTER TABLE "tests" ADD COLUMN     "learningObjectiveId" TEXT;

-- AddForeignKey
ALTER TABLE "tests" ADD CONSTRAINT "tests_learningObjectiveId_fkey" FOREIGN KEY ("learningObjectiveId") REFERENCES "learning_objectives"("id") ON DELETE SET NULL ON UPDATE CASCADE;
