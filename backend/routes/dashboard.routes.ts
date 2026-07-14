import { Router } from "express";
import { authMiddleware } from "../middleware/auth.ts";
import { getAdminDashboardOverview, getIsAdmin, getUserDashboardOverview } from "../controllers/dashboard.controller.ts";

const router = Router();

router.get("/isadmin", authMiddleware, getIsAdmin)
router.get("/user", authMiddleware, getUserDashboardOverview);
router.get("/admin", authMiddleware, getAdminDashboardOverview);

export default router;