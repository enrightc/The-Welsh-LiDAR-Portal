import React from 'react'

import { useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import {useImmerReducer} from "use-immer";
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
                uploadedPicture: [],
                profilePicture: ""
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
            uploadedPicture: [],
            profilePictureValue: "",
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
                draft.uploadedPictureValue = action.profileObject.uploadededPicture;
                draft.profilePictureValue = action.profileObject.profilePicture;
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

            case "catchUploadedPictureChange":
                draft.uploadedPictureValue = action.uploadedPictureChosen;
                break;

            case "catchProfilePictureChange":
                draft.profilePictureValue = action.profilePictureChosen;
                break;

            case "changeSendRequest": 
                draft.sendRequest = draft.sendRequest + 1
                break;
            }
        }

    const [state, dispatch] = useImmerReducer(ReducerFunction, initialstate)

    // useEffect to catch uploaded picture
    useEffect(() => {
    if (state.uploadedPictureValue && state.uploadedPictureValue[0]){
        dispatch({
            type: 'catchProfilePictureChange',
            profilePictureChosen: state.uploadedPictureValue[0]
        });
    }
}, [state.uploadedPictureValue]);

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
                        record_count: response.data.record_count || 0,
                        profilePicture: response.data.profile_picture || "",
                    },
                    });
            } catch (e) {
                console.log(e.response);
            }
        }
        GetProfileInfo();
    }, []);

    // useEffect to send the update request
    useEffect(() => {
      if (state.sendRequest) {
        async function updateProfile() {
          const formData = new FormData();

          formData.append("bio", state.bioValue || "");
          formData.append("location", state.locationValue || "");
          formData.append(
            "expertise_level",
            state.expertiseValue ? state.expertiseValue.toLowerCase() : ""
          );
          formData.append("organisation", state.organisationValue || "");

          let website = state.websiteValue || "";
          if (
            website &&
            !website.startsWith("http://") &&
            !website.startsWith("https://")
          ) {
            website = "https://" + website;
          }
          formData.append("website", website);
          formData.append("twitter", state.twitterValue || "");
          formData.append("facebook", state.facebookValue || "");
          formData.append("instagram", state.instagramValue || "");
          formData.append("linkedin", state.linkedinValue || "");
          formData.append("bluesky", state.blueskyValue || "");

          if (
            state.profilePictureValue &&
            typeof state.profilePictureValue === "object" &&
            state.profilePictureValue instanceof File
          ) {
            formData.append("profile_picture", state.profilePictureValue);
          }

          try {
            const response = await Axios.patch(
              `http://localhost:8000/api/profiles/${GlobalState.userId}/update/`,
              formData
            );
            console.log(response);
            navigate(0);
          } catch (e) {
            console.log(e.response);
            console.log("profilePicture from API:", e?.response?.data?.profilePicture);
            console.log("userProfile from state:", state.userProfile);
          }
        }

        updateProfile();
      }
    }, [state.sendRequest]);

    function FormSubmit(e){
        e.preventDefault()
        dispatch({type: 'changeSendRequest'})
    }

    // function to display thumbnail profile picture
    function ProfilePictureDisplay() {
        if (state.profilePictureValue && typeof state.profilePictureValue === "object") {
            // This is the newly uploaded file (before submission)
            const imageUrl = URL.createObjectURL(state.profilePictureValue);
            return (
            <Grid item style={{ marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}>
                <img src={imageUrl} alt="Preview" style={{ height: "5rem", width: "5rem", objectFit: "cover", borderRadius: "5px" }} />
            </Grid>
            );
        }

        if (typeof state.profilePictureValue === "string" && state.profilePictureValue !== "") {
            // This is the existing profile picture from the backend
            return (
            <Grid item style={{ marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}>
                <img src={state.profilePictureValue} alt="Current Profile" style={{ height: "5rem", width: "5rem", objectFit: "cover", borderRadius: "5px" }} />
            </Grid>
            );
        }

        return null; // Nothing to show
        }

  return (
    <>
    <div
    style={{
        width: '100%',
        maxWidth: '800px',
        margin: '3rem auto',
        padding: '2rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: 'white',
      }}>
        <Grid container spacing={2} alignItems="center" justifyContent="center" style={{ marginBottom: '2rem' }}>
            {/* Profile Picture */}
            <Grid item xs={12} md={4}>
                <img
                    src={
                    state.userProfile.profilePicture
                        ? state.userProfile.profilePicture
                        : defaultProfilePicture
                    }
                    alt="Profile"
                    style={{
                    width: '100%',
                    maxWidth: '200px',
                    borderRadius: '8px',
                    display: 'block',
                    margin: '0 auto',
                    }}
                />
                </Grid>

            {/* Welcome Text */}
            <Grid item xs={12} md={8}>
                <Typography 
                variant="h3"
                style={{
                    textAlign: "center",
                }}
                >
                Welcome <span
                    style= {{
                    color: "green",
                    fontWeight: "bolder"
                    }}>{GlobalState.userUsername}</span>
                </Typography>

                <Typography 
                variant="h5"
                style={{
                    marginTop: "1rem",
                    textAlign: "center",
                }}
                >
                You have recorded {state.userProfile.record_count || 0} LiDAR Features
                </Typography>
            </Grid>
        </Grid>   
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
            <Typography variant="h4" align="left">
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

            {/* Upload profile photo */}
            <Grid>
                <Button 
                    variant="contained" 
                    xs={6}
                    component="label"
                    style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}
                    sx= {{
                        color: "black",
                        border: "1px solid black",
                        fontSize: { xs: '0.8rem', md: '0.8rem' },
                        borderRadius: "5px",
                        backgroundColor: "",
                        }} 
                >
                    Profile Picture
                    <input
                        type="file"
                        accept="image/png, image/gif, image/jpeg"
                        hidden  
                        onChange={(e) =>
                            dispatch({type: 'catchUploadedPictureChange', uploadedPictureChosen: e.target.files,
                            })
                        }
                    />
                </Button>
            </Grid>

            {/* Picture uploaded feedback */}
            <Grid 
                container
                sx= {{
                    color: "black",
                }}>
                    {ProfilePictureDisplay()}
                {/* <ul>
                    {state.profilePictureValue ? <li>{state.profilePictureValue.name}</li> : ""}
                </ul>        */}
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