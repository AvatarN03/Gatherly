import { useState } from 'react'
import { Outlet, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/react'
import { AlertTriangle } from 'lucide-react'

import EventTopBar from './EventTopBar'
import { ItemSkeleton } from '../Skeleton'
import DeleteEventModal from './DeleteEventModal'


import { EventContext } from '../../context/eventContext'

import { useEventQuery, useDeleteEventMutation } from '../../hooks/useEvents'
import { IsEmpty } from '../IsEmpty'

const EventWrapper = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { userId } = useAuth()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const { data: event, isLoading, isError } = useEventQuery(id);
  const deleteMutation = useDeleteEventMutation()

  if (isLoading) return <ItemSkeleton />

  if (!id || isError || !event) {
    return (
      <IsEmpty
        text="Event not found"
        href="/events"
        link="Back to Events"
        Icon={AlertTriangle}
      />
    )
  }

  // ── Derive permissions 
  const isAuthenticated = !!userId;
  const isCreator = event.createdById === userId;
  const eventMembership = event.members?.find((m) => m.user.id === userId)
  const isCoordinator =
    eventMembership?.role === 'COORDINATOR'

  // ── Render 
  return (
    <EventContext.Provider
      value={{
        event,
        eventMembership,
        isEventMember: !!eventMembership,
        isCreator,
        isCoordinator,
        isAuthenticated,
      }}
    >
      <div className="bg-night/40 min-h-screen max-w-380 mx-auto">
        {isAuthenticated && (
          <EventTopBar
            id={id!}
            isCreator={isCreator}
            isCoordinator={isCoordinator}
            isEventMember={!!eventMembership}
            onDelete={() => setShowDeleteModal(true)}
          />
        )}
        {/* Child routes render here */}
        <Outlet key={id} />

        {isCreator && (
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
        )}
      </div>
    </EventContext.Provider>
  )
}

export default EventWrapper