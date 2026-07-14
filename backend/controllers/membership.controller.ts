import { Request, Response } from "express";
import { prisma } from "../utils/prisma.ts";
import imagekit from "../utils/imagekit.ts";
import { CommunityRole } from "../generated/prisma/enums.ts";

export const joinCommunity = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id: communityId } = req.params;
    const user = req.user!;

    // proof image is required — every join/re-join attempt must attach a fresh one
    if (!req.imageUrl || !req.imageFileId) {
      return res.status(400).json({ error: "Proof image is required" });
    }

    const existingMembership = await prisma.membership.findUnique({
      where: { userId_communityId: { userId: user.id, communityId } },
    });

    if (existingMembership) {
      return res.status(400).json({ error: "Already a member" });
    }

    const existingRequest = await prisma.membershipRequest.findUnique({
      where: { userId_communityId: { userId: user.id, communityId } },
    });

    if (existingRequest) {
      if (existingRequest.status === "PENDING") {
        return res.status(400).json({ error: "Request already sent" });
      }

      // status === "REJECTED" → treat this as a fresh re-request
      // delete the old proof image first, since we're replacing it
      if (existingRequest.proofFileId) {
        try {
          await imagekit.files.delete(existingRequest.proofFileId);
        } catch (deleteError) {
          console.warn("Could not delete old proof image:", deleteError);
        }
      }

      const updatedRequest = await prisma.$transaction(async (tx) => {
        const updated = await tx.membershipRequest.update({
          where: { id: existingRequest.id },
          data: {
            proofUrl: req.imageUrl,
            proofFileId: req.imageFileId,
            status: "PENDING",
          },
        });

        await tx.activityLog.create({
          data: {
            actorId: user.id,
            action: "MEMBERSHIP_REQUESTED",
            communityId,
            metadata: { reRequest: true },
          },
        });

        return updated;
      });

      return res.status(200).json(updatedRequest);
    }

    // no prior request at all — first-time join
    const request = await prisma.$transaction(async (tx) => {
      const created = await tx.membershipRequest.create({
        data: {
          userId: user.id,
          communityId,
          proofUrl: req.imageUrl!,
          proofFileId: req.imageFileId!,
        },
      });

      await tx.activityLog.create({
        data: {
          actorId: user.id,
          action: "MEMBERSHIP_REQUESTED",
          communityId,
        },
      });

      return created;
    });

    res.status(201).json(request);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to send request" });
  }
};

export const getMembers = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id: communityId } = req.params;

    const members = await prisma.membership.findMany({
      where: { communityId },
      select: {
        id: true,
        role: true,
        proofUrl: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
            createdAt: true,
          },
        },
      },
    });

    res.json(members);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const leaveCommunity = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const user = req.user!;
    const { id: communityId } = req.params;

    const membership = await prisma.membership.findUnique({
      where: {
        userId_communityId: { userId: user.id, communityId },
      },
    });

    if (!membership) {
      return res.status(404).json({ error: "Not a member" });
    }

    // Optional: prevent owner from leaving
    if (membership.role === "OWNER") {
      return res
        .status(400)
        .json({ error: "Owner cannot leave the community" });
    }

    await prisma.$transaction(async (tx) => {
      // clean up any event roles/registrations this user held in this community
      const communityEvents = await tx.event.findMany({
        where: { communityId },
        select: { id: true },
      });
      const eventIds = communityEvents.map((e) => e.id);

      if (eventIds.length > 0) {
        await tx.eventMember.deleteMany({
          where: { userId: user.id, eventId: { in: eventIds } },
        });
        await tx.eventRegistration.deleteMany({
          where: { userId: user.id, eventId: { in: eventIds } },
        });
      }

      await tx.membership.delete({
        where: { userId_communityId: { userId: user.id, communityId } },
      });

      await tx.activityLog.create({
        data: {
          actorId: user.id,
          action: "MEMBER_LEFT",
          communityId,
          metadata: { previousRole: membership.role },
        },
      });
    });

    if (membership.proofFileId) {
      try {
        await imagekit.files.delete(membership.proofFileId);
        console.log(
          "Community image deleted from ImageKit:",
          membership.proofFileId,
        );
      } catch (error) {
        console.log("Image deletion failed:", error);
      }
    }

    res.json({ message: "Left community successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to leave community" });
  }
};

// export const getMyRequests = async (req: Request, res: Response) => {
//   try {
//     const user = req.user!;

//     const requests = await prisma.membershipRequest.findMany({
//       where: { userId: user.id },
//       include: {
//         community: true,
//       },
//     });

//     res.json(requests);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch user requests" });
//   }
// };

