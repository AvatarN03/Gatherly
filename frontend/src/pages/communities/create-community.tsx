import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { MapPin, Tag, AlignLeft, Users, Loader2, X } from 'lucide-react'
import { useUser } from '@clerk/react'
import toast from 'react-hot-toast'

import { Field } from '../../components/Field'
import { ImageUpload } from '../../components/shared/ImageUpload'

import { useCreateCommunityMutation } from '../../hooks/useCommunities'

import { CommunityvalidateForm } from '../../lib/validation'

import { COMMUNITY_CATEGORIES, inputClass } from '../../constant'

import type { CreateCommunity } from '../../types'

const CreateCommunityPage = () => {
  const navigate = useNavigate()
  const createMutation = useCreateCommunityMutation()
  const [errors, setErrors] = useState<Partial<CreateCommunity>>({})
  const [imageFile, setImageFile] = useState<File | null>(null)

  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (!user && isLoaded) {
      navigate('/communities')
    }
  }, [user, isLoaded, navigate])

  const [formData, setFormData] = useState<CreateCommunity>({
    name: '',
    description: '',
    location: '',
    category: 'General',
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!CommunityvalidateForm(formData, setErrors)) return

    const payload = new FormData()
    payload.append('name', formData.name)
    payload.append('description', formData.description)
    payload.append('location', formData.location)
    payload.append('category', formData.category)

    if (imageFile) {
      payload.append('communityImage', imageFile)
    }

    try {
      const data = await toast.promise(createMutation.mutateAsync(payload), {
        loading: 'Creating community...',
        success: 'Community created successfully!',
        error: 'Failed to create community',
      })

      navigate(`/communities/${data.id}`)
    } catch (error) {
      console.error(error)
    }
  }

  const previewUrl = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : null), [imageFile])
 
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  return (
    <div className=" bg-night/50 py-10 px-4 min-h-[calc(100dvh-100px)]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-mist">Create a Community</h1>
          <p className="text-fog/50 text-sm mt-1">Fill in the details to start your community</p>
        </div>

        {createMutation.isError && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            <X className="w-4 h-4 shrink-0" />
            Failed to create community. Please try again.
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
                    disabled={createMutation.isPending}
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
                    disabled={createMutation.isPending}
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
                    disabled={createMutation.isPending}
                    placeholder="e.g. Mumbai, India"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </Field>

              <Field label="Category *" error={errors.category} classes={'cursor-pointer'}>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={createMutation.isPending}
                    className={`${inputClass} pl-10 appearance-none `}
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
                disabled={createMutation.isPending}
                label="Community Image"
              />

              {/* Preview card */}
              {formData.name && (
                <div className="bg-deep-ocean/75 border border-stone rounded-xl p-4">
                  <p className="text-fog text-xs uppercase tracking-widest mb-3">Preview</p>

                  {previewUrl && (
                    <div className="w-full h-32 mb-3 rounded-lg overflow-hidden">
                      <img src={previewUrl} alt="Community" className="w-full h-full object-cover" />
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
                    <span className="text-xs text-lavender bg-orchid/10 border border-orchid/20 px-2 py-0.5 rounded-full block ml-auto">
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
              disabled={createMutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 bg-orchid hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-mist py-2.5 px-6 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Community'
              )}
            </button>
            <button
              type="button"
              disabled={createMutation.isPending}
              onClick={() => navigate('/communities')}
              className="flex-1 bg-forest-teal border border-lavender/50  text-mist py-2.5 px-6 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-forest-teal hover:bg-forest-teal/90 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCommunityPage