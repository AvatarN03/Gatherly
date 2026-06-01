import type { NextFunction, Request, Response } from "express";

import { getAuth } from "@clerk/express";
import { findOrCreateUser } from "../services/userSync.ts";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    req.user = await findOrCreateUser(userId);

    next();
  } catch (error) {
    next(error);
  }
};
