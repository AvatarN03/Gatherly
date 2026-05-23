import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEventQuery, useUpdateEventMutation, useDeleteEventMutation } from '../../hooks/useEvents'
import type { EventItem } from '../../types/event'

const EventId = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: event, isLoading, isError } = useEventQuery(id || '')
  const { mutate: updateEvent, isPending: isUpdating } = useUpdateEventMutation()
  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEventMutation()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<EventItem> | null>(null)

  const handleEdit = () => {
    setIsEditing(true)
    setFormData(event || null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (formData) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSave = () => {
    if (formData && id) {
      updateEvent(
        { id, updates: formData },
        {
          onSuccess: () => {
            setIsEditing(false)
          },
        }
      )
    }
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?') && id) {
      deleteEvent(id, {
        onSuccess: () => {
          navigate('/events')
        },
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-2xl">
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    )
  }

  if (isError || !event) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-2xl">
          <p className="text-red-600">Failed to load event.</p>
          <button
            onClick={() => navigate('/events')}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  const displayEvent = formData || event

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/events')}
            className="text-indigo-600 hover:text-indigo-700"
          >
            ← Back to Events
          </button>
          {!isEditing && (
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:bg-gray-400"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          {isEditing ? (
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={displayEvent.title || ''}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={displayEvent.date || ''}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={displayEvent.time || ''}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={displayEvent.location || ''}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={displayEvent.description || ''}
                  onChange={handleChange}
                  rows={5}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-gray-400"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    setFormData(null)
                  }}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{displayEvent.title}</h1>

              <div className="mt-6 grid gap-6 md:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Community</p>
                  <p className="mt-2 text-lg text-gray-900">{(displayEvent as any)?.community?.name || 'N/A'}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">Date & Time</p>
                  <p className="mt-2 text-lg text-gray-900">
                    {displayEvent.date} • {displayEvent.time}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">Location</p>
                  <p className="mt-2 text-lg text-gray-900">{displayEvent.location}</p>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-sm font-medium text-gray-600">Description</p>
                <p className="mt-4 whitespace-pre-wrap text-gray-700">{displayEvent.description}</p>
              </div>

              <button className="mt-8 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700">
                Join Event
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventId