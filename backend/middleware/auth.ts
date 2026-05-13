import type { NextFunction, Request, Response } from "express";
import { clerkClient, getAuth } from "@clerk/express";
import { prisma } from "../utils/prisma.ts";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        clerkUserId: string;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId: clerkUserId } = getAuth(req);

    if (!clerkUserId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    // Check existing user
    let user = await prisma.user.findUnique({
      where: {
        clerkUserId,
      },
    });

    // Create user first time login
    if (!user) {
      // Fetch Clerk user
      const clerkUser = await clerkClient.users.getUser(clerkUserId);

      user = await prisma.user.create({
        data: {
          clerkUserId,
          email:
            clerkUser.emailAddresses[0]?.emailAddress || "",

          name:
            `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),

          imageUrl:
            clerkUser.imageUrl || "",
        },
      });
    }

    // Attach DB user
    req.user = {
      id: user.id,
      clerkUserId: user.clerkUserId,
    };

    next();
  } catch (error) {
    next(error);
  }
};