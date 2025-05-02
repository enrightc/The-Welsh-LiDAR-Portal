// Import Routes and Route from React Router to handle page navigation
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation"; // Import the Navigation component

// Import the pages that will be displayed
import Home from "./pages/Home";
import About from "./pages/About";
import Map from "./pages/Map";

// the main App component
function App() {
  return (
    <>
      <Navigation /> {/* Navbar appears on all pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </>
  );
}

// Export the App component so it can be used in main.jsx
export default App;