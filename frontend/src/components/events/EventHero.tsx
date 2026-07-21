import { Tag, Calendar, Clock, MapPin, CheckCircle, Loader2, LogOut, LogIn } from 'lucide-react'
import { SignInButton } from '@clerk/react'

import { useEventContext } from '../../context/eventContext'

import type { EventItem } from '../../types'
import { formatDate, formatLabel } from '../../lib/date'
import { Badge } from '../Badge'
import { EVENT_ROLE_BADGES, ORGANISER_BADGE } from '../../constant'
import { useState } from 'react'
import ConfirmModal from '../communities/ConfirmModal'

type Props = {
  event: EventItem
  isRegistered: boolean
  isMutating: boolean
  onJoin: () => void
  onLeave: () => void
}

const EventHero = ({ event, isRegistered, isMutating, onJoin, onLeave }: Props) => {
  const { isAuthenticated, isCreator, eventMembership } = useEventContext()

  const subCategoryLabel = event.subCategory?.replace(/([A-Z])/g, ' $1').trim();

  const roleBadge = eventMembership
    ? EVENT_ROLE_BADGES[eventMembership.role]
    : null;

  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleRegister = async () => {
    try {
      await onJoin();
      setShowRegisterModal(false);
    } catch {
      // The mutation hook/toast handles the error.
      // Keep the modal open so the user can retry.
    }
  };

  return (
    <div className="relative rounded-2xl border border-stone/30 bg-deep-ocean overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-purple-500/25 via-transparent to-transparent pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row gap-6 p-6">
        <div className="flex-1 flex flex-col justify-between gap-4">

          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {event.category && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-lavender bg-fog/10 border border-mist/20 px-2.5 py-1 rounded-full">
                  <Tag className="w-3 h-3" />
                  {event.category}
                </span>
              )}
              {event.subCategory && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-300 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full">
                  {subCategoryLabel || "GENERAL"}
                </span>
              )}
            </div>

            <h1 className="text-2xl font-semibold text-mist leading-tight">{event.title}</h1>
            <p className="text-fog text-sm mt-2 leading-relaxed max-w-3xl line-clamp-3">{event.description}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="flex items-center gap-1.5 text-xs text-lavender rounded-lg px-3 py-1.5 bg-lavender/10 border border-lavender/20">
              <Calendar className="w-3.5 h-3.5 text-fog" />
              {formatDate(event.date)}
            </span>
            {event.time && (
              <span className="flex items-center gap-1.5 text-xs text-lavender rounded-lg px-3 py-1.5 bg-lavender/10 border border-lavender/20">
                <Clock className="w-3.5 h-3.5 text-fog" />
                {formatLabel(event.time)}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-lavender rounded-lg px-3 py-1.5 bg-lavender/10 border border-lavender/20">
              <MapPin className="w-3.5 h-3.5 text-fog" />
              {event.location}
            </span>
          </div>

          {/* Action row */}
          {/* Action row */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {!isAuthenticated ? (
              <SignInButton mode="modal">
                <button className="flex items-center gap-2 bg-orchid hover:bg-purple-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors cursor-pointer">
                  <LogIn className="w-3.5 h-3.5" />
                  Sign in to register
                </button>
              </SignInButton>
            ) : isCreator || roleBadge ? (
              <>
                {isCreator && (
                  <Badge config={ORGANISER_BADGE} size="sm" />
                )}
                {roleBadge && (
                  <Badge config={roleBadge} size="sm" />
                )}
              </>
            ) : isRegistered ? (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-300 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-lg">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Registered
                </span>

                <button
                  onClick={onLeave}
                  disabled={isMutating}
                  className="flex items-center gap-2 bg-slate hover:bg-red-500/10 border border-[#70787A33] hover:border-red-500/30 text-stone hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm px-4 py-2 rounded-lg transition-all"
                >
                  {isMutating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Leaving...
                    </>
                  ) : (
                    <>
                      <LogOut className="w-3.5 h-3.5" />
                      Leave
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowRegisterModal(true)}
                disabled={isMutating}
                className="flex items-center gap-2 bg-orchid hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors cursor-pointer"
              >
                {isMutating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Join Event"
                )}
              </button>
            )}
          </div>
        </div>


       <div className="md:w-72 xl:w-86 md:h-fit sm:w-48 sm:h-48 w-full h-52 shrink-0 rounded-xl overflow-hidden border border-slate">
          <img
            src={event.imageUrl || '/image_holder.jpg'}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onConfirm={handleRegister}
        isPending={isMutating}
        title="Register for Event"
        description={`You're about to register for "${event.title}".`}
        warningNote="You'll be added to the attendee list. If you change your mind later, you can leave the event at any time."
        confirmButtonLabel="Register"
      />
    </div>
  )
}

export default EventHero