import React, {use, useEffect, useState} from 'react'
import Axios from 'axios';  // Import Axios for making HTTP requests
import { useNavigate } from "react-router-dom";
import {useImmerReducer} from "use-immer"; // Import useImmerReducer for state management

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// MUI Imports
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function Register() {
  const navigate = useNavigate()
  
  const initialstate = {
      usernameValue: "",
      emailValue: "",
      passwordValue: "",
      password2Value: "",
      sendRequest: 0, // State to control when to send the request
    };
  
    function ReducerFunction(draft, action){
      switch (action.type){
        case "catchUsernameChange":
          draft.usernameValue = action.usernameChosen; // Update usernameValue in the state
          break;
        case "catchEmailChange":
          draft.emailValue = action.emailChosen; 
          break;
        case "catchPasswordChange":
          draft.passwordValue = action.passwordChosen; 
          break;
        case "catchPassword2Change":
          draft.password2Value = action.password2Chosen; 
          break;
        case "changeSendRequest":
          draft.sendRequest = draft.sendRequest + 1 // Toggle sendRequest state
          break; // This action will trigger the useEffect to send the request
      }
    }
  
    const [state, dispatch] = useImmerReducer(ReducerFunction, initialstate)

  // Handles the form submission event:
  // - Prevents the default page reload behaviour
  // - Triggers the `useEffect` hook by incrementing sendRequest
  //   which then sends the registration request to the backend
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
    
    async function SignUp() {
      // Define an async function to register a new user by sending a POST request to the backend
      
      try {
        // Make a Post request to  Django backend to register new user
        const response = await Axios.post(
          `${BASE_URL}/api-auth-djoser/users/`,
          {
            username: state.usernameValue,
            email: state.emailValue,
            password: state.passwordValue,
            re_password: state.password2Value,
          },
          {
            cancelToken: source.token // Attach the cancel token so it cancel the request if the component unmounts
          },
        );
        // If the request is successful, the response will contain the data

        // Automatically log the user in after successful registration
        const loginResponse = await Axios.post(
          `${BASE_URL}/api-auth-djoser/token/login/`,
          {
            username: state.usernameValue,
            password: state.passwordValue,
          }
        );

        // Store token in localStorage
        localStorage.setItem("authToken", loginResponse.data.auth_token);

        navigate("/"); // Redirect to the home page after successful registration and login


      } catch (error) {
        if (error.response) {
          console.log("Server responded with:", error.response.status, error.response.data);
        } else {
          console.log("Error:", error.message);
        }
      }
    }
    // Call the function we just defined
    SignUp();
    return () => {
      // Cleanup function to run when the component unmounts
      // This is where you can cancel any ongoing requests or clean up resources
      source.cancel(); // Cancel the Axios request if the component unmounts
    };
  }
}, [state.sendRequest]); // ← This empty array makes sure it runs only once when the component loads

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
              Create an Account
            </Typography>
          </Grid>

          <Grid>
            <TextField 
              id="username" 
              fullWidth 
              label="Username" 
              variant="outlined"
              value={state.usernameValue}
              // When the user types in the input field, onChange function runs.
              // When the user types in the Username input:
              // 1. Grab the new value (e.target.value)
              // 2. Send it to the reducer using dispatch()
              // 3. The reducer updates 'usernameValue' in the state
              // This keeps the input in sync with the app state (a controlled input)
              onChange = {(e)=> 
                // When the user types in the Confirm Password input, do the following:
                dispatch({
                  type: "catchUsernameChange", // Action that tells the reducer what to update
                  usernameChosen: e.target.value // This is the new value from the input field
                })
              } 
            /> 
          </Grid>

          <Grid>
            <TextField 
              id="email" 
              fullWidth 
              label="Email" 
              variant="outlined"
              value={state.emailValue}
              onChange = {(e)=> 
                dispatch({type: "catchEmailChange", emailChosen: e.target.value})} 
            />
          </Grid>

          <Grid>
            <TextField 
              id="password" 
              fullWidth 
              label="Password" 
              variant="outlined" 
              type="password"
              value={state.passwordValue}
              onChange = {(e)=> dispatch({type: "catchPasswordChange", passwordChosen: e.target.value})} 
            />
          </Grid>

          <Grid>
            <TextField 
              id="password2" 
              fullWidth 
              label="Confirm Password" 
              variant="outlined" 
              type="password"
              value={state.password2Value}
              onChange = {(e)=> dispatch({type: "catchPassword2Change", password2Chosen: e.target.value})} 
            />
          </Grid>

          <Grid>
            <Button 
              variant="contained" 
              xs={8}
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
              type="submit">Register
            </Button>
          </Grid>

          <Grid>
            <Typography 
            variant="small" 
            align="center">
              Already have an account? {" "}
              <span
                onClick={() => navigate("/login")} 
                style={{
                  cursor:"pointer", 
                  color:"blue"}}
                >
                  SIGN IN
                </span>
            </Typography>
          </Grid>

        </Grid>
      </form>
    </div>
  )
}

export default Register;