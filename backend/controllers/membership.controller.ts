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
    res.status(500).json({ error: "Something went wrong" });
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

export const handleRequest = async (req: Request<{ requestId: string }>, res: Response) => {
  console.log("Handle request called");

  try {
    const user = req?.user;
    const { requestId } = req.params;
    const { status } = req.body;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // ✅ Validate status
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const request = await prisma.membershipRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // ✅ Prevent re-processing
    if (request.status !== "PENDING") {
      return res.status(400).json({ error: "Request already handled" });
    }

    // 🔐 Authorization
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

    // ✅ Use transaction
    const result = await prisma.$transaction(async (tx) => {
      // If approved → create membership
      if (status === "APPROVED") {
        const existing = await tx.membership.findUnique({
          where: {
            userId_communityId: {
              userId: request.userId,
              communityId: request.communityId,
            },
          },
        });

        if (!existing) {
          await tx.membership.create({
            data: {
              userId: request.userId,
              communityId: request.communityId,
            },
          });
        }
      }

      // Update request
      return await tx.membershipRequest.update({
        where: { id: requestId },
        data: { status },
      });
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process request" });
  }
};

export const getMyRequests = async (req: Request, res: Response) => {
  try {
    const userId = req?.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const requests = await prisma.membershipRequest.findMany({
      where: { userId },
      include: {
        community: true,
      },
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user requests" });
  }
};
