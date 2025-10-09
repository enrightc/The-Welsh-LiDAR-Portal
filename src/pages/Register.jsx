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
import Alert from '@mui/material/Alert';

function Register() {
  const navigate = useNavigate()
  const GlobalDispatch = useContext(DispatchContext);
  const [submitting, setSubmitting] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState({});
  const [formError, setFormError] = React.useState("");
  
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
    setFieldErrors({});
    setFormError("");
    if (submitting) return; // Prevent multiple submissions
    // Basic client-side validation
    const newErrors = {};
    if (!state.usernameValue?.trim()) newErrors.username = ["Please enter a username."];
    if (!state.emailValue?.trim()) newErrors.email = ["Please enter an email address."];
    if (!state.passwordValue) newErrors.password = ["Please enter a password."];
    if (!state.password2Value) newErrors.password2 = ["Please confirm your password."];
    if (state.passwordValue && state.password2Value && state.passwordValue !== state.password2Value) {
      newErrors.password2 = ["Passwords do not match."];
    }
    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return; // don't submit
    }
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
          const data = error.response.data || {};
          // Djoser typically returns field-wise arrays, e.g. { username: ["This field ..."], email: ["..."], password: ["..."], re_password: ["..."] }
          const mapped = {};
          if (data.username) mapped.username = Array.isArray(data.username) ? data.username : [String(data.username)];
          if (data.email) mapped.email = Array.isArray(data.email) ? data.email : [String(data.email)];
          if (data.password) mapped.password = Array.isArray(data.password) ? data.password : [String(data.password)];
          if (data.re_password || data.password2) {
            const rp = data.re_password || data.password2;
            mapped.password2 = Array.isArray(rp) ? rp : [String(rp)];
          }
          if (data.non_field_errors) mapped.non_field_errors = Array.isArray(data.non_field_errors) ? data.non_field_errors : [String(data.non_field_errors)];
          if (data.detail) mapped.detail = [String(data.detail)];

          // If nothing mapped, show a generic error
          if (Object.keys(mapped).length === 0) {
            setFormError("Something went wrong. Please try again.");
          } else {
            setFieldErrors(mapped);
          }
        } else if (error.message) {
          setFormError(error.message);
        } else {
          setFormError("Network error. Please try again.");
        }
      } finally {
        setSubmitting(false); // Unlock the form on error or success
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
              error={Boolean(fieldErrors.username)}
              helperText={fieldErrors.username ? fieldErrors.username.join(" ") : ""}
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
              error={Boolean(fieldErrors.email)}
              helperText={fieldErrors.email ? fieldErrors.email.join(" ") : ""}
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
              error={Boolean(fieldErrors.password)}
              helperText={fieldErrors.password ? fieldErrors.password.join(" ") : ""}
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
              error={Boolean(fieldErrors.password2)}
              helperText={fieldErrors.password2 ? fieldErrors.password2.join(" ") : ""}
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

            {(formError || fieldErrors.non_field_errors || fieldErrors.detail) && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {[formError]
                  .concat(fieldErrors.non_field_errors || [])
                  .concat(fieldErrors.detail || [])
                  .filter(Boolean)
                  .join(" ")}
              </Alert>
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