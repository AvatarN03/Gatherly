import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { useAuth } from '@clerk/react'

import { format } from 'date-fns'

import { Inbox, RefreshCw, X, Mail, Calendar } from 'lucide-react'

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

// NEW: profile dialog for a single registrant
const RegistrationProfileDialog = ({
  registration,
  onClose,
}: {
  registration: EventRegistration
  onClose: () => void
}) => {
  const { event } = useEventContext()
  const { user, registeredAt } = registration

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
            src={event.imageUrl || '/image_holder.jpg'}
            alt="Event banner"
            className="w-full h-32 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 bg-black/30 hover:bg-black/50 rounded-full text-fog/70 hover:text-mist border border-stone/40 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute -bottom-8 left-6 border-2 border-orchid rounded-2xl shadow-lg bg-black/20">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover border-4 border-[#0e2030] shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-orchid/30 border-4 border-[#0e2030] flex items-center justify-center text-lavender font-bold text-2xl shadow-lg">
                {user?.name?.charAt(0).toUpperCase() ?? '?'}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="pt-12 px-6 pb-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <h3 className="text-lg font-semibold text-mist leading-tight">
              {user?.name ?? '—'}
            </h3>
            <span className="shrink-0 rounded-full bg-orchid/10 border border-orchid/30 px-3 py-1 text-xs font-medium text-fog">
              Registered
            </span>
          </div>

          <div className="space-y-3">
            {user?.email && (
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-stone/20 shrink-0">
                  <Mail className="w-4 h-4 text-lavender" />
                </div>
                <span className="text-fog/80 truncate">{user.email}</span>
              </div>
            )}

            {registeredAt && (
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-stone/20 shrink-0">
                  <Calendar className="w-4 h-4 text-lavender" />
                </div>
                <span className="text-fog/80 border-2 rounded-full border-lavender px-2 py-1">
                  Registered on {format(new Date(registeredAt), 'MMMM d, yyyy')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const RegistrationRow = ({
  registration,
  index,
  onSelect,
}: {
  registration: EventRegistration
  index: number
  onSelect: (registration: EventRegistration) => void
}) => {
  const { user, registeredAt } = registration

  return (
    <div
      className="flex items-center justify-between px-5 py-4 cursor-pointer transition-colors hover:bg-stone/10 group"
      onClick={() => onSelect(registration)}
      title="View profile"
    >
      <div className="flex items-center gap-3">
        <span className="w-6 text-center text-xs font-medium text-fog/40">
          {index + 1}
        </span>

        {user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={user.name}
            className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-600 group-hover:ring-lavender/50 transition-colors"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orchid/15 text-sm font-semibold text-orchid group-hover:ring-2 group-hover:ring-lavender/50 transition-all">
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
        )}

        <div>
          <p className="text-mist text-sm font-medium group-hover:text-lavender transition-colors">
            {user?.name}
          </p>
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

const RegistrationsList = ({
  registrations,
  onSelect,
}: {
  registrations: EventRegistration[]
  onSelect: (registration: EventRegistration) => void
}) => (
  <div className="rounded-xl border border-stone bg-deep-ocean/75 divide-y divide-slate-700/50">
    {registrations.map((reg, index) => (
      <RegistrationRow
        key={reg.id}
        registration={reg}
        index={index}
        onSelect={onSelect}
      />
    ))}
  </div>
)

const GetEventRegisters = () => {
  const { userId } = useAuth()
  const navigate = useNavigate()
  const { event, isCreator, isCommunityAdmin } = useEventContext()

  const [profileRegistration, setProfileRegistration] =
    useState<EventRegistration | null>(null)

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
          <RegistrationsList
            registrations={registrations}
            onSelect={setProfileRegistration}
          />
        )}
      </div>

      {/* Profile dialog */}
      {profileRegistration && (
        <RegistrationProfileDialog
          registration={profileRegistration}
          onClose={() => setProfileRegistration(null)}
        />
      )}
    </div>
  )
}

export default GetEventRegisters