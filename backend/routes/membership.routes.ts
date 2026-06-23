import {Router} from 'express';

import { authMiddleware } from '../middleware/auth.ts';

import { getCommunityRequests, getMembers, getMyRequestForCommunity, getMyRequests, handleRequest, joinCommunity, leaveCommunity, removeCommunityMember, updateMemberRole, withdrawRequest } from '../controllers/membership.controller.ts';

const router = Router();

// private routes 
router.post("/:id/join", authMiddleware, joinCommunity);

router.get("/:id/my-request", authMiddleware, getMyRequestForCommunity );


router.delete("/:id/withdraw", authMiddleware, withdrawRequest);



router.patch("/:id/requests/:requestId", authMiddleware, handleRequest);

router.patch("/:id/members/:memberId", authMiddleware, updateMemberRole);
router.delete("/:id/members/:memberId", authMiddleware, removeCommunityMember);

router.get("/:id/members", authMiddleware, getMembers);

router.delete("/:id/leave", authMiddleware, leaveCommunity);

// only owner/admin routes
router.get("/:id/requests", authMiddleware, getCommunityRequests);


export default router;