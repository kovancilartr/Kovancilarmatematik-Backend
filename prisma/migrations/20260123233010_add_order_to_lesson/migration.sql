/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `isPublished` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `learning_objectives` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `learning_objectives` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `tests` table. All the data in the column will be lost.
  - You are about to drop the column `durationMinutes` on the `tests` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `tests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Material" DROP COLUMN "createdAt",
DROP COLUMN "order",
DROP COLUMN "type",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "createdAt",
DROP COLUMN "isPublished",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "learning_objectives" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "tests" DROP COLUMN "createdAt",
DROP COLUMN "durationMinutes",
DROP COLUMN "updatedAt";

-- DropEnum
DROP TYPE "MaterialType";
