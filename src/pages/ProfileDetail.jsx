import React from 'react'

import { useEffect, useContext } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import {useImmerReducer} from "use-immer";
import Axios from 'axios'; 

// Contexts
import StateContext from '../Contexts/StateContext';

//Assets
import defaultProfilePicture from "../Components/Assets/defaultProfilePicture.webp";
import blueskyLogo from "../Components/Assets/blueskyLogo.png";

// Components

// Icons 
import LocationPinIcon from '@mui/icons-material/LocationPin';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import StarIcon from '@mui/icons-material/Star';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';
import LanguageIcon from '@mui/icons-material/Language';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import LinkedInIcon from '@mui/icons-material/LinkedIn';


// MUI imports
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';




function ProfileDetail() {

    const navigate = useNavigate();
    const GlobalState = useContext(StateContext);

    const params = useParams();

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
            profilePicture: "",
            user_records: []
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
        user_records: [],
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
                const response = await Axios.get(`http://localhost:8000/api/profiles/${params.id}/`);
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
                        last_active: response.data.last_active || "",
                        joined_date: response.data.joined_date || "",
                        user_records: response.data.user_records || [],
                    },
                });
            } catch (e) {
                console.log(e.response);
            }
        }
        GetProfileInfo();
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

    console.log("Logged in user ID:", GlobalState.userId);
