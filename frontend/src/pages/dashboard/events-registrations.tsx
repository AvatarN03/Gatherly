import { Link } from "react-router-dom";
import { Calendar, Users, Tag, AlertCircle, CalendarClock } from "lucide-react";
import { useEventsRegistrationsQuery } from "../../hooks/useEvents";

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const AllEventRegistrations = () => {
  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useEventsRegistrationsQuery();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-slate" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-cocoa/30 bg-cocoa/5 py-14 text-center">
        <AlertCircle className="h-10 w-10 text-cocoa" />

        <div>
          <p className="font-medium text-mist">
            Couldn't load event registrations
          </p>
          <p className="text-sm text-stone">Please try again.</p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="rounded-lg border border-slate px-4 py-2 text-sm text-mist"
        >
          {isRefetching ? "Retrying..." : "Try Again"}
        </button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <div className="rounded-full bg-orchid/15 p-3">
          <CalendarClock className="h-6 w-6 text-orchid" />
        </div>

        <p className="text-fog">No event registrations yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-5 pt-2 pb-5">
        <h2 className="text-lg font-semibold text-mist">
          Event Registrations
        </h2>

        <span className="text-sm text-stone">
          {data.length} {data.length === 1 ? "event" : "events"}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {data.map((event) => (
          <Link
            key={event.id}
            to={`/events/${event.id}/registers`}
            className="group flex flex-col gap-3 rounded-xl border border-fog/20 bg-deep-ocean p-4 transition-all duration-300 hover:-translate-y-1 hover:border-orchid/60 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-medium text-mist transition-colors group-hover:text-purple-400">
                {event.title}
              </h3>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border-2 border-lavender/80 bg-orchid/70 px-2 py-0.5 text-xs font-medium text-mist transition-colors duration-200 group-hover:bg-black group-hover:text-white">
                  <Tag className="h-3 w-3" />
                  {event.category}
                </span>

                {event.subCategory && (
                  <span className="inline-flex items-center gap-1 rounded-full border-2 border-lavender/50 px-2 py-0.5 text-xs text-mist/60">
                    {event.subCategory}
                  </span>
                )}

                <span className="inline-flex items-center gap-1 text-xs text-mist/60">
                  <Calendar className="h-3 w-3 text-fog" />
                  {formatDate(event.date)}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-lavender/80 bg-cocoa/80 px-3 py-1 text-sm font-medium text-mist">
                <Users className="h-3.5 w-3.5" />
                {event._count.registrations}{" "}
                {event._count.registrations === 1 ? "registration" : "registrations"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default AllEventRegistrations;