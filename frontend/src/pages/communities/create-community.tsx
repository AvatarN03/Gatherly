import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateCommunityMutation } from '../../hooks/useCommunities'
import type { CreateCommunityDto } from '../../types'

const CreateCommunity = () => {
  const navigate = useNavigate()
  const createMutation = useCreateCommunityMutation()
  const [errors, setErrors] = useState<Partial<CreateCommunityDto>>({})

  const [formData, setFormData] = useState<CreateCommunityDto>({
    name: '',
    description: '',
    imageUrl: '',
    location: '',
  })

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateCommunityDto> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Community name is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required'
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field when user starts typing
    if (errors[name as keyof CreateCommunityDto]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await createMutation.mutateAsync(formData)
      navigate('/communities')
    } catch (error) {
      console.error('Failed to create community:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold mb-8">Create a New Community</h1>

          {createMutation.isError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
              Error creating community. Please try again.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Community Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Community Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter community name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your community..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Image URL *
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="mt-2 h-32 w-full object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., New York, USA"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Community'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/communities')}
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

export default CreateCommunity