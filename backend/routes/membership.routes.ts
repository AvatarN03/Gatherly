import { Router } from "express";

import { authMiddleware } from "../middleware/auth.ts";

import {
  getCommunitiesRequests,
  getCommunityRequests,
  getMembers,
//   getMyMemberships,
  getMyRequestForCommunity,
//   getMyRequests,
  handleRequest,
  joinCommunity,
  leaveCommunity,
  removeCommunityMember,
  updateMemberRole,
  withdrawRequest,
} from "../controllers/membership.controller.ts";
import { upload, uploadToImageKit } from "../services/uploadImage.ts";
import { registerLimiter } from "../middleware/rateLimit.ts";

const router = Router();

// private routes

// router.get("/mine", authMiddleware, getMyMemberships);

router.get("/requests", authMiddleware, getCommunitiesRequests);

// router.get("/requests/mine", authMiddleware, getMyRequests);

router.post(
  "/:id/join",
  authMiddleware,
  registerLimiter,
  upload.single("proofImage"),
  uploadToImageKit("join-proofs"),
  joinCommunity,
);

router.get("/:id/my-request", authMiddleware, getMyRequestForCommunity);

router.delete(
  "/:id/withdraw", 
  authMiddleware,
  registerLimiter, 
  withdrawRequest
);

router.patch("/:id/requests/:requestId", authMiddleware, handleRequest);

router.patch("/:id/members/:memberId", authMiddleware, updateMemberRole);
router.delete("/:id/members/:memberId", authMiddleware, removeCommunityMember);

router.get("/:id/members", authMiddleware, getMembers);

router.delete(
  "/:id/leave", 
  authMiddleware, 
  registerLimiter,
  leaveCommunity
);

// only owner/admin routes
router.get("/:id/requests", authMiddleware, getCommunityRequests);

export default router;
