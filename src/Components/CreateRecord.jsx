
import * as React from 'react';

import { useEffect, useContext } from 'react';

import { useNavigate } from "react-router-dom";
import {useImmerReducer} from "use-immer";

import Axios from 'axios'; // Import Axios for making HTTP requests

// MUI imports
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

// Contexts
import StateContext from '../Contexts/StateContext';

// Components
import ToastListener from './ToastListener.jsx';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const siteOptions = [
    { value: '', label: '' },
    { value: 'enclosure', label: 'Enclosure' },
    { value: 'mound', label: 'Mound' },
    { value: 'field_system', label: 'Field system' },
    { value: 'settlement', label: 'Settlement' },
    { value: 'trackway', label: 'Trackway' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'pit', label: 'Pit' },
    { value: 'bank', label: 'Bank' },
    { value: 'ditch', label: 'Ditch' },
    { value: 'other', label: 'Other' },
    { value: 'unknown', label: 'Unknown' },
  ];

const monumentOptions = {
enclosure: [
    { value: 'banjo_enclosure', label: 'Banjo enclosure' },
    { value: 'curvilinear_enclosure', label: 'Curvilinear enclosure' },
    { value: 'defended_enclosure', label: 'Defended enclosure' },
    { value: 'causewayed_enclosure', label: 'Causewayed enclosure' },
    { value: 'rectilinear_enclosure', label: 'Rectilinear enclosure' },
    { value: 'hillfort', label: 'Hillfort' },
    { value: 'promontory_fort', label: 'Promontory fort' },
],
mound: [
    { value: 'round_barrow', label: 'Round barrow' },
    { value: 'cairn', label: 'Cairn' },
    { value: 'platform_mound', label: 'Platform mound' },
    { value: 'burial_mound', label: 'Burial mound' },
],
field_system: [
    { value: 'field_system', label: 'Field system' },
    { value: 'ridge_and_furrow', label: 'Ridge and furrow' },
    { value: 'lynchet', label: 'Lynchet' },
    { value: 'strip_field_system', label: 'Strip field system' },
],
settlement: [
    { value: 'hillfort', label: 'Hillfort' },
    { value: 'roman_villa', label: 'Roman villa' },
    { value: 'farmstead', label: 'Farmstead' },
    { value: 'hamlet', label: 'Hamlet' },
    { value: 'deserted_medieval_village', label: 'Deserted medieval village' },
],
trackway: [
    { value: 'hollow_way', label: 'Hollow way' },
    { value: 'trackway', label: 'Trackway' },
    { value: 'causeway', label: 'Causeway' },
],
industrial: [
    { value: 'tramway', label: 'Tramway' },
    { value: 'quarry', label: 'Quarry' },
    { value: 'mine_shaft', label: 'Mine shaft' },
    { value: 'leat', label: 'Leat' },
    { value: 'mill', label: 'Mill' },
],
pit: [
    { value: 'quarry_pit', label: 'Quarry pit' },
    { value: 'extraction_pit', label: 'Extraction pit' },

],
bank: [
    { value: 'boundary_bank', label: 'Boundary bank' },
    { value: 'defensive_bank', label: 'Defensive bank' },
    { value: 'field_boundary', label: 'Field boundary' },
],
ditch: [
    { value: 'defensive_ditch', label: 'Defensive ditch' },
    { value: 'drainage_ditch', label: 'Drainage ditch' },
    { value: 'boundary_ditch', label: 'Boundary ditch' },
],
other: [
    { value: 'earthwork', label: 'Earthwork' },
    { value: 'cropmark', label: 'Cropmark' },
    { value: 'structure', label: 'Structure (undefined)' },
    { value: 'other', label: 'Other' },
],
unknown: [
    { value: 'unknown', label: 'Unknown' },
],
};

const periodOptions = [
    { value: 'neolithic', label: 'Neolithic' },
    { value: 'bronze_age', label: 'Bronze Age' },
    { value: 'iron_age', label: 'Iron Age' },
    { value: 'roman', label: 'Roman' },
    { value: 'medieval', label: 'Medieval' },
    { value: 'post_medieval', label: 'Post Medieval' },
    { value: 'modern', label: 'Modern' },
    { value: 'unknown', label: 'Unknown' },
  ];

// const confidenceOptions = [
// { value: 'certain', label: 'Certain' },
// { value: 'probable', label: 'Probable' },
// { value: 'possible', label: 'Possible' },
// ];

