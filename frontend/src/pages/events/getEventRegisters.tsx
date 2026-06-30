import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/react'
import { format } from 'date-fns'
import { Inbox, RefreshCw, X } from 'lucide-react'
import toast from 'react-hot-toast'

import { useEventRegistrationsQuery } from '../../hooks/useEvents'
import { useEventContext } from '../../context/eventContext'
import type { EventRegistration } from '../../types'


const RegistrationsLoading = () => (
  <div className="space-y-3">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="h-16 animate-pulse rounded-xl bg-deep-ocean/75 border border-stone/50"
      />
    ))}
  </div>
)

const RegistrationsError = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
    <X className="w-4 h-4 shrink-0" />
    Failed to load registrations.
    <button
      onClick={onRetry}
      className="ml-auto p-1 rounded-md hover:bg-red-500/10 cursor-pointer transition-colors"
      aria-label="Retry"
    >
      <RefreshCw className="w-4 h-4 text-mist" />
    </button>
  </div>
)

const RegistrationsEmpty = () => (
  <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate p-10 text-center">
    <Inbox className="w-8 h-8 text-lavender mb-3" />
    <p className="text-mist text-sm font-medium">No registrations yet</p>
    <p className="text-fog/40 text-xs mt-1">
      Share the event to get people registered.
    </p>
  </div>
)

const RegistrationRow = ({
  registration,
  index,
}: {
  registration: EventRegistration
  index: number
}) => {
  const { user, registeredAt } = registration

  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-3">
        <span className="w-6 text-center text-xs font-medium text-fog/40">
          {index + 1}
        </span>

        {user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={user.name}
            className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-600"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orchid/15 text-sm font-semibold text-orchid">
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
        )}

        <div>
          <p className="text-mist text-sm font-medium">{user?.name}</p>
          <p className="text-fog/50 text-xs">{user?.email}</p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-fog/40 text-xs">Registered</p>
        <p className="text-fog/70 text-xs font-medium">
          {registeredAt ? format(new Date(registeredAt), 'd MMM yyyy') : '—'}
        </p>
      </div>
    </div>
  )
}

const RegistrationsList = ({ registrations }: { registrations: EventRegistration[] }) => (
  <div className="rounded-xl border border-stone bg-deep-ocean/75 divide-y divide-slate-700/50">
    {registrations.map((reg, index) => (
      <RegistrationRow key={reg.id} registration={reg} index={index} />
    ))}
  </div>
)


const GetEventRegisters = () => {
  const { userId } = useAuth()
  const navigate = useNavigate()
  const { event, isCreator, isCommunityAdmin } = useEventContext()

  const {
    data: registrations = [],
    isLoading,
    isError,
    refetch,
  } = useEventRegistrationsQuery(event.id || '')

  const currentMember = event?.members?.find((m) => m.user.id === userId)
  const canViewRegistrations =
    isCreator || isCommunityAdmin || currentMember?.role === 'COORDINATOR'

  useEffect(() => {
    if (!canViewRegistrations) {
      toast.error("You don't have permission to view registrations for this event.")
      navigate(`/events/${event.id}`)
    }
  }, [canViewRegistrations, navigate, event.id])

  return (
    <div className="bg-night/50 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Back + heading */}
        <div className="mb-8">
         
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-medium text-mist">Registrations</h1>
              {event?.title && (
                <p className="text-fog/70 text-sm mt-1">Title: {event.title}</p>
              )}
            </div>
            <span className="shrink-0 rounded-full bg-orchid/10 border border-orchid/30 px-4 py-1.5 text-sm font-medium text-fog">
              {registrations.length} registered
            </span>
          </div>
        </div>

        {isLoading ? (
          <RegistrationsLoading />
        ) : isError ? (
          <RegistrationsError onRetry={refetch} />
        ) : registrations.length === 0 ? (
          <RegistrationsEmpty />
        ) : (
          <RegistrationsList registrations={registrations} />
        )}
      </div>
    </div>
  )
}

export default GetEventRegisters