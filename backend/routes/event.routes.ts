import { Router } from "express";

import { authMiddleware } from "../middleware/auth.ts";

import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  addEventMember,
  removeEventMember,
  getEventRegistrations,
  updateEventMember,
  getMyEvents,
  getMyEventRegistrations,
  getMyEventRoles,
  // getManagedEventRegistrations,
} from "../controllers/event.controller.ts";

import { upload, uploadToImageKit } from "../services/uploadImage.ts";
import { validate } from "../middleware/validate.ts";
import { eventSchema } from "../lib/event-schema.ts";
import { registerLimiter } from "../middleware/rateLimit.ts";

const router = Router();

// Public routes
router.get("/", getEvents);
router.get("/mine", authMiddleware, getMyEvents);
// router.get("/registrations", authMiddleware, getManagedEventRegistrations);
router.get("/registrations/mine", authMiddleware, getMyEventRegistrations);
router.get("/roles/mine", authMiddleware, getMyEventRoles);

router.get("/:id", getEventById);

// private routes
router.post(
  "/",
  authMiddleware,
  upload.single("eventImage"),
  uploadToImageKit("events"),
  validate(eventSchema),
  createEvent,
);

router.patch(
  "/:id",
  authMiddleware,
  upload.single("updateEventImage"),
  uploadToImageKit("events"),
   validate(eventSchema),
  updateEvent,
);

router.delete(
  "/:id",
  authMiddleware,
  deleteEvent,
);


// Registration routes

// -> user actions
router.post(
  "/:id/register", 
  authMiddleware,
  registerLimiter, 
  registerForEvent
);


router.delete(
  "/:id/register", 
  authMiddleware,
  registerLimiter, 
  unregisterFromEvent
);


router.get("/:id/registrations", authMiddleware, getEventRegistrations);

router.post("/:id/members", authMiddleware, addEventMember);
router.patch("/:id/members/:memberId", authMiddleware, updateEventMember);
router.delete("/:id/members/:memberId", authMiddleware, removeEventMember);

export default router;
