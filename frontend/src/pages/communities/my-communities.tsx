
import { Users } from "lucide-react";

import Card from "../../components/Card";
import { CardSkeleton } from "../../components/Skeleton";
import { Error } from "../../components/Error";
import { IsEmpty } from "../../components/IsEmpty";

import { useMyCommunityQuery } from "../../hooks/useCommunities";

import { SKELETON_COUNT } from "../../constant";

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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 my-4 px-4">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <Error isRefetching={isRefetching} handleRetry={refetch} text="Couldn't load your communities" />;
  }

  if (communities.length === 0) {
    return (
      <IsEmpty
        text="You haven't owned any communities yet. Create one to get started!"
        link="Browse communities"
        href="/communities"
        Icon={Users}
      />
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