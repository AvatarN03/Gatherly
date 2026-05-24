/*
  Warnings:

  - Added the required column `category` to the `Community` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "imageFileId" TEXT,
ALTER COLUMN "imageUrl" DROP NOT NULL;
