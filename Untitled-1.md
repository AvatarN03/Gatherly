# Event Management & Community Platform - Development TODO

> **Project Goal**: Build a complete event management platform where users can create/join communities, manage community admissions, create events, and register attendees. Communities can have multiple admins who manage the community collectively.

---

## PHASE 1: BACKEND - CORE FEATURES (Complete Missing Routes & Controllers)

### 1.1 User Management
- [ ] **Complete User Sync Route** (`/api/users/sync`)
  - Sync Clerk user data with Prisma DB on login
  - Handle profile updates (name, image, email)
  - Return user profile with communities and events
  - File: `backend/routes/user.routes.ts` and `backend/controllers/user.controller.ts` (create new)

### 1.2 Community Management - Role Management  
- [ ] **Add Role Change Endpoint**
  - Route: `PATCH /api/communities/:id/members/:userId/role`
  - Change member role (MEMBER → ADMIN → OWNER or vice versa)
  - Only OWNER can change roles
  - File: `backend/routes/community.routes.ts` + new controller method

- [ ] **Add Remove Member Endpoint**
  - Route: `DELETE /api/communities/:id/members/:userId`
  - Remove a member from community (OWNER/ADMIN only)
  - File: `backend/routes/community.routes.ts` + new controller method

- [ ] **Authorization Check for Community Updates**
  - Only OWNER or ADMIN can update community details
  - Add role verification to `updateCommunity` controller

### 1.3 Event Management - Complete Event Member & Registration Flow
- [ ] **Complete Add Event Member Function** (`addEventMember`)
  - Assign event roles (COORDINATOR, SPEAKER, HOST)
  - Only event creator or community ADMIN/OWNER can assign
  - File: `backend/controllers/event.controller.ts` (line ~200)

- [ ] **Complete Remove Event Member Function** (`removeEventMember`)
  - Remove coordinator/speaker from event
  - Only event creator or community ADMIN/OWNER can remove
  - File: `backend/controllers/event.controller.ts`

- [ ] **Event Registration Approval Flow**
  - Add `status` field to registration (PENDING → APPROVED/REJECTED)
  - Route: `PATCH /api/events/:id/registrations/:registrationId`
  - Only event creator can approve/reject
  - File: `backend/controllers/event.controller.ts` (new method)

- [ ] **Complete Event Registrations Retrieval**
  - Ensure `getEventRegistrations` returns with pagination
  - File: `backend/controllers/event.controller.ts`

- [ ] **Authorization Check for Event Updates**
  - Only event creator or community ADMIN can update events
  - Update `updateEvent` controller

### 1.4 Membership Request Handling
- [ ] **Complete `handleRequest` Controller** 
  - Finish the incomplete implementation
  - On APPROVED: create Membership record
  - On REJECTED: delete MembershipRequest
  - File: `backend/controllers/membership.controller.ts` (line ~90)

---

## PHASE 2: BACKEND - VALIDATION & ERROR HANDLING

### 2.1 Input Validation
- [ ] **Validate all request bodies** (name, email, description length limits)
  - Community: name (1-50 chars), description (1-500 chars)
  - Event: title (1-100 chars), description, date must be future
  - User: name, email format

- [ ] **Validate route parameters** (UUIDs, required fields)

### 2.2 Authorization Checks  
- [ ] **Audit all routes for proper authorization**
  - Community update/delete: only OWNER or system admin
  - Event update/delete: only creator or community ADMIN/OWNER
  - Membership requests: only OWNER/ADMIN can approve

### 2.3 Error Handling
- [ ] **Standardize error responses** (use consistent error format)
  - Create error handler middleware
  - File: `backend/middleware/errorHandler.ts` (new)

- [ ] **Add logging** for debugging
  - Replace console.log with proper logging

---

## PHASE 3: BACKEND - DATA & QUERIES

### 3.1 Pagination
- [ ] **Add pagination to list endpoints**
  - `GET /api/communities?skip=0&take=10`
  - `GET /api/events?skip=0&take=10`
  - `GET /api/memberships/:id/members?skip=0&take=10`
  - File: Update all `getMany` queries in controllers

### 3.2 Filtering & Search
- [ ] **Enhance search for communities** (by location, members count)
- [ ] **Enhance search for events** (by date range, available seats)

### 3.3 Database Queries Optimization
- [ ] **Add necessary indexes** in schema.prisma
  - On `createdById`, `communityId`, `eventId` fields
  - File: `backend/prisma/schema.prisma`

---

## PHASE 4: BACKEND - IMAGEKIT INTEGRATION

