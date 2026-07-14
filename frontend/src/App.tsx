import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Toaster } from 'react-hot-toast';

import Communities from "./pages/communities"
import CommunityId from "./pages/communities/community-id"
import CreateCommunityPage from "./pages/communities/create-community"
import EditCommunity from "./pages/communities/edit-community"
import { CommunityMembersPanel } from "./pages/communities/community-id-members";
import { CommunityRequestPanel } from "./pages/communities/community-id-requests";
import CommunityWrapper from "./components/communities/CommunityWrapper";


import Events from "./pages/events"
import EventId from "./pages/events/event-id"
import CreateEvent from "./pages/events/create-event"
import EditEvent from "./pages/events/editEvent"
import GetEventRegisters from "./pages/events/getEventRegisters"
import { EventTeam } from "./pages/events/eventTeam";
import EventWrapper from "./components/events/EventWrapper";




import Marketing from "./pages/marketing"
import About  from "./pages/marketing/About";


import MyDashboardCommunities from "./pages/communities/my-communities";
import PublicLayout from "./components/marketing/PublicLayout";
import MyDashboardEvents from "./pages/events/my-events";
import MyEventAssignments from "./pages/events/my-events-assignments";
import MyEventRegistrations from "./pages/events/my-events-registerations";
import ManageCommunities from "./pages/communities/manage-communities";
import JoinedCommunities from "./pages/communities/joined-communities";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/dashboard";
import CommunitiesRequest from "./pages/dashboard/communities-requests";
import Contact from "./pages/marketing/Contact";
// import AllEventRegistrations from "./pages/dashboard/events-registrations";


const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" />

      <Routes>

        {/* Public Routes */}
        {/* Marketing */}
        <Route element={<PublicLayout />}>
          <Route index element={<Marketing />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Communities & Events */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/communities-requests" element={<CommunitiesRequest />} />
          {/* <Route path="/dashboard/events-registrations" element={<AllEventRegistrations />} /> */}

          <Route path="communities" element={<Communities />} />
          <Route path="communities/my" element={<MyDashboardCommunities />} />
          <Route path="communities/create" element={<CreateCommunityPage />} />
          <Route path="communities/managed" element={<ManageCommunities />} />
          <Route path="communities/joined" element={<JoinedCommunities />} />

          <Route path="communities/:id" element={<CommunityWrapper />}>
            <Route index element={<CommunityId />} />
            <Route path="edit" element={<EditCommunity />} />
            <Route path="members" element={<CommunityMembersPanel />} />
            <Route path="requests" element={<CommunityRequestPanel />} />
          </Route>

          <Route path="events" element={<Events />} />
          <Route path="events/my" element={<MyDashboardEvents />} />
          <Route path="events/create" element={<CreateEvent />} />
          <Route path="events/assigned" element={<MyEventAssignments />} />
          <Route path="events/registered" element={<MyEventRegistrations />} />

          <Route path="events/:id" element={<EventWrapper />}>
            <Route index element={<EventId />} />
            <Route path="edit" element={<EditEvent />} />
            <Route path="team" element={<EventTeam />} />
            <Route path="registers" element={<GetEventRegisters />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App