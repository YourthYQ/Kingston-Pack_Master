import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // Import Navbar
import LandingPage from "./pages/Landing/LandingPage"; // Landing Page
import MainPage from "./pages/Main/MainPage"; // Main Page for palletization
import ServicesPage from "./pages/Services/ServicesPage"
import AboutPage from "./pages/About/AboutPage";

const App = () => {
  return (
    <Router>
      {/* The Navbar will always be displayed */}
      <Navbar />

      {/* Routes for different pages */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        {/*<Route path="/main" element={<MainPage />} />*/}
      </Routes>
    </Router>
  );
};

export default App;