import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { BodyContent } from "./component/body";
import Watchlist from "./component/watchList";
import { EventDetailsPage } from "./eventDetailsPage";
import { LandingPage } from "./landingPage";
import { EventPage } from "./eventPage";
import Auth from "./Auth";

function App() {
  return (
    <>
      <Router>
        <div className="bg-[#F5F5F5] w-full h-full">
          {/* <Watchlist /> */}
          <Routes>
            <Route path="/"  element={<LandingPage/>}  />
            <Route element={<Auth/>}>
            <Route path="/events" element={<EventPage />} />
            <Route path="/event-details" element={<EventDetailsPage />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
