import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {  MapPin, Tag, AlignLeft, Users, Loader2, X } from 'lucide-react'
import toast from 'react-hot-toast'

import { Field } from '../../components/Field'
import { ImageUpload } from '../../components/shared/ImageUpload'
import { Error } from '../../components/Error'

import { useCommunityContext } from '../../context/communityContext'

import { useUpdateCommunityMutation } from '../../hooks/useCommunities'

import { COMMUNITY_CATEGORIES, inputClass } from '../../constant'

import { CommunityvalidateForm } from '../../lib/validation'

import type { CreateCommunity } from '../../types'

const EditCommunity = () => {
  const { community } = useCommunityContext();

  const navigate = useNavigate();

  const updateMutation = useUpdateCommunityMutation();

  const [errors, setErrors] = useState<Partial<CreateCommunity>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<CreateCommunity>({
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
    if (errors[name as keyof CreateCommunity]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!CommunityvalidateForm(formData, setErrors)) return

    const payload = new FormData()
    payload.append('name', formData.name ?? '')
    payload.append('description', formData.description ?? '')
    payload.append('location', formData.location ?? '')
    payload.append('category', formData.category ?? '')
    if (imageFile) {
      payload.append('updateCommunityImage', imageFile)
      if (community.imageFileId) payload.append('imageFileId', community.imageFileId)
    }

    try {
      const data = await toast.promise(
        updateMutation.mutateAsync({ id: community.id, data: payload }),
        {
          loading: 'Updating community...',
          success: 'Community updated successfully!',
          error: 'Failed to update community. Please try again.',
        }
      )
      navigate(`/communities/${data.id}`)
    } catch (error) {
      toast.error('Failed to update community. Please try again.')
      console.error('Failed to update community:', error)
    }
  }

  const pendingPreviewUrl = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : null), [imageFile])
  useEffect(() => {
    return () => {
      if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl)
    }
  }, [pendingPreviewUrl])

  const currentImage = pendingPreviewUrl ?? community.imageUrl ?? null

  if (!community) return (
   <Error
      isRefetching={updateMutation.isPending}
      handleRetry={() => navigate('/communities/my')}
      text="Failed to load community details."
   />
  )

  return (
    <div className="bg-night/50 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <h1 className="text-2xl font-medium text-mist">Edit Community</h1>
          <p className="text-fog/50 text-sm mt-1">Update your community's details and appearance</p>
        </div>

        {updateMutation.isError && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            <X className="w-4 h-4 shrink-0" />
            Failed to update community. Please try again.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* 2-column on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* LEFT column */}
            <div className="flex flex-col gap-6">

              <Field label="Community Name *" error={errors.name}>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={updateMutation.isPending}
                    placeholder="e.g. Mumbai Photographers"
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
                    disabled={updateMutation.isPending}
                    placeholder="What is this community about?"
                    rows={5}
                    className={`${inputClass} pl-10 resize-none`}
                  />
                </div>
              </Field>

              <Field label="Location *" error={errors.location}>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={updateMutation.isPending}
                    placeholder="e.g. Mumbai, India"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </Field>

              <Field label="Category *" error={errors.category} classes="cursor-pointer">
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={updateMutation.isPending}
                    className={`${inputClass} pl-10 appearance-none`}
                  >
                    {COMMUNITY_CATEGORIES.map(({ value, label }) => (
                      <option key={value} value={value} className="bg-forest-teal">
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </Field>

            </div>

            {/* RIGHT column */}
            <div className="flex flex-col gap-6">

             <ImageUpload
                file={imageFile}
                onChange={setImageFile}
                disabled={updateMutation.isPending}
                label="Community Image"
                existingImageUrl={community.imageUrl ?? null}
              />

              {/* Live preview card */}
              {formData.name && (
                <div className="bg-deep-ocean/75 border border-stone rounded-xl p-4">
                  <p className="text-fog text-xs uppercase tracking-widest mb-3">Preview</p>

                  {currentImage && (
                    <div className="w-full h-32 mb-3 rounded-lg overflow-hidden">
                      <img
                        src={currentImage}
                        alt="Community"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <p className="text-mist font-medium truncate">{formData.name}</p>
                  {formData.description && (
                    <p className="text-fog/75 text-sm mt-1 line-clamp-2">{formData.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-3">
                    {formData.location && (
                      <span className="text-mist text-xs flex items-center gap-1 py-0.5 px-2 bg-slate-800/50 border border-slate-700 rounded-full">
                        <MapPin className="w-3 h-3 text-fog" />
                        {formData.location}
                      </span>
                    )}
                    <span className="text-xs text-lavender bg-orchid/10 border border-orchid/20 px-2 py-0.5 rounded-full ml-auto">
                      {formData.category}
                    </span>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 bg-orchid hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-mist py-2.5 px-6 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Community'
              )}
            </button>
            <button
              type="button"
              disabled={updateMutation.isPending}
              onClick={() => navigate(`/communities/${community.id}`)}
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

export default EditCommunity