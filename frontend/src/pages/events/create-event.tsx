import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateEventMutation } from '../../hooks/useEvents'
import { useMyCommunityQuery } from '../../hooks/useCommunities'
import type { EventItem } from '../../types/event'
import { EVENT_SUBCATEGORIES, type CommunityCategory } from '../../constant'

const CreateEvent = () => {
  const navigate = useNavigate()
  const { mutate, isPending } = useCreateEventMutation()
  const { data: communities = [] } = useMyCommunityQuery()
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [formData, setFormData] = useState<Partial<EventItem>>({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    communityId: '',
    category: '',
    subCategory: '',
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
  }

  const selectedCommunity = communities.find((c) => c.id === formData.communityId)
  const subcategories = selectedCommunity && 'category' in selectedCommunity
    ? EVENT_SUBCATEGORIES[selectedCommunity.category as CommunityCategory] ?? []
    : []

  // ✅ fixed generic type
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // ✅ reset subCategory and auto-set category from community on communityId change
      ...(name === 'communityId' ? {
        subCategory: '',
        category: communities.find((c) => c.id === value)?.category || '',
      } : {}),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.communityId) {
      alert('Please select a community')
      return
    }

    const payload = new FormData()
    payload.append('title', formData.title || '')
    payload.append('date', formData.date || '')
    payload.append('time', formData.time || '')
    payload.append('location', formData.location || '')
    payload.append('description', formData.description || '')
    payload.append('communityId', formData.communityId || '')
    payload.append('category', formData.category || '')
    payload.append('subCategory', formData.subCategory || '')  // ✅ added
    if (imageFile) {
      payload.append('image', imageFile)
    }

    mutate(payload, {
      onSuccess: () => navigate('/events'),
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
          <p className="mt-2 text-gray-600">Fill in the details below to create a new event</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Community</label>
              <select
                name="communityId"
                value={formData.communityId}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select a community</option>
                {communities.map((community) => (
                  <option key={community.id} value={community.id}>
                    {community.name}
                  </option>
                ))}
              </select>
            </div>

            {
              formData.category && (


                <div>
                  <label className="block text-sm font-medium text-gray-700">Community Category</label>
                  <input
                    value={formData.category}
                    disabled

                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                  />

                </div>
              )
            }

            <div>
              <label className="block text-sm font-medium text-gray-700">Event Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter event title"
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter event location"
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter event description"
                rows={5}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2"
              />
              {imageFile && (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="mt-2 h-32 w-full object-cover rounded-lg"
                />
              )}
            </div>

            {/* ✅ only shows after community is selected */}
            {subcategories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Sub-Category</label>
                <select
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select a sub-category</option>
                  {subcategories.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {isPending ? 'Creating...' : 'Create Event'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/events')}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateEvent