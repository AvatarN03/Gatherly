import { ClipboardCheck } from 'lucide-react'

import Card from '../../components/Card'
import { Error } from '../../components/Error'
import { IsEmpty } from '../../components/IsEmpty'
import { CardSkeleton } from '../../components/Skeleton'

import { useMyEventRolesQuery } from '../../hooks/useEvents'

import { EVENT_ROLE_BADGES, SKELETON_COUNT } from '../../constant'


const MyEventAssignments = () => {
  const { data, isLoading, isError, isRefetching, refetch } = useMyEventRolesQuery()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 my-4 px-4">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <Error isRefetching={isRefetching} handleRetry={refetch} text="Couldn't load your events" />;
  }

  if (!data || data.length === 0) {
    return (
      <IsEmpty
        text="You haven't been assigned to any events yet. Assign yourself to one to get started!"
        link="Browse events"
        href="/events"
        Icon={ClipboardCheck}
      />
    )
  }

  return (
    <>
      <div className="mb-5 pt-2 pb-5">
        <h2 className="text-lg font-semibold text-mist">
          Assigned Events
        </h2>

        <span className="text-sm text-stone">
          {data.length} total
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((assignment) => (
          <Card
            key={assignment.id}
            type="event"
            item={assignment.event}
            badge={
              <span className={`inline-flex items-center text-sm font-medium border-2 px-2 py-0.5 rounded-full transition-colors duration-200 ${
                EVENT_ROLE_BADGES[assignment.role as keyof typeof EVENT_ROLE_BADGES]?.className ??
                "bg-slate/50 border-slate/80 text-mist"
              }`}
              >
                {EVENT_ROLE_BADGES[assignment.role as keyof typeof EVENT_ROLE_BADGES]?.label ?? assignment.role}
              </span>
            }
          />

        ))}
      </div>
    </>
  )
}

export default MyEventAssignments