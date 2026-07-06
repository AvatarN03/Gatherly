// MyCommunities.tsx
import { useNavigate } from "react-router-dom";

const MyCommunities = ({ memberships }: { memberships: any[] }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">My communities</p>
        <button onClick={() => navigate("/communities")} className="text-xs text-indigo-600 hover:underline">
          Explore more
        </button>
      </div>
      <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {memberships.length === 0 ? (
          <p className="p-4 text-center text-sm text-gray-500">You haven't joined any communities</p>
        ) : memberships.map((m: any) => (
          <div
            key={m.id}
            onClick={() => navigate(`/communities/${m.communityId}`)}
            className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-50"
          >
            {m.community?.imageUrl ? (
              <img src={m.community.imageUrl} alt="" className="h-9 w-9 flex-shrink-0 rounded-lg border border-gray-200 object-cover" />
            ) : (
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-xs font-semibold text-indigo-700">
                {m.community?.name?.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">{m.community?.name}</p>
              <p className="text-xs text-gray-500">{m.community?.category} · {m.community?.members?.length ?? 0} members</p>
            </div>
            <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">{m.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCommunities;