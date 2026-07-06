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
} from "../controllers/event.controller.ts";

import { upload, uploadToImageKit } from "../services/uploadImage.ts";

const router = Router();

// Public routes
router.get("/", getEvents);
router.get("/mine", authMiddleware, getMyEvents);
router.get("/registrations/mine", authMiddleware, getMyEventRegistrations);
router.get("/roles/mine", authMiddleware, getMyEventRoles);

router.get("/:id", getEventById);

// private routes
router.post(
  "/",
  authMiddleware,
  upload.single("eventImage"),
  uploadToImageKit("events"),
  createEvent,
);

router.patch(
  "/:id",
  authMiddleware,
  upload.single("updateEventImage"),
  uploadToImageKit("events"),
  updateEvent,
);

router.delete(
  "/:id",
  authMiddleware,
  deleteEvent,
);


// Registration routes

// -> user actions
router.post("/:id/register", authMiddleware, registerForEvent);
router.delete("/:id/register", authMiddleware, unregisterFromEvent);


router.get("/:id/registrations", authMiddleware, getEventRegistrations);

router.post("/:id/members", authMiddleware, addEventMember);
router.patch("/:id/members/:memberId", authMiddleware, updateEventMember);
router.delete("/:id/members/:memberId", authMiddleware, removeEventMember);

export default router;
