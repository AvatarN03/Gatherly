import { useNavigate } from "react-router-dom";


const PendingRequestsCard = ({
  memberships,
  requestCount,
}: {
  memberships: any[];
  requestCount: number;
}) => {
  const navigate = useNavigate();

  const communitiesWithRequests = memberships.filter(
    (m) => (m.community?._count?.requests ?? 0) > 0
  );

  if (requestCount === 0) return null;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">Pending join requests</p>
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
          {requestCount} new
        </span>
      </div>
      <div className="space-y-2">
        {communitiesWithRequests.map((m) => (
          <div
            key={m.id}
            onClick={() => navigate(`/communities/${m.community.id}/requests`)}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm hover:border-indigo-300 transition"
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
              <p className="text-xs text-gray-500">
                {m.community?._count?.requests}{" "}
                {m.community?._count?.requests === 1 ? "request" : "requests"} waiting
              </p>
            </div>
            <span className="shrink-0 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700">
              Review
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingRequestsCard;