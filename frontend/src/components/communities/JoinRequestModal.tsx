import { useRef, useState } from 'react'

import { X, Upload, IdCard } from 'lucide-react'
import toast from 'react-hot-toast'

import { resizeImage } from '../../lib/image'

interface JoinRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (file: File) => Promise<void>;
  isPending: boolean
}

const JoinRequestModal = ({ isOpen, onClose, onSubmit, isPending }: JoinRequestModalProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    if (!selected.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, etc).')
      return
    }
    if (selected.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.')
      return
    }

    setError(null)

    try {
      const resized = await resizeImage(selected)
      setFile(resized)
      setPreview(URL.createObjectURL(resized))
    } catch {
      setError('Could not process this image. Try a different file.')
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      setError("Please attach an ID/proof image to continue.");
      return;
    }

    try {
      await onSubmit(file);
    } catch {
      toast.error("Failed to submit request");
    } finally {
      setFile(null);
      setPreview(null);
      setError(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleClose = () => {
    setFile(null)
    setPreview(null)
    setError(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={handleClose}>
      <div className="bg-lavender border-4 border-cocoa rounded-md w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 bg-slate/50 p-2 rounded-full cursor-pointer text-night hover:text-fog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <IdCard className="w-5 h-5 text-night" />
          <h2 className="text-sm font-bold tracking-widest text-night uppercase">
            Verify to Join
          </h2>
        </div>

        <p className="text-xs text-night/80 mb-4">
          Please upload a photo of your ID or a clear selfie as proof of identity
          to submit your join request.
        </p>

        <label
          htmlFor={isPending ? undefined : "proof-upload"}
          className={`flex flex-col items-center justify-center border-2 border-dashed border-cocoa rounded-lg p-6 transition-colors ${isPending
              ? "opacity-60 cursor-not-allowed pointer-events-none"
              : "cursor-pointer hover:bg-cocoa/10"
            }`}
        >
          {preview ? (

            <div className="relative z-0 group">
              <img
                src={preview}
                alt="Proof preview"
                className="min-h-40 max-h-120 rounded-md object-contain"
              />
              <div className="flex absolute w-full h-full inset-0 items-center justify-center z-10 bg-black/20 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="text-white text-xs font-medium p-2 rounded-md bg-slate">Click to Change</span>
              </div>
            </div>


          ) : (
            <>
              <Upload className="w-6 h-6 text-night/60 mb-2" />
              <span className="text-xs text-night/60">Click to upload image</span>
            </>
          )}
        </label>
        <input
          id="proof-upload"
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isPending}
        />

        {error && <p className="text-xs text-red-600 mt-2">{error}</p>}

        <div className="flex gap-3 mt-5">
          <button
            onClick={handleClose}
            className="w-full py-2.5 text-xs tracking-widest rounded-lg border border-cocoa text-night hover:bg-cocoa/10 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full py-2.5 text-xs tracking-widest rounded-lg bg-cocoa text-white disabled:opacity-50 cursor-pointer"
          >
            {isPending ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default JoinRequestModal