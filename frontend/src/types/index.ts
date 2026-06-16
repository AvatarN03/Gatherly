import type { Community } from './community';
import type { EventItem } from './event';

export type {
  Community,
  Membership,
  MembershipRequest,
  User,
  CreateCommunityDto,
  UpdateCommunityDto,
  VerifyCommunityResponse,
  CommunityRole,
  RequestStatus,
} from './community'


export interface CommunityDetails extends Community {
  events: EventItem[];
}