import { Router } from 'express';
import { createCommunity, deleteCommunity, getCommunities, getCommunityById, getMyCommunities, updateCommunity, verifyCommunity } from '../controllers/community.controller.ts';
import { authMiddleware } from '../middleware/auth.ts';
import { upload, uploadToImageKit } from '../services/uploadImage.ts';

const router = Router();

router.get("/", getCommunities);
router.get("/my", authMiddleware, getMyCommunities);

router.post("/", authMiddleware,upload.single('image'), uploadToImageKit("communities"), createCommunity);
// Route: multer runs first → uploadToImageKit → your controller

router.get("/:id", getCommunityById);



router.get("/:id/verify", verifyCommunity);

router.delete("/:id", authMiddleware,upload.single('image'), uploadToImageKit("communities"), deleteCommunity)

router.patch("/:id", authMiddleware, upload.single('image'), uploadToImageKit("communities"), updateCommunity)

export default router;