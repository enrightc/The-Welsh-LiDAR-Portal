// Import Routes and Route from React Router to handle page navigation
import { Routes, Route } from "react-router-dom";

// Import the pages that will be displayed
import Home from "./pages/Home";
import About from "./pages/About";

// Define the main App component
const App = () => {
  return (
    <Routes>
      {/* Route for the Home page ("/") */}
      <Route path="/" element={<Home />} />

      {/* Route for the About page ("/about") */}
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

// Export the App component so it can be used in main.jsx
export default App;