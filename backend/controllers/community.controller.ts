import type { Request, Response } from "express";
import { prisma } from "../utils/prisma.ts";

export const createCommunity = async (req: Request, res: Response) => {
  try {
    const { name, description, imageUrl, location } = req.body;
    const userId = req?.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const community = await prisma.community.create({
      data: {
        name,
        description,
        imageUrl,
        location,
        createdById: userId,
      },
    });
    console.log("check2");

    res.status(201).json(community);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const getCommunities = async (req: Request, res: Response) => {
  const search = req.query.search as string;

  const communities = await prisma.community.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
  });

  res.json(communities);
};

export const getCommunityById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const community = await prisma.community.findUnique({
    where: { id },
    include: {
      members: true,
    },
  });

  if (!community) {
    return res.status(404).json({ error: "Community not found" });
  }

  res.json(community);
};

export const verifyCommunity = async (req: Request, res: Response) => {
  const { id } = req.params;
  const community = await prisma.community.findUnique({
    where: { id },
  });

  if (!community) {
    return res.status(404).json({ error: "Community not found" });
  }

  res.json({ message: "Community exists" });
};

export const updateCommunity = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, imageUrl, location } = req.body;

  try {
    const updatedCommunity = await prisma.community.update({
      where: { id },
      data: {
        name,
        description,
        imageUrl,
        location,
      },
    });
    res.json(updatedCommunity);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const deleteCommunity = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req?.user?.id;
  console.log("User ID from auth middleware:", userId);

  try {
    const community = await prisma.community.findUnique({
      where: { id },
    });

    if (!community) {
      return res.status(404).json({ error: "Community not found" });
    }

    // 🔐 Authorization check
    if (community.createdById !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this community" });
    }
    console.log("Delete community called");

    await prisma.community.delete({
      where: { id },
    });

    res.json({ message: "Community deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
