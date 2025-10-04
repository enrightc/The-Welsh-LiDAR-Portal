
import * as React from 'react';

import { useEffect, useContext, useState } from 'react';

import { useNavigate } from "react-router-dom";
import {useImmerReducer} from "use-immer";

import Axios from 'axios'; // Import Axios for making HTTP requests

// MUI imports
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Link from '@mui/material/Link';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

// Icons
import InfoIcon from '@mui/icons-material/Info';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// Contexts
import StateContext from '../Contexts/StateContext';

// Components
import ToastListener from './ToastListener.jsx';
import SiteMonumentHelpModal from './SiteMonumentHelpModal';

// Constants
import { siteOptions, monumentOptions, periodOptions } from '../Constants/Options.js';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const isTouchDevice = (typeof window !== 'undefined') && (('ontouchstart' in window) || navigator.maxTouchPoints > 0);

export default function CreateRecord({ resetPolygon, fetchRecords, onSuccess }) {
    // Modal state (controls the Site/Monument help dialog)
    // helpOpen - true/false flag (whether modal is visible)
    // setHelpOpen - function to update helpOpen
    const [helpOpen, setHelpOpen] = React.useState(false);

    // State for database full dialog
    const [dbFullDialogOpen, setDbFullDialogOpen] = useState(false);


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
    
        // state.titleValue.trim() checks if user has typed something
        // .trim() removes trailing whitespaces
        // isNaN(state.prnValue) checks if it is not a number
        // newErrors.title adds an error message specfically to that field. it is a temporary object. Later it is passed to the form state (setErrors(newErrors);)
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
        
    }

    useEffect(() => {
        if (state.sendRequest) {
            async function AddRecord() {
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
                    dispatch({ type: "resetForm" }); // <--- Reset form
                    resetPolygon(); // Reset the polygon in the parent component
                    navigate("/LidarPortal", { state: { toast: "New record successfully created" } });
                    fetchRecords(); // Fetch the updated records after adding a new one
                    // if onSuccess provided tell sidebar to close.
                    if (typeof onSuccess === "function") {
                        onSuccess();
                    }

                } catch (e) {
                    if (
                        e.response &&
                        e.response.data &&
                        e.response.data.detail &&
                        e.response.data.detail.includes("database is currently full")
                    ) {
                        setDbFullDialogOpen(true); // Open the custom dialog instead of using alert
                        return; // Stop here — don't show the fallback toast
                    }

                    // 👇 Fallback for any other kind of error
                    navigate(".", {
                        state: {
                            toast: "There was a problem creating your record. Please try again.",
                        },
                    });
                }
            }

            AddRecord();
        }
    }, [state.sendRequest]); // watch for changes in state.sendRequest


    return (
    <Box sx={{ px: { xs: 1, md: 0 } }}>
      <Box
        sx={{
          width: '100%',
          mx: 'auto',
          p: { xs: 1.25, md: 2 },
          maxHeight: { xs: 'unset', md: '80vh' },
          overflowY: { xs: 'visible', md: 'auto' },
          bgcolor: 'transparent',
          borderRadius: { xs: 1, md: 2 },
          boxShadow: { xs: '0 1px 3px #0002', md: '0 2px 8px #0001' }
        }}
      >
        <form onSubmit={FormSubmit} autoComplete="on">
          <Grid container direction="column" spacing={2}>
            {/* Heading */}
            <Grid>
              <Typography 
                variant="h5" 
                align="center"
                color="black"
                sx={{ fontWeight: 600, mb: 0.5 }}
              >
                Submit a new record
              </Typography>
              <Typography
                variant="body2"
                align="center"
                color="text.secondary"
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                Fields marked * are required
              </Typography>
            </Grid>

            {/* Title */}
            <Grid>
              <TextField
                style={errors.title ? { borderRadius: '5px', padding: 4 } : {}}
                id="title"
                fullWidth
                label="Title *"
                variant="outlined"
                size="small"
                autoComplete="on"
                value={state.titleValue}
                onChange={(e) =>
                  dispatch({
                    type: "catchTitleChange",
                    titleChosen: e.target.value
                  })
                }
                error={Boolean(errors.title)}
                helperText={errors.title}
              />
              {!isTouchDevice ? (
                <InputAdornment position="start">
                  <Tooltip title={<Typography sx={{ fontSize: '1rem' }}>
                    Give your record a clear, engaging title. Instead of “Round Barrow”, try “Round Barrow near Greenwood Forest” so others can find and recognise it easily.
                  </Typography>}>
                    <IconButton aria-label="About the title field" edge="end" size="small" tabIndex={-1}>
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ) : (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  Tip: Write a clear title, e.g. “Round Barrow near Greenwood Forest”.
                </Typography>
              )}
            </Grid>
                        
            {/* PRN */}
            <Grid>
              <TextField
                id="PRN"
                fullWidth
                label="PRN (if known)"
                variant="outlined"
                size="small"
                value={state.prnValue}
                onChange={(e) =>
                  dispatch({
                    type: "catchPrnChange",
                    prnChosen: e.target.value
                  })
                }
                autoComplete="off"
                error={Boolean(errors.prn)}
                helperText={errors.prn}
              />
              {!isTouchDevice ? (
                <InputAdornment position="start">
                  <Tooltip title={<Typography sx={{ fontSize: '1rem' }}>
                    A PRN is a site’s unique ID in the Historic Environment Record (HER). If your site already has one, add it here.
                  </Typography>}>
                    <IconButton aria-label="About the PRN field" edge="end" size="small" tabIndex={-1}>
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ) : (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  Optional: PRN is the HER ID if known.
                </Typography>
              )}
            </Grid>
                    
            {/* Description */}
    <Grid>
    <TextField
        style={errors.description ? { borderRadius: '5px', padding: 4 } : {}}
        id="description"
        fullWidth
        label="Description *"
        variant="outlined"
        multiline
        size="small"
        rows={4}
        value={state.descriptionValue}
        onChange={(e) =>
        dispatch({
            type: "catchDescriptionChange",
            descriptionChosen: e.target.value
        })
        }
        error={Boolean(errors.description)}
        helperText={errors.description}
    />
    {!isTouchDevice ? (
        <InputAdornment position="start">
        <Tooltip title={<Typography sx={{ fontSize: '1rem' }}>
            Describe the site’s character, shape, and form. Include dimensions if you can, and compare with similar sites to add context.
        </Typography>}>
            <IconButton aria-label="About the description field" edge="end" size="small" tabIndex={-1}>
            <InfoIcon fontSize="small" />
            </IconButton>
        </Tooltip>
        </InputAdornment>
    ) : (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
        Describe the site’s character, shape, form, and any measurements. Comparisons help too.
        </Typography>
    )}
    </Grid>

            {/* site type */}
            <Grid>
              <TextField
                style={errors.site ? { borderRadius: '5px', padding: 4 } : {}}
                id="site"
                fullWidth
                label="Site Type *"
                variant="outlined"
                size="small"
                value={state.siteValue}
                onChange={(e) => {
                  dispatch({ type: 'catchSiteChange', siteChosen: e.target.value });
                  dispatch({ type: 'catchMonumentChange', monumentChosen: '' });
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
              {!isTouchDevice ? (
                <InputAdornment position="start">
                  <Tooltip 
                    disableInteractive={false}
                    slotProps={{ tooltip: { sx: { pointerEvents: 'auto' } } }}
                    title={
                      <Typography sx={{ fontSize: '1rem' }}>
                        Choose the broad category of the feature (e.g., ditch, mound, enclosure). This helps narrow the monument options.{" "}
                        <Link
                          component="button"
                          underline="always"
                          sx={{ fontSize: 'inherit', color: 'blue' }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setHelpOpen(true);
                          }}
                          aria-label="Open detailed help on site and monument types"
                        >
                          More help
                        </Link>
                      </Typography>
                    }
                  >
                    <IconButton aria-label="About the site type field" edge="end" size="small" tabIndex={-1}>
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ) : (
                <Stack direction="row" spacing={1} sx={{ mt: 0.5 }} alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    Pick a broad category (e.g., ditch, mound).
                  </Typography>
                  <Link
                    component="button"
                    underline="always"
                    sx={{ fontSize: '0.75rem' }}
                    onClick={(e) => { e.preventDefault(); setHelpOpen(true); }}
                    aria-label="Open detailed help on site and monument types"
                  >
                    More help
                  </Link>
                </Stack>
              )}
            </Grid>

            {/* monument type */}
            <Grid>
              <TextField
                style={errors.monument ? { borderRadius: '5px', padding: 4 } : {}}
                id="monument"
                fullWidth
                label="Monument Type *"
                variant="outlined"
                size="small"
                value={state.monumentValue}
                onChange={(e) =>
                  dispatch({
                    type: "catchMonumentChange", monumentChosen: e.target.value,
                  })
                }
                select
                disabled={!state.siteValue}
                error={Boolean(errors.monument)}
                helperText={
                  !state.siteValue
                    ? "Please select a site type first"
                    : errors.monument
                }
              >
                <MenuItem value="">
                  Select a monument type
                </MenuItem>
                {(monumentOptions[state.siteValue] || []).map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              {!isTouchDevice ? (
                <InputAdornment position="start">
                  <Tooltip 
                    disableInteractive={false}
                    slotProps={{ tooltip: { sx: { pointerEvents: 'auto' } } }}
                    title={
                      <Typography sx={{ fontSize: '1rem' }}>
                        Choose the specific monument type that best fits the site.
                        {" "}
                        <Link
                          component="button"
                          underline="always"
                          sx={{ fontSize: 'inherit', color: 'blue' }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setHelpOpen(true);
                          }}
                          aria-label="Open detailed help on site and monument types"
                        >
                          More help
                        </Link>
                      </Typography>
                    }
                  >
                    <IconButton aria-label="About the monument type field" edge="end" size="small" tabIndex={-1}>
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ) : (
                <Stack direction="row" spacing={1} sx={{ mt: 0.5 }} alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    Then choose the specific monument type.
                  </Typography>
                  <Link
                    component="button"
                    underline="always"
                    sx={{ fontSize: '0.75rem' }}
                    onClick={(e) => { e.preventDefault(); setHelpOpen(true); }}
                    aria-label="Open detailed help on site and monument types"
                  >
                    More help
                  </Link>
                </Stack>
              )}
            </Grid>

            {/* period */}
            <Grid>
              <TextField
                style={errors.period ? { borderRadius: '5px', padding: 4 } : {}}
                id="period"
                fullWidth
                label="Period *"
                variant="outlined"
                size="small"
                value={state.periodValue}
                onChange={(e) =>
                  dispatch({
                    type: "catchPeriodChange", periodChosen: e.target.value
                  })}
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
              {!isTouchDevice ? (
                <InputAdornment position="start">
                  <Tooltip
                    title={
                      <Typography component="div" sx={{ fontSize: '1rem', lineHeight: 1.6 }}>
                        <div>Select the period that best matches the site. Choose ‘Unknown’ if you’re unsure.</div>
                        <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                          <li>Prehistoric (to AD 43)</li>
                          <li>Roman (AD 43–c.410)</li>
                          <li>Early Medieval (c.410–1086)</li>
                          <li>Medieval (1086–1536)</li>
                          <li>Post-Medieval (1536–1750)</li>
                          <li>Industrial (1750–1899)</li>
                          <li>Modern (1900+)</li>
                        </ul>
                      </Typography>
                    }
                  >
                    <IconButton aria-label="About the period field" edge="end" size="small" tabIndex={-1}>
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ) : (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  Pick the best-fit period. Choose “Unknown” if unsure.
                </Typography>
              )}
            </Grid>

            {/* Photo upload */}
            <Grid>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                fullWidth
                style={{
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
                sx={{
                  color: "black",
                  border: "1px solid black",
                  fontSize: { xs: '0.8rem', md: '0.8rem' },
                  borderRadius: "5px",
                  backgroundColor: "",
                  mt: 0.5,
                  py: 1.5
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
                    const maxSizeMB = 2;
                    const maxSizeBytes = maxSizeMB * 1024 * 1024;
                    const tooLarge = newFiles.some(file => file.size > maxSizeBytes);
                    if (tooLarge) {
                      alert(`Each file must be under ${maxSizeMB}MB.`);
                      return;
                    }
                    const updatedFiles = [...state.uploadedPictures, ...newFiles].slice(0, 5); // Limit to 5
                    dispatch({
                      type: 'catchUploadedPictures',
                      picturesChosen: updatedFiles,
                    });
                    // Allow re-selecting the same files later
                    e.target.value = null;
                  }}
                />
              </Button>
            </Grid>

            {/* Picture uploaded feedback */}
            <Grid
              container
              sx={{
                color: "black",
              }}>
              <ul style={{ margin: '0.25rem 0 0', paddingLeft: '1rem', fontSize: '0.875rem' }}>
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
                <Typography color="error" align="left" sx={{ mb: 1 }}>
                  {errors.polygon}
                </Typography>
              )}
              {/* Display error message if there are any errors */}
              {Object.keys(errors).length > 0 && (
                <Typography color="error" align="left" sx={{ mb: 1 }}>
                  Please make sure all required fields are complete
                </Typography>
              )}
              <Box
                sx={{
                  position: { xs: 'sticky', md: 'static' },
                  bottom: 0,
                  pt: 1,
                  mt: 1,
                  background: { xs: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, #fff 40%)', md: 'transparent' }
                }}
              >
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  sx={{
                    color: 'black',
                    border: 'none',
                    fontSize: { xs: '1rem', md: '1rem' },
                    borderRadius: '8px',
                    backgroundColor: '#FFD034',
                    py: 1.25
                  }}
                >
                  Submit
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>

        <ToastListener />
        {/* Modals */}
        <SiteMonumentHelpModal 
          open={helpOpen} 
          onClose={() => setHelpOpen(false)} 
        />
        <Dialog open={dbFullDialogOpen} onClose={() => setDbFullDialogOpen(false)}>
          <DialogTitle>Database Full</DialogTitle>
          <DialogContent>
            <Typography sx={{ fontSize: '1rem', color: 'black' }}>
              Oops, it looks like the database is currently full. We can’t save your record right now.
              Please bear with us — we're working on it.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDbFullDialogOpen(false)} sx={{ color: 'black' }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
    );
}