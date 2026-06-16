import type { EventSubCategory } from "../constant"
import type { CommunityCategory } from "../constant"
import type { Membership } from "./community"

export type EventItem = {
  title: string
  date: string
  time: string
  createdBy: string
  location: string
  description: string
  communityId: string
  imageUrl?: string
  imageFileId?: string
  category: CommunityCategory | ""
  subCategory: EventSubCategory | ""
  members: Membership[]
}