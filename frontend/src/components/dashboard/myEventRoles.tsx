import { useNavigate } from "react-router-dom";

const roleStyle: Record<string, string> = {
  HOST: "bg-pink-100 text-pink-800",
  SPEAKER: "bg-teal-100 text-teal-800",
  COORDINATOR: "bg-gray-100 text-gray-700",
  VOLUNTEER: "bg-orange-100 text-orange-800",
};

const MyEventRoles = ({ roles }: { roles: any[] }) => {
  const navigate = useNavigate();

  if (roles.length === 0) return null;

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-gray-700">My event roles</p>
      <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {roles.map((r: any) => (
          <div
            key={r.id}
            onClick={() => navigate(`/events/${r.event?.id}`)}
            className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-50"
          >
            {r.event?.imageUrl ? (
              <img src={r.event.imageUrl} alt="" className="h-9 w-9 shrink-0 rounded-lg object-cover" />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                <i className="ti ti-star text-base" aria-hidden="true" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">{r.event?.title}</p>
              <p className="text-xs text-gray-500">
                Assigned {new Date(r.assignedAt).toLocaleDateString()}
                {r.event?.community?.name ? ` · ${r.event.community.name}` : ""}
              </p>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${roleStyle[r.role] ?? "bg-gray-100 text-gray-700"}`}>
              {r.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyEventRoles;