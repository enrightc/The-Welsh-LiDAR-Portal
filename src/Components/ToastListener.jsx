// src/Components/ToastListener.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MySnackbar from "./MySnackbar";

// useEffect & useState from react
// These are react hooks, Hooks are special functions that let you add features to your components.
// 1) useState - lets components remember values between re-renders. 
// 2) useEffect - Lets components run side effects (things that happen outside of rendering, like fetching data, logging or timers)

// useNavigate & useLocation
// These are React Router Hooks. They give info and control over navigation.
// 1) useLocation - Tells you the current "location" in React Router.
// 2) useNavigate - Gives you a function (navigate) that lets you move to a different page in code.

// In simple terms:
	// useState → remember something.
	// useEffect → do something when the component renders/changes.
	// useLocation → see where you are and read data passed along.
	// useNavigate → go somewhere new in code.

function ToastListener() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // if location.state exists (not null or undefined) then get the toast)
    const toast = location.state?.toast;

    // Only open the snackbar if a toast message exists
    // without if block the snackbar would open anyway but nothing will be inside. with if snackbar only shown when theres an actual message to display. 
    if (toast) { // if toast exists
      setMessage(toast); // Saves the text into the components state variable message
      // later passing message down to <MySnackbar message={message} />
      setOpen(true); // change open state from false to true.
    // if toast is undefined, null or an empty string, nothing will happen. 

      // Clear the toast from history state so it doesn’t reappear on back/refresh
      // 1) navigate is react routers function (from useNavigate) that changes the current route
      // 2) location.pathname is the current path, basically saying stay on same page.
      // 3) replace: true → instead of pushing a new entry onto the browser history (like clicking a link), it replaces the current history entry. This means the back button won’t take you back to the previous state with the toast.
      // 4) state: {} → this overwrites location.state with an empty object. That clears out any old state, like your toast message, so the snackbar doesn’t show again on refresh or back navigation.
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]); // this belongs to useEffect Hook 
  // The part after the comma — [location, navigate] — is called the dependency array
  // it tells react Only re-run the code inside this effect when one of these things changes.
  // Re-run this effect when the route (location) changes, or if navigate changes
    // That’s how your ToastListener “sees” a new toast when you navigate with:
    // navigate("/", { state: { toast: "Successfully logged out!" } });


  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <MySnackbar open={open} onClose={handleClose} message={message} />
  );
}

export default ToastListener;