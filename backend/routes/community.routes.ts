import { Router } from 'express';
import { createCommunity, deleteCommunity, getCommunities, getCommunityById, updateCommunity, verifyCommunity } from '../controllers/community.controller.ts';
import { authMiddleware } from '../middleware/auth.ts';

const router = Router();

router.get("/", getCommunities);

router.post("/", authMiddleware, createCommunity);

router.get("/:id", getCommunityById);

router.get("/:id/verify", verifyCommunity);

router.delete("/:id", authMiddleware, deleteCommunity)

router.patch("/:id", authMiddleware, updateCommunity)

export default router;