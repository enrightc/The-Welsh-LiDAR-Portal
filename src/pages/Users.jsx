import React, { useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import Axios from 'axios';

// Contexts
import StateContext from '../Contexts/StateContext';

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
      <Grid container justifyContent="flex-start"
      spacing={2} 
      style={{
        padding: "100px"
      }} 
    >
          {state.profilesList.map((profile) => {
            return (
                <Grid 
                    key={profile.id} 
                    item style={{
                        marginTop: "1em", 
                        maxWidth: "20em",
                        minWidth: "20em",
                    }}
                >
                    <Card>
                    <CardMedia
                        sx={{ height: 140 }}
                        image=""
                        title="Profile Picture"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                        {profile.user_username}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {profile.bio.substring(0,100) || "No bio provided."}... 
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Member since {profile.joined_date.split('T')[0]}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Last Active {profile.last_active.split('T')[0]}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">{profile.record_count} Lidar Features recorded</Button>
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