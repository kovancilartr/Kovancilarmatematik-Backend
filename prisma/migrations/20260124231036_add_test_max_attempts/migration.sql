-- AlterTable
ALTER TABLE "tests" ADD COLUMN     "durationMinutes" INTEGER,
ADD COLUMN     "maxAttempts" INTEGER NOT NULL DEFAULT 0;
