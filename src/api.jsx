// src/api.js
import axios from "axios";

// Create a custom Axios instance.
// This means all your API requests use the same baseURL and settings.
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "/", 
  // baseURL: points Axios at your backend server (from your .env variable)
  // If not set, it falls back to "/" (relative path)

  timeout: 30000, 
  // timeout: stops requests from hanging forever.
  // If the server takes longer than 30 seconds, Axios throws an error.
});

// === Re-attach token if user already logged in ===
// When user logs in, you save a token in localStorage ("authToken").
// This checks if it's there, and if yes, attaches it to every request automatically.
const saved = localStorage.getItem("authToken");
if (saved) {
  api.defaults.headers.common["Authorization"] = `Token ${saved}`;
}

// === Response Interceptor ===
// This runs *after* every request comes back.
// If the server says "401 Unauthorized" (token is invalid or expired),
// we clean up the token locally so the app doesn't think the user is logged in.
api.interceptors.response.use(
  (res) => res, // success: just return the response
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      // Remove bad/expired token from localStorage
      localStorage.removeItem("authToken");
      // Also remove it from Axios so future requests don’t include it
      delete api.defaults.headers.common["Authorization"];
    }
    // Always pass the error back to your code so you can show messages/spinners
    return Promise.reject(err);
  }
);

// Export this `api` instance.
// Anywhere else in your code, import it like:
//   import api from "./api";
//   api.get("/records/");
//   api.post("/api-auth-djoser/token/login/", {username, password});
export default api;