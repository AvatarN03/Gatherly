import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {  useEventRegistrationsQuery } from '../../hooks/useEvents'
import { useAuth } from '@clerk/react'
import { useEventContext } from '../../context/eventContext'

type Registration = {
  id: string
  userId: string
  eventId: string
  registeredAt: string
  user: {
    id: string
    name: string
    email: string
    imageUrl?: string
  }
}

const GetEventRegisters = () => {

  const {userId} = useAuth();
  const navigate = useNavigate();

  const { event, isCreator, isCommunityAdmin } = useEventContext();
  const {
    data: registrations = [],
    isLoading,
    isError,
  } = useEventRegistrationsQuery(event.id || '');

  const currentMember = event?.members?.find(
    (m) => m.userId === userId
  );

  const canViewRegistrations =
    isCreator ||
    isCommunityAdmin ||
    currentMember?.role === "COORDINATOR";


  // ✅ navigate in useEffect, not during render
 useEffect(() => {
  if (!canViewRegistrations) {
    navigate(`/events/${event.id}`);
  }
}, [canViewRegistrations, navigate, event.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-2xl">
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-2xl">
          <p className="text-red-500">Failed to load registrations.</p>
          <button
            onClick={() => navigate(`/events/${event.id}`)}
            className="mt-4 text-sm text-indigo-600 hover:underline"
          >
            ← Back to event
          </button>
        </div>
      </div>
    )
  }

  const typedRegistrations = registrations as Registration[]

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-2xl space-y-5">

        {/* Header */}
        <div>
          <button
            onClick={() => navigate(`/events/${event.id}`)}
            className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
          >
            ← Back to event
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Registrations</h1>
              {event?.title && (
                <p className="mt-1 text-sm text-gray-500">{event.title}</p>
              )}
            </div>
            <span className="rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-semibold text-indigo-700">
              {typedRegistrations.length} registered
            </span>
          </div>
        </div>

        {/* Empty state */}
        {typedRegistrations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-2xl">📭</p>
            <p className="mt-2 text-sm font-medium text-gray-700">No registrations yet</p>
            <p className="mt-1 text-xs text-gray-400">
              Share the event to get people registered.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm divide-y divide-gray-100">
            {typedRegistrations.map((reg, index) => (
              <div key={reg.id} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center text-xs font-medium text-gray-400">
                    {index + 1}
                  </span>
                  {reg.user?.imageUrl ? (
                    <img
                      src={reg.user.imageUrl}
                      alt={reg.user.name}
                      className="h-9 w-9 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
                      {reg.user?.name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{reg.user?.name}</p>
                    <p className="text-xs text-gray-500">{reg.user?.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Registered</p>
                  <p className="text-xs font-medium text-gray-600">
                    {reg.registeredAt
                      ? new Date(reg.registeredAt).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })
                      : '—'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default GetEventRegisters