export const getMyRequestForCommunity = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const user = req.user!;
    const { id: communityId } = req.params;

    // If the user is already a community member,
    // they cannot have a pending join request.
    const membership = await prisma.membership.findUnique({
      where: {
        userId_communityId: {
          userId: user.id,
          communityId,
        },
      },
    });

    if (membership) {
      return res.json(null);
    }

    const request = await prisma.membershipRequest.findUnique({
      where: {
        userId_communityId: {
          userId: user.id,
          communityId,
        },
      },
    });

    return res.json(request);
  } catch (error) {
    console.error("Error fetching user request:", error);
    return res.status(500).json({
      error: "Failed to fetch user request",
    });
  }
};

export const removeCommunityMember = async (
  req: Request<{ id: string; memberId: string }>,
  res: Response,
) => {
  try {
    const user = req.user!;
    const { id: communityId, memberId } = req.params;

    // Check if the requester is OWNER/ADMIN
    const requesterMembership = await prisma.membership.findUnique({
      where: {
        userId_communityId: { userId: user.id, communityId },
      },
    });

    if (
      !requesterMembership ||
      (requesterMembership.role !== "OWNER" &&
        requesterMembership.role !== "ADMIN")
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const member = await prisma.membership.findUnique({
      where: { id: memberId },
    });

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    if (member.communityId !== communityId) {
      return res
        .status(400)
        .json({ error: "Member does not belong to this community" });
    }

    // owner can never be removed by anyone
    if (member.role === "OWNER") {
      return res.status(400).json({ error: "Owner cannot be removed" });
    }

    await prisma.$transaction(async (tx) => {
      const communityEvents = await tx.event.findMany({
        where: { communityId },
        select: { id: true },
      });
      const eventIds = communityEvents.map((e) => e.id);

      if (eventIds.length > 0) {
        await tx.eventMember.deleteMany({
          where: { userId: member.userId, eventId: { in: eventIds } },
        });
        await tx.eventRegistration.deleteMany({
          where: { userId: member.userId, eventId: { in: eventIds } },
        });
      }

      await tx.membership.delete({
        where: { id: memberId },
      });

      await tx.activityLog.create({
        data: {
          actorId: user.id,
          action: "MEMBER_REMOVED",
          communityId,
          targetUserId: member.userId,
          metadata: { removedRole: member.role },
        },
      });
    });

    // clean up proof image from ImageKit, if one exists
    if (member.proofFileId) {
      try {
        await imagekit.files.delete(member.proofFileId);
      } catch (deleteError) {
        console.warn("Could not delete proof image:", deleteError);
      }
    }

    res.json({ message: "Member removed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove member" });
  }
};

export const withdrawRequest = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const user = req.user!;
    const { id: communityId } = req.params;

    const request = await prisma.membershipRequest.findFirst({
      where: {
        userId: user.id,
        communityId,
        status: "PENDING",
      },
    });

    if (!request) {
      return res.status(404).json({ error: "No pending request found" });
    }

    await prisma.$transaction(async (tx) => {
      await tx.membershipRequest.delete({
        where: { id: request.id },
      });

      await tx.activityLog.create({
        data: {
          actorId: user.id,
          action: "MEMBERSHIP_WITHDRAWN",
          communityId,
        },
      });
    });

    // clean up proof image from ImageKit
    if (request.proofFileId) {
      try {
        await imagekit.files.delete(request.proofFileId);
      } catch (deleteError) {
        console.warn("Could not delete proof image:", deleteError);
      }
    }

    res.json({ message: "Request withdrawn successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to withdraw request" });
  }
};

