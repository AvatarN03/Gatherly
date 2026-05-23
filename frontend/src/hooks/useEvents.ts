import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/axiosInstance'
import type { EventItem } from '../types/event'

const eventsApi = {
  getAllEvents: async (): Promise<EventItem[]> => {
    const { data } = await api.get('/events')
    return data
  },

  getEventById: async (id: string): Promise<EventItem> => {
    const { data } = await api.get(`/events/${id}`)
    return data
  },

  createEvent: async (event: Omit<EventItem, 'id'>): Promise<EventItem> => {
    const { data } = await api.post('/events', event)
    return data
  },

  updateEvent: async (id: string, updates: Partial<EventItem>): Promise<EventItem> => {
    const { data } = await api.patch(`/events/${id}`, updates)
    return data
  },

  deleteEvent: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`)
  },
}

// Hook to fetch all events
export const useEventsQuery = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => eventsApi.getAllEvents(),
  })
}

// Hook to fetch a single event
export const useEventQuery = (id: string) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsApi.getEventById(id),
  })
}

// Hook to create an event
export const useCreateEventMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (event: Omit<EventItem, 'id'>) => eventsApi.createEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

// Hook to update an event
export const useUpdateEventMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<EventItem> }) =>
      eventsApi.updateEvent(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

// Hook to delete an event
export const useDeleteEventMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => eventsApi.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}
