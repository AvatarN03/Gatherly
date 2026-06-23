import { useNavigate } from "react-router-dom";

import type { EventItem } from "../../types";


const EventsTab = ({ events }: { events: EventItem[] }) => {
  const navigate = useNavigate();

  if (!events.length) return (
    <div className="rounded-xl border border-gray-200 bg-night p-8 text-center text-sm text-gray-500 shadow-sm">
      No events yet
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {events.map((event) => (
        <div
          key={event.id}
          onClick={() => navigate(`/events/${event.id}`)}
          className="cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-forest-teal shadow-sm hover:border-indigo-300 transition"
        >
          <img src={event.imageUrl || "/image_holder.jpg"} alt={event.title} className="h-48 w-full object-cover" />
          <div className="p-3 space-y-4">
            <p className="truncate text-sm font-semibold text-mist">{event.title}</p>
            <p className="mt-1 text-xs text-fog/70">
              {new Date(event.date).toLocaleDateString("in-IN")} · {event.location}
            </p>
            {event.subCategory && (
              <span className="mt-2 inline-block rounded-full bg-lavender px-2 py-0.5 text-xs text-forest-teal">
                {event.subCategory.replace(/([A-Z])/g, " $1").trim()}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsTab;