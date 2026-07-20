import { Calendar } from "lucide-react";

import Card from "../../components/Card";
import { CardSkeleton } from "../../components/Skeleton";
import { Error } from "../../components/Error";
import { IsEmpty } from "../../components/IsEmpty";

import { useMyEventsQuery } from "../../hooks/useEvents";

import { SKELETON_COUNT } from "../../constant";

const MyDashboardEvents = () => {
  const {
    data: events = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useMyEventsQuery();

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

  if (events.length === 0) {
    return (
      <IsEmpty
        text="You haven't created any events yet. Create one to get started!"
        link="Browse events"
        href="/events"
        Icon={Calendar}
      />
    );
  }

  return (
    <>
      <div className="mb-5 pt-2 pb-5">
        <h2 className="text-lg font-semibold text-mist">My Events</h2>
        <span className="text-sm text-stone">
          {events.length} total
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {events.map((event) => (
          <Card
            key={event.id}
            type="event"
            item={event}
          />
        ))}
      </div>
    </>
  );
};

export default MyDashboardEvents;