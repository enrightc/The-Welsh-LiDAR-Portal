// Import Routes and Route from React Router to handle page navigation
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation"; // Import the Navigation component
import { useImmerReducer } from "use-immer";

// Import the pages that will be displayed
import Home from "./pages/Home";
import About from "./pages/About";
import Map from "./pages/Map";
import Testing from "./pages/Testing"; // Import the Testing component
import Register from "./pages/Register"; 
import Login from "./pages/Login"; 

// Contexts
import DispatchContext from "./Contexts/DispatchContext";
import StateContext from "./Contexts/StateContext";

// the main App component
function App() {
  const initialstate = {
    userUsername: "",
    userEmail: "",
    userId: "",
    userToken: "", // Token to store the authentication token
    globalMessage: "Hello, this message can be used by any child component",
  };
      
  function ReducerFunction(draft, action){
    switch (action.type){
      case "catchToken":
        draft.userToken = action.tokenValue; // Update the token in the state
        break; // This action will update the token state when the request is successful
      case "catchUserInfo":
        draft.userUsername = action.usernameInfo; // Update username in the state
        draft.userEmail = action.emailInfo; // Update email in the state
        draft.userId = action.IdInfo; // Update user ID in the state
        break; // This action will update the user information in the state
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialstate)


  return (
    <>
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
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
        </DispatchContext.Provider>
        </StateContext.Provider>
    </>
  );
}

// Export the App component so it can be used in main.jsx
export default App;