import { Link } from "react-router-dom";
import { Ticket, AlertCircle } from "lucide-react";
import Card from "../../components/Card";
import { useMyRegistrationsQuery } from "../../hooks/useEvents";

const MyEventRegistrations = () => {
  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useMyRegistrationsQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-72 animate-pulse rounded-xl bg-slate"
          />
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
            Couldn't load your registrations
          </p>

          <p className="text-sm text-stone">
            Please try again.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="rounded-lg border border-slate px-4 py-2"
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
          <Ticket className="h-6 w-6 text-orchid" />
        </div>

        <p className="text-fog">
          You haven't registered for any events yet.
        </p>

        <Link
          to="/events"
          className="text-sm font-medium text-orchid hover:text-lavender"
        >
          Browse events →
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-5 pt-2 pb-5">
        <h2 className="text-lg font-semibold text-mist">
          Registered Events
        </h2>

        <span className="text-sm text-stone">
          {data.length} total
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {data.map((registration) => (
          <Card
            key={registration.id}
            type="event"
            item={registration.event}
          />
        ))}
      </div>
    </>
  );
};

export default MyEventRegistrations;