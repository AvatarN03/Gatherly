import { Request } from "express";
import rateLimit from "express-rate-limit";


export const registerLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator: (req:Request) => req.user!.id,
  message: {
    error: "Too many registration attempts.",
  },
});