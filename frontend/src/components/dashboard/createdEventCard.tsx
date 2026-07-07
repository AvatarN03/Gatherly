import { useNavigate } from "react-router-dom";


const CreatedEventsCard = ({ events }: { events: any[] }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">Events you created</p>
        <button onClick={() => navigate("/events")} className="text-xs text-indigo-600 hover:underline">
          View all
        </button>
      </div>
      <div className="space-y-3">
        {events.length === 0 ? (
          <p className="rounded-xl border border-gray-200 bg-white p-4 text-center text-sm text-gray-500 shadow-sm">
            No events created yet
          </p>
        ) : events.map((ev) => {
          const total = ev._count?.registrations ?? 0;

          return (
            <div
              key={ev.id}
              onClick={() => navigate(`/events/${ev.id}`)}
              className="cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:border-indigo-300 transition"
            >
              {ev.imageUrl && (
                <img src={ev.imageUrl} alt={ev.title} className="h-28 w-full object-cover" />
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate font-semibold text-gray-900">{ev.title}</p>
                  <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                    {ev.category}
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span>{new Date(ev.date).toLocaleDateString()}</span>
                  <span>{ev.time}</span>
                  {ev.subCategory && <span>{ev.subCategory}</span>}
                  <span>{total} {total === 1 ? "registration" : "registrations"}</span>
                </div>

                {ev.community?.name && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                    {ev.community.imageUrl && (
                      <img
                        src={ev.community.imageUrl}
                        alt=""
                        className="h-4 w-4 rounded-full object-cover"
                      />
                    )}
                    <span>{ev.community.name}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CreatedEventsCard;