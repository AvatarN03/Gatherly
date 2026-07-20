import type { Request, Response } from "express";
import { prisma } from "../utils/prisma.ts";
import { CustomRequest } from "../types/index.ts";
import imagekit from "../utils/imagekit.ts";
import { PLAN_LIMITS } from "../constant.ts";

export const createEvent = async (req: CustomRequest, res: Response) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      category,
      subCategory,
      communityId,
    } = req.body;

    const members = req.body.members ? JSON.parse(req.body.members) : [];

    const user = req.user;

    const community = await prisma.community.findUnique({
      where: {
        id: communityId,
      },
    });

    if (!community) {
      return res.status(404).json({
        error: "Community not found",
      });
    }

    // 👇 Check event limit here
    const eventCount = await prisma.event.count({
      where: {
        communityId,
      },
    });

    const limit = PLAN_LIMITS[user.plan].eventsPerCommunity;

    if (eventCount >= limit) {
      return res.status(403).json({
        error: `Your ${user.plan} plan allows only ${limit} events per community.`,
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const event = await tx.event.create({
        data: {
          title,
          description,
          date: new Date(date),
          time,
          location,
          category,
          subCategory,
          imageUrl: req.imageUrl || "",
          imageFileId: req.imageFileId,
          communityId,
          createdById: user.id,
        },
      });

      // Creator becomes HOST
      await tx.eventMember.create({
        data: {
          eventId: event.id,
          userId: user.id,
          role: "HOST",
        },
      });

      // Selected members
      if (members.length > 0) {
        await tx.eventMember.createMany({
          data: members.map((member: { userId: string; role: string }) => ({
            eventId: event.id,
            userId: member.userId,
            role: member.role,
          })),
          skipDuplicates: true,
        });
      }

      await tx.activityLog.create({
        data: {
          actorId: user.id,
          action: "EVENT_CREATED",
          communityId,
          eventId: event.id,
          metadata: { title: event.title },
        },
      });

      return event;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create event",
    });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const { communityId, search, page = "1", limit = "9" } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const where: any = {};

    if (communityId) {
      where.communityId = communityId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { date: "desc" },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        include: {
          community: {
            select: { id: true, name: true, imageUrl: true },
          },
        },
      }),
      prisma.event.count({ where }),
    ]);

    const hasMore = pageNum * limitNum < total;

    res.json({
      events,
      nextPage: hasMore ? pageNum + 1 : null,
      total,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

export const getMyEvents = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    const events = await prisma.event.findMany({
      where: {
        createdById: user.id,
      },
      orderBy: { date: "desc" },
      include: {
        community: {
          select: { id: true, name: true, imageUrl: true },
        },
      },
    });

    res.json(events);
  } catch (error) {
    console.error("Error fetching my events:", error);
    res.status(500).json({ error: "Failed to fetch my events" });
  }
};

export const getEventById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
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
        community: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            location: true,
          },
        },
        members: {
          select: {
            id: true,
            user: true,
            role: true,
          },
        },
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Failed to fetch event" });
  }
};

export const updateEvent = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      date,
      time,
      location,
      category,
      subCategory,
      members,
    } = req.body;

    const user = req.user!;

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return res.status(404).json({
        error: "Event not found",
      });
    }

    if (event.createdById !== user.id) {
      return res.status(403).json({
        error: "Not authorized",
      });
    }

    const updatedEvent = await prisma.$transaction(async (tx) => {
      const updated = await tx.event.update({
        where: { id },
        data: {
          title,
          description,
          date: date ? new Date(date) : event.date,
          time: time ? time : event.time,
          location,
          category,
          subCategory,
          ...(req.imageUrl && {
            imageUrl: req.imageUrl,
            imageFileId: req.imageFileId,
          }),
        },
      });

      if (members) {
        const parsedMembers =
          typeof members === "string" ? JSON.parse(members) : members;

        await tx.eventMember.deleteMany({
          where: { eventId: id },
        });

        await tx.eventMember.create({
          data: {
            eventId: id,
            userId: user.id,
            role: "HOST",
          },
        });

        if (parsedMembers.length > 0) {
          await tx.eventMember.createMany({
            data: parsedMembers
              .filter((m: any) => m.userId !== user.id)
              .map((m: any) => ({
                eventId: id,
                userId: m.userId,
                role: m.role,
              })),
            skipDuplicates: true,
          });
        }
      }

      await tx.activityLog.create({
        data: {
          actorId: user.id,
          action: "EVENT_UPDATED",
          communityId: event.communityId,
          eventId: id,
          metadata: { title: updated.title },
        },
      });

      return updated;
    });

    res.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);

    res.status(500).json({
      error: "Failed to update event",
    });
  }
};

