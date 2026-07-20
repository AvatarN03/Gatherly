import { useState } from "react";

type DeleteCommunityModalProps = { 
  open: boolean; 
  isPending: boolean; 
  communityName: string;
  onCancel: () => void; 
  onConfirm: () => void; 
};

const DeleteCommunityModal = (
  { open, 
    isPending, 
    communityName, 
    onCancel, 
    onConfirm 
  }: DeleteCommunityModalProps) => 
  {
  const [confirmationText, setConfirmationText] = useState("");

  if (!open) return null;

  const isMatch = confirmationText.trim() === communityName;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-xl bg-night/70 p-6 shadow-lg border-orchid border-2">
        <h2 className="mb-2 text-lg font-semibold text-mist">Delete community?</h2>
        <p className="mb-6 text-sm text-fog/70 leading-relaxed">
          This cannot be undone. All members, requests, and events linked to this community will be permanently removed.
        </p>
        <p className="mb-2 text-sm text-fog/70">
          Type <span className="font-semibold text-fog">{communityName}</span> to
          confirm:
        </p>

        <input
          type="text"
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          placeholder={communityName}
          className="mb-6 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm text-gray-600 bg-gray-300 hover:bg-gray-100 cursor-pointer transition-colors">
            Cancel
          </button>
         <button
            onClick={onConfirm}
            disabled={!isMatch || isPending}
            className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer transition-colors"
          >
            {isPending ? "Deleting..." : "Yes, delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCommunityModal;