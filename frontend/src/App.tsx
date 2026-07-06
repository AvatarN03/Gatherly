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
import { About } from "./pages/marketing/About";
import { ContactUs } from "./pages/marketing/contactUs";


import MyDashboardCommunities from "./pages/dashboard/my-communities";
import DashboardLayout from "./pages/dashboard";
import PublicLayout from "./components/PublicLayout";
import MyDashboardEvents from "./pages/dashboard/my-events";
import MyEventAssignments from "./pages/dashboard/my-events-assignments";
import MyEventRegistrations from "./pages/dashboard/my-events-registerations";
import ManageCommunities from "./pages/dashboard/manage-communities";
import JoinedCommunities from "./pages/dashboard/joined-communities";


const App = () => {
  return (
    <BrowserRouter>
  <Toaster position="bottom-right" />

  <Routes>

    {/* Public Routes */}
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Marketing />} />

      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<ContactUs />} />

      <Route path="/communities" element={<Communities />} />
      <Route path="/communities/create" element={<CreateCommunityPage />} />

      <Route path="/communities/:id" element={<CommunityWrapper />}>
        <Route index element={<CommunityId />} />
        <Route path="edit" element={<EditCommunity />} />
        <Route path="members" element={<CommunityMembersPanel />} />
        <Route path="requests" element={<CommunityRequestPanel />} />
      </Route>

      <Route path="/events" element={<Events />} />
      <Route path="/events/create" element={<CreateEvent />} />

      <Route path="/events/:id" element={<EventWrapper />}>
        <Route index element={<EventId />} />
        <Route path="edit" element={<EditEvent />} />
        <Route path="team" element={<EventTeam />} />
        <Route path="registers" element={<GetEventRegisters />} />
      </Route>
    </Route>

    {/* Dashboard Routes */}
    <Route path="/dashboard" element={<DashboardLayout />}>
      <Route index element={<h1 className="min-h-[200vh]">Dashboard</h1>} />
      <Route path="communities" element={<MyDashboardCommunities />} />
      <Route path="communities/managed" element={<ManageCommunities />} />
      <Route path="communities/joined" element={<JoinedCommunities />} />
      <Route path="communities/browse" element={<Communities />} />

      <Route path="events" element={<MyDashboardEvents />} />
      <Route path="events/assigned" element={<MyEventAssignments />} />
      <Route path="events/registered" element={<MyEventRegistrations />} />
      <Route path="events/browse" element={<Events />} />
    </Route>

  </Routes>
</BrowserRouter>
  )
}

export default App