export const deleteEvent = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Authorization check - only creator can delete
    if (event.createdById !== user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this event" });
    }

    if (event.imageFileId) {
      try {
        await imagekit.files.delete(event.imageFileId);
      } catch (deleteError) {
        console.warn("Could not delete event image:", deleteError);
      }
    }

    // log before deleting — eventId FK uses onDelete: SetNull, so this
    // survives with eventId becoming null; communityId still points to
    // the (still-existing) community
    await prisma.activityLog.create({
      data: {
        actorId: user.id,
        action: "EVENT_DELETED",
        communityId: event.communityId,
        eventId: id,
        metadata: { title: event.title },
      },
    });

    await prisma.event.delete({
      where: { id },
    });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }
};

export const registerForEvent = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if already registered
    const existingRegistration = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: {
          eventId: id,
          userId: user.id,
        },
      },
    });

    if (existingRegistration) {
      return res
        .status(400)
        .json({ error: "Already registered for this event" });
    }

    if (event.createdById === user.id) {
      return res.status(400).json({
        error: "Event creator cannot register for their own event",
      });
    }

    const registration = await prisma.$transaction(async (tx) => {
      const created = await tx.eventRegistration.create({
        data: {
          eventId: id,
          userId: user.id,
        },
      });

      await tx.activityLog.create({
        data: {
          actorId: user.id,
          action: "EVENT_REGISTRATION_CREATED",
          communityId: event.communityId,
          eventId: id,
        },
      });

      return created;
    });

    res.status(201).json(registration);
  } catch (error) {
    console.error("Error registering for event:", error);
    res.status(500).json({ error: "Failed to register for event" });
  }
};

export const unregisterFromEvent = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const registration = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: {
          eventId: id,
          userId: user.id,
        },
      },
      include: {
        event: { select: { communityId: true } },
      },
    });

    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }

    await prisma.$transaction(async (tx) => {
      await tx.eventRegistration.delete({
        where: { id: registration.id },
      });

      await tx.activityLog.create({
        data: {
          actorId: user.id,
          action: "EVENT_REGISTRATION_CANCELLED",
          communityId: registration.event.communityId,
          eventId: id,
        },
      });
    });

    res.json({ message: "Unregistered from event successfully" });
  } catch (error) {
    console.error("Error unregistering from event:", error);
    res.status(500).json({ error: "Failed to unregister from event" });
  }
};

// Add Event Member (Admin/Coordinator)

export const addEventMember = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.body;
    const currentUser = req.user!;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        community: {
          include: {
            members: {
              where: { userId: currentUser.id },
            },
          },
        },
        members: {
          where: { userId: currentUser.id },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const communityMembership = event.community.members[0];
    const eventMembership = event.members[0];

    const isCommunityOwner = communityMembership?.role === "OWNER";
    const isCommunityAdmin = communityMembership?.role === "ADMIN";
    const isEventCoordinator = eventMembership?.role === "COORDINATOR";

    if (!isCommunityOwner && !isCommunityAdmin && !isEventCoordinator) {
      return res.status(403).json({
        error: "You are not authorized to manage event members.",
      });
    }

    const existingMember = await prisma.eventMember.findUnique({
      where: {
        eventId_userId: { eventId: id, userId },
      },
    });

    if (existingMember) {
      return res.status(400).json({
        error: "User is already assigned to this event.",
      });
    }

    const member = await prisma.$transaction(async (tx) => {
      const created = await tx.eventMember.create({
        data: {
          eventId: id,
          userId,
          role: role ?? "VOLUNTEER",
        },
        include: {
          user: {
            select: { id: true, name: true, email: true, imageUrl: true },
          },
        },
      });

      await tx.activityLog.create({
        data: {
          actorId: currentUser.id,
          action: "EVENT_MEMBER_ASSIGNED",
          communityId: event.communityId,
          eventId: id,
          targetUserId: userId,
          metadata: { role: created.role },
        },
      });

      return created;
    });

    return res.status(201).json(member);
  } catch (error: any) {
    console.error("Error adding event member:", error);

    if (error.code === "P2002") {
      return res.status(400).json({
        error: "User is already assigned to this event.",
      });
    }

    return res.status(500).json({
      error: "Failed to add event member.",
    });
  }
};

