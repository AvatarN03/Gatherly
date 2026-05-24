/*
  Warnings:

  - Added the required column `category` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subCategory` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "imageFileId" TEXT,
ADD COLUMN     "subCategory" TEXT NOT NULL;
