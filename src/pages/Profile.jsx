import React from 'react'

import { useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import {useImmerReducer} from "use-immer";
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

function Profile() {
    const navigate = useNavigate()
    const GlobalState = useContext(StateContext) 

    const initialstate = {
            userProfile: {
                bio: "",
                location: "",
            }
        };
    
    function ReducerFunction(draft, action){
        switch (action.type){
            case "catchUserProfileInfo":
                draft.userProfile = action.profileObject;
                break;  
        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFunction, initialstate)

    // request to get profile info
    useEffect(() => {
        async function GetProfileInfo() {
            try {
                const response = await Axios.get(`http://localhost:8000/api/profiles/${GlobalState.userId}/`);
                console.log(response.data);
                dispatch({
                    type: "catchUserProfile",
                    profileObject: response.data,
                });
            } catch (e) {
                console.log(e.response);
            }
        }
        GetProfileInfo();
    }, []);

  return (
    <>
    <Typography 
        variant="h3" 
        style={{
            marginTop: "1rem",
            textAlign: "center",
        }}   
    >
        My Profile
    </Typography>
    
    <Typography 
        variant="h4"
        style={{
            marginTop: "1rem",
            textAlign: "center",
        }}
    >
        Welcome <span
        style= {{
            color: "green",
            fontWeight: "bolder"
        }}>{GlobalState.userUsername}</span>
    </Typography>
    </>
  )
}

export default Profile