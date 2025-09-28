import React, {useEffect, useContext, useState} from 'react'
import Axios from 'axios'; // Import Axios for making HTTP requests
import { useNavigate } from "react-router-dom";
import { useImmerReducer } from 'use-immer';

// MUI Imports
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// Contexts
import DispatchContext from '../Contexts/DispatchContext'; // Import the DispatchContext for state management
import StateContext from '../Contexts/StateContext'; 

function Login() {
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState("");  // new state for error message

    // Get the value of VITE_BACKEND_URL from the environment variables available at build time.
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    const [loginComplete, setLoginComplete] = useState(false);  // State to track if login is complete

    const GlobalDispatch = useContext(DispatchContext); // Get the dispatch function from the context

    const GlobalState = useContext(StateContext);

    const initialstate = {
          usernameValue: "",
          passwordValue: "",
          sendRequest: 0, // State to control when to send the request
          token: "", // Token to store the authentication token
        };
      
        function ReducerFunction(draft, action){
          switch (action.type){
            case "catchUsernameChange":
              draft.usernameValue = action.usernameChosen; // Update usernameValue in the state
              break;
            case "catchPasswordChange":
              draft.passwordValue = action.passwordChosen; 
              break;
            case "changeSendRequest":
              draft.sendRequest = draft.sendRequest + 1 // Toggle sendRequest state
              break; // This action will trigger the useEffect to send the request
            case "catchToken":
              draft.token = action.tokenValue // Update the token in the state
            break; // This action will update the token state when the request is successful
            case 'userSignsIn':
              draft.userId = action.IdInfo;
              draft.username = action.usernameInfo;
              draft.email = action.emailInfo;
              break;
          }
        }
      
        const [state, dispatch] = useImmerReducer(ReducerFunction, initialstate)

    {/* // Handles the form submission event:
    // - Prevents the default page reload behaviour
    // - Triggers the `useEffect` hook by incrementing sendRequest
    //   which then sends the registration request to the backend */}
    function FormSubmit(e){
        e.preventDefault() // prevents the default form submission behavior/page reload
        dispatch({type: 'changeSendRequest'}) // Dispatch an action to change the sendRequest state
    }

    // useEffect hook to handle the registration API call:
  // - When `sendRequest` becomes true, it triggers a POST request to the backend to register a new user
  // - If the request is successful, the backend returns a response with the created user data
  // - Includes a cleanup function that cancels the request if the component unmounts before completion
  useEffect(() => {
    if (state.sendRequest) {
      const source = Axios.CancelToken.source(); // Create a cancel token for Axios requests
    
    async function SignIn() {
      // Define an async function to register a new user by sending a POST request to the backend
      
      try {
        // Make a Post request to  Django backend to register new user
        const response = await Axios.post(
          `${BASE_URL}/api-auth-djoser/token/login/`,
          {
            username: state.usernameValue,
            password: state.passwordValue,
          },
          {
            cancelToken: source.token
          },
        );
        // If the request is successful, the response will contain the data

        dispatch({
            type: 'catchToken', 
            tokenValue: response.data.auth_token}); // Dispatch an action to update the token in the state
        GlobalDispatch({
            type: 'catchToken', 
            tokenValue: response.data.auth_token
        }); // Dispatch an action to update the global token in the context
       // navigate("/"); // Redirect to the home page after successful registration

       setErrorMessage("");  // clear any previous errors
        
      // Error messages
      } catch (error) {
        if (error.response && error.response.status === 400) { // bad request (wrong username or password)
          setErrorMessage("Invalid username or password");
        } else {
          setErrorMessage("Something went wrong. Please try again.");
        }
      }
    }
    // Call the function we just defined
    SignIn();
    return () => {
      // Cleanup function to run when the component unmounts
      // This is where you can cancel any ongoing requests or clean up resources
      source.cancel(); // Cancel the Axios request if the component unmounts
    };
  }
}, [state.sendRequest]); // ← This empty array makes sure it runs only once when the component loads

    // Get user information from the backend after successful login
    // - When `state.token` becomes available, it triggers a POST request to the backend to log in the user
    useEffect(() => {
        if (state.token !== "") {
        const source = Axios.CancelToken.source(); // Create a cancel token for Axios requests
        
        async function GetUserInfo() {
        // Define an async function to register a new user by sending a POST request to the backend
        
        try {
            // Make a get request to  Django backend to get user information
            const response = await Axios.get(
              `${BASE_URL}/api-auth-djoser/users/me/`,
              {
                headers: {
                  Authorization: `Token ${state.token}`,
                },
                cancelToken: source.token,
              },
            );
            
            // If the request is successful, the response will contain the data

            GlobalDispatch({
                type: 'userSignsIn', 
                usernameInfo: response.data.username, emailInfo: response.data.email, 
                IdInfo: response.data.id
            }); // Dispatch an action to update the username in the state
            setLoginComplete(true); // Set this after dispatch
            navigate("/profile"); // Redirect to the home page after successful registration
            
        } catch (error) {
            if (error.response) {
            console.log("Server responded with:", error.response.status, error.response.data);
            } else {
            console.log("Error:", error.message);
            }
        }
        }
        // Call the function we just defined
        GetUserInfo();
        return () => {
        // Cleanup function to run when the component unmounts
        // This is where you can cancel any ongoing requests or clean up resources
        source.cancel(); // Cancel the Axios request if the component unmounts
        };
    }
    }, [state.token]); // ← This empty array makes sure it runs only once when the component loads

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '800px',
        margin: '3rem auto',
        padding: '2rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: 'white',
      }}
    >

      <form onSubmit={FormSubmit}>
        <Grid container direction="column" spacing={3} >
          <Grid>
            <Typography variant="h4" align="center">
              Login to your Account
            </Typography>
          </Grid>

          <Grid>
            <TextField 
                id="username" 
                fullWidth 
                label="Username" 
                variant="outlined"
                onChange = {(e)=> 
                    // When the user types in the Confirm Password input, do the following:
                    dispatch({
                      type: "catchUsernameChange", // Action that tells the reducer what to update
                      usernameChosen: e.target.value // This is the new value from the input field
                    })
                  } />
          </Grid>


          <Grid>
            <TextField 
              id="password" 
              fullWidth 
              label="Password" 
              variant="outlined" 
              type="password"
              onChange = {(e)=> 
                dispatch({
                type:       "catchPasswordChange", passwordChosen: e.target.value})} 
            />
          </Grid>
          
          <Grid>
            {errorMessage && (
            <Grid>
              <Typography color="error" align="center">
                {errorMessage}
              </Typography>
            </Grid>
          )}
            <Button variant="contained" xs={8}
                style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}
                sx= {{
                    color: "black",
                    border: "none",
                    fontSize: { xs: '0.8rem', md: '1rem' },
                    borderRadius: "5px",
                    backgroundColor: "#FFD034",
                  }} 
                type="submit">Login</Button>
          </Grid>

          <Grid>
            <Typography variant="small" align="center">
              Dont have an account yet?{" "}
              <span
                onClick={() => navigate("/register")} 
                style={{
                    cursor:"pointer", 
                    color:"blue"}}
                >
                     Register
                </span>
            </Typography>
          </Grid>

        </Grid>
      </form>
    </div>
  )
}

export default Login;