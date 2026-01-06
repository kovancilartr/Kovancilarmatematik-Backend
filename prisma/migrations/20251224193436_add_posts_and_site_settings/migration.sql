/*
  Warnings:

  - The values [TEACHER,STUDENT,PARENT] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `token` on the `refresh_tokens` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `password` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the `attempts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `choices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `completions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `courses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `enrollment_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `enrollments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `files` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lessons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `parents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `questions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quizzes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `responses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sections` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `students` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teachers` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN');
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "attempts" DROP CONSTRAINT "attempts_quizId_fkey";

-- DropForeignKey
ALTER TABLE "attempts" DROP CONSTRAINT "attempts_studentId_fkey";

-- DropForeignKey
ALTER TABLE "choices" DROP CONSTRAINT "choices_questionId_fkey";

-- DropForeignKey
ALTER TABLE "completions" DROP CONSTRAINT "completions_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "completions" DROP CONSTRAINT "completions_studentId_fkey";

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "enrollment_requests" DROP CONSTRAINT "enrollment_requests_courseId_fkey";

-- DropForeignKey
ALTER TABLE "enrollment_requests" DROP CONSTRAINT "enrollment_requests_studentId_fkey";

-- DropForeignKey
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_courseId_fkey";

-- DropForeignKey
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_studentId_fkey";

-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_uploadedBy_fkey";

-- DropForeignKey
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "parents" DROP CONSTRAINT "parents_userId_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_quizId_fkey";

-- DropForeignKey
ALTER TABLE "quizzes" DROP CONSTRAINT "quizzes_courseId_fkey";

-- DropForeignKey
ALTER TABLE "responses" DROP CONSTRAINT "responses_attemptId_fkey";

-- DropForeignKey
ALTER TABLE "responses" DROP CONSTRAINT "responses_choiceId_fkey";

-- DropForeignKey
ALTER TABLE "responses" DROP CONSTRAINT "responses_questionId_fkey";

-- DropForeignKey
ALTER TABLE "sections" DROP CONSTRAINT "sections_courseId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_parentId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_userId_fkey";

-- DropForeignKey
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_userId_fkey";

-- AlterTable
ALTER TABLE "refresh_tokens" ALTER COLUMN "token" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255);

-- DropTable
DROP TABLE "attempts";

-- DropTable
DROP TABLE "choices";

-- DropTable
DROP TABLE "completions";

-- DropTable
DROP TABLE "courses";

-- DropTable
DROP TABLE "enrollment_requests";

-- DropTable
DROP TABLE "enrollments";

-- DropTable
DROP TABLE "files";

-- DropTable
DROP TABLE "lessons";

-- DropTable
DROP TABLE "parents";

-- DropTable
DROP TABLE "questions";

-- DropTable
DROP TABLE "quizzes";

-- DropTable
DROP TABLE "responses";

-- DropTable
DROP TABLE "sections";

-- DropTable
DROP TABLE "students";

-- DropTable
DROP TABLE "teachers";

-- DropEnum
DROP TYPE "EnrollmentStatus";

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "videoUrl" VARCHAR(500),
    "pdfUrl" VARCHAR(500),
    "imageUrl" VARCHAR(500),
    "category" VARCHAR(100) NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'BEGINNER',
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "siteName" VARCHAR(100) NOT NULL,
    "siteDescription" TEXT,
    "logoUrl" VARCHAR(500),
    "faviconUrl" VARCHAR(500),
    "primaryColor" VARCHAR(7),
    "secondaryColor" VARCHAR(7),
    "contactEmail" VARCHAR(255),
    "contactPhone" VARCHAR(20),
    "socialLinks" JSONB,
    "seoKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "seoTitle" VARCHAR(255),
    "seoDescription" VARCHAR(500),
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "allowRegistration" BOOLEAN NOT NULL DEFAULT true,
    "maxFileSize" INTEGER NOT NULL DEFAULT 10485760,
    "allowedFileTypes" TEXT[] DEFAULT ARRAY['pdf', 'mp4', 'jpg', 'jpeg', 'png']::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "posts_category_idx" ON "posts"("category");

-- CreateIndex
CREATE INDEX "posts_isPublished_idx" ON "posts"("isPublished");

-- CreateIndex
CREATE INDEX "posts_authorId_idx" ON "posts"("authorId");

-- CreateIndex
CREATE INDEX "posts_createdAt_idx" ON "posts"("createdAt");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "refresh_tokens_expiresAt_idx" ON "refresh_tokens"("expiresAt");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
