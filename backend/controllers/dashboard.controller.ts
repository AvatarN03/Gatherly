import type { Request, Response } from "express";
import { prisma } from "../utils/prisma.ts";

const DASHBOARD_LIMIT = 4;

export const getUserDashboardOverview = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const [
      myMemberships,
      myRegistrations,
      myAssignments,

      communitiesJoined,
      eventsRegistered,
      eventAssignments,
    ] = await Promise.all([
      prisma.membership.findMany({
        where: {
          userId: user.id,
        },
        take: DASHBOARD_LIMIT,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          role: true,
          createdAt: true,

          community: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
              category: true,

              _count: {
                select: {
                  members: true,
                },
              },
            },
          },
        },
      }),

      prisma.eventRegistration.findMany({
        where: {
          userId: user.id,
        },
        take: DASHBOARD_LIMIT,
        orderBy: {
          registeredAt: "desc",
        },
        select: {
          id: true,
          registeredAt: true,

          event: {
            select: {
              id: true,
              title: true,
              date: true,
              imageUrl: true,
              category: true,
              subCategory: true,

              community: {
                select: {
                  id: true,
                  name: true,
                },
              },

              _count: {
                select: {
                  registrations: true,
                },
              },
            },
          },
        },
      }),

      prisma.eventMember.findMany({
        where: {
          userId: user.id,
        },
        take: DASHBOARD_LIMIT,
        orderBy: {
          assignedAt: "desc",
        },
        select: {
          id: true,
          role: true,
          assignedAt: true,

          event: {
            select: {
              id: true,
              title: true,
              date: true,
              imageUrl: true,

              community: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),

      prisma.membership.count({
        where: {
          userId: user.id,
        },
      }),

      prisma.eventRegistration.count({
        where: {
          userId: user.id,
        },
      }),

      prisma.eventMember.count({
        where: {
          userId: user.id,
        },
      }),
    ]);

    return res.json({
      myMemberships,
      myRegistrations,
      myAssignments,

      stats: {
        communitiesJoined,
        eventsRegistered,
        eventAssignments,
      },
    });
  } catch (error) {
    console.error("Error fetching user dashboard overview:", error);
    return res.status(500).json({
      error: "Failed to fetch user dashboard overview",
    });
  }
};

export const getAdminDashboardOverview = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const [
      managedCommunities,
      createdEvents,
      pendingRequests,

      communitiesManaged,
      eventsCreated,
      pendingRequestsCount,
      totalMembers,
    ] = await Promise.all([
      // ==========================
      // Managed Communities Preview
      // ==========================
      prisma.membership.findMany({
        where: {
          userId: user.id,
          role: {
            in: ["OWNER", "ADMIN"],
          },
        },
        take: DASHBOARD_LIMIT,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          role: true,
          createdAt: true,

          community: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
              category: true,
              _count: {
                select: {
                  members: true,
                },
              },
            },
          },
        },
      }),

      // ==========================
      // Created Events Preview
      // ==========================
      prisma.event.findMany({
        where: {
          createdById: user.id,
        },
        take: DASHBOARD_LIMIT,
        orderBy: {
          date: "desc",
        },
        select: {
          id: true,
          title: true,
          date: true,
          time: true,
          imageUrl: true,
          category: true,
          subCategory: true,
          community: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
          _count: {
            select: {
              registrations: true,
            },
          },
        },
      }),

      prisma.membershipRequest.findMany({
        where: {
          status: "PENDING",

          community: {
            members: {
              some: {
                userId: user.id,
                role: {
                  in: ["OWNER", "ADMIN"],
                },
              },
            },
          },
        },

        take: DASHBOARD_LIMIT,

        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          createdAt: true,

          user: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },

          community: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),

      // ==========================
      // Counts
      // ==========================

      prisma.membership.count({
        where: {
          userId: user.id,
          role: {
            in: ["OWNER", "ADMIN"],
          },
        },
      }),

      prisma.event.count({
        where: {
          createdById: user.id,
        },
      }),
      prisma.membershipRequest.count({
        where: {
          status: "PENDING",
          community: {
            members: {
              some: {
                userId: user.id,
                role: {
                  in: ["OWNER", "ADMIN"],
                },
              },
            },
          },
        },
      }),
      prisma.membership.aggregate({
        where: {
          community: {
            members: {
              some: {
                userId: user.id,
                role: {
                  in: ["OWNER", "ADMIN"],
                },
              },
            },
          },
        },

        _count: {
          id: true,
        },
      }),
    ]);

    return res.json({
      managedCommunities,
      createdEvents,
      pendingRequests,

      stats: {
        communitiesManaged,
        totalMembers: totalMembers._count.id,
        eventsCreated,
        pendingRequests: pendingRequestsCount,
      },
    });
  } catch (error) {
    console.error("Error fetching admin dashboard overview:", error);
    return res.status(500).json({
      error: "Failed to fetch admin dashboard overview",
    });
  }
};

export const getIsAdmin = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const isAdmin = await prisma.membership.findFirst({
      where: {
        userId: user.id,
        role: {
          in: ["OWNER", "ADMIN"],
        },
      },
    });

    return res.json({ isAdmin: !!isAdmin });
  }
  catch (error) {
    console.error("Error checking admin status:", error);
    return res.status(500).json({ 
      error: "Failed to check admin status"
    });
  }
  }
