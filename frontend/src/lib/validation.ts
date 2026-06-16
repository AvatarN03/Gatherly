import type { CreateCommunityDto } from "../types"

export const CommunityvalidateForm = (formData: CreateCommunityDto, setErrors: React.Dispatch<React.SetStateAction<Partial<CreateCommunityDto>>>): boolean => {
    const newErrors: Partial<CreateCommunityDto> = {}
    if (!formData.name.trim()) newErrors.name = 'Community name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
