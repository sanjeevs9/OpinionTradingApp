import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { Navbar } from "./component/navbar.tsx";
import { Footer } from "./component/footer.tsx";
import { UserProvider } from "./context/UserContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <div className="min-h-screen">
          <Navbar />
          <App />
          <Footer />
        </div>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
