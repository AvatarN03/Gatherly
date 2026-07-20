import { Router } from "express";

import { authMiddleware } from "../middleware/auth.ts";

import {
  createCommunity,
  deleteCommunity,
  getCommunities,
  getCommunityById,
  getJoinedCommunities,
  getManagedCommunities,
  getMyCommunities,
  updateCommunity,
  //   verifyCommunity,
} from "../controllers/community.controller.ts";

import { upload, uploadToImageKit } from "../services/uploadImage.ts";
import { communitySchema, updateCommunitySchema } from "../lib/community-schema.ts";
import { validate } from "../middleware/validate.ts";
import { resizeImageIfNeeded } from "../services/resizeImage.ts";

const router = Router();

// public routes
router.get("/", getCommunities);

// private routes
router.get("/my", authMiddleware, getMyCommunities);
router.get("/managed", authMiddleware, getManagedCommunities);
router.get("/joined", authMiddleware, getJoinedCommunities);

// it must be below to avoid conflict with /my route
router.get("/:id", getCommunityById);

// Route: multer runs first → uploadToImageKit → your controller
router.post(
  "/",
  authMiddleware,
  upload.single("communityImage"),
  resizeImageIfNeeded,
  uploadToImageKit("communities"),
  validate(communitySchema),
  createCommunity,
);

router.delete("/:id", authMiddleware, deleteCommunity);

router.put(
  "/:id",
  authMiddleware,
  upload.single("updateCommunityImage"),
  uploadToImageKit("communities"),
  validate(updateCommunitySchema),
  updateCommunity,
);

// TODO: verify the community
// router.get("/:id/verify", verifyCommunity);

export default router;
