import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/react'
import { Loader2, X, Users, AlignLeft, MapPin, Tag } from 'lucide-react'
import toast from 'react-hot-toast'

import { Field } from '../../components/Field'
import { ImageUpload } from '../../components/shared/ImageUpload'
import { EventDatePicker } from '../../components/events/EventDatePicker'
import { EventTimePicker } from '../../components/events/EventTimePicker'
import type { TeamMember } from '../../components/events/EventMemberRow'
import { EventTeamAssignment } from '../../components/events/EventTeamAssignment'

import { useCreateEventMutation } from '../../hooks/useEvents'
import { useMyCommunityQuery } from '../../hooks/useCommunities'

import { truncate } from '../../lib'
import { EventValidateForm } from '../../lib/validation'

import { EVENT_SUBCATEGORIES, INITIAL_FORM, inputClass } from '../../constant'
import type { CommunityCategory } from '../../constant'

import type { CreateEvent } from '../../types'

const CreateEventPage = () => {
  const navigate = useNavigate()
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (!user && isLoaded) {
      toast.error('You must be logged in to create an event')
      navigate('/events')
    }
  }, [user, isLoaded, navigate])

  const [formData, setFormData] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<CreateEvent>>({})
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [selectedMembers, setSelectedMembers] = useState<TeamMember[]>([])

  const { data: communities = [], isLoading: communitiesLoading } = useMyCommunityQuery()
  const { mutateAsync: createEvent, isPending, isError } = useCreateEventMutation()

  const selectedCommunity = useMemo(
    () => communities.find((c) => c.id === formData.communityId),
    [communities, formData.communityId]
  )

  const subcategories = useMemo(
    () =>
      selectedCommunity ? EVENT_SUBCATEGORIES[selectedCommunity.category as CommunityCategory] : [],
    [selectedCommunity]
  )

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    if (errors[name as keyof CreateEvent]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }

    if (name === 'communityId') {
      // Side effects live outside the updater so they run exactly once per change.
      setSelectedMembers([])
      const community = communities.find((c) => c.id === value)
      setFormData((prev) => ({
        ...prev,
        communityId: value,
        category: (community?.category as CommunityCategory) ?? '',
        subCategory: '',
      }))
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const setDate = (date: string) => setFormData((prev) => ({ ...prev, date }))
  const setTime = (time: string) => setFormData((prev) => ({ ...prev, time }))

  const resetForm = () => {
    setFormData(INITIAL_FORM)
    setImageFile(null)
    setSelectedMembers([])
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!EventValidateForm(formData, setErrors)) return

    const payload = new FormData()
    payload.append('title', formData.title || '')
    payload.append('date', formData.date || '')
    payload.append('time', formData.time || '')
    payload.append('location', formData.location || '')
    payload.append('description', formData.description || '')
    payload.append('communityId', formData.communityId || '')
    payload.append('category', formData.category || '')
    payload.append('subCategory', formData.subCategory || '')
    payload.append('members', JSON.stringify(selectedMembers))
    if (imageFile) payload.append('eventImage', imageFile)

    try {
      const result = await toast.promise(createEvent(payload), {
        loading: 'Creating event...',
        success: 'Event created successfully!',
        error: 'Failed to create event',
      })
      resetForm()
      navigate(`/events/${result.id}`)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="bg-night/50 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <h1 className="text-2xl font-medium text-mist">Create an Event</h1>
          <p className="text-fog/50 text-sm mt-1">Fill in the details to set up your event</p>
        </div>

        {isError && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            <X className="w-4 h-4 shrink-0" />
            Failed to create event. Please try again.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT column */}
            <div className="flex flex-col gap-6">
              <Field label="Community *" error={errors.communityId}>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />

                  {communitiesLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-fog" />
                  )}

                  <select
                    name="communityId"
                    value={formData.communityId}
                    onChange={handleChange}
                    disabled={isPending || communitiesLoading}
                    className={`${inputClass} pl-10 appearance-none pr-10 cursor-pointer truncate w-full max-w-2xl`}
                  >
                    <option value="">
                      {communitiesLoading ? 'Loading communities...' : 'Select a community'}
                    </option>

                    {communities.map((c) => (
                      <option key={c.id} value={c.id} title={c.name} className="bg-slate-900 text-mist">
                        {truncate(c.name)}
                      </option>
                    ))}
                  </select>
                </div>
              </Field>

              {formData.category && (
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
              )}

              {subcategories.length > 0 && (
                <Field label="Sub-Category *" error={errors.subCategory}>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Date" error={errors.date}>
                  <EventDatePicker value={formData.date} onChange={setDate} />
                </Field>

                <Field label="Time" error={errors.time}>
                  <EventTimePicker value={formData.time} onChange={setTime} />
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
              />

              {formData.communityId && (
                <EventTeamAssignment
                  communityId={formData.communityId}
                  selectedMembers={selectedMembers}
                  onChange={setSelectedMembers}
                  disabled={isPending}
                />
              )}
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
                  Creating...
                </>
              ) : (
                'Create Event'
              )}
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => navigate('/events')}
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

export default CreateEventPage