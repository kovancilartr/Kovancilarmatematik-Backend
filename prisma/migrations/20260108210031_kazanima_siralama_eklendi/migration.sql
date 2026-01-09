/*
  Warnings:

  - Added the required column `order` to the `learning_objectives` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "learning_objectives" ADD COLUMN     "order" INTEGER NOT NULL;
