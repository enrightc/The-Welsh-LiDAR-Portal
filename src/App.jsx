// Import Routes and Route from React Router to handle page navigation
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation"; // Import the Navigation component

// Import the pages that will be displayed
import Home from "./pages/Home";
import About from "./pages/About";
import Map from "./pages/Map";
import Testing from "./components/Testing"; // Import the Testing component
import Register from "./pages/Register"; 
import Login from "./pages/Login"; 

// the main App component
function App() {
  return (
    <>
      <Navigation /> {/* Navbar appears on all pages */}
      <main className="page-content">
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/map" element={<Map />} />
            <Route path="/testing" element={<Testing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </>
  );
}

// Export the App component so it can be used in main.jsx
export default App;