import Card from '../../components/Card'
import { useMyEventRolesQuery } from '../../hooks/useEvents'

const roleBadgeStyles: Record<string, string> = {
  HOST: 'bg-purple-100 text-purple-700',
  VOLUNTEER: 'bg-green-100 text-green-700',
}

const MyEventAssignments = () => {
  const { data, isLoading, isError, error } = useMyEventRolesQuery()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-gray-200 overflow-hidden"
          >
            <div className="h-36 bg-gray-200" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600 font-medium">
          Failed to load your event assignments
        </p>
        <p className="text-red-500 text-sm mt-1">
          {(error as Error)?.message ?? 'Something went wrong. Please try again.'}
        </p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
        You don't have any event assignments yet.
      </div>
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
              <span
                className={`inline-flex items-center text-sm font-medium border-2 px-2 py-0.5 rounded-full transition-colors duration-200 ${roleBadgeStyles[assignment.role] ?? 'bg-slate/50 border-slate/80 text-mist'
                  }`}
              >
                {assignment.role}
              </span>
            }
          />
        ))}
      </div>
    </>
  )
}

export default MyEventAssignments