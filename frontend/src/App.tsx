import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./pages/auth/login"
import SignUpComponent from "./pages/auth/signup"
import { Wrapper } from "./components/marketing/Wrapper"
import Communities from "./pages/communities"
import CommunityId from "./pages/communities/community-id"
import Events from "./pages/events"
import EventId from "./pages/events/event-id"
import CreateCommunity from "./pages/communities/create-community"


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Wrapper />}>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/sign-in/*" element={<Login />} />
          <Route path="/sign-up/*" element={<SignUpComponent />} />

          <Route path="/communities" element={<Communities />} />
          <Route path="/communities/:id" element={<CommunityId />} />
          <Route path="/communities/create" element={<CreateCommunity />} />

          <Route path="/dashboard" element={<h1>Dashboard</h1>} />

          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventId />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App