import { Route, Routes } from "react-router-dom";
import { EventDetailsPage } from "./eventDetailsPage";
import { LandingPage } from "./landingPage";
import { EventPage } from "./eventPage";
import { AdminPage } from "./component/adminPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/events" element={<EventPage />} />
      <Route path="/event-details/:stockSymbol" element={<EventDetailsPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