export const updateEventMember = async (
  req: Request<{ id: string; memberId: string }>,
  res: Response,
) => {
  try {
    const { id, memberId } = req.params;
    const { role } = req.body;
    const user = req.user!;

    if (!role) {
      return res.status(400).json({ error: "Role is required" });
    }

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        community: {
          include: {
            members: {
              where: {
                userId: user.id,
              },
            },
          },
        },
        members: {
          where: {
            userId: user.id,
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const communityMembership = event.community.members[0];
    const eventMembership = event.members[0];

    const isOwner = communityMembership?.role === "OWNER";
    const isAdmin = communityMembership?.role === "ADMIN";
    const isCoordinator = eventMembership?.role === "COORDINATOR";

    if (!isOwner && !isAdmin && !isCoordinator) {
      return res.status(403).json({
        error: "Not authorized to update event members",
      });
    }

    const member = await prisma.eventMember.findUnique({
      where: { id: memberId },
    });

    if (!member || member.eventId !== id) {
      return res.status(404).json({ error: "Member not found" });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.eventMember.update({
        where: { id: memberId },
        data: { role },
        include: {
          user: {
            select: { id: true, name: true, email: true, imageUrl: true },
          },
        },
      });

      await tx.activityLog.create({
        data: {
          actorId: user.id,
          action: "EVENT_MEMBER_ROLE_UPDATED",
          communityId: event.communityId,
          eventId: id,
          targetUserId: member.userId,
          metadata: { previousRole: member.role, newRole: role },
        },
      });

      return result;
    });

    return res.json(updated);
  } catch (error) {
    console.error("Error updating event member:", error);
    return res.status(500).json({
      error: "Failed to update event member",
    });
  }
};

// Remove Event Member

export const removeEventMember = async (
  req: Request<{ id: string; memberId: string }>,
  res: Response,
) => {
  try {
    const { id, memberId } = req.params;
    const user = req.user!;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        community: {
          include: {
            members: { where: { userId: user.id } },
          },
        },
        members: { where: { userId: user.id } },
      },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const communityMembership = event.community.members[0];
    const eventMembership = event.members[0];

    const isOwner = communityMembership?.role === "OWNER";
    const isAdmin = communityMembership?.role === "ADMIN";
    const isCoordinator = eventMembership?.role === "COORDINATOR";

    if (!isOwner && !isAdmin && !isCoordinator) {
      return res.status(403).json({
        error: "Not authorized to remove members from this event",
      });
    }

    const memberToRemove = await prisma.eventMember.findUnique({
      where: { id: memberId },
    });

    if (!memberToRemove || memberToRemove.eventId !== id) {
      return res.status(404).json({ error: "Member not found" });
    }

    await prisma.$transaction(async (tx) => {
      await tx.eventMember.delete({
        where: { id: memberId },
      });

      await tx.activityLog.create({
        data: {
          actorId: user.id,
          action: "EVENT_MEMBER_REMOVED",
          communityId: event.communityId,
          eventId: id,
          targetUserId: memberToRemove.userId,
        },
      });
    });

    res.json({ message: "Member removed from event successfully" });
  } catch (error) {
    console.error("Error removing event member:", error);
    res.status(500).json({ error: "Failed to remove event member" });
  }
};

// Get Event Members

export const getEventMembers = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    const members = await prisma.eventMember.findMany({
      where: { eventId: id },
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
    });

    res.json(members);
  } catch (error) {
    console.error("Error fetching event members:", error);
    res.status(500).json({ error: "Failed to fetch event members" });
  }
};

// Get Event Registrations

export const getEventRegistrations = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        members: {
          where: {
            userId: user.id,
          },
          select: {
            role: true,
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const isCreator = event.createdById === user.id;
    const isEventMember = event.members.length > 0;

    if (!isCreator && !isEventMember) {
      return res
        .status(403)
        .json({ error: "Not authorized to view registrations" });
    }

    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId: id },
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
    });

    res.json(registrations);
  } catch (error) {
    console.error("Error fetching event registrations:", error);
    res.status(500).json({ error: "Failed to fetch event registrations" });
  }
};

export const getMyEventRegistrations = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    const registrations = await prisma.eventRegistration.findMany({
      where: { userId: user.id },
      include: {
        event: {
          include: {
            community: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    res.json(registrations);
  } catch (error) {
    console.error("Error fetching my event registrations:", error);
    res.status(500).json({ error: "Failed to fetch my event registrations" });
  }
};

export const getMyEventRoles = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    const roles = await prisma.eventMember.findMany({
      where: { userId: user.id },
      include: {
        event: {
          include: {
            community: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    res.json(roles);
  } catch (error) {
    console.error("Error fetching my event roles:", error);
    res.status(500).json({ error: "Failed to fetch my event roles" });
  }
};

// export const getManagedEventRegistrations = async (
//   req: Request,
//   res: Response,
// ) => {
//   try {
//     const user = req.user!;

//     const events = await prisma.event.findMany({
//       where: {
//         OR: [
//           {
//             createdById: user.id,
//           },
//           {
//             members: {
//               some: {
//                 userId: user.id,
//                 role: {
//                   in: ["HOST", "COORDINATOR"],
//                 },
//               },
//             },
//           },
//         ],
//         registrations: {
//           some: {},
//         },
//       },
//       select: {
//         id: true,
//         title: true,
//         date: true,
//         createdAt: true,
//         imageUrl: true,
//         category: true,
//         subCategory: true,
//         _count: {
//           select: {
//             registrations: true,
//           },
//         },
//       },
//       orderBy: {
//         date: "asc",
//       },
//     });

//     return res.json(events);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       error: "Failed to fetch event registrations summary",
//     });
//   }
// };
