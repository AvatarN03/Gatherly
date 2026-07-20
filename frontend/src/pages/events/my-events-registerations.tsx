import { Ticket } from "lucide-react";

import Card from "../../components/Card";
import { CardSkeleton } from "../../components/Skeleton";
import { Error } from "../../components/Error";
import { IsEmpty } from "../../components/IsEmpty";

import { useMyRegistrationsQuery } from "../../hooks/useEvents";

import { SKELETON_COUNT } from "../../constant";

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
  

  if (data.length === 0) {
    return (
       <IsEmpty
        text="You haven't registered for any events yet. Register for one to get started!"
        link="Browse events"
        href="/events"
        Icon={Ticket}
      />
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