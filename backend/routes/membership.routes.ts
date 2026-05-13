import {Router} from 'express';
import { authMiddleware } from '../middleware/auth.ts';
import { getCommunityRequests, getMembers, handleRequest, joinCommunity, leaveCommunity } from '../controllers/membership.controller.ts';

const router = Router();

router.post("/:id/join", authMiddleware, joinCommunity);

router.get("/:id/requests", authMiddleware, getCommunityRequests);

router.patch("/:id/requests/:requestId", authMiddleware, handleRequest);

router.get("/:id/members", authMiddleware, getMembers);

router.delete("/:id/leave", authMiddleware, leaveCommunity);


export default router;