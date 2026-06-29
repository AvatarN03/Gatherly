import { createContext, useContext } from 'react'
import type { EventItem, Membership, EventMember } from '../types'

type EventContextValue = {
  event: EventItem
  // current user's community membership (for OWNER/ADMIN check)
  communityMembership: Membership | undefined
  // current user's event team role (HOST, COORDINATOR, etc.)
  eventMembership: EventMember | undefined
  isCreator: boolean
  isCommunityAdmin: boolean   // OWNER or ADMIN in the community       // any role in event.members
}

export const EventContext = createContext<EventContextValue | null>(null)

export const useEventContext = () => {
  const ctx = useContext(EventContext)
  if (!ctx) throw new Error('useEventContext must be used inside EventWrapper')
  return ctx
}