export default function CreateRecord({ resetPolygon, fetchRecords, onSuccess }) {
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate()
    const GlobalState = useContext(StateContext) // Get global state, specfically for lat/lng of marker

    const [errors, setErrors] = React.useState({});

    const initialstate = {
        titleValue: "",
        prnValue: "",
        descriptionValue: "",
        siteValue: "",
        monumentValue: "",
        periodValue: "",
        picture1Value: "",
        picture2Value: "",
        picture3Value: "",
        picture4Value: "",
        picture5Value: "",
        uploadedPictures: [],
        sendRequest: 0,
    };
    
    function ReducerFunction(draft, action){
        switch (action.type){
            case "catchTitleChange":
                draft.titleValue = action.titleChosen; // Update usernameValue in the state
                break;
            case "catchPrnChange":
                draft.prnValue = action.prnChosen;
                break;
            case "catchDescriptionChange":
                draft.descriptionValue = action.descriptionChosen;
            break;
            case "catchSiteChange":
                draft.siteValue = action.siteChosen;
                break;
            case "catchMonumentChange":
                draft.monumentValue = action.monumentChosen;
                break;
            case "catchPeriodChange":
                draft.periodValue = action.periodChosen;
                break;
            case "picture1Change":
                draft.picture1Value = action.picture1Chosen;
                break;
            case "picture2Change":
                draft.picture2Value = action.picture2Chosen;
                break;
            case "picture3Change":
                draft.picture3Value = action.picture3Chosen;
                break;
            case "picture4Change":
                draft.picture4Value = action.picture4Chosen;
                break;
            case "picture5Change":
                draft.picture5Value = action.picture5Chosen;
                break;
            case "catchUploadedPictures":
                draft.uploadedPictures = Array.from(action.picturesChosen);
                break;
            case "changeSendRequest":
                draft.sendRequest = draft.sendRequest + 1 // Toggle sendRequest state
                break; // This action will trigger the useEffect to send the request
            case "resetForm":
                return initialstate; // Resets all fields to their initial values
                break;
        }
    }
    
    const [state, dispatch] = useImmerReducer(ReducerFunction, initialstate)

    // Catching picture fields
    // This effect runs every time the first uploaded picture changes.
    useEffect(() => {
        // Check if there is a picture in the first slot of uploadedPictures (i.e. if the user has selected at least one picture).
        if (state.uploadedPictures[0]) {
            // If there is a picture, update the form state with the new picture for picture1.
            // The dispatch function sends an action to the reducer to save this picture in a separate state variable (picture1Value).
            dispatch({
                type: "picture1Change",         // Action type the reducer will listen for
                picture1Chosen: state.uploadedPictures[0], // The actual picture file selected by the user
            });
        }
        // The dependency array below means this effect will run again whenever state.uploadedPictures[0] changes.
    }, [state.uploadedPictures[0]]);

    useEffect(() => {
        if (state.uploadedPictures[1]) {
            dispatch({
                type: "picture2Change",
                picture2Chosen: state.uploadedPictures[1],
            });
        }
    }, [state.uploadedPictures[1]]);

    useEffect(() => {
        if (state.uploadedPictures[2]) {
            dispatch({
                type: "picture3Change",
                picture3Chosen: state.uploadedPictures[2],
            });
        }
    }, [state.uploadedPictures[2]]);

    useEffect(() => {
        if (state.uploadedPictures[3]) {
            dispatch({
                type: "picture4Change",
                picture4Chosen: state.uploadedPictures[3],
            });
        }
    }, [state.uploadedPictures[3]]);

    useEffect(() => {
        if (state.uploadedPictures[4]) {
            dispatch({
                type: "picture5Change",
                picture5Chosen: state.uploadedPictures[4],
            });
        }
    }, [state.uploadedPictures[4]]);

    function FormSubmit(e){
        e.preventDefault(); // Stop default form submission
    
        let newErrors = {};
    
        if (!state.titleValue.trim()) newErrors.title = "Title is required";
        if (!state.descriptionValue.trim()) newErrors.description = "Description is required";
        if (!state.siteValue) newErrors.site = "Site type is required";
        if (!state.monumentValue) newErrors.monument = "Monument type is required";
        if (!state.periodValue) newErrors.period = "Period is required";
        if (!GlobalState.polygonValue || GlobalState.polygonValue.length === 0)
            newErrors.polygon = "You must draw a polygon";
    
        setErrors(newErrors);
    
        // If there are errors, do NOT submit
        if (Object.keys(newErrors).length > 0) {
            return;
        }
    
        // If no errors, submit as normal
        dispatch({type: 'changeSendRequest'})
        handleSnackbarOpen();
    }

    useEffect(()=>{
        if (state.sendRequest){
            async function AddRecord(){
                console.log([
                    state.titleValue, state.descriptionValue, state.prnValue,
                    state.siteValue, state.monumentValue, state.periodValue,
                    // state.latitudeValue, state.longitudeValue, state.picture1Value,
                    state.picture2Value, state.picture3Value, state.picture4Value, state.picture5Value,
                    GlobalState.userId
                  ]);
                const formData = new FormData();
                    formData.append(
                        "title", state.titleValue);
                    formData.append(
                        "description", state.descriptionValue);
                    formData.append(
                        "PRN", state.prnValue);
                    formData.append(
                        "site_type", state.siteValue);
                    formData.append(
                        "monument_type", state.monumentValue);
                    formData.append(
                        "period", state.periodValue);
                    // formData.append(
                    //     "latitude", state.latitudeValue);
                    // formData.append(
                    //     "longitude", state.longitudeValue);
                    formData.append(
                        "picture1", state.picture1Value);
                    formData.append(
                        "picture2", state.picture2Value);
                    formData.append(
                        "picture3", state.picture3Value);
                    formData.append(
                        "picture4", state.picture4Value);
                    formData.append(
                        "picture5", state.picture5Value);
                    
                    formData.append("polygonCoordinate", JSON.stringify(GlobalState.polygonValue));  
                try {
                    const response = await Axios.post(
                        `${BASE_URL}/api/records/create/`,
                        formData,
                        {
                            headers: {
                                Authorization: `Token ${GlobalState.userToken}`  // 👈 this must be your user's auth token
                            }
                        }
                    );
                    console.log(response)
                    dispatch({ type: "resetForm" }); // <--- Reset form
                    resetPolygon(); // Reset the polygon in the parent component
                    navigate("/LidarPortal", { state: { toast: "New record successfully created" } });
                    console.log("Called resetPolygon from CreateRecord!");
                    fetchRecords(); // Fetch the updated records after adding a new one
                    // if onSuccess provided tell sidebar to close.
                    if (typeof onSuccess === "function") {
                      onSuccess();
                    }

                } catch(e){
                    console.log(e.response)
                    navigate(".", { state: { toast: "There was a problem creating your record. Please try again." } });
                }
            }
            AddRecord()
        }
    }, [state.sendRequest]); // watch for changes in state.sendRequest


    return (
    <div>
        <div
            style={{
                width: '400px',
                maxWidth: '800px',
                margin: '1rem auto',
                padding: '2rem', 
                maxHeight: '80vh',         // Set a maximum height (e.g., 80% of viewport height)
                overflowY: 'auto',         // Enable vertical scrolling when content overflows
                background: '#fff',        // (optional) background for clarity
                borderRadius: '8px',       // (optional) rounded corners
                boxShadow: '0 2px 8px #0001', // (optional) subtle shadow  
            }}
        >
            <form onSubmit={FormSubmit}>
                <Grid container direction="column"
                 spacing={3} >
                
                    {/* Heading */}
                    <Grid>
                        <Typography 
                            variant="h4" 
                            align="center"
                            color="black"
                        >
                        Submit a new record
                        </Typography>
                    </Grid>

                    {/* Title */}
                    <Grid>
                        <TextField style={errors.title ? {  borderRadius: '5px', padding: 4 } : {}}
                        id="title" 
                        fullWidth 
                        label="Title *" 
                        variant="outlined"
                        value={state.titleValue}
                        
                        // When the user types in the input field, onChange function runs.
                        // When the user types in the Username input:
                        // 1. Grab the new value (e.target.value)
                        // 2. Send it to the reducer using dispatch()
                        // 3. The reducer updates 'usernameValue' in the state
                        // This keeps the input in sync with the app state (a controlled input)
                        onChange = {(e)=> 
                            // When the user types in the Confirm Password input, do the following:
                            dispatch({
                            type: "catchTitleChange", // Action that tells the reducer what to update
                            titleChosen: e.target.value // This is the new value from the input field
                            })
                        } 
                        error={Boolean(errors.title)}
                        helperText={errors.title}
                        /> 
                    </Grid>
                        
                    {/* PRN */} 
                    <Grid>
                        <TextField 
                        id="PRN" 
                        fullWidth 
                        label="PRN (if known)" 
                        variant="outlined"
                        value={state.prnValue}
                        onChange = {(e)=> 
                            dispatch({
                            type: "catchPrnChange", 
                            prnChosen: e.target.value 
                            })
                        } 
                        /> 
                    </Grid>
                    
                    {/* Description */}
                    <Grid>
                        <TextField style={errors.description ? {  borderRadius: '5px', padding: 4 } : {}}
                        id="description" 
                        fullWidth 
                        label="Description *" 
                        variant="outlined"
                        multiline
                        rows="3"
                        value={state.descriptionValue}
                        onChange = {(e)=>     
                            dispatch({
                            type: "catchDescriptionChange", 
                            descriptionChosen: e.target.value 
                            })
                        } 
                        error={Boolean(errors.description)}
                        helperText={errors.description}
                        /> 
                    </Grid>

                    {/* site type */}
                    <Grid>
                        <TextField 
                            style={errors.site ? {  borderRadius: '5px', padding: 4 } : {}}
                            id="site" 
                            fullWidth 
                            label="Site Type *" 
                            variant="outlined"
                            value={state.siteValue}
                            onChange = {(e) => {
                                dispatch({ type: "catchSiteChange", siteChosen: e.target.value });
                                dispatch({ type: "catchMonumentChange", monumentChosen: "" }); // Reset monument type
                                }} 
                            select
                            error={Boolean(errors.site)}
                            helperText={errors.site}
                        >
                            {siteOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                {option.label}
                                </MenuItem>
                            ))}
                            
                        </TextField>
                    </Grid>

                    {/* monument type */}
                    <Grid>
                        <TextField 
                            style={errors.monument ? {  borderRadius: '5px', padding: 4 } : {}} 
                            id="monument" 
                            fullWidth 
                            label="Monument Type *" 
                            variant="outlined"
                            value={state.monumentValue}
                            onChange = {(e)=> 
                                dispatch({
                                type: "catchMonumentChange", monumentChosen: e.target.value,
                            })
                        } 
                            select
                            disabled={!state.siteValue} // <-- disables if site type is not selected
                            error={Boolean(errors.monument)}
                            helperText={
                                !state.siteValue
                                  ? "Please select a site type first"
                                  : errors.monument // Will show the error if site type is selected but no monument is picked
                              }
                        >
                            <MenuItem 
                                value="">
                                    Select a monument type
                            </MenuItem>
                            {/* This code generates the dropdown options for the "Monument Type" select field,
                            based on what the user has chosen for "Site Type". */}
                            {/* Look up the array of monument options for the selected site type.
                            // If nothing is selected, use an empty array (so nothing breaks). */}
                            {(monumentOptions[state.siteValue] || [])
                                // For each monument option in that array, do the following:
                            .map((option) => (
                                // Create a MenuItem for the dropdown:
                                <MenuItem 
                                    key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* period */}
                    <Grid>
                        <TextField 
                            style={errors.period ? {  borderRadius: '5px', padding: 4 } : {}}
                            id="period" 
                            fullWidth 
                            label="Period *" 
                            variant="outlined"
                            value={state.periodValue}
                            onChange = {(e)=> 
                                dispatch({
                                type: "catchPeriodChange", periodChosen: e.target.value})}
                            select
                            error={Boolean(errors.period)}
                            helperText={errors.period}
                        >
                            {periodOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                   {/* Photo upload */}
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
                            Upload Pictures (Max. 5)
                            <input
                                type="file"
                                multiple
                                accept="image/png, image/gif, image/jpeg"
                                hidden  
                                onChange={(e) => {
                                    const newFiles = Array.from(e.target.files);
                                    const updatedFiles = [...state.uploadedPictures, ...newFiles].slice(0, 5); // Limit to 5
                                    dispatch({
                                        type: 'catchUploadedPictures',
                                        picturesChosen: updatedFiles,
                                    });
                                }}
                            />
                        </Button>
                    </Grid>

                    {/* Picture uploaded feedback */}
                    <Grid 
                        container
                        sx= {{
                            color: "black",
                        }}>
                        <ul>
                            {state.picture1Value ? <li>{state.picture1Value.name}</li> : ""}
                            {state.picture2Value ? <li>{state.picture2Value.name}</li> : ""}
                            {state.picture3Value ? <li>{state.picture3Value.name}</li> : ""}
                            {state.picture4Value ? <li>{state.picture4Value.name}</li> : ""}
                            {state.picture5Value ? <li>{state.picture5Value.name}</li> : ""}
                        </ul>       
                    </Grid>

                    {/* Submit Button */}
                    <Grid>
                        {/* Display error message if polygon is not drawn */}
                        {errors.polygon && (
                        <Typography color="error" align="left" sx={{ marginBottom: 2 }}>
                            {errors.polygon}
                        </Typography>
                    )}
                    {/* Display error message if there are any errors */}
                    {Object.keys(errors).length > 0 && (
                        <Typography color="error" align="left" sx={{ marginBottom: 1 }}>
                            Please make sure all required fields are complete
                        </Typography>
                    )}
                        <Button 
                        variant="contained" 
                        xs={8}
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
                        type="submit">Submit
                        
                        </Button>
                    </Grid>

                    {/* display capatured coords in the form */}  
                    {/* <Grid container style={{ marginTop: "2rem" }}>
                        <TextField
                            id="polygon"
                            label="Polygon Coordinates"
                            variant="standard"
                            fullWidth
                            multiline
                            rows={4}
                            value={JSON.stringify(GlobalState.polygonValue)}
                            InputProps={{ readOnly: true }}
                        />
                    </Grid> */}

                </Grid>
            </form>

            <ToastListener />

        </div> 
    </div>
    );
}