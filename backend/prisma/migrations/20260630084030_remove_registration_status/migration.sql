/*
  Warnings:

  - You are about to drop the column `status` on the `EventRegistration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EventRegistration" DROP COLUMN "status";

-- DropEnum
DROP TYPE "RegistrationStatus";
