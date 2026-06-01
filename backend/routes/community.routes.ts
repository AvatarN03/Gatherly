import { Router } from "express";

import { authMiddleware } from "../middleware/auth.ts";

import {
  createCommunity,
  deleteCommunity,
  getCommunities,
  getCommunityById,
  getMyCommunities,
  updateCommunity,
//   verifyCommunity,
} from "../controllers/community.controller.ts";

import { upload, uploadToImageKit } from "../services/uploadImage.ts";

const router = Router();

// public routes
router.get("/", getCommunities);
router.get("/:id", getCommunityById);


// private routes 
router.get("/my", authMiddleware, getMyCommunities);


// Route: multer runs first → uploadToImageKit → your controller
router.post(
  "/",
  authMiddleware,
  upload.single("communityImage"),
  uploadToImageKit("communities"),
  createCommunity
);

router.delete(
  "/:id",
  authMiddleware,
  deleteCommunity,
);

router.patch(
  "/:id",
  authMiddleware,
  upload.single("updateCommunityImage"),
  uploadToImageKit("communities"),
  updateCommunity,
);

// TODO: verify the community 
// router.get("/:id/verify", verifyCommunity);



export default router;