console.log("Profile page ID:", params.id);

  return (
    <div>
        <Grid
            container
            direction="column"
            alignItems={{ xs: "center", sm: "center" }}
            spacing={2}
            sx={{
                mb: 2,
                p: "4rem", 
                backgroundColor: "FCFCFB"
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

                {String(GlobalState.userId) === String(params.id) && (
                    <Typography
                        display="flex"
                        justifyContent="flex-end"
                        variant="body2"
                        sx={{ color: "primary.main", cursor: "pointer", fontWeight: "medium" }}
                    >
                        <Button onClick={() => navigate("/profile")}>Edit Profile</Button>
                    </Typography>
                )}

                <Box sx={{ display: "flex", mb: 2 }}>
                    <img
                        src={
                        state.userProfile.profilePicture
                            ? state.userProfile.profilePicture
                            : defaultProfilePicture
                        }
                        alt="Profile"
                        style={{
                        width: "6rem",
                        height: "6rem",
                        borderRadius: "50%",
                        objectFit: "cover",
                        }}
                    />
                </Box>

                {/* Bio */}
                
                <Typography  
                    variant="h4" sx={{ fontWeight: "bold", color: "green" }}>
                    @{state.userProfile.user_username}
                </Typography>
                    
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        mt: 2,
                        alignItems: { xs: "flex-start", sm: "center" },
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                    }}
                    >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LocationPinIcon fontSize="medium" />
                        <Typography
                            variant="body1"
                            sx={{ textTransform: "capitalize" }}
                        >
                            {state.userProfile.location}
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <StarIcon fontSize="medium" />
                        <Typography variant="body1">{state.userProfile.expertise}</Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <HomeWorkIcon fontSize="medium" />
                        <Typography variant="body1">{state.userProfile.organisation}</Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CalendarMonthIcon fontSize="medium" />
                        <Typography variant="body1">Last active: {state.userProfile.last_active}</Typography>
                    </Box>
                </Box>

                <Box sx={{mt: 4}}>
                    <Typography>
                        {state.userProfile.bio}
                    </Typography>
                </Box>
            </Box>
        
        
        <Box
            sx={{
                width: "90%",
                maxWidth: "800px",
                mx: "auto",
                p: 3,
                border: "1px solid #ccc",
                borderRadius: 2,
                backgroundColor: "white",
                flexDirection: { xs: "column", sm: "row" },
            }}
        >
            <Box sx={{mt: 2, display: "flex", justifyContent: "center", gap: 10, }}>
                <Typography variant="body1" sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                    <SearchIcon fontSize="large" />
                    Records Submitted: {" "}  
                    {state.userProfile.record_count}
                </Typography>
                <Divider orientation="vertical" flexItem />
                <Typography variant="body1" sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                    <CalendarMonthIcon fontSize="large" />
                    Member since: {" "}  
                    {state.userProfile.joined_date}
                </Typography>
            </Box>
        </Box>

        {/* Social Media */}
        <Box
            sx={{
                width: "90%",
                maxWidth: "800px",
                mx: "auto",
                mt: 5,
                p: 3,
                border: "1px solid #ccc",
                borderRadius: 2,
                backgroundColor: "white",
            }}
        >
            <Box sx={{mt: 2, display: "flex", justifyContent: "center", gap: 6}}>
                {/* users website */}
                {state.userProfile.website && (
                    <Typography
                        variant="body1"
                        sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}
                    >
                        <a
                        href={state.userProfile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Visit user website (opens in new tab)"
                        style={{ color: "inherit", textDecoration: "none" }}
                        >
                        <LanguageIcon fontSize="large" />
                        </a>
                    </Typography>
                )}
                
                {/* Facebook */}
                {state.userProfile.facebook && (
                    <Typography
                        variant="body1"
                        sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}
                        >
                        <a
                            href={state.userProfile.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Visit user facebook (opens in new tab)"
                            style={{ color: "inherit", textDecoration: "none" }}
                        >
                            <FacebookIcon fontSize="large" />
                        </a>
                    </Typography>
                )}
                
                {/* Twitter */}
                {state.userProfile.twitter && (
                    <Typography
                        variant="body1"
                        sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}
                        >
                        <a
                            href={state.userProfile.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Visit user X (opens in new tab)"
                            style={{ color: "inherit", textDecoration: "none" }}
                        >
                            <XIcon fontSize="large" />
                        </a>
                    </Typography>
                )}

                {/* Linkedin */}
                {state.userProfile.linkedin && (
                    <Typography
                        variant="body1"
                        sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}
                        >
                        <a
                            href={state.userProfile.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Visit user Linkedin (opens in new tab)"
                            style={{ color: "inherit", textDecoration: "none" }}
                        >
                            <LinkedInIcon fontSize="large" />
                        </a>
                    </Typography>
                )}

                {/* Bluesky */}
                {state.userProfile.bluesky && (
                    <Typography
                        variant="body1"
                        sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}
                        >
                        <a
                            href={state.userProfile.bluesky}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Visit user bluesky (opens in new tab)"
                            style={{ color: "inherit", textDecoration: "none" }}
                        >
                            <img src={blueskyLogo} alt="Bluesky Logo" style={{ width: "32px", height: "32px" }} />
                        </a>
                    </Typography>
                )} 
            </Box>             
        </Box>

        {/* Features recorded by */}
            <Box
                sx={{
                    width: "90%",
                    maxWidth: "800px",
                    mx: "auto",
                    mt: 5,
                    p: 3,
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    backgroundColor: "white",
                }}
            >
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                        Features recorded by {state.userProfile.user_username}
                    </Typography>

                {state.userProfile.user_records.length === 0 ? (
                    <Typography variant="body2">
                        This user hasn't recorded any features yet.
                    </Typography>
                    ) : (
                    state.userProfile.user_records.map((feature) => (
                        <Box 
                            key={feature.id} 
                            sx={{ 
                                mb: 2, 
                                p: 2, 
                                border: "1px solid #ccc", borderRadius: 2 
                            }}
                        >
                            <Typography 
                                variant="body1"
                            >
                                {feature.title}
                            </Typography>
                            <Typography 
                                variant="body2" 
                                color="text.secondary"
                            >
                                {feature.monument_type_display}
                            </Typography>
                            <Typography 
                                variant="body2" 
                                color="text.secondary"
                            >
                                Period: {feature.period_display}
                            </Typography>
                            <Typography 
                                variant="body2" 
                                sx={{ mt: 1 }}
                            >
                                {feature.description?.slice(0, 100)}...
                            </Typography>
                        
                            <Box 
                                sx={{ 
                                    mt: 1, 
                                    display: "flex", 
                                    gap: 2 
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => navigate(`/map?feature_id=${feature.id}`)}
                                >
                                    View on Map
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => navigate(`/record/${feature.id}`)}
                                >
                                    View Full Record
                                </Button>
                            </Box>
                        </Box>
                    ))
                    )}     
                </Box>

            </Box>
        </Grid>

        
        
            
        
        
        
    </div>
  )
}

export default ProfileDetail