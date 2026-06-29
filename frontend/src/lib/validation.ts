import type { CreateCommunity, CreateEvent, EventItem } from "../types"

export const CommunityvalidateForm = (formData: CreateCommunity, setErrors: React.Dispatch<React.SetStateAction<Partial<CreateCommunity>>>): boolean => {
    const newErrors: Partial<CreateCommunity> = {}
    if (!formData.name.trim()) newErrors.name = 'Community name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

export const EventValidateForm = (
  formData: Partial<CreateEvent | EventItem>,
  setErrors: React.Dispatch<React.SetStateAction<Partial<CreateEvent>>>
): boolean => {
  const newErrors: Partial<CreateEvent | EventItem> = {}

  if (!formData.communityId?.trim()) newErrors.communityId = 'Please select a community'
  if (!formData.title?.trim()) newErrors.title = 'Event title is required'
  if (!formData.date?.trim()) newErrors.date = 'Date is required'
  if (!formData.time?.trim()) newErrors.time = 'Time is required'
  if (!formData.location?.trim()) newErrors.location = 'Location is required'
  if (!formData.description?.trim()) newErrors.description = 'Description is required'

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}