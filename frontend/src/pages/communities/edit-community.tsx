import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCommunityQuery, useUpdateCommunityMutation } from '../../hooks/useCommunities'
import type { Community, CreateCommunityDto } from '../../types'
import { COMMUNITY_CATEGORIES } from '../../constant'

// ✅ Inner form — only mounts when community is ready, so useState initializes correctly
const EditCommunityForm = ({ community }: { community: Community }) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const updateMutation = useUpdateCommunityMutation()
  const [errors, setErrors] = useState<Partial<CreateCommunityDto>>({})
  const [imageFile, setImageFile] = useState<File | null>(null)

  // ✅ Initializes directly from prop — no useEffect needed
  const [formData, setFormData] = useState<CreateCommunityDto>({
    name: community.name,
    description: community.description,
    location: community.location,
    category: community.category,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof CreateCommunityDto]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateCommunityDto> = {}
    if (!formData.name.trim()) newErrors.name = 'Community name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const payload = new FormData()
    payload.append('name', formData.name)
    payload.append('description', formData.description)
    payload.append('location', formData.location)
    payload.append('category', formData.category)
    if (imageFile) {
      payload.append('image', imageFile)
      if (community.imageFileId) {
        payload.append('imageFileId', community.imageFileId)
      }
    }

    try {
      await updateMutation.mutateAsync({ id: id!, data: payload })
      navigate(`/communities/${id}`)
    } catch (error) {
      console.error('Failed to update community:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold mb-8">Edit Community</h1>

          {updateMutation.isError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
              Error updating community. Please try again.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Community Name *</label>
              <input
                type="text" id="name" name="name"
                value={formData.name} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                id="description" name="description"
                value={formData.description} onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Community Image</label>
              <div className="flex gap-4">
                <img
                  src={imageFile ? URL.createObjectURL(imageFile) : community.imageUrl || '/default-community.png'}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1">
                  <input
                    type="file" accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <p className="text-sm text-gray-500 mt-2">Leave empty to keep current image</p>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <input
                type="text" id="location" name="location"
                value={formData.location} onChange={handleChange}
                placeholder="e.g., New York, USA"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                id="category" name="category"
                value={formData.category} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
              >
                {COMMUNITY_CATEGORIES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit" disabled={updateMutation.isPending}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {updateMutation.isPending ? 'Updating...' : 'Update Community'}
              </button>
              <button
                type="button" onClick={() => navigate(`/communities/${id}`)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// ✅ Outer shell — handles loading, only renders form when data is ready
const EditCommunity = () => {
  const { id } = useParams<{ id: string }>()
  const { data: community, isLoading } = useCommunityQuery(id || '')

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-600">Loading community...</div>
    </div>
  )

  if (!community) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-red-600">Community not found</div>
    </div>
  )

  return <EditCommunityForm community={community} />
}

export default EditCommunity