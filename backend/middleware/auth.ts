import type { NextFunction, Request, Response } from "express";
import { clerkClient, getAuth } from "@clerk/express";
import { prisma } from "../utils/prisma.ts";

declare global {
  namespace Express {
    interface Request {
      user:{
            id: string;
            email: string;
            name?: string | null;
            imageUrl?: string | null;
          }
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    // Check existing user
    let user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    // Create user first time login
    if (!user) {
      // Fetch Clerk user
      const clerkUser = await clerkClient.users.getUser(userId);

      user = await prisma.user.create({
        data: {
          id: userId,
          email:
            clerkUser.emailAddresses[0]?.emailAddress || "",

          name:
            `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),

          imageUrl:
            clerkUser.imageUrl || "",
        },
      });
    }

    // Attach DB user (include basic profile fields)
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};