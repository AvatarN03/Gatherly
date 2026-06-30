import { useEffect, useState } from 'react'
import { Outlet, useParams, useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/react'
import { AlertTriangle } from 'lucide-react'

import EventTopBar from './EventTopBar'
import { EventSkeleton } from '../Skeleton'
import DeleteEventModal from './DeleteEventModal'


import { EventContext } from '../../context/eventContext'

import { useEventQuery, useDeleteEventMutation } from '../../hooks/useEvents'
import { useMembersQuery } from '../../hooks/useMembership'

const EventWrapper = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user: clerkUser, isLoaded } = useUser()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const { data: event, isLoading, isError } = useEventQuery(id || '')
  const deleteMutation = useDeleteEventMutation()

  // Once the event loads we know its communityId — fetch community members
  // to determine if the current user is OWNER/ADMIN there
  const { data: communityMembers = [] } = useMembersQuery(
    event?.communityId ?? ''
  )

    useEffect(()=>{
      if(!clerkUser && isLoaded)
      {
        navigate('/events');
      }
    }, [clerkUser, navigate, isLoaded])

  if (isLoading) return <EventSkeleton />

  if (isError || !event) {
    return (
      <div className="min-h-screen bg-night flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="p-4 bg-red-500/10 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-mist font-medium">Event not found</p>
          <button
            onClick={() => navigate('/events')}
            className="text-sm text-orchid hover:underline"
          >
            Back to events
          </button>
        </div>
      </div>
    )
  }

  // ── Derive permissions 
  const currentUserId = clerkUser?.id;

  // Community-level membership
  const communityMembership = communityMembers.find(
    (m) => m.userId === currentUserId
  )
  const isCommunityAdmin =
    communityMembership?.role === 'OWNER' ||
    communityMembership?.role === 'ADMIN'

  // Event-level team membership (from the event payload, already fetched)
  const eventMembers = (event.members ?? []);
  const eventMembership = eventMembers.find((m) => m.userId === currentUserId)

  // Creator check
  const isCreator = event.createdById === currentUserId

  // ── Render 
  return (
    <EventContext.Provider
      value={{
        event,
        communityMembership,
        eventMembership,
        isCreator,
        isCommunityAdmin,
      }}
    >
      <div className="bg-night/40 min-h-screen">
        <EventTopBar
          id={id!}
          isCreator={isCreator}
          isCommunityAdmin={isCommunityAdmin}
          onDelete={isCreator ? () => setShowDeleteModal(true) : undefined}
        />

        {/* Child routes render here */}
        <Outlet key={id} />

        <DeleteEventModal
          eventTitle={event.title}
          open={showDeleteModal}
          isPending={deleteMutation.isPending}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={() =>
            deleteMutation.mutate(id!, {
              onSuccess: () => navigate('/events'),
            })
          }
        />
      </div>
    </EventContext.Provider>
  )
}

export default EventWrapper