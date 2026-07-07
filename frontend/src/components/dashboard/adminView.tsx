import type { DashboardOverviewResponse } from "../../types";
import CreatedEventsCard from "./createdEventCard";
import ManagedCommunitiesCard from "./manageCommunitiesCards";
import PendingRequestsCard from "./pendingRequest";

const AdminView = ({ data }: { data: DashboardOverviewResponse }) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
    <div className="space-y-6">
      <ManagedCommunitiesCard memberships={data.adminMemberships} />
      <PendingRequestsCard memberships={data.adminMemberships} requestCount={data.stats.pendingRequests} />
    </div>
    <div>
      <CreatedEventsCard events={data.createdEvents} />
    </div>
  </div>
);

export default AdminView;