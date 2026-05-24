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
} from "../controllers/event.controller.ts";
import { upload, uploadToImageKit } from "../services/uploadImage.ts";

const router = Router();

// Public routes
router.get("/", getEvents);
router.get("/:id", getEventById);

// Protected routes - event creation and management
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  uploadToImageKit("events"),
  createEvent,
);
router.patch(
  "/:id",
  authMiddleware,
  upload.single("image"),
  uploadToImageKit("events"),
  updateEvent,
);
router.delete(
  "/:id",
  authMiddleware,
  upload.single("image"),
  uploadToImageKit("events"),
  deleteEvent,
);

// Registration routes
router.post("/:id/register", authMiddleware, registerForEvent);
router.delete("/:id/register", authMiddleware, unregisterFromEvent);
router.get("/:id/registrations", authMiddleware, getEventRegistrations);

// Event member management
router.post("/:id/members", authMiddleware, addEventMember);
router.delete("/:id/members/:memberId", authMiddleware, removeEventMember);

export default router;