### 4.1 Image Upload
- [ ] **Create image upload service**
  - File: `backend/services/imageUpload.ts` (new)
  - Use ImageKit for uploading community/event images

- [ ] **Add image upload endpoints**
  - Route: `POST /api/upload/image`
  - Return signed URL for frontend upload
  - File: `backend/routes/upload.routes.ts` (new)

---

## PHASE 5: FRONTEND - AUTHENTICATION & SETUP

### 5.1 Clerk Integration
- [ ] **Wrap App with ClerkProvider** 
  - File: `frontend/src/main.tsx`

- [ ] **Setup protected routes**
  - File: `frontend/src/App.tsx` (new/update)
  - Redirect unauthenticated users to sign-in

### 5.2 API Client Setup
- [ ] **Enhance axios instance with auth tokens**
  - File: `frontend/src/lib/axiosInstance.ts`
  - Add Clerk token to request headers

---

## PHASE 6: FRONTEND - CORE HOOKS & UTILITIES

### 6.1 API Hooks
- [ ] **useUser Hook** - Get current logged-in user
  - File: `frontend/src/hooks/useUser.ts` (new)

- [ ] **useMemberships Hook** - Get user's community memberships
  - File: `frontend/src/hooks/useMemberships.ts` (new)

- [ ] **useEventRegistrations Hook** - Get user's event registrations
  - File: `frontend/src/hooks/useEventRegistrations.ts` (new)

- [ ] **Refine existing hooks** - Add error handling, loading states
  - Files: `useCommunities.ts`, `useEvents.ts`, `useDebounceValue.ts`

### 6.2 Type Definitions
- [ ] **Complete type definitions**
  - File: `frontend/src/types/index.ts`
  - Add types for Community, Event, Membership, User, EventRegistration

---

## PHASE 7: FRONTEND - COMMUNITY PAGES

### 7.1 Community List & Search
- [ ] **Communities Index Page** (`/communities`)
  - File: `frontend/src/pages/communities/index.tsx`
  - Display all communities with search
  - Show "Join" button for non-members
  - Show member count

### 7.2 Community Detail Page
- [ ] **Community Detail & Member Management** (`/communities/:id`)
  - File: `frontend/src/pages/communities/community-id.tsx`
  - Show community info, members list, events
  - For ADMIN/OWNER: show join requests, member management, role change UI
  - For non-members: show "Join Community" button

### 7.3 Create Community
- [ ] **Create Community Form** (`/communities/create`)
  - File: `frontend/src/pages/communities/create-community.tsx`
  - Form: name, description, location, image upload
  - Validate & submit to backend

### 7.4 Community Member Management (Admin View)
- [ ] **Join Requests Panel**
  - Show pending join requests
  - Approve/Reject buttons
  - File: `frontend/src/components/JoinRequestsList.tsx` (new)

- [ ] **Members Panel**
  - List all members with roles
  - Change role dropdown (OWNER/ADMIN only)
  - Remove member button
  - File: `frontend/src/components/MembersList.tsx` (new)

---

## PHASE 8: FRONTEND - EVENT PAGES

### 8.1 Event List & Search
- [ ] **Events Index Page** (`/events`)
  - File: `frontend/src/pages/events/index.tsx`
  - Display all events with search/filter
  - Show community name, date, registered count
  - Show "Register" button for non-registered users

### 8.2 Event Detail Page
- [ ] **Event Detail & Registration** (`/events/:id`)
  - File: `frontend/src/pages/events/event-id.tsx`
  - Show event info, registrations, assigned coordinators
  - For non-registered: "Register for Event" button
  - For registered: "Unregister" button
  - For creator/ADMIN: event edit, registration approval panel

### 8.3 Create Event
- [ ] **Create Event Form** (`/events/create`)
  - File: `frontend/src/pages/events/create-event.tsx`
  - Form: title, description, date, location, community selector, image upload
  - Validate date is future
  - Validate user is community member

### 8.4 Event Management (Creator/Admin View)
- [ ] **Registration Approval Panel**
  - Show pending registrations
  - Approve/Reject buttons
  - File: `frontend/src/components/RegistrationPanel.tsx` (new)

- [ ] **Coordinator/Speaker Assignment Panel**
  - Add/remove event members
  - Change roles (COORDINATOR, SPEAKER, HOST)
  - File: `frontend/src/components/EventMembersPanel.tsx` (new)

---

## PHASE 9: FRONTEND - DASHBOARD & USER PROFILE

### 9.1 User Dashboard
- [ ] **Dashboard Page** (`/dashboard`)
  - File: `frontend/src/pages/dashboard.tsx`
  - Show user's communities (created, joined)
  - Show user's registered events
  - Quick stats: communities, events, pending requests

