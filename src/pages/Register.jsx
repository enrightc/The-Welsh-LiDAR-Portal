import React, {useEffect, useState} from 'react'
import Axios from 'axios';  // Import Axios for making HTTP requests
import { useNavigate } from "react-router-dom";

// MUI Imports
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
function Register() {
  const navigate = useNavigate()
  const [sendRequest, setSendRequest] = useState(false); // State to control when to send the request
  
  // Handles the form submission event:
  // - Prevents the default page reload behaviour
  // - Triggers the `useEffect` hook by setting `sendRequest` to true,
  //   which then sends the registration request to the backend
  function FormSubmit(e){
    e.preventDefault() // prevents the default form submission behavior/page reload
    console.log("Form submitted");
    setSendRequest(true); // Set sendRequest to true to trigger the useEffect
  }

  // useEffect hook to handle the registration API call:
  // - When `sendRequest` becomes true, it triggers a POST request to the backend to register a new user
  // - If the request is successful, the backend returns a response with the created user data
  // - Includes a cleanup function that cancels the request if the component unmounts before completion
  useEffect(() => {
    if (sendRequest) {
      const source = Axios.CancelToken.source(); // Create a cancel token for Axios requests
    
    async function SignUp() {
      // Define an async function to register a new user by sending a POST request to the backend
      
      try {
        // Make a Post request to  Django backend to register new user
        const response = await Axios.post(
          'http://localhost:8000/api-auth-djoser/users/', 
          {
            username: 'testinguser',
            email: 'testinguser@gmail.com',
            password: 'mypass123',
            re_password: 'mypass123',
          }, 
          {
            cancelToken: source.token // Attach the cancel token so it cancel the request if the component unmounts
          },
        );
        // If the request is successful, the response will contain the data

        console.log(response)
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
}, [sendRequest]); // ← This empty array makes sure it runs only once when the component loads

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
            <TextField id="username" fullWidth label="Username" variant="outlined" />
          </Grid>

          <Grid>
            <TextField id="email" fullWidth label="Email" variant="outlined" />
          </Grid>

          <Grid>
            <TextField id="password" fullWidth label="Password" variant="outlined" type="password" />
          </Grid>

          <Grid>
            <TextField id="password2 "fullWidth label="Confirm Password" variant="outlined" type="password" />
          </Grid>

          <Grid>
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
                type="submit">Register</Button>
          </Grid>

          <Grid>
            <Typography variant="small" align="center">
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