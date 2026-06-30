import { useState } from 'react'
import { X, Trash } from 'lucide-react'

type Props = {
    eventTitle: string
    open: boolean
    isPending: boolean
    onCancel: () => void
    onConfirm: () => void
}

const DeleteEventModal = ({ eventTitle, open, isPending, onCancel, onConfirm }: Props) => {

    const [confirmationText, setConfirmationText] = useState("");

    if (!open) return null;

    const isMatch = confirmationText.trim() === eventTitle;

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-deep-ocean border border-stone rounded-2xl p-6 max-w-sm w-full">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-red-400">
                        <Trash className="w-5 h-5" />
                        <h2 className="text-mist font-medium text-base">Delete Event</h2>
                    </div>
                    <button
                        onClick={onCancel}
                        disabled={isPending}
                        className="text-fog/50 hover:text-mist transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <p className="text-fog/70 text-sm leading-relaxed mb-1">
                    Are you sure you want to delete
                </p>
                <p className="text-mist text-sm font-medium mb-4 truncate">"{eventTitle}"?</p>
                <p className="text-fog/50 text-xs mb-6">
                    This will permanently remove the event, all registrations, and team assignments. This cannot be undone.
                </p>
                <p className="mb-2 text-sm text-fog/70">
                    Type <span className="font-semibold text-fog">{eventTitle}</span> to
                    confirm:
                </p>

                <input
                    type="text"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder={eventTitle}
                    className="mb-6 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />

                <div className="flex gap-3">
                    <button
                        onClick={onConfirm}
                         disabled={!isMatch || isPending}
                        className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                    >
                        {isPending ? 'Deleting...' : 'Delete Event'}
                    </button>
                    <button
                        onClick={onCancel}
                        disabled={isPending}
                        className="flex-1 bg-forest-teal border border-lavender/50 text-mist text-sm font-medium py-2.5 rounded-lg transition-colors hover:bg-forest-teal/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteEventModal