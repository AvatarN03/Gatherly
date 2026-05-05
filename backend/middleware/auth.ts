import type { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
console.log("Auth middleware called");
  const user = req.get("user-id"); 

//   if (!user) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }
// import { getAuth } from "@clerk/express";

// export const authMiddleware = async (req, res, next) => {
//   const { userId: clerkUserId } = getAuth(req);

//   if (!clerkUserId) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }

//   // 🔥 Find user in DB
//   let user = await prisma.user.findUnique({
//     where: { clerkUserId },
//   });

//   // 🔁 Sync if not exists
//   if (!user) {
//     user = await prisma.user.create({
//       data: {
//         clerkUserId,
//         email: "temp@email.com", // later fetch from Clerk
//         name: "New User",
//         imageUrl: "",
//       },
//     });
//   }

//   // ✅ Attach DB user
//   req.user = {
//     id: user.id,           // DB UUID
//     clerkUserId,
//   };

//   next();
// };

  req.user = { id: "d2a08f04-1a72-457b-baaa-1185862950ad" }; // attach user to request
  next();
};
