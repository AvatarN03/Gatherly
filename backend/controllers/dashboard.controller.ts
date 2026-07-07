import type { Request, Response } from "express";
import { prisma } from "../utils/prisma.ts";

const DASHBOARD_LIMIT = 4;

export const getDashboardOverview = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const [
      adminMemberships,
      myMemberships,
      createdEvents,
      myRegistrations,
      myEventRoles,

      communitiesManagedCount,
      communitiesJoinedCount,
      eventsCreatedCount,
      eventsRegisteredCount,
      eventRolesCount,
      pendingRequestsCount,
      totalMembersCount,
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
                  events: true,
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
      }),

      // ==========================
      // Joined Communities Preview
      // ==========================
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

      // ==========================
      // Registered Events Preview
      // ==========================
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
          },
        },
      }),

      // ==========================
      // Assigned Events Preview
      // ==========================
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

      prisma.membership.count({
        where: {
          userId: user.id,
        },
      }),

      prisma.event.count({
        where: {
          createdById: user.id,
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
          role: {
            in: ["OWNER", "ADMIN", "MEMBER"],
          },
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

    const stats = {
      communitiesManaged: communitiesManagedCount,
      communitiesJoined: communitiesJoinedCount,
      eventsCreated: eventsCreatedCount,
      eventsRegistered: eventsRegisteredCount,
      eventRoles: eventRolesCount,
      pendingRequests: pendingRequestsCount,
      totalMembers: totalMembersCount._count.id,
    };
    return res.json({
      isAdmin: communitiesManagedCount > 0,

      adminMemberships,
      myMemberships,
      createdEvents,
      myRegistrations,
      myEventRoles,

      stats,
    });
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);

    return res.status(500).json({
      error: "Failed to fetch dashboard overview",
    });
  }
};
