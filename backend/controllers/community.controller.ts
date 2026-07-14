import type { Request, Response } from "express";
import { prisma } from "../utils/prisma.ts";
import { CustomRequest } from "../types/index.ts";
import imagekit from "../utils/imagekit.ts";

export const createCommunity = async (req: CustomRequest, res: Response) => {
  try {
    const { name, description, location, category } = req.body;

    const user = req.user!;

    const community = await prisma.$transaction(async (tx) => {
      const created = await tx.community.create({
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

      await tx.activityLog.create({
        data: {
          actorId: user.id,
          action: "COMMUNITY_CREATED",
          communityId: created.id,
          metadata: { name: created.name },
        },
      });

      return created;
    });

    res.status(201).json(community);
  } catch (error) {
    console.log("CREATE COMMUNITY ERROR:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const getCommunities = async (req: Request, res: Response) => {
  try {
    const search = (req.query.search as string) || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const where = {
      name: {
        contains: search,
        mode: "insensitive" as const,
      },
    };

    const [communities, total] = await Promise.all([
      prisma.community.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.community.count({ where }),
    ]);

    res.json({
      communities,
      hasMore: skip + communities.length < total,
      nextPage: page + 1,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch communities",
    });
  }
};

export const getMyCommunities = async (req: Request, res: Response) => {
  const user = req.user!;

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
        _count: {
          select: {
            members: true,
            requests: true,
          },
        },
        events: true,
        members: {
          select: {
            id: true,
            userId: true,
            role: true,
          },
        },
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

  const user = req.user!;

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

    const community = await prisma.community.findFirst({
      where: {
        id,
        createdById: user.id,
      },
    });

    if (!community) {
      return res.status(403).json({
        error: "Not authorized",
      });
    }

    const updatedCommunity = await prisma.$transaction(async (tx) => {
      const updated = await tx.community.update({
        where: { id },
        data,
      });

      await tx.activityLog.create({
        data: {
          actorId: user.id,
          action: "COMMUNITY_UPDATED",
          communityId: id,
          metadata: {
            changedFields: Object.keys(data),
          },
        },
      });

      return updated;
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
  const user = req.user!;

  try {
     const community = await prisma.community.findUnique({
      where: { id },
      select: {
        name: true,
        createdById: true,
        imageFileId: true,
      },
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
        console.log(
          "Community image deleted from ImageKit:",
          community.imageFileId,
        );
      } catch (error) {
        console.log("Image deletion failed:", error);
      }
    }

    // log BEFORE deleting the community — communityId FK now uses
    // onDelete: SetNull, so this row survives, just loses the FK link
    await prisma.activityLog.create({
      data: {
        actorId: user.id,
        action: "COMMUNITY_DELETED",
        communityId: id,
        metadata: { name: community.name },
      },
    });

    await prisma.community.delete({
      where: { id },
    });

    res.json({ message: "Community deleted successfully" });
  } catch (error) {
    console.error("DELETE COMMUNITY ERROR:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const getManagedCommunities = async (req: Request, res: Response) => {
  const user = req.user!;

  try {
    const managedCommunities = await prisma.community.findMany({
      where: {
        members: {
          some: {
            userId: user.id,
            role: "ADMIN",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(managedCommunities);
  } catch (error) {
    console.error("GET MANAGED COMMUNITIES ERROR:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const getJoinedCommunities = async (req: Request, res: Response) => {
  const user = req.user!;

  try {
    const joinedCommunities = await prisma.community.findMany({
      where: {
        members: {
          some: {
            userId: user.id,
            role: "MEMBER",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(joinedCommunities);
  } catch (error) {
    console.error("GET JOINED COMMUNITIES ERROR:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
