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
                expertise: "",
                organisation: "",
                website: "",
                facebook: "",
                twitter: "",
                instagram: "",
                linkedin: "",
                bluesky: "",
            },
            bioValue: "",
            locationValue: "",
            expertiseValue: "",
            organisationValue: "",  
            websiteValue: "",       
            twitterValue: "",
            facebookValue: "",
            instagramValue: "",
            linkedinValue: "",
            blueskyValue: "",
            sendRequest: 0,
            };
    
    function ReducerFunction(draft, action) {
        switch (action.type) {
            case "catchUserProfileInfo":
                draft.userProfile = action.profileObject;
                draft.bioValue = action.profileObject.bio;
                draft.locationValue = action.profileObject.location;
                draft.expertiseValue = action.profileObject.expertise;
                draft.organisationValue = action.profileObject.organisation;
                draft.websiteValue = action.profileObject.website;
                draft.twitterValue = action.profileObject.twitter;
                draft.facebookValue = action.profileObject.facebook;
                draft.instagramValue = action.profileObject.instagram;
                draft.linkedinValue = action.profileObject.linkedin;
                draft.blueskyValue = action.profileObject.bluesky;
                break;

            case "catchBioChange":
                draft.bioValue = action.bioChosen;
                break;

            case "catchLocationChange":
                draft.locationValue = action.locationChosen;
                break;

            case "catchExpertiseChange":
                draft.expertiseValue = action.expertiseChosen;
                break;

            case "catchOrganisationChange":
                draft.organisationValue = action.organisationChosen;
                break;

            case "catchWebsiteChange":
                draft.websiteValue = action.websiteChosen;
                break;

            case "catchTwitterChange":
                draft.twitterValue = action.twitterChosen;
                break;

            case "catchFacebookChange":
                draft.facebookValue = action.facebookChosen;
                break;

            case "catchInstagramChange":
                draft.instagramValue = action.instagramChosen;
                break;

            case "catchLinkedInChange":
                draft.linkedinValue = action.linkedinChosen;
                break;

            case "catchBlueskyChange":
                draft.blueskyValue = action.blueskyChosen;
                break;

            case "changeSendReuest": 
                draft.sendRequest = draft.sendRequest + 1
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
                const expertiseRaw = response.data.expertise_level || "";
                const expertiseFormatted = expertiseRaw.charAt(0).toUpperCase() + expertiseRaw.slice(1).toLowerCase();

                dispatch({
                    type: "catchUserProfileInfo",
                    profileObject: {
                        bio: response.data.bio || "",
                        location: response.data.location || "",
                        expertise: expertiseFormatted,
                        organisation: response.data.organisation || "",
                        website: response.data.website || "",
                        twitter: response.data.twitter || "",
                        facebook: response.data.facebook || "",
                        instagram: response.data.instagram || "",
                        linkedin: response.data.linkedin || "",
                        bluesky: response.data.bluesky || "",
                    },
                    });
            } catch (e) {
                console.log(e.response);
            }
        }
        GetProfileInfo();
    }, []);

    // useEffect to send the update request
    useEffect(()=>{
        if (state.sendRequest){
            async function updateProfile(){
                const formData = new FormData();
                formData.append("bio", state.bioValue);
                formData.append("location", state.locationValue);
                formData.append("expertise_level", state.expertiseValue ? state.expertiseValue.toLowerCase() : "");
                formData.append("organisation", state.organisationValue);
                formData.append("website", state.websiteValue);
                formData.append("twitter", state.twitterValue);
                formData.append("facebook", state.facebookValue);
                formData.append("instagram", state.instagramValue);
                formData.append("linkedin", state.linkedinValue);
                formData.append("bluesky", state.blueskyValue);
 
                try {
                    const response = await Axios.patch(`http://localhost:8000/api/profiles/${GlobalState.userId}/update`, formData);
                    console.log(response)
                    
                } catch(e){
                    console.log(e.response)
                }
            }
            updateProfile()
        }
    }, [state.sendRequest]); // watch for changes in state.sendRequest

    function FormSubmit(e){
        e.preventDefault()
        dispatch({type: 'changeSendReuest'})
    }

  return (
    <>
    <div>
        <Typography 
            variant="h3"
            style={{
                marginTop: "2rem",
                textAlign: "center",
            }}
        >
            Welcome <span
            style= {{
                color: "green",
                fontWeight: "bolder"
            }}>{GlobalState.userUsername}</span>
        </Typography>
    </div>
    
    {/* Profile Fields */}
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
              My Profile
            </Typography>
          </Grid>

            {/* Bio */}
            <Grid>
            <TextField 
                id="bio" 
                fullWidth 
                label="bio" 
                variant="outlined"
                multiline
                rows={5}
                value={state.bioValue}
                onChange = {(e)=> 
                    // When the user types in the Confirm Password input, do the following:
                    dispatch({
                        type: "catchBioChange", // Action that tells the reducer what to update
                        bioChosen: e.target.value // This is the new value from the input field
                    })
                    }
                    InputLabelProps={{
                    shrink: true
                    }} 
                    />
            </Grid>

            {/* Location */}
            <Grid>
            <TextField 
                id="location" 
                fullWidth 
                label="location" 
                variant="outlined"
                value={state.locationValue}
                onChange = {(e)=> 
                    // When the user types in the Confirm Password input, do the following:
                    dispatch({
                        type: "catchLocationChange", // Action that tells the reducer what to update
                        locationChosen: e.target.value // This is the new value from the input field
                    })
                    }
                    InputLabelProps={{
                    shrink: true
                    }} 
                    />
            </Grid>

            {/* Expertise */}
            <Grid>
                <TextField
                    id="expertise"
                    fullWidth
                    select
                    label="Expertise"
                    value={state.expertiseValue}
                    onChange={(e) =>
                    dispatch({
                        type: "catchExpertiseChange",
                        expertiseChosen: e.target.value
                    })
                    }
                >
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Enthusiast">Enthusiast</MenuItem>
                <MenuItem value="Researcher">Researcher</MenuItem>
                <MenuItem value="Professional">Professional</MenuItem>
            </TextField>
            </Grid>

            {/* Organisation */}
            <Grid>
            <TextField 
                id="organisation" 
                fullWidth 
                label="organisation" 
                variant="outlined"
                value={state.organisationValue}
                onChange = {(e)=> 
                    // When the user types in the Confirm Password input, do the following:
                    dispatch({
                        type: "catchOrganisationChange", // Action that tells the reducer what to update
                        organisationChosen: e.target.value // This is the new value from the input field
                    })
                    }
                    InputLabelProps={{
                    shrink: true
                    }} 
                    />
            </Grid>

            {/* Website */}
            <Grid>
            <TextField 
                id="website" 
                fullWidth 
                label="website" 
                variant="outlined"
                value={state.websiteValue}
                onChange = {(e)=> 
                    // When the user types in the Confirm Password input, do the following:
                    dispatch({
                        type: "catchWebsiteChange", // Action that tells the reducer what to update
                        websiteChosen: e.target.value // This is the new value from the input field
                    })
                    }
                    InputLabelProps={{
                    shrink: true
                    }} 
                    />
            </Grid>

            {/* Twitter */}
            <Grid>
            <TextField 
                id="twitter" 
                fullWidth 
                label="twitter" 
                variant="outlined"
                value={state.twitterValue}
                onChange = {(e)=> 
                    // When the user types in the Confirm Password input, do the following:
                    dispatch({
                        type: "catchTwitterChange", // Action that tells the reducer what to update
                        twitterChosen: e.target.value // This is the new value from the input field
                    })
                    }
                    InputLabelProps={{
                    shrink: true
                    }} 
                    />
            </Grid>

            {/* Facebook */}
            <Grid>
            <TextField 
                id="facebook" 
                fullWidth 
                label="facebook" 
                variant="outlined"
                value={state.facebookValue}
                onChange={(e) =>
                dispatch({
                    type: "catchFacebookChange",
                    facebookChosen: e.target.value,
                })
                }
                InputLabelProps={{ shrink: true }}
            />
            </Grid>

            {/* Instagram */}
            <Grid>
            <TextField 
                id="instagram" 
                fullWidth 
                label="instagram" 
                variant="outlined"
                value={state.instagramValue}
                onChange={(e) =>
                dispatch({
                    type: "catchInstagramChange",
                    instagramChosen: e.target.value,
                })
                }
                InputLabelProps={{ shrink: true }}
            />
            </Grid>

            {/* LinkedIn */}
            <Grid>
            <TextField 
                id="linkedin" 
                fullWidth 
                label="linkedin" 
                variant="outlined"
                value={state.linkedinValue}
                onChange={(e) =>
                dispatch({
                    type: "catchLinkedInChange",
                    linkedinChosen: e.target.value,
                })
                }
                InputLabelProps={{ shrink: true }}
            />
            </Grid>

            {/* Bluesky */}
            <Grid>
            <TextField 
                id="bluesky" 
                fullWidth 
                label="bluesky" 
                variant="outlined"
                value={state.blueskyValue}
                onChange={(e) =>
                dispatch({
                    type: "catchBlueskyChange",
                    blueskyChosen: e.target.value,
                })
                }
                InputLabelProps={{ shrink: true }}
            />
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
                type="submit">Update</Button>
          </Grid>

        </Grid>
      </form>
    </div>
    </>
  )
}

export default Profile