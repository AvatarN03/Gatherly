import { useEffect, useMemo } from 'react'
import { ImagePlus, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { resizeImage } from '../../lib/image'
import { Field } from '../Field'



const MAX_FILE_SIZE_MB = 10
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']

type Props = {
  file: File | null
  onChange: (file: File | null) => void
  disabled?: boolean
  label?: string
  /**
   * URL of an already-saved image (e.g. event.imageUrl). Shown as the initial
   * preview until the user picks a replacement — no separate "current image"
   * card needed. Once a new `file` is chosen it takes over the same box.
   */
  existingImageUrl?: string | null
}

export const ImageUpload = ({
  file,
  onChange,
  disabled,
  label = 'Image',
  existingImageUrl,
}: Props) => {

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])

    useEffect(() => {
      return () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl)
      }
    }, [previewUrl])

  // A newly-picked file always wins; otherwise fall back to whatever's
  // already saved (if anything).
  const displayUrl = previewUrl ?? existingImageUrl ?? null

  const validateFile = (candidate: File): string | null => {
    if (!ACCEPTED_TYPES.includes(candidate.type)) {
      return 'Please upload a PNG, JPG, or WEBP image.'
    }
    if (candidate.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `Image must be smaller than ${MAX_FILE_SIZE_MB} MB.`
    }
    return null
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file later
    if (!selected) return

    const validationError = validateFile(selected)
    if (validationError) {
      toast.error(validationError)
      return
    }

    try {
      const resized = await resizeImage(selected)
      onChange(resized)
    } catch (err) {
      console.error(err)
      toast.error('Failed to process image. Please try another file.')
    }
  }

  const clearImage = () => {
    onChange(null)
  }

  return (
    <Field label={label}>
      {displayUrl ? (
        // Wrapping the whole preview in a <label> means clicking anywhere on
        // the image (not just a dedicated button) opens the file picker —
        // covers both "swap the existing image" and "pick a different new
        // one" without adding any extra buttons/space.
        <label className="relative rounded-xl overflow-hidden border border-orchid cursor-pointer group block">
          <img src={displayUrl} alt="Preview" className="w-full h-64 object-cover" />

          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
            <span className="opacity-0 group-hover:opacity-100 text-mist text-xs font-medium px-3 py-1.5 bg-slate-900/80 rounded-lg transition-opacity">
              Click to {file ? 'change' : 'replace'} image
            </span>
          </div>

          {/* Remove: only meaningful once a new file is actually pending —
              there's nothing to "remove" about an already-saved image via
              this control, so it stays hidden until a replacement exists. */}
          {file && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault() // don't let the click bubble to the <label> and reopen the picker
                clearImage()
              }}
              disabled={disabled}
              className="absolute top-3 right-3 p-1.5 bg-slate-900/80 hover:bg-slate-900 rounded-full text-mist cursor-pointer transition-colors z-10"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {file && (
            <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-slate-900/60 text-fog/80 text-xs truncate">
              {file.name}
            </div>
          )}

          <input
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            onChange={handleImageChange}
            disabled={disabled}
            className="hidden"
          />
        </label>
      ) : (
        <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate hover:border-orchid/50 rounded-xl cursor-pointer transition-colors group">
          <ImagePlus className="w-8 h-8 text-lavender group-hover:text-mist transition-colors mb-3" />
          <p className="text-mist text-sm font-medium">Click to upload image</p>
          <p className="text-fog text-xs mt-1 underline underline-offset-2">PNG, JPG, WEBP up to {MAX_FILE_SIZE_MB} MB</p>
          <input
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            onChange={handleImageChange}
            disabled={disabled}
            className="hidden"
          />
        </label>
      )}
    </Field>
  )
}