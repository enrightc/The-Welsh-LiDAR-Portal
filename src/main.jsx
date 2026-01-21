// Import StrictMode (helps catch potential issues in development)
import { StrictMode, useEffect, useState } from "react";

// Import createRoot to create a React application
import { createRoot } from "react-dom/client";

// Import BrowserRouter for handling navigation (React Router)
import { BrowserRouter } from "react-router-dom";

// Import global CSS file
import "./index.css";

// MUI Imports
import Button from '@mui/material/Button';


// Import the main App component
import App from "./App.jsx";
import "./api";

// Theme
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

/* Microsoft Clarity (only loads after analytics consent) */
const clarityId = import.meta.env.VITE_CLARITY_ID;
const CONSENT_KEY = "mtp_cookie_consent_v1";

function getConsent() {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setConsent(consent) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
}

function loadClarity(id) {
  if (!id) return;
  // Prevent double-loading
  if (window.__clarityLoaded) return;
  window.__clarityLoaded = true;

  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () {
      (c[a].q = c[a].q || []).push(arguments);
    };
    t = l.createElement(r);
    t.async = 1;
    t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", id);
}

function CookieBanner() {
  const [consent, setConsentState] = useState(() => getConsent());

  useEffect(() => {
    // If consent already granted for analytics, load Clarity.
    if (consent?.analytics === true) {
      loadClarity(clarityId);
    }
  }, [consent]);

  // If the user has made a choice, don't show the banner.
  if (consent) return null;

  const acceptAnalytics = () => {
    const next = { analytics: true, ts: new Date().toISOString() };
    setConsent(next);
    setConsentState(next);
  };

  const rejectAnalytics = () => {
    const next = { analytics: false, ts: new Date().toISOString() };
    setConsent(next);
    setConsentState(next);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie preferences"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        padding: "1rem",
        background: "rgba(20, 20, 20, 0.8)",
        color: "white",
        zIndex: 9999,
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <p style={{ margin: 0, lineHeight: 1.4 }}>
          We use cookies to understand how people use the site. You can accept or reject analytics cookies.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
          <Button 
            variant="contained" 
            onClick={acceptAnalytics}
            sx = {{
                backgroundColor: "green",
              }}
            >
              
            Accept 
          </Button>
          <Button 
            variant="contained" 
            onClick={rejectAnalytics}
            sx = {{
                backgroundColor: "red",
              }}
            >
            Reject
          </Button>

        </div>
      </div>
    </div>
  );
}

// Get the root element in index.html (React will render inside this)
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Wrap the entire app with BrowserRouter to enable routing i.e. multiple page app */}
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
        <CookieBanner />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);