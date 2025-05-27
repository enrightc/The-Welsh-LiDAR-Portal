import React from 'react'
import { useNavigate } from "react-router-dom";

// MUI Imports
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function Login() {
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
          <Grid>
            <Typography variant="h4" align="center">
              Login to your Account
            </Typography>
          </Grid>

          <Grid>
            <TextField id="username" fullWidth label="Username" variant="outlined" />
          </Grid>


          <Grid>
            <TextField id="password" fullWidth label="Password" variant="outlined" type="password" />
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