import { Link } from "react-router-dom";
import { Users, AlertCircle, Tag } from "lucide-react";
import { useCommunitiesRequestsQuery } from "../../hooks/useMembership";

const CommunitiesRequest = () => {
  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useCommunitiesRequestsQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-64 animate-pulse rounded-xl bg-slate"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-cocoa/30 bg-cocoa/5 py-14 text-center">
        <AlertCircle className="h-10 w-10 text-cocoa" />

        <div>
          <p className="font-medium text-mist">
            Couldn't load community requests
          </p>
          <p className="text-sm text-stone">Please try again.</p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="rounded-lg border border-slate px-4 py-2 text-sm text-mist"
        >
          {isRefetching ? "Retrying..." : "Try Again"}
        </button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <div className="rounded-full bg-orchid/15 p-3">
          <Users className="h-6 w-6 text-orchid" />
        </div>

        <p className="text-fog">
          No pending join requests for your communities.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-5 pt-2 pb-5">
        <h2 className="text-lg font-semibold text-mist">
          Community Requests
        </h2>

        <span className="text-sm text-stone">
          {data.length} {data.length === 1 ? "community" : "communities"} with pending requests
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((community) => (
          <Link
            key={community.id}
            to={`/communities/${community.id}/requests`}
            className="group relative block overflow-hidden rounded-xl border border-fog/20 bg-deep-ocean transition-all duration-300 hover:-translate-y-1.5 hover:border-orchid/60"
          >
            <img
              src={community.imageUrl || "/image_holder.jpg"}
              alt={community.name}
              className="h-48 w-full object-cover"
            />

            {/* Category badge */}
            <div className="absolute top-4 right-4 z-10">
              <span className="inline-flex items-center gap-1 rounded-full border-2 border-lavender/80 bg-orchid/70 px-2 py-0.5 text-sm font-medium text-mist transition-colors duration-200 group-hover:bg-black group-hover:text-white">
                <Tag className="h-3.5 w-3.5" />
                {community.category}
              </span>
            </div>

            {/* Pending requests badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-flex items-center gap-1 rounded-full border-2 border-lavender/80 bg-cocoa/80 px-2.5 py-1 text-sm font-medium text-mist">
                <Users className="h-3.5 w-3.5" />
                {community._count?.requests ?? 0}
              </span>
            </div>

            <div className="p-4">
              <h2 className="mb-1 truncate text-base font-medium text-mist transition-colors group-hover:text-purple-400">
                {community.name}
              </h2>

              <p className="mb-3 line-clamp-2 text-ellipsis text-sm text-lavender group-hover:underline underline-offset-4">
                {community.description}
              </p>

              <p className="text-xs text-stone">
                {community._count?.requests ?? 0} pending{" "}
                {(community._count?.requests ?? 0) === 1 ? "request" : "requests"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default CommunitiesRequest;