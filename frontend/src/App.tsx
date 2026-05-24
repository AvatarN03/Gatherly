import { BrowserRouter, Route, Routes } from "react-router-dom"
import Communities from "./pages/communities"
import CommunityId from "./pages/communities/community-id"
import CreateCommunity from "./pages/communities/create-community"
import EditCommunity from "./pages/communities/edit-community"
import Events from "./pages/events"
import EventId from "./pages/events/event-id"
import CreateEvent from "./pages/events/create-event"
import DashBoard from "./pages/dashboard"
import { Navbar } from "./components/Navbar"


const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>

        <Route path="/" element={<h1>Home</h1>} />

        <Route path="/communities" element={<Communities />} />
        <Route path="/communities/create" element={<CreateCommunity />} />
        <Route path="/communities/:id/edit" element={<EditCommunity />} />
        <Route path="/communities/:id" element={<CommunityId />} />

        <Route path="/dashboard" element={<DashBoard />} />

        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventId />} />
        <Route path="/events/create" element={<CreateEvent />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App