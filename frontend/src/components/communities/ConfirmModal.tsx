import { useState } from 'react'

import { AlertTriangle, X } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isPending: boolean
  title: string
  description: string
  warningNote?: string
  confirmWord?: string 
  confirmButtonLabel: string
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  title,
  description,
  warningNote,
  confirmWord,
  confirmButtonLabel,
}: ConfirmModalProps) => {
  const [inputValue, setInputValue] = useState('')

  if (!isOpen) return null

  const requiresTyping = !!confirmWord
  const isConfirmDisabled =
    isPending || (requiresTyping && inputValue.trim() !== confirmWord)

  const handleClose = () => {
    setInputValue('')
    onClose()
  }

  const handleConfirm = () => {
    if (isConfirmDisabled) return
    onConfirm()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-lavender border-2 border-cocoa rounded-md w-full max-w-md p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 cursor-pointer bg-slate/40 hover:bg-slate/60  rounded-full p-2 text-fog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h2 className="text-sm font-bold tracking-widest text-night uppercase">
            {title}
          </h2>
        </div>

        <p className="text-xs text-night/80 mb-3">{description}</p>

        {warningNote && (
          <div className="bg-cocoa/30 border border-amber-400/30 rounded-lg p-3 mb-4">
            <p className="text-xs text-forest-teal font-medium leading-loose">{warningNote}</p>
          </div>
        )}

        {requiresTyping && (
          <div className="mb-4">
            <label className="text-xs text-night/70 mb-1 block">
              Type <span className="font-bold">{confirmWord}</span> to confirm
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={confirmWord}
              className="w-full px-3 py-2 text-sm rounded-lg border border-cocoa bg-night/10 text-night focus:outline-none focus:ring-2 focus:ring-cocoa/50"
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="w-full py-2.5 text-xs tracking-widest rounded-lg border border-cocoa text-night hover:bg-cocoa/10 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className="w-full py-2.5 text-xs tracking-widest rounded-lg bg-red-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-700 transition-colors cursor-pointer"
          >
            {isPending ? 'Processing...' : confirmButtonLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal