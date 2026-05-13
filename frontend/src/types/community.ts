export interface Community {
  id: string
  name: string
  description: string
  imageUrl: string
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
  user?: User
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
  imageUrl: string
  location: string
}

export interface UpdateCommunityDto extends Partial<CreateCommunityDto> {}

export interface VerifyCommunityResponse {
  message: string
}
