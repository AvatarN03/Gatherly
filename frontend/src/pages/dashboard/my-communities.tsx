
import { Link } from "react-router-dom";
import { useMyCommunityQuery } from "../../hooks/useCommunities";
import {  Users, AlertCircle } from "lucide-react";
import Card from "../../components/Card";





const MyDashboardCommunities = () => {
  const {
    data: communities = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useMyCommunityQuery();



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
      <div className="mb-5 pt-2 pb-5">
        <h2 className="text-lg font-semibold text-mist">My Communities</h2>
        <span className="text-sm text-stone">{communities.length} total</span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 ">
        {communities.map((community) => (
          <Card key={community.id} type="community" item={community} />
        ))}
      </div>
    </div>
  );
};

export default MyDashboardCommunities;