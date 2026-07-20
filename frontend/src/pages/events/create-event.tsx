import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/react'
import {
  ArrowLeft,
  Loader2,
  X,
  ImagePlus,
  Users,
  AlignLeft,
  MapPin,
  Tag,
  UserCheck,
} from 'lucide-react'
import toast from 'react-hot-toast'

import { Field } from '../../components/Field'
import { EventDatePicker } from '../../components/events/EventDatePicker'
import { EventTimePicker } from '../../components/events/EventTimePicker'

import { useCreateEventMutation } from '../../hooks/useEvents'
import { useMyCommunityQuery } from '../../hooks/useCommunities'
import { useMembersQuery } from '../../hooks/useMembership'

import { truncate } from '../../lib'
import { EventValidateForm } from '../../lib/validation'

import { EVENT_MEMBER_ROLES, type CreateEvent } from '../../types'

import { EVENT_SUBCATEGORIES, inputClass } from '../../constant'
import type { CommunityCategory } from '../../constant'

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [selectedMembers, setSelectedMembers] = useState<Array<{ userId: string; role: string }>>([]);
  const [errors, setErrors] = useState<Partial<CreateEvent>>({});

  const { data: communities = [], isLoading: communitiesLoading } = useMyCommunityQuery();

  const { mutateAsync: createEvent, isPending, isError } = useCreateEventMutation();

  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!user && isLoaded) {
      toast.error('You must be logged in to create an event')
      navigate('/events')
    }
  }, [user, isLoaded, navigate])

  const [formData, setFormData] = useState<Partial<CreateEvent>>({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    communityId: '',
    category: 'General',
    subCategory: '',
  })

  // Fetch members for the selected community
  const { data: members = [], isLoading: membersLoading } = useMembersQuery(formData.communityId ?? '')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const selectedCommunity = communities.find((c) => c.id === formData.communityId)

  const subcategories =
    selectedCommunity && 'category' in selectedCommunity
      ? EVENT_SUBCATEGORIES[selectedCommunity.category as CommunityCategory] ?? []
      : []

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    if (errors[name as keyof CreateEvent]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
    setFormData((prev) => {
      if (name === 'communityId') {
        const community = communities.find((c) => c.id === value)
        setSelectedMembers([]) // reset team when community changes
        return {
          ...prev,
          communityId: value,
          category: (community?.category as CommunityCategory) ?? '',
          subCategory: '',
        }
      }
      return { ...prev, [name]: value }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // Reset errors before validation

    if (!EventValidateForm(formData, setErrors)) return;

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
      setFormData({});
      setImageFile(null);
      setImagePreview(null);
      setSelectedMembers([]);
      setErrors({});
      navigate(`/events/${result.id}`); 
    } catch (error) {
      toast.error('Failed to create event. Please try again.')
      console.error(error)
    }
  }

  return (
    <div className="bg-night/50 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Back + heading */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/events')}
            className="flex items-center text-fog/50 hover:text-mist text-sm transition-colors mb-4 hover:underline underline-offset-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Events
          </button>
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
                    <option value="" >
                      {communitiesLoading
                        ? "Loading communities..."
                        : "Select a community"}
                    </option>

                    {communities.map((c) => (
                      <option
                        key={c.id}
                        value={c.id}
                        title={c.name}
                        className="bg-slate-900 text-mist"
                      >
                        {truncate(c.name)}
                      </option>
                    ))}
                  </select>
                </div>
              </Field>

              {/* Category — auto-filled, read-only */}
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

              {/* Sub-category */}
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

              {/* Date + Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Date" error={errors.date}>
                  <EventDatePicker
                    value={formData.date}
                    onChange={(date) => setFormData((prev) => ({ ...prev, date }))}
                  />
                </Field>

                <Field label="Time" error={errors.time}>
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

              {/* Image upload */}
              <Field label="Event Image">
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-orchid">
                    <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
                    <button
                      type="button"
                      onClick={clearImage}
                      disabled={isPending}
                      className="absolute top-3 right-3 p-1.5 bg-slate-900/80 hover:bg-slate-900 rounded-full text-mist cursor-pointer transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-slate-900/60 text-fog/80 text-xs truncate">
                      {imageFile?.name}
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate hover:border-orchid/50 rounded-xl cursor-pointer transition-colors group">
                    <ImagePlus className="w-8 h-8 text-lavender group-hover:text-mist transition-colors mb-3" />
                    <p className="text-mist text-sm font-medium">Click to upload image</p>
                    <p className="text-fog text-xs mt-1 underline underline-offset-2">PNG, JPG up to 10 MB</p>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </Field>

              {/* Event Team — driven by useMembersQuery */}
              {formData.communityId && (
                <div className="bg-deep-ocean/75 border border-stone rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <UserCheck className="w-4 h-4 text-lavender" />
                    <p className="text-fog text-xs uppercase tracking-widest">Assign Event Team</p>
                  </div>

                  {membersLoading ? (
                    <div className="flex items-center gap-2 py-4 justify-center text-fog/50 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading members...
                    </div>
                  ) : members.length === 0 ? (
                    <p className="text-fog/40 text-sm text-center py-4">No members in this community yet.</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {members.map((member) => {
                        const selected = selectedMembers.find((m) => m.userId === member.userId)
                        
                        return (
                          <div
                            key={member.userId}
                            className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${selected
                              ? 'border-orchid/40 bg-orchid/5'
                              : 'border-slate-700/50 bg-slate-800/30'
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={member.user.imageUrl}
                                alt={member.user.name}
                                className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-600"
                              />
                              <div>
                                <p className="text-mist text-sm font-medium">{member.user.name}</p>
                                <p className="text-fog/50 text-xs">{member.role}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={!!selected}
                                className="accent-orchid cursor-pointer"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedMembers((prev) => [
                                      ...prev,
                                      { userId: member.userId, role: 'COORDINATOR' },
                                    ])
                                  } else {
                                    setSelectedMembers((prev) =>
                                      prev.filter((m) => m.userId !== member.userId)
                                    )
                                  }
                                }}
                              />
                              <select
                                disabled={!selected}
                                value={selected?.role ?? 'COORDINATOR'}
                                onChange={(e) => {
                                  setSelectedMembers((prev) =>
                                    prev.map((m) =>
                                      m.userId === member.userId ? { ...m, role: e.target.value } : m
                                    )
                                  )
                                }}
                                className={`${inputClass} py-1 px-2 text-xs disabled:opacity-40 disabled:cursor-not-allowed`}
                              >
                                {EVENT_MEMBER_ROLES.map((r) => (
                                  <option key={r} value={r}>
                                    {r}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
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