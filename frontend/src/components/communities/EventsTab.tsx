import { Link } from "react-router-dom";

import { formatDate } from "../../lib/date";

import type { EventItem } from "../../types";


const EventsTab = ({ events }: { events: EventItem[] }) => {

  if (!events.length) return (
    <div className="min-h-32 rounded-xl border border-gray-200 bg-night p-8 text-center text-md text-stone shadow-sm">
      No events yet
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {events.map((event) => (
        <Link to={`/events/${event.id}`} key={event.id} target="_blank" >
          <div
            key={event.id}
            className="cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-deep-ocean shadow-sm hover:border-indigo-300 transition"
          >
            <img src={event.imageUrl || "/image_holder.jpg"} alt={event.title} className="h-48 w-full object-cover" />
            <div className="p-3 space-y-4">
              <p className="truncate text-sm font-medium text-lavender">{event.title}</p>
              <p className="mt-1 text-xs text-fog">
                {formatDate(event.date)} · {event.location}
              </p>

              <span className="mt-2 inline-block rounded-full bg-lavender px-2 py-0.5 text-xs text-forest-teal font-semibold">
                {event.subCategory.replace(/([A-Z])/g, " $1").trim()}
              </span>

            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default EventsTab;