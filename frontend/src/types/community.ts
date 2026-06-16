import type { RefObject } from "react"

export interface Community {
  id: string
  name: string
  description: string
  imageUrl: string
  imageFileId: string
  category: string
  location: string
  createdById: string
  createdAt: string
  updatedAt: string
  members?: Membership[]
}

export interface Membership {
  id: string
  userId: string
  communityId: string
  role: CommunityRole
  createdAt: string
  user: User
  community?: Community
  status: RequestStatus
}

export interface MembershipRequest {
  id: string
  userId: string
  communityId: string
  proofUrl: string
  status: RequestStatus
  createdAt: string
  user?: User
  community?: Community
}

export interface User {
  id: string
  clerkUserId: string
  email: string
  name: string
  imageUrl: string
  createdAt: string
  updatedAt: string
}

export type CommunityRole = 'OWNER' | 'ADMIN' | 'MEMBER'
export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface CreateCommunityDto {
  name: string
  description: string
  location: string
  category: string
}

export type UpdateCommunityDto = Partial<CreateCommunityDto>

export interface VerifyCommunityResponse {
  message: string
}


export interface CommunityGridType {
  communities: Community[]
  isLoading: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean
  search: string
  sentinelRef: RefObject<HTMLDivElement | null>
}

export type CommunityTab = "overview" | "events" | "members" | "requests";