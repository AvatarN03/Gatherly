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

// private routes 
router.get("/my", authMiddleware, getMyCommunities);

// it must be below to avoid conflict with /my route
router.get("/:id", getCommunityById);


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

router.put(
  "/:id",
  authMiddleware,
  upload.single("updateCommunityImage"),
  uploadToImageKit("communities"),
  updateCommunity,
);

// TODO: verify the community 
// router.get("/:id/verify", verifyCommunity);



export default router;
