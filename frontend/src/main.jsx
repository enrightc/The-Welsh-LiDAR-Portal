// Import StrictMode (helps catch potential issues in development)
import { StrictMode } from "react";

// Import createRoot to create a React application
import { createRoot } from "react-dom/client";

// Import BrowserRouter for handling navigation (React Router)
import { BrowserRouter } from "react-router-dom";

// Import global CSS file
import "./index.css";

// Import the main App component
import App from "./App.jsx";

// Get the root element in index.html (React will render inside this)
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Wrap the entire app with BrowserRouter to enable routing */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);