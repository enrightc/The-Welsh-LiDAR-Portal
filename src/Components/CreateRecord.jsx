import * as React from 'react';

import { useNavigate } from "react-router-dom";
import {useImmerReducer} from "use-immer";

// MUI imports
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

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
    { value: 'ditch_pit', label: 'Ditch pit' },
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
};

export default function CreateRecord() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate()


    const initialstate = {
        titleValue: "",
        prnValue: "",
        descriptionValue: "",
        siteValue: "",
        monumentValue: "",
        periodValue: "",
        latitudeValue: "",
        longitudeValue: "",
        // picture1Value: "",
        // picture2Value: "",
        // picture3Value: "",
        // picture4Value: "",
        // picture5Value: "",
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
            // case "catchLatitudeChange":
            // draft.latitudeValue = action.latitudeChosen;
            // break;
            // case "catchLongitudeChange":
            // draft.longitudeValue = action.longitudeChosen;          
            // break;
            // case "picture1Change":
            // draft.picture1Value = action.picture1Chosen;
            // break;
            // case "picture2Change":
            // draft.picture2Value = action.picture2Chosen;
            // break;
            // case "picture3Change":
            // draft.picture3Value = action.picture3Chosen;
            // break;
            // case "picture4Change":
            // draft.picture4Value = action.picture4Chosen;
            // break;
            // case "picture5Change":
            // draft.picture5Value = action.picture5Chosen;
            // break;
        }
      }
    
      const [state, dispatch] = useImmerReducer(ReducerFunction, initialstate)

  function FormSubmit(e){
    e.preventDefault() // prevents the default form submission behavior/page reload
    console.log("Form submitted");
    // dispatch({type: 'changeSendRequest'}) // Dispatch an action to change the sendRequest state
  }

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <div>
        <Button 
            onClick={toggleDrawer(true)}
            style={{
                position: 'fixed',  // or 'absolute', but 'fixed' is best for staying visible
                bottom: 24,
                left: 24,
                zIndex: 3000,       // Make this higher than your map's z-index
                backgroundColor: '#1976d2',
                color: 'white',
            }}
        >
            Create Record
        </Button>

        <Drawer 
            open={open} 
            onClose={toggleDrawer(false)}
            PaperProps={{
                style: {
                  top: 70, // Height of your navbar in px
                  height: 'calc(100% - 70px)', // Take up the rest of the screen
                }
              }}       
        >
            <div
                style={{
                    width: '400px',
                    maxWidth: '800px',
                    margin: '3rem auto',
                    padding: '2rem',  
                }}
            >
                <form onSubmit={FormSubmit}>
                    <Grid container direction="column" spacing={3} >
                    
                        {/* Heading */}
                        <Grid>
                            <Typography variant="h4" align="center">
                            Submit a new record
                            </Typography>
                        </Grid>

                        {/* Title */}
                        <Grid>
                            <TextField 
                            id="title" 
                            fullWidth 
                            label="Title" 
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
                                type: "catchTitleChange", 
                                titleChosen: e.target.value 
                                })
                            } 
                            /> 
                        </Grid>
                        
                        {/* Description */}
                        <Grid>
                            <TextField 
                            id="PRN" 
                            fullWidth 
                            label="PRN (if known)" 
                            variant="outlined"
                            value={state.prnValue}
                            onChange = {(e)=> 
                                
                                dispatch({
                                type: "catchTitleChange", 
                                titleChosen: e.target.value 
                                })
                            } 
                            /> 
                        </Grid>

                        {/* site type */}
                        <Grid>
                            <TextField 
                                id="site" 
                                fullWidth 
                                label="Site Type" 
                                variant="outlined"
                                value={state.siteValue}
                                onChange = {(e) => {
                                    dispatch({ type: "catchSiteChange", siteChosen: e.target.value });
                                    dispatch({ type: "catchMonumentChange", monumentChosen: "" }); // Reset monument type
                                  }} 
                                select
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
                                id="monument" 
                                fullWidth 
                                label="Monument Type" 
                                variant="outlined"
                                value={state.monumentValue}
                                onChange = {(e)=> 
                                    dispatch({
                                    type: "catchMonumentChange", monumentChosen: e.target.value,
                                })
                            } 
                                select
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
                            id="period" 
                            fullWidth 
                            label="Period" 
                            variant="outlined"
                            value={state.periodValue}
                            onChange = {(e)=> 
                                dispatch({
                                type: "catchPeriodChange", periodChosen: e.target.value})} 
                            />
                        </Grid>

                        {/* latitude */}
                        <Grid>
                            <TextField 
                            id="latitude" 
                            fullWidth 
                            label="Latitude" 
                            variant="outlined"
                            value={state.latitudeValue}
                            onChange = {(e)=> 
                                dispatch({
                                type: "catchLatitudeChange", latitudeChosen: e.target.value})} 
                            />
                        </Grid>

                        {/* longitude */}
                        <Grid>
                            <TextField 
                            id="longitude" 
                            fullWidth 
                            label="Longitude" 
                            variant="outlined"
                            value={state.longitudeValue}
                            onChange = {(e)=> 
                                dispatch({
                                type: "catchLongitudeChange", longitudeChosen: e.target.value})} 
                            />
                        </Grid>

                        {/* Submit Button */}
                        <Grid>
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

                    </Grid>
                </form>
            </div>
        </Drawer>
    </div>
  );
}