export const updateMemberRole = async (
  req: Request<{ id: string; memberId: string }>,
  res: Response,
) => {
  try {
    const user = req.user!;
    const { id: communityId, memberId } = req.params;
    const { role } = req.body;

    // validate the incoming role is one we allow assigning via this endpoint
    // OWNER is intentionally excluded — ownership transfer should be its own explicit flow
    const assignableRoles: CommunityRole[] = ["ADMIN", "MEMBER"];
    if (!assignableRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Check if the requester is OWNER/ADMIN
    const requesterMembership = await prisma.membership.findUnique({
      where: {
        userId_communityId: { userId: user.id, communityId },
      },
    });

    if (
      !requesterMembership ||
      (requesterMembership.role !== "OWNER" &&
        requesterMembership.role !== "ADMIN")
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const member = await prisma.membership.findUnique({
      where: { id: memberId },
    });

    if (!member || member.communityId !== communityId) {
      return res.status(404).json({
        error: "Member not found in this community",
      });
    }

    // owner's role can never be changed through this endpoint
    if (member.role === "OWNER") {
      return res.status(400).json({ error: "Owner's role cannot be changed" });
    }

    const updatedMembership = await prisma.$transaction(async (tx) => {
      const updated = await tx.membership.update({
        where: { id: memberId },
        data: { role },
      });

      await tx.activityLog.create({
        data: {
          actorId: user.id,
          action: "MEMBER_ROLE_UPDATED",
          communityId,
          targetUserId: member.userId,
          metadata: { previousRole: member.role, newRole: role },
        },
      });

      return updated;
    });

    res.json(updatedMembership);
  } catch (error) {
    res.status(500).json({ error: "Failed to update member role" });
  }
};

//only owner/admin
export const getCommunityRequests = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const user = req.user!;
    const { id: communityId } = req.params;

    // 🔐 Check if requester is OWNER/ADMIN
    const membership = await prisma.membership.findUnique({
      where: {
        userId_communityId: { userId: user.id, communityId },
      },
    });

    if (!membership || membership.role === "MEMBER") {
      return res.status(403).json({ error: "Not authorized" });
    }

    const requests = await prisma.membershipRequest.findMany({
      where: {
        communityId,
        status: "PENDING",
      },
      select: {
        id: true,
        proofUrl: true,
        createdAt: true,
        status: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
      },
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
};

export const handleRequest = async (
  req: Request<{ requestId: string }>,
  res: Response,
) => {
  try {
    const user = req.user!;
    const { requestId } = req.params;
    const { status } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const request = await prisma.membershipRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (request.status !== "PENDING") {
      return res.status(400).json({ error: "Request already handled" });
    }

    const membership = await prisma.membership.findUnique({
      where: {
        userId_communityId: {
          userId: user.id,
          communityId: request.communityId,
        },
      },
    });

    if (!membership || membership.role === "MEMBER") {
      return res.status(403).json({ error: "Not authorized" });
    }

    await prisma.$transaction(async (tx) => {
      if (status === "APPROVED") {
        const existingMembership = await tx.membership.findUnique({
          where: {
            userId_communityId: {
              userId: request.userId,
              communityId: request.communityId,
            },
          },
        });

        if (!existingMembership) {
          await tx.membership.create({
            data: {
              userId: request.userId,
              communityId: request.communityId,
              role: "MEMBER",
              proofUrl: request.proofUrl,
              proofFileId: request.proofFileId,
            },
          });
        }

        await tx.membershipRequest.delete({
          where: { id: requestId },
        });

        await tx.activityLog.create({
          data: {
            actorId: user.id,
            action: "MEMBERSHIP_APPROVED",
            communityId: request.communityId,
            targetUserId: request.userId,
          },
        });
      } else {
        await tx.membershipRequest.update({
          where: { id: requestId },
          data: { status: "REJECTED" },
        });

        await tx.activityLog.create({
          data: {
            actorId: user.id,
            action: "MEMBERSHIP_REJECTED",
            communityId: request.communityId,
            targetUserId: request.userId,
          },
        });
      }
    });

    if (status === "REJECTED" && request.proofFileId) {
      try {
        await imagekit.files.delete(request.proofFileId);
      } catch (deleteError) {
        console.warn("Could not delete proof image:", deleteError);
      }
    }

    return res.json({
      message: `Request ${status.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to process request",
    });
  }
};

// export const getMyMemberships = async (req: Request, res: Response) => {
//   try {
//     const user = req.user!;

//     const memberships = await prisma.membership.findMany({
//       where: { userId: user.id },
//       include: {
//         community: true,
//       },
//     });

//     res.json(memberships);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch user memberships" });
//   }
// };

export const getCommunitiesRequests = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    const memberships = await prisma.membership.findMany({
      where: {
        userId: user.id,
        role: { in: ["OWNER", "ADMIN"] },
      },
      select: {
        role: true, // needed to split owner vs admin
        community: {
          select: {
            id: true,
            name: true,
            description: true,
            imageUrl: true,
            category: true,
            _count: {
              select: {
                requests: { where: { status: "PENDING" } },
              },
            },
          },
        },
      },
    });

    const toCard = (m: (typeof memberships)[number]) => ({
      id: m.community.id,
      name: m.community.name,
      description: m.community.description,
      imageUrl: m.community.imageUrl,
      category: m.community.category,
      _count: { requests: m.community._count.requests },
    });

    const ownedCommunities = memberships
      .filter((m) => m.role === "OWNER")
      .map(toCard)
      .filter((c) => c._count.requests > 0);

    const managedCommunities = memberships
      .filter((m) => m.role === "ADMIN")
      .map(toCard)
      .filter((c) => c._count.requests > 0);

    return res.status(200).json({
      ownedCommunities,
      managedCommunities,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to fetch community requests",
    });
  }
};
