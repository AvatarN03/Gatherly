import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { api } from "../lib/axiosInstance";
import type { EventItem, EventRegistration } from "../types";

// ─────────────────────────────────────────
// Events — list / read
// ─────────────────────────────────────────

const getAllEvents = async (
  params: { search?: string; page?: number; limit?: number } = {}
): Promise<{ events: EventItem[]; nextPage: number | null; total: number }> => {
  const { data } = await api.get("/events", { params });
  return data;
};

export const useEventsQuery = () =>
  useQuery({
    queryKey: ["events"],
    queryFn: () => getAllEvents(),
  });

export const useEventsInfiniteQuery = (search = "") =>
  useInfiniteQuery({
    queryKey: ["events", "infinite", search],
    queryFn: ({ pageParam = 1 }) =>
      getAllEvents({ search, page: pageParam, limit: 12 }),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
  });

const getEventById = async (id: string): Promise<EventItem> => {
  const { data } = await api.get(`/events/${id}`);
  return data;
};

export const useEventQuery = (id: string) =>
  useQuery({
    queryKey: ["event", id],
    queryFn: () => getEventById(id),
    enabled: !!id,
  });

const getMyEvents = () => api.get("/events/mine");

export const useMyEventsQuery = () =>
  useQuery({
    queryKey: ["events", "mine"],
    queryFn: getMyEvents,
  });

const getMyEventRoles = () => api.get("/events/roles/mine");

export const useMyEventRolesQuery = () =>
  useQuery({
    queryKey: ["event-roles", "mine"],
    queryFn: getMyEventRoles,
  });

// ─────────────────────────────────────────
// Events — create / update / delete
// ─────────────────────────────────────────

const createEvent = async (event: FormData): Promise<EventItem> => {
  const { data } = await api.post("/events", event, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const useCreateEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

const updateEvent = async (id: string, updates: FormData): Promise<EventItem> => {
  const { data } = await api.patch(`/events/${id}`, updates, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const useUpdateEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: FormData }) =>
      updateEvent(id, updates),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", id] });
    },
  });
};

const deleteEvent = async (id: string): Promise<void> => {
  await api.delete(`/events/${id}`);
};

export const useDeleteEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

// ─────────────────────────────────────────
// Registration (attendee signs up for an event)
// ─────────────────────────────────────────

const registerForEvent = async (id: string) => {
  const { data } = await api.post(`/events/${id}/register`);
  return data;
};

export const useRegisterForEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerForEvent,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["registrations", "mine"] });
    },
  });
};

const unregisterFromEvent = async (id: string) => {
  const { data } = await api.delete(`/events/${id}/register`);
  return data;
};

export const useUnregisterFromEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unregisterFromEvent,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["registrations", "mine"] });
    },
  });
};

const getMyRegistrations = () => api.get("/events/registrations/mine");

export const useMyRegistrationsQuery = () =>
  useQuery({
    queryKey: ["registrations", "mine"],
    queryFn: getMyRegistrations,
  });

const getEventRegistrations = async (
  eventId: string
): Promise<EventRegistration[]> => {
  const { data } = await api.get(`/events/${eventId}/registrations`);
  return data;
};

export const useEventRegistrationsQuery = (eventId: string) =>
  useQuery({
    queryKey: ["event-registrations", eventId],
    queryFn: () => getEventRegistrations(eventId),
    enabled: !!eventId,
  });

// ─────────────────────────────────────────
// Event team members (HOST / COORDINATOR / VOLUNTEER / SPEAKER, etc.)
// ─────────────────────────────────────────

const addEventMember = async (
  eventId: string,
  userId: string,
  role: string = "MEMBER"
) => {
  const { data } = await api.post(`/events/${eventId}/members`, { userId, role });
  return data;
};

export const useAddEventMemberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      userId,
      role,
    }: {
      eventId: string;
      userId: string;
      role?: string;
    }) => addEventMember(eventId, userId, role),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    },
  });
};

const updateEventMember = async (eventId: string, memberId: string, role: string) => {
  const { data } = await api.patch(`/events/${eventId}/members/${memberId}`, { role });
  return data;
};

export const useUpdateEventMemberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      memberId,
      role,
    }: {
      eventId: string;
      memberId: string;
      role: string;
    }) => updateEventMember(eventId, memberId, role),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    },
  });
};

const removeEventMember = async (eventId: string, memberId: string) => {
  const { data } = await api.delete(`/events/${eventId}/members/${memberId}`);
  return data;
};

export const useRemoveEventMemberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, memberId }: { eventId: string; memberId: string }) =>
      removeEventMember(eventId, memberId),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    },
  });
};

// ─────────────────────────────────────────
// Community membership requests
// ─────────────────────────────────────────

const getMyMembershipRequests = () => api.get("/communities/requests/mine");

export const useMyMembershipRequestsQuery = () =>
  useQuery({
    queryKey: ["membership-requests", "mine"],
    queryFn: getMyMembershipRequests,
  });