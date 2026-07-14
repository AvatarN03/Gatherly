/*
  Warnings:

  - Added the required column `proofFileId` to the `MembershipRequest` table without a default value. This is not possible if the table is not empty.
  - Made the column `proofUrl` on table `MembershipRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ActivityAction" AS ENUM ('COMMUNITY_CREATED', 'COMMUNITY_UPDATED', 'COMMUNITY_DELETED', 'MEMBERSHIP_REQUESTED', 'MEMBERSHIP_APPROVED', 'MEMBERSHIP_REJECTED', 'MEMBERSHIP_WITHDRAWN', 'MEMBER_REMOVED', 'MEMBER_LEFT', 'MEMBER_ROLE_UPDATED', 'EVENT_CREATED', 'EVENT_UPDATED', 'EVENT_DELETED', 'EVENT_MEMBER_ASSIGNED', 'EVENT_MEMBER_ROLE_UPDATED', 'EVENT_MEMBER_REMOVED', 'EVENT_REGISTRATION_CREATED', 'EVENT_REGISTRATION_CANCELLED');

-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "proofFileId" TEXT,
ADD COLUMN     "proofUrl" TEXT;

-- AlterTable
ALTER TABLE "MembershipRequest" ADD COLUMN     "proofFileId" TEXT NOT NULL,
ALTER COLUMN "proofUrl" SET NOT NULL;

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" "ActivityAction" NOT NULL,
    "communityId" TEXT,
    "eventId" TEXT,
    "targetUserId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ActivityLog_communityId_idx" ON "ActivityLog"("communityId");

-- CreateIndex
CREATE INDEX "ActivityLog_actorId_idx" ON "ActivityLog"("actorId");

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
