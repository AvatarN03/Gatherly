import { User } from "../generated/prisma/client.ts";

declare global {
  namespace Express {
    interface Request {
      user: User;
      imageUrl?: string;
      imageFileId?: string;
    }
  }
}

export {};
