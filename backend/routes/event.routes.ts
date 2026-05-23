import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.ts';
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
  getEventMembers,
  getEventRegistrations,
} from '../controllers/event.controller.ts';

const router = Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);
router.get('/:id/members', getEventMembers);

// Protected routes - event creation and management
router.post('/', authMiddleware, createEvent);
router.patch('/:id', authMiddleware, updateEvent);
router.delete('/:id', authMiddleware, deleteEvent);

// Registration routes
router.post('/:id/register', authMiddleware, registerForEvent);
router.delete('/:id/register', authMiddleware, unregisterFromEvent);
router.get('/:id/registrations', authMiddleware, getEventRegistrations);

// Event member management
router.post('/:id/members', authMiddleware, addEventMember);
router.delete('/:id/members/:memberId', authMiddleware, removeEventMember);

export default router;