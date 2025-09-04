import React from 'react'

import { useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import {useImmerReducer} from "use-immer";
import Axios from 'axios'; 

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Contexts
import StateContext from '../Contexts/StateContext';

//Assets
import defaultProfilePicture from "../Components/Assets/defaultProfilePicture.webp";

// Components
import Snackbar from '../Components/MySnackbar.jsx';

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
    
    // Redirect unauthenticated users to login if the try to access /profile route
    useEffect(() => {
      if (!GlobalState.userId) {
        navigate("/login");
      }
    }, [GlobalState.userId]);


    const [snackbarOpen, setSnackbarOpen] = React.useState(false);

    const [snackbarMessage, setSnackbarMessage] = React.useState("Profile updated!");

    // Function to Open the Snackbar:
    const handleSnackbarOpen = (
        message = "Profile updated!") => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };  
    
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

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
                const response = await Axios.get(`${BASE_URL}/api/profiles/${GlobalState.userId}/`);
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
                        user_username: response.data.user_username || "",
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
              `${BASE_URL}/api/profiles/${GlobalState.userId}/update/`,
              formData
            );
            console.log(response);
            handleSnackbarOpen("Profile updated!");
            setTimeout(() => navigate(0), 1500);
          } catch (e) {
            console.log(e.response);
            handleSnackbarOpen("Update failed. Please try again.");
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
      const size = 80; // px
      const commonStyle = {
        width: size,
        height: size,
        objectFit: "cover",
        borderRadius: "50%",
        display: "block",
        backgroundColor: "transparent",
      };

      if (state.profilePictureValue && typeof state.profilePictureValue === "object") {
        // Newly uploaded file preview
        const imageUrl = URL.createObjectURL(state.profilePictureValue);
        return <img src={imageUrl} alt="Preview" style={commonStyle} />;
      }

      if (typeof state.profilePictureValue === "string" && state.profilePictureValue !== "") {
        // Existing profile picture from backend
        return <img src={state.profilePictureValue} alt="Current Profile" style={commonStyle} />;
      }

      return null; // Nothing to show
    }

  return (
    <>
      <Grid
        container
        direction="column"
        justifyContent="center"
        
        style={{
          padding: "4rem",
        }}
      >
        <Box
          sx={{
            width: "90%",
            maxWidth: "800px",
            mx: "auto",
            my: 6,
            p: 3,
            border: "1px solid #ccc",
            borderRadius: 2,
            backgroundColor: "white",
          }}
        >
          <Grid
            container
            direction="column"
            justifyContent="center"
            sx={{
              px: { xs: 2, sm: 4 }, // padding left/right: 2 on mobile, 4 on desktop
              py: 4, // padding top/bottom stays 4
            }}
          >
            {/* Profile Picture */}
            <Grid style={{ flexBasis: "100%", maxWidth: "100%" }}>
              <img
                src={
                  state.userProfile.profilePicture
                    ? state.userProfile.profilePicture
                    : defaultProfilePicture
                }
                alt="Profile"
                style={{
                  width: "100%",
                  maxWidth: "200px",
                  display: "block",
                  margin: "0 auto",
                  borderRadius: "50%",
                }}
              />
            </Grid>

            {/* Welcome Text */}
            <Grid style={{ flexBasis: "100%", maxWidth: "100%" }}>
              <Typography
                variant="h3"
                style={{
                  textAlign: "center",
                }}
              >
                Welcome{" "}
                <span
                  style={{
                    color: "green",
                    fontWeight: "bolder",
                  }}
                >
                  {GlobalState.userUsername}
                </span>
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
        </Box>

        {/* Profile Fields */}
        <Box
          sx={{
            width: "90%",
            maxWidth: "800px",
            mx: "auto",
            my: 6,
            p: 3,
            border: "1px solid #ccc",
            borderRadius: 2,
            backgroundColor: "white",
          }}
        >
          <form onSubmit={FormSubmit}>
            <Grid container direction="column" spacing={3}>
              <Grid sx={{ width: "100%" }}>
                <Typography variant="h4" align="left">
                  My Profile
                </Typography>
              </Grid>

              {/* Bio */}
              <Grid item sx={{ width: "100%" }}>
                <TextField
                  id="bio"
                  fullWidth
                  label="bio"
                  variant="outlined"
                  multiline
                  rows={5}
                  value={state.bioValue}
                  onChange={e =>
                    dispatch({
                      type: "catchBioChange",
                      bioChosen: e.target.value,
                    })
                  }
                />
              </Grid>

              {/* Location */}
              <Grid item sx={{ width: "100%" }}>
                <TextField
                  id="location"
                  fullWidth
                  label="location"
                  variant="outlined"
                  value={state.locationValue}
                  onChange={e =>
                    dispatch({
                      type: "catchLocationChange",
                      locationChosen: e.target.value,
                    })
                  }
                />
              </Grid>

              {/* Expertise */}
              <Grid item sx={{ width: "100%" }}>
                <TextField
                  id="expertise"
                  fullWidth
                  select
                  label="Expertise"
                  value={state.expertiseValue}
                  onChange={e =>
                    dispatch({
                      type: "catchExpertiseChange",
                      expertiseChosen: e.target.value,
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
              <Grid item sx={{ width: "100%" }}>
                <TextField
                  id="organisation"
                  fullWidth
                  label="organisation"
                  variant="outlined"
                  value={state.organisationValue}
                  onChange={e =>
                    dispatch({
                      type: "catchOrganisationChange",
                      organisationChosen: e.target.value,
                    })
                  }
                />
              </Grid>

              {/* Website */}
              <Grid item sx={{ width: "100%" }}>
                <TextField
                  id="website"
                  fullWidth
                  label="website"
                  variant="outlined"
                  value={state.websiteValue}
                  onChange={e =>
                    dispatch({
                      type: "catchWebsiteChange",
                      websiteChosen: e.target.value,
                    })
                  }
                />
              </Grid>

              {/* Twitter */}
              <Grid item sx={{ width: "100%" }}>
                <TextField
                  id="twitter"
                  fullWidth
                  label="twitter"
                  variant="outlined"
                  value={state.twitterValue}
                  onChange={e =>
                    dispatch({
                      type: "catchTwitterChange",
                      twitterChosen: e.target.value,
                    })
                  }
                />
              </Grid>

              {/* Facebook */}
              <Grid item sx={{ width: "100%" }}>
                <TextField
                  id="facebook"
                  fullWidth
                  label="facebook"
                  variant="outlined"
                  value={state.facebookValue}
                  onChange={e =>
                    dispatch({
                      type: "catchFacebookChange",
                      facebookChosen: e.target.value,
                    })
                  }
                />
              </Grid>

              {/* Instagram */}
              <Grid item sx={{ width: "100%" }}>
                <TextField
                  id="instagram"
                  fullWidth
                  label="instagram"
                  variant="outlined"
                  value={state.instagramValue}
                  onChange={e =>
                    dispatch({
                      type: "catchInstagramChange",
                      instagramChosen: e.target.value,
                    })
                  }
                />
              </Grid>

              {/* LinkedIn */}
              <Grid item sx={{ width: "100%" }}>
                <TextField
                  id="linkedin"
                  fullWidth
                  label="linkedin"
                  variant="outlined"
                  value={state.linkedinValue}
                  onChange={e =>
                    dispatch({
                      type: "catchLinkedInChange",
                      linkedinChosen: e.target.value,
                    })
                  }
                />
              </Grid>

              {/* Bluesky */}
              <Grid item sx={{ width: "100%" }}>
                <TextField
                  id="bluesky"
                  fullWidth
                  label="bluesky"
                  variant="outlined"
                  value={state.blueskyValue}
                  onChange={e =>
                    dispatch({
                      type: "catchBlueskyChange",
                      blueskyChosen: e.target.value,
                    })
                  }
                />
              </Grid>

              {/* Upload profile photo */}
              <Grid item sx={{ width: "100%" }}>
                <Button
                  variant="contained"
                  component="label"
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                  sx={{
                    color: "black",
                    border: "1px solid black",
                    fontSize: "0.9rem",
                    borderRadius: "5px",
                    backgroundColor: "",
                  }}
                >
                  Profile Picture
                  <input
                    type="file"
                    accept="image/png, image/gif, image/jpeg"
                    hidden
                    onChange={e =>
                      dispatch({
                        type: "catchUploadedPictureChange",
                        uploadedPictureChosen: e.target.files,
                      })
                    }
                  />
                </Button>
              </Grid>

              {/* Picture uploaded feedback */}
              <Grid container justifyContent="center" alignItems="center" sx={{ mt: 1 }}>
                {ProfilePictureDisplay()}
              </Grid>

              <Grid item sx={{ width: "100%" }}>
                <Button
                  variant="contained"
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                  sx={{
                    color: "black",
                    border: "none",
                    fontSize: "0.9rem",
                    borderRadius: "5px",
                    backgroundColor: "#FFD034",
                  }}
                  type="submit"
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </form>
          <Snackbar
            open={snackbarOpen}
            onClose={handleSnackbarClose}
            message={snackbarMessage}
          />
        </Box>
      </Grid>
    </>
  );
}

export default Profile