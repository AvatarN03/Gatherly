import MyCommunities from "./myCommunities";
import MyEventRoles from "./myEventRoles";
import MyRegistrations from "./myRegisterations";

const UserView = ({ data }: { data: any }) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
    <div className="space-y-6">
      <MyCommunities memberships={data.myMemberships} />
    </div>
    <div className="space-y-6">
      <MyRegistrations registrations={data.myRegistrations} />
      <MyEventRoles roles={data.myEventRoles} />
    </div>
  </div>
);

export default UserView;