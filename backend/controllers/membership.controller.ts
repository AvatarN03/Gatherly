import { Request, Response } from "express";
import { prisma } from "../utils/prisma.ts";

export const joinCommunity = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id: communityId } = req.params;
    const user = req?.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    //check if user is already a member or has a pending request
    const existingMembership = await prisma.membership.findFirst({
      where: {
        AND: [{ userId: user.id }, { communityId }],
      },
    });

    if (existingMembership) {
      return res.status(400).json({ error: "Already a member" });
    }

    //check if user has a pending request
    const existingRequest = await prisma.membershipRequest.findFirst({
      where: {
        userId: user.id,
        communityId,
        status: "PENDING",
      },
    });

    if (existingRequest) {
      return res.status(400).json({ error: "Request already sent" });
    }

    const request = await prisma.membershipRequest.create({
      data: {
        userId: user.id,
        communityId,
        proofUrl: "demo-proof", // you can update later
      },
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
      include: {
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
    const user = req?.user;
    const { id: communityId } = req.params;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

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

    await prisma.membership.delete({
      where: {
        userId_communityId: { userId: user.id, communityId },
      },
    });

    res.json({ message: "Left community successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to leave community" });
  }
};

export const getMyRequests = async (req: Request, res: Response) => {
  try {
    const user = req?.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const requests = await prisma.membershipRequest.findMany({
      where: { userId: user.id },
      include: {
        community: true,
      },
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user requests" });
  }
};

export const getMyRequestForCommunity = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const user = req?.user;
    const { id: communityId } = req.params;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const request = await prisma.membershipRequest.findFirst({
      where: { userId: user.id, communityId },
    });

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user request" });
  }
};

export const removeCommunityMember = async (
  req: Request<{ id: string; memberId: string }>,
  res: Response,
) => {
  try {
    const user = req?.user;
    const { id: communityId, memberId } = req.params;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
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
      where: {
        id: memberId,
      },
    });
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    if (member.communityId !== communityId) {
      return res
        .status(400)
        .json({ error: "Member does not belong to this community" });
    }

    await prisma.membership.delete({
      where: {
        id: memberId,
      },
    });

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
    const user = req?.user;
    const { id: communityId } = req.params;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const request = await prisma.membershipRequest.findFirst({
      where: { userId: user.id, communityId },
    });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    await prisma.membershipRequest.delete({
      where: { id: request.id },
    });

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
    const user = req?.user;
    const { id: communityId, memberId } = req.params;
    const { role } = req.body;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
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
      where: {
        id: memberId,
      },
    });

    if (!member || member.communityId !== communityId) {
      return res.status(404).json({
        error: "Member not found in this community",
      });
    }

    const updatedMembership = await prisma.membership.update({
      where: {
        id: memberId,
      },
      data: {
        role,
      },
    });

    res.json(updatedMembership);
  } catch (error) {
    res.status(500).json({ error });
  }
};

//only owner/admin
export const getCommunityRequests = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const user = req?.user;
    const { id: communityId } = req.params;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

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
      include: {
        user: true,
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
    const user = req.user;
    const { requestId } = req.params;
    const { status } = req.body;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const request = await prisma.membershipRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
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
            },
          });
        }
      }

      // Remove request after processing
      await tx.membershipRequest.delete({
        where: {
          id: requestId,
        },
      });
    });

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

export const getMyMemberships = async (req: Request, res: Response) => {
  try {
    const user = req?.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const memberships = await prisma.membership.findMany({
      where: { userId: user.id },
      include: {
        community: true,
      },
    });

    res.json(memberships);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user memberships" });
  }
};

export const getCommunitiesRequests = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const communities = await prisma.membership.findMany({
      where: {
        userId: user.id,
        role: {
          in: ["OWNER", "ADMIN"],
        },
      },
      select: {
        community: {
          select: {
            id: true,
            name: true,
            description: true,
            imageUrl: true,
            category: true,
            _count: {
              select: {
                requests: {
                  where: {
                    status: "PENDING",
                  },
                },
              },
            },
          },
        },
      },
    });

    const data = communities
      .map(({ community }) => ({
        id: community.id,
        name: community.name,
        description: community.description,
        imageUrl: community.imageUrl,
        category: community.category,
        _count: {
          requests: community._count.requests,
        },
      }))
      .filter((community) => community._count.requests > 0);

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to fetch community requests",
    });
  }
};
