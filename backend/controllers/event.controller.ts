import type { Request, Response } from "express";
import { prisma } from "../utils/prisma.ts";
import { CustomRequest } from "../types/index.ts";
import imagekit from "../utils/imagekit.ts";

export const createEvent = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const {
      title,
      description,
      date,
      location,
      category,
      subCategory,
      communityId,
    } = req.body;

    const members = req.body.members
      ? JSON.parse(req.body.members)
      : [];

    const user = req.user;

    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

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

    const result = await prisma.$transaction(
      async (tx) => {
        const event = await tx.event.create({
          data: {
            title,
            description,
            date: new Date(date),
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
            data: members.map(
              (member: {
                userId: string;
                role: string;
              }) => ({
                eventId: event.id,
                userId: member.userId,
                role: member.role,
              })
            ),
            skipDuplicates: true,
          });
        }

        return event;
      }
    );

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
    const { communityId, search } = req.query;

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

    const events = await prisma.event.findMany({
      where,
      orderBy: {
        date: "asc", // event data not created data
      },
      include: {
        community: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    });

    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
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
        registrations: {
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
      location,
      category,
      subCategory,
      members,
    } = req.body;

    const user = req?.user;

    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

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

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        date: date
          ? new Date(date)
          : event.date,
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
        typeof members === "string"
          ? JSON.parse(members)
          : members;

      await prisma.eventMember.deleteMany({
        where: {
          eventId: id,
        },
      });

      await prisma.eventMember.create({
        data: {
          eventId: id,
          userId: user.id,
          role: "HOST",
        },
      });

      if (parsedMembers.length > 0) {
        await prisma.eventMember.createMany({
          data: parsedMembers
            .filter(
              (m: any) => m.userId !== user.id
            )
            .map((m: any) => ({
              eventId: id,
              userId: m.userId,
              role: m.role,
            })),
          skipDuplicates: true,
        });
      }
    }

    res.json(updatedEvent);
  } catch (error) {
    console.error(
      "Error updating event:",
      error
    );

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
    const user = req?.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

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

    if (event?.imageFileId) {
      await imagekit.files.delete(event.imageFileId);
    }

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
    const user = req?.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

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

    const registration = await prisma.eventRegistration.create({
      data: {
        eventId: id,
        userId: user.id,
      },
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
    const user = req?.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const registration = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: {
          eventId: id,
          userId: user.id,
        },
      },
    });

    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }

    await prisma.eventRegistration.delete({
      where: {
        id: registration.id,
      },
    });

    res.json({ message: "Unregistered from event successfully" });
  } catch (error) {
    console.error("Error unregistering from event:", error);
    res.status(500).json({ error: "Failed to unregister from event" });
  }
};

// ==================
// Add Event Member (Admin/Coordinator)
// ==================
export const addEventMember = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.body;
    const user = req?.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Authorization check - only creator can add members
    if (event.createdById !== user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to add members to this event" });
    }

    const member = await prisma.eventMember.create({
      data: {
        eventId: id,
        userId,
        role: role || "COORDINATOR",
      },
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

    res.status(201).json(member);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ error: "User is already a member of this event" });
    }
    console.error("Error adding event member:", error);
    res.status(500).json({ error: "Failed to add event member" });
  }
};

// ==================
// Remove Event Member
// ==================
export const removeEventMember = async (
  req: Request<{ id: string; memberId: string }>,
  res: Response,
) => {
  try {
    const { id, memberId } = req.params;
    const user = req?.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Authorization check - only creator can remove members
    if (event.createdById !== user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to remove members from this event" });
    }

    await prisma.eventMember.delete({
      where: { id: memberId },
    });

    res.json({ message: "Member removed from event successfully" });
  } catch (error) {
    console.error("Error removing event member:", error);
    res.status(500).json({ error: "Failed to remove event member" });
  }
};

// ==================
// Get Event Members
// ==================
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

// ==================
// Get Event Registrations
// ==================
export const getEventRegistrations = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const user = req?.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Authorization check - only creator can view registrations
    if (event.createdById !== user.id) {
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