### 9.2 User Profile
- [ ] **User Profile Page** (`/profile`)
  - File: `frontend/src/pages/profile.tsx` (new)
  - Show user info, edit profile
  - Show user's community memberships
  - Show user's event registrations

---

## PHASE 10: FRONTEND - NAVIGATION & LAYOUT

### 10.1 Navbar Enhancement
- [ ] **Update Navbar Component**
  - File: `frontend/src/components/Navbar.tsx`
  - Add navigation links: Communities, Events, Dashboard, Profile
  - Add user sign-in/sign-out buttons (Clerk)
  - Responsive mobile menu

### 10.2 Routing Setup
- [ ] **Setup all routes in App.tsx**
  - File: `frontend/src/App.tsx` (update/create)
  - Configure React Router with all pages
  - Setup protected routes for authenticated users

---

## PHASE 11: FRONTEND - UI/UX & STYLING

### 11.1 Component Library
- [ ] **Create reusable components**
  - Button, Card, Modal, Loading, Error message components
  - File: `frontend/src/components/` (organize)

### 11.2 Tailwind CSS Styling
- [ ] **Apply consistent styling** across all pages
  - Use Tailwind color scheme, spacing, typography
  - Mobile responsive design
  - Dark mode (optional)

### 11.3 Loading & Error States
- [ ] **Add loading skeletons** for data fetching
- [ ] **Add error boundary** for crash handling
  - File: `frontend/src/components/ErrorBoundary.tsx` (new)

---

## PHASE 12: BACKEND - TESTING & PRODUCTION

### 12.1 API Testing
- [ ] **Test all endpoints** with Postman/Thunder Client
  - Community CRUD, membership, role changes
  - Event CRUD, registration, approval
  - Error scenarios (unauthorized, not found, etc.)

### 12.2 Database Seeding
- [ ] **Create seed data** for testing
  - File: `backend/prisma/seed.ts` (update)
  - Add test communities, users, events, memberships
  - Run: `npx prisma db seed`

### 12.3 Environment Setup
- [ ] **Create .env files** for both backend and frontend
  - Backend: DATABASE_URL, CLERK_SECRET_KEY, IMAGEKIT_PRIVATE_KEY
  - Frontend: VITE_API_URL, VITE_CLERK_PUBLISHABLE_KEY, VITE_IMAGEKIT_PUBLIC_KEY

---

## PHASE 13: FRONTEND - TESTING & DEPLOYMENT

### 13.1 Component Testing
- [ ] **Test React components** (optional)
  - Setup Jest/Vitest
  - Test critical components (forms, auth checks)

### 13.2 Build & Bundle
- [ ] **Build frontend for production**
  - Run: `npm run build`
  - Check bundle size

---

## PHASE 14: DEPLOYMENT

### 14.1 Backend Deployment
- [ ] **Deploy backend** to hosting (Vercel, Railway, Heroku, etc.)
  - Setup environment variables
  - Setup database (PostgreSQL)

### 14.2 Frontend Deployment
- [ ] **Deploy frontend** to hosting (Vercel, Netlify, etc.)
  - Setup environment variables
  - Connect to live backend API

### 14.3 DNS & Domain
- [ ] **Setup custom domain** (if needed)

---

## OPTIONAL ENHANCEMENTS

- [ ] **Email Notifications** - Send emails for join requests, event registrations
- [ ] **Analytics** - Track community/event usage
- [ ] **Real-time Updates** - Use WebSockets for live notifications
- [ ] **File Attachments** - Allow users to upload documents
- [ ] **Event Capacity** - Set max attendees per event
- [ ] **Payment Integration** - For paid events (Stripe)
- [ ] **Advanced Permissions** - More granular role-based access
- [ ] **Soft Deletes** - Archive communities/events instead of deleting
- [ ] **Audit Logs** - Track who changed what and when

---

## NOTES

- **Authentication**: Already setup with Clerk (auto-creates users on first login)
- **Database**: PostgreSQL with Prisma ORM (schema already defined)
- **Image Upload**: ImageKit is added to dependencies but not yet integrated
- **Authorization Pattern**: Check user role in community/event before allowing actions
- **Error Handling**: Should use consistent error format across all APIs
- **Frontend State**: Consider using TanStack Query for caching and sync

---

**Start with Phase 1 (Backend Routes)** → Phase 2-3 (Backend Polish) → Phase 5-7 (Frontend Core) → Rest

You can correct/modify this list as needed!