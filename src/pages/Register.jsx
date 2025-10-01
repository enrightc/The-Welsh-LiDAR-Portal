import React, { useEffect, useContext } from 'react'
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useImmerReducer } from "use-immer";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Import contexts
import DispatchContext from '../Contexts/DispatchContext';

// MUI Imports
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

function Register() {
  const navigate = useNavigate()
  const GlobalDispatch = useContext(DispatchContext);
  const [submitting, setSubmitting] = React.useState(false);
  
  const initialstate = {
      usernameValue: "",
      emailValue: "",
      passwordValue: "",
      password2Value: "",
      sendRequest: 0,
    };
  
    function ReducerFunction(draft, action){
      switch (action.type){
        case "catchUsernameChange":
          draft.usernameValue = action.usernameChosen;
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
          draft.sendRequest = draft.sendRequest + 1
          break;
      }
    }
  
    const [state, dispatch] = useImmerReducer(ReducerFunction, initialstate)

  function FormSubmit(e){
    e.preventDefault()
    if (submitting) return; // Prevent multiple submissions
    setSubmitting(true); // Lock the form
    dispatch({type: 'changeSendRequest'})
  }

  useEffect(() => {
    if (state.sendRequest) {
      const source = Axios.CancelToken.source();
    
    async function SignUp() {
      try {
        // Register the user
        const response = await Axios.post(
          `${BASE_URL}/api-auth-djoser/users/`,
          {
            username: state.usernameValue,
            email: state.emailValue,
            password: state.passwordValue,
            re_password: state.password2Value,
          },
          {
            cancelToken: source.token
          },
        );

        console.log("Registration successful:", response.data);

        // Log the user in
        const loginResponse = await Axios.post(
          `${BASE_URL}/api-auth-djoser/token/login/`,
          {
            username: state.usernameValue,
            password: state.passwordValue,
          }
        );

        const token = loginResponse.data.auth_token;
        
        // Set Axios default header for future requests
        Axios.defaults.headers.common["Authorization"] = `Token ${token}`;

        // Get user information
        const userInfoResponse = await Axios.get(
          `${BASE_URL}/api-auth-djoser/users/me/`,
          {
            headers: { Authorization: `Token ${token}` }
          }
        );

        console.log("User info retrieved:", userInfoResponse.data);

        // Set localStorage BEFORE dispatching (critical for immediate state sync)
        localStorage.setItem("theUserUsername", userInfoResponse.data.username);
        localStorage.setItem("theUserEmail", userInfoResponse.data.email);
        localStorage.setItem("theUserId", userInfoResponse.data.id);
        localStorage.setItem("theUserToken", token);

        // Update global state
        GlobalDispatch({
          type: "userSignsIn",
          usernameInfo: userInfoResponse.data.username,
          emailInfo: userInfoResponse.data.email,
          IdInfo: userInfoResponse.data.id,
          tokenInfo: token,
        });

        // Navigate to home
        navigate("/profile", { replace: true });

      } catch (error) {
        if (error.response) {
          console.log("Server responded with:", error.response.status, error.response.data);
        } else {
          console.log("Error:", error.message);
        }
      } finally {
        setSubmitting(false); // Unlock the form on error
      }
    }
    
    SignUp();
    return () => {
      source.cancel();
    };
  }
}, [state.sendRequest]);

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
              onChange = {(e)=> 
                dispatch({
                  type: "catchUsernameChange",
                  usernameChosen: e.target.value
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
              disabled={submitting}
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
              type="submit">
              {submitting ? <CircularProgress size={20} color="inherit" /> : "Register"}
            </Button>

            {submitting && (
              <Typography 
                variant="body2" 
                align="center" 
                sx={{ mt: 1, opacity: 0.8 }}
              >
                If this takes a while, the server might be waking up.
              </Typography>
            )}
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