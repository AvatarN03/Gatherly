import { useNavigate } from "react-router-dom";


const rolePill: Record<string, string> = {
  OWNER: "bg-purple-100 text-purple-800",
  ADMIN: "bg-blue-100 text-blue-800",
  MODERATOR: "bg-amber-100 text-amber-800",
};

const ManagedCommunitiesCard = ({ memberships }: { memberships: any[] }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">Communities you manage</p>
        <button onClick={() => navigate("/communities")} className="text-xs text-indigo-600 hover:underline">
          View all
        </button>
      </div>
      <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {memberships.length === 0 ? (
          <p className="p-4 text-center text-sm text-gray-500">No communities managed</p>
        ) : memberships.map((m) => (
          <div
            key={m.id}
            onClick={() => navigate(`/communities/${m.community.id}`)}
            className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-50"
          >
            {m.community?.imageUrl ? (
              <img src={m.community.imageUrl} alt="" className="h-9 w-9 shrink-0 rounded-lg border border-gray-200 object-cover" />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-xs font-semibold text-indigo-700">
                {m.community?.name?.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">{m.community?.name}</p>
              <div className="mt-0.5 flex flex-wrap gap-3 text-xs text-gray-500">
                <span>{m.community?._count?.members ?? 0} members</span>
                <span>{m.community?._count?.events ?? 0} events</span>
                {(m.community?._count?.requests ?? 0) > 0 && (
                  <span className="text-red-600 font-medium">
                    {m.community._count.requests} pending
                  </span>
                )}
              </div>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${rolePill[m.role] ?? "bg-gray-100 text-gray-700"}`}>
              {m.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagedCommunitiesCard;