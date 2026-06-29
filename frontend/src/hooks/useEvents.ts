import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { api } from "../lib/axiosInstance";

import type { EventItem } from "../types";

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
    console.log(data);
    return data;
  },

  createEvent: async (event: FormData): Promise<EventItem> => {
    const { data } = await api.post("/events", event, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  // in eventsApi
  updateEvent: async (id: string, updates: FormData): Promise<EventItem> => {
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
    role: string = "MEMBER",
  ) => {
    const { data } = await api.post(`/events/${eventId}/members`, {
      userId,
      role,
    });
    return data;
  },

  removeEventMember: async (eventId: string, memberId: string) => {
    const { data } = await api.delete(`/events/${eventId}/members/${memberId}`);
    return data;
  },

  updateEventMember: async (
    eventId: string,
    memberId: string,
    role: string,
  ) => {
    const { data } = await api.patch(`/events/${eventId}/members/${memberId}`, {
      role,
    });
    return data;
  },

  getEventRegistrations: async (eventId: string) => {
    const { data } = await api.get(`/events/${eventId}/registrations`);
    return data;
  },
};

// Hook to fetch all events
export const useEventsQuery = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => eventsApi.getAllEvents(),
  });
};

export const useEventsInfiniteQuery = (search = "") => {
  return useInfiniteQuery({
    queryKey: ["events", "infinite", search],
    queryFn: ({ pageParam = 1 }) =>
      eventsApi.getAllEvents({ search, page: pageParam, limit: 12 }),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
  });
};

// Hook to fetch a single event
export const useEventQuery = (id: string) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => eventsApi.getEventById(id),
  });
};

// Hook to create an event
export const useCreateEventMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (event: FormData) => eventsApi.createEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

// Hook to update an event
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

export const useEventRegistrationsQuery = (eventId: string) =>
  useQuery({
    queryKey: ["event-registrations", eventId],
    queryFn: () => eventsApi.getEventRegistrations(eventId),
    enabled: !!eventId,
  });

// Hook to delete an event
export const useDeleteEventMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventsApi.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useRegisterForEventMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventsApi.registerForEvent(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["event", id],
      });

      queryClient.invalidateQueries({
        queryKey: ["events"],
      });

      queryClient.invalidateQueries({
        queryKey: ["registrations", "mine"],
      });
    },
  });
};

export const useUnregisterFromEventMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventsApi.unregisterFromEvent(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["event", id],
      });

      queryClient.invalidateQueries({
        queryKey: ["events"],
      });

      queryClient.invalidateQueries({
        queryKey: ["registrations", "mine"],
      });
    },
  });
};

// useEvents.ts — add these if missing
export const useMyEventsQuery = () =>
  useQuery({
    queryKey: ["events", "mine"],
    queryFn: () => api.get("/events/mine"),
  });

export const useMyRegistrationsQuery = () =>
  useQuery({
    queryKey: ["registrations", "mine"],
    queryFn: () => api.get("/events/registrations/mine"),
  });

export const useMyEventRolesQuery = () =>
  useQuery({
    queryKey: ["event-roles", "mine"],
    queryFn: () => api.get("/events/roles/mine"),
  });

// useMembership.ts — add this
export const useMyMembershipRequestsQuery = () =>
  useQuery({
    queryKey: ["membership-requests", "mine"],
    queryFn: () => api.get("/communities/requests/mine"),
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
