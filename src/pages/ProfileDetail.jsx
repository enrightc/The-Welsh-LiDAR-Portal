import React from 'react'

import { useEffect, useContext } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import {useImmerReducer} from "use-immer";
import Axios from 'axios'; 

// Contexts
import StateContext from '../Contexts/StateContext';

//Assets
import defaultProfilePicture from "../Components/Assets/defaultProfilePicture.webp";

// Components


// MUI imports
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';


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
                    },
                    });
            } catch (e) {
                console.log(e.response);
            }
        }
        GetProfileInfo();
    }, []);

  return (
    <div> Profile Page</div>
  )
}

export default ProfileDetail