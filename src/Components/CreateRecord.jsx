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
            case "catchLatitudeChange":
            draft.latitudeValue = action.latitudeChosen;
            break;
            case "catchLongitudeChange":
            draft.longitudeValue = action.longitudeChosen;          
            break;
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
                    onChange = {(e)=> 
                        dispatch({
                        type: "catchSiteChange", siteChosen: e.target.value})} 
                    />
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
                        type: "catchMonumentChange", monumentChosen: e.target.value})} 
                    />
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