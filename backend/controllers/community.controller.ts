import type { Request, Response } from "express";
import { prisma } from "../utils/prisma.ts";
import { CustomRequest } from "../types/index.ts";
import imagekit from "../utils/imagekit.ts";

export const createCommunity = async (req: CustomRequest, res: Response) => {
  try {
    const { name, description, location, category } = req.body;

    const user = req?.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const community = await prisma.community.create({
      data: {
        name,
        description,
        imageUrl: req.imageUrl || "",
        imageFileId: req.imageFileId,
        category,
        location,
        createdById: user.id,

        members: {
          create: {
            userId: user.id,
            role: "OWNER",
          },
        },
      },
    });

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
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(communities);
};

export const getMyCommunities = async (req: Request, res: Response) => {
  const user = req?.user;
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  

  const communities = await prisma.community.findMany({
    where: {
      createdById: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(communities);
};

export const getCommunityById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    const community = await prisma.community.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                imageUrl: true,
              },
            },
          },
        },
        events: true,
      },
    });

    if (!community) {
      return res.status(404).json({
        error: "Community not found",
      });
    }

    res.json(community);
  } catch (error) {
    console.error("GET COMMUNITY ERROR:", error);

    res.status(500).json({
      error:
        error instanceof Error ? error.message : "Failed to fetch community",
    });
  }
};

// export const verifyCommunity = async (
//   req: Request<{ id: string }>,
//   res: Response,
// ) => {
//   const { id } = req.params;
//   const community = await prisma.community.findUnique({
//     where: { id },
//   });

//   if (!community) {
//     return res.status(404).json({ error: "Community not found" });
//   }

//   res.json({ message: "Community exists" });
// };

export const updateCommunity = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const { name, description, category, location } = req.body;

  try {
    const data: any = {
      name,
      description,
      category,
      location,
    };

    if (req.imageUrl) {
      data.imageUrl = req.imageUrl;
      data.imageFileId = req.imageFileId;
    }

    const updatedCommunity = await prisma.community.update({
      where: { id },
      data,
    });

    res.json(updatedCommunity);
  } catch (error) {
    console.log("UPDATE COMMUNITY ERROR:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const deleteCommunity = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  const user = req?.user;

  try {
    const community = await prisma.community.findUnique({
      where: { id },
    });

    if (!community) {
      return res.status(404).json({ error: "Community not found" });
    }

    // 🔐 Authorization check
    if (community.createdById !== user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this community" });
    }

    if (community.imageFileId) {
      try {
        await imagekit.files.delete(community.imageFileId);
        console.log("Community image deleted from ImageKit:", community.imageFileId);
      } catch (error) {
        console.log("Image deletion failed:", error);
      }
    }

    console.log("COMMUNITY TO DELETE");

    await prisma.community.delete({
      where: { id },
    });

    res.json({ message: "Community deleted successfully" });
  } catch (error) {
    console.error("DELETE COMMUNITY ERROR:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
