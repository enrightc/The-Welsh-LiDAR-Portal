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
import "./api";

// Theme
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

/* Microsoft Clarity – production only via env variable */
const clarityId = import.meta.env.VITE_CLARITY_ID;

if (clarityId) {
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", clarityId);
}

// Get the root element in index.html (React will render inside this)
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Wrap the entire app with BrowserRouter to enable routing i.e. multiple page app */}
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);