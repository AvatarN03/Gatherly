import { Router } from "express";
import { authMiddleware } from "../middleware/auth.ts";
import { getDashboardOverview } from "../controllers/dashboard.controller.ts";

const router = Router();

router.get("/", authMiddleware, getDashboardOverview);

export default router;