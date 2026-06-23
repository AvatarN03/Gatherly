import type { RefObject } from 'react';
import type { CommunityCategory, EventSubCategory, ROLE_CONFIG } from '../constant';

export interface User {
  id: string
  clerkUserId: string
  email: string
  name: string
  imageUrl: string
  createdAt: string
  updatedAt: string
}

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
  createdBy?: User
  events?: EventItem[]
  members?: Membership[]
  _count?: {
    members: number
    requests: number
  }
}


export interface Membership {
  id: string
  userId: string
  communityId: string
  role: CommunityRole
  createdAt: string
  user: User
  community?: Community

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


export type EventItem = {
  id?: string
  title: string
  date: string
  time: string
  createdBy: string
  location: string
  description: string
  communityId: string
  imageUrl?: string
  imageFileId?: string
  category: CommunityCategory | "General"
  subCategory: EventSubCategory | ""
  members: Membership[]
}




export type CommunityRole = 'OWNER' | 'ADMIN' | 'MEMBER';


export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface CreateCommunity {
  name: string
  description: string
  location: string
  category: string
}

export interface CommunityGridType {
  communities: Community[]
  isLoading: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean
  search: string
  sentinelRef: RefObject<HTMLDivElement | null>
}


export interface HeaderProps {
    title: string
    search: string
    onChange: (value: string) => void
    url:string
}

export type Role = keyof typeof ROLE_CONFIG;

export type StatusFilter = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL';

export type RequestHandelStatus = 'APPROVED' | 'REJECTED';

export type MemberRoleHandler = 'ADMIN' | 'MEMBER';