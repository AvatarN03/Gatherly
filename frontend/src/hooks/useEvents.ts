import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { api } from "../lib/axiosInstance";
import type { EventItem, EventRegistration } from "../types";

const eventsApi = {
  getAllEvents: async (
    params: { search?: string; page?: number; limit?: number } = {},
  ): Promise<{
    events: EventItem[];
    nextPage: number | null;
    total: number;
  }> => {
    const { data } = await api.get("/events", { params });
    return data;
  },

  getEventById: async (id: string): Promise<EventItem> => {
    const { data } = await api.get(`/events/${id}`);
    return data;
  },

  getMyEvents: async () => {
    const { data } = await api.get("/events/mine");
    console.log("data from getMyEvents:", data);
    return data;
  },

  getMyEventRoles: async () => {
    const { data } = await api.get("/events/roles/mine");
    console.log("data from getMyEventRoles:", data);
    return data;
  },

  getMyRegistrations: async () => {
    const { data } = await api.get("/events/registrations/mine");
    console.log("data from getMyRegistrations:", data);
    return data;
  },

  getEventRegistrations: async (
    eventId: string,
  ): Promise<EventRegistration[]> => {
    const { data } = await api.get(`/events/${eventId}/registrations`);
    return data;
  },

  createEvent: async (event: FormData): Promise<EventItem> => {
    const { data } = await api.post("/events", event, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  updateEvent: async (
    id: string,
    updates: FormData,
  ): Promise<EventItem> => {
    const { data } = await api.patch(`/events/${id}`, updates, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  deleteEvent: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`);
  },

  registerForEvent: async (id: string) => {
    const { data } = await api.post(`/events/${id}/register`);
    return data;
  },

  unregisterFromEvent: async (id: string) => {
    const { data } = await api.delete(`/events/${id}/register`);
    return data;
  },

  addEventMember: async (
    eventId: string,
    userId: string,
    role = "MEMBER",
  ) => {
    const { data } = await api.post(`/events/${eventId}/members`, {
      userId,
      role,
    });
    return data;
  },

  updateEventMember: async (
    eventId: string,
    memberId: string,
    role: string,
  ) => {
    const { data } = await api.patch(
      `/events/${eventId}/members/${memberId}`,
      { role },
    );
    return data;
  },

  removeEventMember: async (eventId: string, memberId: string) => {
    const { data } = await api.delete(
      `/events/${eventId}/members/${memberId}`,
    );
    return data;
  },
};

export const useEventsQuery = () =>
  useQuery({
    queryKey: ["events"],
    queryFn: () => eventsApi.getAllEvents(),
  });

export const useEventsInfiniteQuery = (search = "") =>
  useInfiniteQuery({
    queryKey: ["events", "infinite", search],
    queryFn: ({ pageParam = 1 }) =>
      eventsApi.getAllEvents({ search, page: pageParam, limit: 12 }),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
  });


export const useEventQuery = (id: string) =>
  useQuery({
    queryKey: ["event", id],
    queryFn: () => eventsApi.getEventById(id),
    enabled: !!id,
  });


export const useMyEventsQuery = () =>
  useQuery({
    queryKey: ["events", "mine"],
    queryFn: eventsApi.getMyEvents,
  });

export const useMyEventRolesQuery = () =>
  useQuery({
    queryKey: ["event-roles", "mine"],
    queryFn: eventsApi.getMyEventRoles,
  });


;

export const useCreateEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eventsApi.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};


export const useUpdateEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: FormData }) =>
      eventsApi.updateEvent(id, updates),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", id] });
    },
  });
};


export const useDeleteEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eventsApi.deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};



export const useRegisterForEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eventsApi.registerForEvent,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["registrations", "mine"] });
    },
  });
};



export const useUnregisterFromEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eventsApi.unregisterFromEvent,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["registrations", "mine"] });
    },
  });
};


export const useMyRegistrationsQuery = () =>
  useQuery({
    queryKey: ["registrations", "mine"],
    queryFn: eventsApi.getMyRegistrations,
  });



export const useEventRegistrationsQuery = (eventId: string) =>
  useQuery({
    queryKey: ["event-registrations", eventId],
    queryFn: () => eventsApi.getEventRegistrations(eventId),
    enabled: !!eventId,
  });


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
    }) => eventsApi.addEventMember(eventId, userId, role),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    },
  });
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
    }) => eventsApi.updateEventMember(eventId, memberId, role),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    },
  });
};



export const useRemoveEventMemberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      memberId,
    }: {
      eventId: string;
      memberId: string;
    }) => eventsApi.removeEventMember(eventId, memberId),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    },
  });
};






