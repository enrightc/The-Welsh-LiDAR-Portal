// React and related hooks
import { useEffect } from "react";

// Third-party libraries
import { Routes, Route } from "react-router-dom";
import { useImmerReducer } from "use-immer";

// App components
import Navigation from "./Components/Navigation";
import ToastListener from "./Components/ToastListener";

// App pages
import About from "./pages/About";
import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import LidarPortal from "./pages/LidarPortal";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ProfileDetail from "./pages/ProfileDetail";
import Register from "./pages/Register";
import Users from "./pages/Users";

// Contexts
import DispatchContext from "./Contexts/DispatchContext";
import StateContext from "./Contexts/StateContext";

// Styles
import './App.css';

// the main App component
function App() {

  const initialstate = {
    userUsername: localStorage.getItem("theUserUsername"), // Retrieve username from localStorage or set to empty string
    userEmail: localStorage.getItem("theUserEmail"),  
    userId: localStorage.getItem("theUserId"),  
    userToken: localStorage.getItem("theUserToken"), 
    userIsLoggedIn: localStorage.getItem('theUserUsername') ? true : false, // State to track if the user is logged in
    // userIsAdmin: false, // State to track if the user is an admin
    // markerPosition: {
    //   latitudeValue: "52.1307",    
    //   longitudeValue: "-3.7837", 
    // },  
    polygonValue: [],
  };
      
  function ReducerFunction(draft, action){
    switch (action.type){
      case "catchToken":
        draft.userToken = action.tokenValue; // Update the token in the state
        break; // This action will update the token state when the request is successful
      case "userSignsIn":
        draft.userUsername = action.usernameInfo; // Update username in the state
        draft.userEmail = action.emailInfo; // Update email in the state
        draft.userId = action.IdInfo; // Update user ID in the state
        draft.userIsLoggedIn = true; // Set userIsLoggedIn to true
        break; // This action will update the user information in the state
      case "Logout":
        draft.userIsLoggedIn = false;
        draft.userUsername = "";
        draft.userEmail = "";
        draft.userId = null;
        draft.userToken = "";
        break;
      // case "catchLatitudeChange":
      //   draft.markerPosition.latitudeValue = action.latitudeChosen;
      //   break;
      // case "catchLongitudeChange":
      //   draft.markerPosition.longitudeValue = action.longitudeChosen;
      //   break;
      case 'catchPolygonCoordinateChange':
        draft.polygonValue = action.polygonChosen;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialstate)

useEffect(() => {
  if (state.userIsLoggedIn) {
    localStorage.setItem("theUserUsername", state.userUsername);
    localStorage.setItem("theUserEmail", state.userEmail);
    localStorage.setItem("theUserId", state.userId);
    localStorage.setItem("theUserToken", state.userToken);        
  }
  else {
    localStorage.removeItem("theUserUsername");
    localStorage.removeItem("theUserEmail");
    localStorage.removeItem("theUserId");
    localStorage.removeItem("theUserToken");
  }
}, [state.userIsLoggedIn]);

  return (
    <>
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <Navigation /> {/* Navbar appears on all pages */}
          <main className="page-content">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/HowItWorks" element={<HowItWorks />} />
                <Route path="/LidarPortal" element={<LidarPortal />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/users" element={<Users />} />
                <Route path="/user/:username" element={<ProfileDetail />} />
            </Routes>
            <ToastListener />
          </main>
        </DispatchContext.Provider>
      </StateContext.Provider>
    </>
  );
}

// Export the App component so it can be used in main.jsx
export default App;