import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Loader2,
  X,
  Users,
  AlignLeft,
  MapPin,
  Tag
} from 'lucide-react'
import toast from 'react-hot-toast'

import { Field } from '../../components/Field'
import { IsEmpty } from '../../components/IsEmpty'
import { ImageUpload } from '../../components/shared/ImageUpload'
import { EventDatePicker } from '../../components/events/EventDatePicker'
import { EventTimePicker } from '../../components/events/EventTimePicker'
import { EventTeamAssignment } from '../../components/events/EventTeamAssignment'

import { useEventContext } from '../../context/eventContext'

import { useUpdateEventMutation } from '../../hooks/useEvents'

import { EventValidateForm } from '../../lib/validation'

import { EVENT_SUBCATEGORIES, inputClass } from '../../constant'
import type { CommunityCategory } from '../../constant'

import { type EventItem } from '../../types'

const EditEventPage = () => {
  const navigate = useNavigate()
  const { event, isCreator } = useEventContext();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<EventItem>>({})

  const { mutateAsync: updateEvent, isPending, isError } = useUpdateEventMutation()

  const [formData, setFormData] = useState<Partial<EventItem>>({
    title: event.title,
    date: event.date,
    time: event.time,
    location: event.location,
    description: event.description,
    communityId: event.communityId,
    category: event.category,
    subCategory: event.subCategory
  })



  const [selectedMembers, setSelectedMembers] = useState(
    (event.members ?? [])
      .map((m) => ({ userId: m.user.id, role: m.role })),
  )

  if (!isCreator) {
    return (
      <IsEmpty
        text="You don't have permission to edit this event. Only the event creator can make changes."
        href={`/events/${event.id}`}
        link="Back to Event"
        Icon={X}
      />
    )
  }

  const subcategories = EVENT_SUBCATEGORIES[(formData.category as CommunityCategory)] ??EVENT_SUBCATEGORIES['General']

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    if (errors[name as keyof EventItem]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!EventValidateForm(formData, setErrors)) return

    const payload = new FormData()
    payload.append('title', formData.title || '')
    payload.append('date', formData.date || '')
    payload.append('time', formData.time || '')
    payload.append('location', formData.location || '')
    payload.append('description', formData.description || '')
    payload.append('category', formData.category || '')
    payload.append('communityId', formData.communityId || '')
    payload.append('subCategory', formData.subCategory || '')
    payload.append('members', JSON.stringify(selectedMembers))

    if (imageFile) {
      payload.append("updateEventImage", imageFile);
    }

    try {
      await toast.promise(updateEvent({ id: event.id, updates: payload }), {
        loading: 'Saving changes...',
        success: 'Event updated successfully!',
        error: 'Failed to update event',
      })
      navigate(`/events/${event.id}`)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="bg-night/50 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Back + heading */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-medium text-mist">Edit Event</h1>
            <p className="text-fog/50 text-sm mt-1">Update the details for this event</p>
          </div>
        </div>

        {isError && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            <X className="w-4 h-4 shrink-0" />
            Failed to update event. Please try again.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* LEFT column */}
            <div className="flex flex-col gap-6">

              {/* Community — locked, cannot change on edit */}
              <Field label="Community (cannot be changed)">
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
                  <input
                    value={event.community?.name ?? ''}
                    disabled
                    className={`${inputClass} pl-10 opacity-50 cursor-not-allowed`}
                  />
                </div>
              </Field>

              {/* Category — locked, inherited from the community at creation */}
              <Field label="Community Category">
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
                  <input
                    value={formData.category}
                    disabled
                    className={`${inputClass} pl-10 opacity-50 cursor-not-allowed`}
                  />
                </div>
              </Field>

              {/* Sub-category — still editable */}
              {subcategories.length > 0 && (
                <Field label="Sub-Category *">
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
                    <select
                      name="subCategory"
                      value={formData.subCategory}
                      onChange={handleChange}
                      disabled={isPending}
                      className={`${inputClass} pl-10 appearance-none`}
                    >
                      <option value="">Select a sub-category</option>
                      {subcategories.map(({ value, label }: { value: string; label: string }) => (
                        <option key={value} value={value} className="bg-forest-teal">
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </Field>
              )}

              <Field label="Event Title *" error={errors.title}>
                <div className="relative">
                  <AlignLeft className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    disabled={isPending}
                    placeholder="e.g. Photography Walk — Marine Lines"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </Field>

              {/* Date + Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Date">
                  <EventDatePicker
                    value={formData.date}
                    onChange={(date) => setFormData((prev) => ({ ...prev, date }))}
                  />
                </Field>

                <Field label="Time">
                  <EventTimePicker
                    value={formData.time}
                    onChange={(time) => setFormData((prev) => ({ ...prev, time }))}
                  />
                </Field>
              </div>

              <Field label="Location *" error={errors.location}>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={isPending}
                    placeholder="e.g. Marine Lines, Mumbai"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </Field>

              <Field label="Description *" error={errors.description}>
                <div className="relative">
                  <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-stone" />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={isPending}
                    placeholder="What is this event about?"
                    rows={5}
                    className={`${inputClass} pl-10 resize-none`}
                  />
                </div>
              </Field>

            </div>

            {/* RIGHT column */}
             <div className="flex flex-col gap-6">
 
              <ImageUpload
                file={imageFile}
                onChange={setImageFile}
                disabled={isPending}
                label="Event Image"
                existingImageUrl={event.imageUrl ?? null}
              />
 
              {/* Event Team — fetches its own roster via useMembersQuery(communityId) */}
              <EventTeamAssignment
                communityId={event.communityId}
                selectedMembers={selectedMembers}
                onChange={setSelectedMembers}
                disabled={isPending}
              />
 
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 bg-orchid hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-mist py-2.5 px-6 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => navigate(`/events/${event.id}`)}
              className="flex-1 bg-forest-teal border border-lavender/50 text-mist py-2.5 px-6 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-forest-teal hover:bg-forest-teal/90 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditEventPage