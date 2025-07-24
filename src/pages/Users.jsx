import React, { useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import Axios from 'axios';

// Contexts
import StateContext from '../Contexts/StateContext';

//Assets
import defaultProfilePicture from "../Components/Assets/defaultProfilePicture.webp";

// MUI imports
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

function Users() {
  function Profile() {
    const navigate = useNavigate();
    const GlobalState = useContext(StateContext);

    const initialstate = {
      dataIsLoading: true,
      profilesList: [],
    };

    function ReducerFunction(draft, action) {
      switch (action.type) {
        case 'catchProfiles':
          draft.profilesList = action.profilesArray;
          break;
        case 'loadingDone':
          draft.dataIsLoading = false;
          break;
      }
    }

    const [state, dispatch] = useImmerReducer(ReducerFunction, initialstate);

    // Request to get all profiles
    useEffect(() => {
      async function GetProfiles() {
        try {
          const response = await Axios.get(`http://localhost:8000/api/profiles/`);
          console.log(response.data);
          dispatch({
            type: "catchProfiles",
            profilesArray: response.data,
          });
          dispatch({ type: "loadingDone" });
        } catch (e) {
          console.log(e.response);
        }
      }
      GetProfiles();
    }, []);

    if (state.dataIsLoading === true) {
      return (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ height: "100vh" }}
        >
          <CircularProgress />
        </Grid>
      );
    }

    return (
      <Grid container justifyContent="center"
      spacing={4} 
      style={{
        padding: "4rem"
      }} 
    >
          {state.profilesList.map((profile) => {
            return (
                <Grid 
                  container
                  justifyContent="center"
                  
                    key={profile.id} 
                    style={{
                         
                        maxWidth: "20em",
                        minWidth: "20em",
                        display: "flex",
                        justifyContent: "center"
                    }}
                >
                    <Card
                      sx={{
                        width: "100%", boxShadow: 3, borderRadius: 2
                      }}
                    >
                    <CardMedia
                        sx={{
                          height: 200,
                        }}
                        image={profile.profile_picture ? profile.profile_picture : defaultProfilePicture }
                        alt="Profile Picture"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                        {profile.user_username}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        {profile.bio.substring(0,100) || "No bio provided."}... 
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        Member since {profile.joined_date.split('T')[0]}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Last Active {profile.last_active.split('T')[0]}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" onClick={()=>navigate(`/user/${profile.id}`)}>{profile.record_count} Lidar Features recorded</Button>
                    </CardActions>
                  </Card>
                </Grid>
                
            );
        })}
        
      </Grid>
    );
  }

  return <Profile />;
}

export default Users;