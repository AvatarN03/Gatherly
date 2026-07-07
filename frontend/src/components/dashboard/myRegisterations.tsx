import { useNavigate } from "react-router-dom";

const MyRegistrations = ({ registrations }: { registrations: any[] }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">My event registrations</p>
        <button onClick={() => navigate("/events")} className="text-xs text-indigo-600 hover:underline">
          View all
        </button>
      </div>
      <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {registrations.length === 0 ? (
          <p className="p-4 text-center text-sm text-gray-500">Not registered for any events</p>
        ) : registrations.map((reg: any) => (
          <div
            key={reg.id}
            onClick={() => navigate(`/events/${reg.event?.id}`)}
            className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-50"
          >
            {reg.event?.imageUrl ? (
              <img src={reg.event.imageUrl} alt="" className="h-9 w-9 shrink-0 rounded-lg object-cover" />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                <i className="ti ti-calendar text-base" aria-hidden="true" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">{reg.event?.title}</p>
              <p className="text-xs text-gray-500">
                {reg.event?.date ? new Date(reg.event.date).toLocaleDateString() : ""}
                {reg.event?.subCategory ? ` · ${reg.event.subCategory}` : ""}
              </p>
              {reg.event?.community?.name && (
                <p className="text-xs text-gray-400">{reg.event.community.name}</p>
              )}
            </div>
            <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
              Registered
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRegistrations;