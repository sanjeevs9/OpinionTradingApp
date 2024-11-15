import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Navbar } from "./component/navbar.tsx";
import { Footer } from "./component/footer.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="bg-[#F5F5F5] w-full h-full">
      <Navbar />
      <App />
      <Footer />
    </div>
  </StrictMode>
);
