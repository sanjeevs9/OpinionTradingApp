import "./App.css";
import { Route, Routes } from "react-router-dom";
import { EventDetailsPage } from "./eventDetailsPage";
import { LandingPage } from "./landingPage";
import { EventPage } from "./eventPage";
import { AdminPage } from "./component/adminPage";

function App() {
  return (
    <div className="bg-[#F5F5F5] w-full h-full">
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/events" element={<EventPage />} />
        <Route path="/event-details/:stockSymbol" element={<EventDetailsPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  );
}

export default App;
