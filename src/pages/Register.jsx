import React from 'react'
import { useNavigate } from "react-router-dom";

// MUI Imports
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
function Register() {
  const navigate = useNavigate()
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
      <form>
        <Grid container direction="column" spacing={3} >
          <Grid item>
            <Typography variant="h4" align="center">
              Create an Account
            </Typography>
          </Grid>

          <Grid item>
            <TextField id="username" fullWidth label="Username" variant="outlined" />
          </Grid>

          <Grid item>
            <TextField id="email" fullWidth label="Email" variant="outlined" />
          </Grid>

          <Grid item>
            <TextField id="password" fullWidth label="Password" variant="outlined" type="password" />
          </Grid>

          <Grid item>
            <TextField id="password2 "fullWidth label="Confirm Password" variant="outlined" type="password" />
          </Grid>

          <Grid item>
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

          <Grid item>
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