import { Link } from 'react-router-dom'
import { useEventsQuery } from '../../hooks/useEvents'

const Events = () => {
  const { data, isLoading, isError } = useEventsQuery()

  const events = data ?? []

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Events
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
              Upcoming events for the community
            </h1>
            <p className="mt-3 max-w-2xl text-gray-600">
              Join live sessions, workshops, and meetups to connect with the community and grow
              your skills.
            </p>
          </div>

          <Link
            to="/events/create"
            className="w-fit rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Create Event
          </Link>
        </div>

        {isLoading ? (
          <p className="text-gray-600">Loading events...</p>
        ) : isError ? (
          <p className="text-red-600">Unable to load events.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <div
                key={event.id ?? event.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{event.title}</h2>
                    <p className="mt-2 text-sm text-gray-500">
                      {event.date} • {event.time}
                    </p>
                    {(event as any)?.community && (
                      <p className="mt-1 text-xs text-gray-400">
                        Community: {(event as any).community.name}
                      </p>
                    )}
                  </div>
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                    {event.location}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-gray-600">{event.description}</p>

                <div className="mt-6 flex gap-3">
                  <Link
                    to={`/events/${event.id}`}
                    className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    View Details
                  </Link>
                  <button className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                    Join Event
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Events