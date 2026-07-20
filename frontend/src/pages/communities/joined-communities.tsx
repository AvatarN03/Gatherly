import { UserCheck } from "lucide-react";

import Card from "../../components/Card";
import { CardSkeleton } from "../../components/Skeleton";
import { Error } from "../../components/Error";
import { IsEmpty } from "../../components/IsEmpty";

import { useJoinedCommunitiesQuery } from "../../hooks/useCommunities";

import { SKELETON_COUNT } from "../../constant";

const JoinedCommunities = () => {
  const {
    data: joinedCommunities = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useJoinedCommunitiesQuery();

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

  if (joinedCommunities.length === 0) {
    return (
       <IsEmpty
        text="You haven't joined any communities yet. Join one to get started!"
        link="Browse communities"
        href="/communities"
        Icon={UserCheck}
      />
    );
  }

  return (
    <>
      <div className="mb-5 pt-2 pb-5">
        <h2 className="text-lg font-semibold text-mist">
          Joined Communities
        </h2>
        <span className="text-sm text-stone">
          {joinedCommunities.length} total
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {joinedCommunities.map((community) => (
          <Card
            key={community.id}
            type="community"
            item={community}
          />
        ))}
      </div>
    </>
  );
};

export default JoinedCommunities;