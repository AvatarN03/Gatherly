import { createContext, useContext } from 'react'
import type { Community, Membership, MembershipRequest } from '../types'


type CommunityContextValue = {
  community: Community
  userMembership: Membership | undefined
  userRequest?: MembershipRequest | undefined
  isCreator: boolean
  isOwner: boolean
  isAdmin: boolean
}

export const CommunityContext = createContext<CommunityContextValue | null>(null)

export const useCommunityContext = () => {
  const ctx = useContext(CommunityContext)
  if (!ctx) throw new Error('useCommunityContext must be used inside CommunityWrapper')
  return ctx
}