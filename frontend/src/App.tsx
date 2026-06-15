import { BrowserRouter, Route, Routes } from "react-router-dom"

import Communities from "./pages/communities"
import CommunityId from "./pages/communities/community-id"
import CreateCommunity from "./pages/communities/create-community"
import EditCommunity from "./pages/communities/edit-community"
import JoinCommunityPage from "./components/communities/JoinCommunity"

import Events from "./pages/events"
import EventId from "./pages/events/event-id"
import CreateEvent from "./pages/events/create-event"
import EditEvent from "./pages/events/editEvent"

import GetEventRegisters from "./pages/registers/getEventRegisters"

import DashBoard from "./pages/dashboard"

import { Navbar } from "./components/Navbar"
import Marketing from "./pages/marketing"
import Wrapper from "./components/Wrapper"


const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Wrapper>
        <Routes>
          <Route path="/" element={<Marketing />} />

          <Route path="/communities" element={<Communities />} />
          <Route path="/communities/create" element={<CreateCommunity />} />
          <Route path="/communities/:id/edit" element={<EditCommunity />} />
          <Route path="/communities/:id" element={<CommunityId />} />
          <Route path="/communities/:id/join" element={<JoinCommunityPage />} />

          <Route path="/dashboard" element={<DashBoard />} />

          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventId />} />
          <Route path="/events/create" element={<CreateEvent />} />
          <Route path="/events/:id/edit" element={<EditEvent />} />
          <Route path="/register/:id" element={<GetEventRegisters />} />

        </Routes>
      </Wrapper>
    </BrowserRouter>
  )
}

export default App