// components/MemberProfileDialog.tsx
import { X, Mail, Calendar, Shield } from 'lucide-react'
import { ROLE_CONFIG } from '../constant'
import type { Membership } from '../types'
import { formatDate } from '../lib/date'

interface MemberProfileDialogProps {
  member: Membership
  image?: string | null
  onClose: () => void
}

export const MemberProfileDialog = ({
  member,
  image,
  onClose,
}: MemberProfileDialogProps) => {
  const { label, icon: Icon, className } = ROLE_CONFIG[member.role]

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-deep-ocean border border-stone/40 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top banner + avatar */}
        <div className="relative">
          <img
            src={image ?? '/image-holder.jpg'}
            alt="Community Banner"
            className="w-full h-32 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 bg-black/30 hover:bg-black/50 rounded-full text-fog/70 hover:text-mist border border-stone/40 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute -bottom-8 left-6 border-2 border-orchid rounded-2xl shadow-lg bg-black/20">
            {member.user?.imageUrl ? (
              <img
                src={member.user.imageUrl}
                alt={member.user.name}
                className="w-16 h-16 rounded-2xl object-cover border-4 border-[#0e2030] shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-orchid/30 border-4 border-[#0e2030] flex items-center justify-center text-lavender font-bold text-2xl shadow-lg">
                {member.user?.name?.charAt(0).toUpperCase() ?? '?'}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="pt-12 px-6 pb-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-mist leading-tight">
                {member.user?.name ?? '—'}
              </h3>
            </div>
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium border px-2.5 py-1 rounded-full shrink-0 ${className}`}>
              <Icon className="w-3.5 h-3.5" />
              {label}
            </span>
          </div>

          <div className="space-y-3">
            {member.user?.email && (
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-stone/20 shrink-0">
                  <Mail className="w-4 h-4 text-lavender" />
                </div>
                <span className="text-fog/80 truncate">{member.user.email}</span>
              </div>
            )}

            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 rounded-lg bg-stone/20 shrink-0">
                <Shield className="w-4 h-4 text-lavender" />
              </div>
              <span className="text-fog/80 border-2 rounded-full border-lavender px-2 py-1">
                Joined {formatDate(member.createdAt)}
              </span>
            </div>

            {member.user?.createdAt && (
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-stone/20 shrink-0">
                  <Calendar className="w-4 h-4 text-lavender" />
                </div>
                <span className="text-fog/80">
                  Member since {formatDate(member.user.createdAt)}
                </span>
              </div>
            )}

            {/* Add proofUrl if present */}
            {member.proofUrl && (
              <div className="mt-4 pt-4 border-t border-stone/20">
                <a
                  href={member.proofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-lavender hover:text-orchid transition-colors flex items-center gap-2"
                >
                  <span>🔗 View Proof</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}