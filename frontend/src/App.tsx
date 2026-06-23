import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Toaster } from 'react-hot-toast';

import Communities from "./pages/communities"
import CommunityId from "./pages/communities/community-id"
import CreateCommunityPage from "./pages/communities/create-community"
import EditCommunity from "./pages/communities/edit-community"


import Events from "./pages/events"
import EventId from "./pages/events/event-id"
import CreateEvent from "./pages/events/create-event"
import EditEvent from "./pages/events/editEvent"

import GetEventRegisters from "./pages/registers/getEventRegisters"

import DashBoard from "./pages/dashboard"

import { Navbar } from "./components/Navbar"
import Marketing from "./pages/marketing"
import Wrapper from "./components/Wrapper"
import { Footer } from "./components/Footer"
import { CommunityMembersPanel } from "./pages/communities/community-id-members";
import { CommunityRequestPanel } from "./pages/communities/community-id-requests";
import CommunityWrapper from "./components/communities/CommunityWrapper";
import { About } from "./pages/marketing/About";
import { ContactUs } from "./pages/marketing/contactUs";


const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Wrapper>
        <Routes>
          <Route path="/" element={<Marketing />} />
          //TODO:about and contact us pages are not implemented yet
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

          <Route path="/dashboard" element={<DashBoard />} />

          <Route path="/events" element={<Events />} />
          
          <Route path="/events/:id" element={<EventId />} />
          <Route path="/events/create" element={<CreateEvent />} />
          <Route path="/events/:id/edit" element={<EditEvent />} />
          <Route path="/register/:id" element={<GetEventRegisters />} />

        </Routes>
      </Wrapper>
      <Footer />
      <Toaster position="bottom-right" />
    </BrowserRouter>
  )
}

export default App