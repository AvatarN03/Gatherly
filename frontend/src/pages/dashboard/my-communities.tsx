// pages/dashboard/communities/MyDashboardCommunities.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMyCommunityQuery } from "../../hooks/useCommunities";
import { MapPin, MoreVertical, LogOut, Eye, Users, AlertCircle } from "lucide-react";

const categoryStyles: Record<string, string> = {
  Sports: "bg-cocoa/20 text-cocoa ring-cocoa/40",
  Education: "bg-lavender/15 text-lavender ring-lavender/30",
  Environment: "bg-forest-teal/40 text-mist ring-forest-teal",
};

const defaultCategoryStyle = "bg-slate text-fog ring-slate";

const MyDashboardCommunities = () => {
  const {
    data: communities = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useMyCommunityQuery();

  // Tracks which card's options menu is open (by community id), so only
  // one can be open at a time.
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 rounded-xl border border-slate p-5 animate-pulse"
          >
            <div className="h-20 w-20 shrink-0 rounded-xl bg-slate" />
            <div className="flex-1 space-y-2.5 py-1">
              <div className="h-4 w-2/3 rounded bg-slate" />
              <div className="h-3 w-full rounded bg-slate" />
              <div className="h-3 w-1/2 rounded bg-slate" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-cocoa/30 bg-cocoa/5 py-14 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cocoa/15">
          <AlertCircle className="h-6 w-6 text-cocoa" strokeWidth={2} />
        </div>
        <div>
          <p className="font-medium text-mist">Couldn't load your communities</p>
          <p className="mt-1 text-sm text-stone">
            Something went wrong on our end. Give it another try.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isRefetching}
          className="mt-1 rounded-lg border border-slate/70 bg-deep-ocean px-4 py-2 text-sm font-medium text-fog transition-colors hover:bg-slate/40 hover:text-mist disabled:opacity-60"
        >
          {isRefetching ? "Retrying..." : "Try again"}
        </button>
      </div>
    );
  }

  if (communities.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orchid/15">
          <Users className="h-6 w-6 text-orchid" strokeWidth={1.5} />
        </div>
        <p className="text-fog">You haven't joined any communities yet.</p>
        <Link
          to="/communities"
          className="text-sm font-medium text-orchid transition hover:text-lavender"
        >
          Browse communities →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-mist">My Communities</h2>
        <span className="text-sm text-stone">{communities.length} total</span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {communities.map((community) => (
          <div
            key={community.id}
            className="group relative flex gap-4 rounded-xl border border-slate bg-night/40 p-5 transition hover:border-orchid/50 hover:shadow-lg hover:shadow-orchid/5"
          >
            <Link
              to={`/communities/${community.id}`}
              className="flex min-w-0 flex-1 gap-4"
            >
              <img
                src={community.imageUrl}
                alt={community.title}
                className="h-20 w-20 shrink-0 rounded-xl object-cover ring-1 ring-slate"
              />
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-medium text-mist transition group-hover:text-orchid">
                  {community.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-fog">
                  {community.description}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${
                      categoryStyles[community.category] ?? defaultCategoryStyle
                    }`}
                  >
                    {community.category}
                  </span>
                  {community.location && (
                    <span className="flex items-center gap-1 truncate text-xs text-stone">
                      <MapPin className="h-3 w-3 shrink-0" strokeWidth={1.5} />
                      {community.location}
                    </span>
                  )}
                </div>
              </div>
            </Link>

            {/* Options menu */}
            <div className="shrink-0">
              <button
                type="button"
                onClick={() =>
                  setOpenMenuId((id) => (id === community.id ? null : community.id))
                }
                aria-label="Community options"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-stone transition-colors hover:bg-slate/50 hover:text-mist"
              >
                <MoreVertical className="h-4 w-4" strokeWidth={2} />
              </button>

              {openMenuId === community.id && (
                <>
                  {/* Click-away layer */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setOpenMenuId(null)}
                  />
                  <div className="absolute right-5 top-14 z-20 w-44 overflow-hidden rounded-xl border border-slate/70 bg-deep-ocean shadow-xl shadow-black/40">
                    <Link
                      to={`/communities/${community.id}`}
                      onClick={() => setOpenMenuId(null)}
                      className="flex items-center gap-2 px-3.5 py-2.5 text-sm text-fog transition-colors hover:bg-slate/40 hover:text-mist"
                    >
                      <Eye className="h-4 w-4" strokeWidth={2} />
                      View community
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuId(null);
                        // TODO: wire this up to your leave-community mutation
                      }}
                      className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-cocoa transition-colors hover:bg-cocoa/10"
                    >
                      <LogOut className="h-4 w-4" strokeWidth={2} />
                      Leave community
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyDashboardCommunities;