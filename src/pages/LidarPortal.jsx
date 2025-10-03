import React, { useEffect, useState, useRef, useMemo } from 'react'
import Axios from 'axios'; // Import Axios for making HTTP requests

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Components
import CornerHelpBox from "../Components/CornerHelpBox";
import MapToolbar from "../Components/MapToolbar";
import '../assets/styles/map.css';
import Sidebar from '../Components/Sidebar';
import RecordDetail from '../Components/RecordDetail';
import MiniProfile from '../Components/MiniProfile';  
import MainLidarMap from '../Components/MainLidarMap';
import CreateRecordMobile from '../Components/CreateRecordMobile';

// MUI Imports
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import StateContext from "../Contexts/StateContext";
import DispatchContext from "../Contexts/DispatchContext";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Typography from '@mui/material/Typography';

// Fetches all records from the Django backend API at /api/records/
// Converts the response to JSON and logs the data to the browser console
function records() {
  // fetch('http://127.0.0.1:8000/api/records/').then((response) => response.json()).then(data=>console.log(data))
}

records();

const LidarPortal = () => {
  // Selected Record Modal
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedFeature, setSelectedFeature] = React.useState(null);

  // Record form for mobile
  const [panelOpen, setPanelOpen] = React.useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); // ≤ md treated as handheld
  const isTouchDevice = (typeof window !== 'undefined') && (('ontouchstart' in window) || navigator.maxTouchPoints > 0);
  const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod|Touch/.test(navigator.userAgent);
  const isHandheld = isSmallScreen || isTouchDevice || isMobileDevice; // broader check than screen width alone

  const openPanel = () => setPanelOpen(true);
  const closePanel = () => setPanelOpen(false);
    
  // Profile view Modal
  // State in LiDARPortal.jsx
  const [selectedUser, setSelectedUser] = useState(null);
  const [miniProfileModalOpen, setMiniProfileOpen] = useState(false);

  // When user clicks the username
  const handleOpenMiniProfile = async (userId) => {
  try {
    const response = await Axios.get(`${BASE_URL}/api/profiles/${userId}/`);
    setSelectedUser(response.data);
    setMiniProfileOpen(true);
  } catch (error) {
    console.log("Error fetching mini profile:", error);
  }
};

  const [scheduledMonuments, setScheduledMonuments] = useState(null);

  // *Sidebar*
  // State variable to control whether the sidebar is open or closed.
  // 'sidebarOpen' is true if the sidebar is open, false if it is closed.
  // Use 'setSidebarOpen' to change its value (for example, to open or close the sidebar).
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  // // 1. Get global state and dispatch from context
  const state = React.useContext(StateContext);
  const dispatch = React.useContext(DispatchContext);

  const isLoggedIn = !!state.userId;

  // Tracks if the user is currently in the middle of drawing a polygon.
  // true = drawing in progress, false = not drawing.
  const [isDrawing, setIsDrawing] = useState(false);

  // Holds a reference to the active Leaflet.Draw polygon handler.
  // This lets us call special methods like "undo last vertex" or "cancel"
  // on the exact drawing session that's in progress.
  const activeDrawHandlerRef = useRef(null);

  // Use the useState hook to create a state variable called allRecords
  // It starts as an empty array []
  // setAllRecords is the function used to update the state later
  const [allRecords, setAllRecords] = useState([]); // Store records fetched from the backend
  const [dataIsLoading, setDataIsLoading] = useState(true); // Track loading state

  const [polygonDrawn, setPolygonDrawn] = useState(false);  // state to track if polygon has been drawn.

  // Create a "ref" (like an empty box) to store the Leaflet FeatureGroup.
  // Later we attach this ref to <FeatureGroup ref={featureGroupRef}> to link them.
  // Once attached, we can access the FeatureGroup using featureGroupRef.current.
  const featureGroupRef = useRef();

  // This function runs when the custom "Draw Polygon" button is clicked.
  // It starts the polygon drawing mode so the user can click on the map to draw.
  const handleStartPolygon = () => { 
    // If a polygon has already been drawn, stop here.
    if (polygonDrawn) {
      alert("You can only draw one polygon per record.");
      return;
    }

  // Get the FeatureGroup object from the ref.
  // This group is where Leaflet will store the shapes the user draws.
  // It also gives us access to the map object so we can manually control tools.
  const fg = featureGroupRef.current;
  
  // Safety check: if the FeatureGroup or map isn't available yet, stop.
  // This prevents errors from happening if the map hasn’t loaded.
  if (!fg || !fg._map) return;

  // Get the Leaflet map object that the FeatureGroup is attached to.
  // Leaflet automatically adds a reference to the map as `. _map` once the FeatureGroup is added to the map.
  const map = fg._map;

  // Create a new polygon drawing tool from Leaflet Draw.
  // This tool allows the user to click on the map to place points and form a shape.
  const polygonDrawer = new L.Draw.Polygon(map, {
    shapeOptions: {
      color: '#97009c',
      weight: 2,
    },
    showArea: true,
  });

  // Save the handler so Undo/Cancel can call into it
  activeDrawHandlerRef.current = polygonDrawer;

  // Mark drawing as active
  setIsDrawing(true);

  // Disable double-click zoom during drawing (so double-tap can be used to finish)
  const hadDoubleClickZoom = map.doubleClickZoom && map.doubleClickZoom._enabled;
  if (hadDoubleClickZoom) map.doubleClickZoom.disable();

  const onCreated = () => {
    // Finished: hide drawing UI; re-enable dblclick zoom after this tick
    setIsDrawing(false);

    if (hadDoubleClickZoom) setTimeout(() => map.doubleClickZoom.enable(), 0);
  };

  const onDrawStop = () => {
    // Cleanup no matter how we stop (finish or cancel)
    setIsDrawing(false);
    activeDrawHandlerRef.current = null;

    map.off('draw:created', onCreated);
    map.off('draw:drawstop', onDrawStop);

    if (hadDoubleClickZoom) setTimeout(() => map.doubleClickZoom.enable(), 0);
  };

  map.on('draw:created', onCreated);
  map.on('draw:drawstop', onDrawStop);


  polygonDrawer.enable(); // Activate the polygon tool so the user can start drawing.
}; // once polygon is closed it is added to the featureGroup and onCreated={handleDrawCreate} is triggered and handleDrawCreate runs.


// Custom function to delete a polygon once drawn or clear an incomplete active polygon
function handleDeletePolygon() {
  const handler = activeDrawHandlerRef.current;

  // 1) Cancel if drawing is still active
  if (handler) {
    handler.disable(); // triggers draw:drawstop cleanup
  }

  // 2) Remove any finished polygons
  const fg = featureGroupRef.current;
  if (fg) fg.clearLayers();

  // 3) Reset states
  setIsDrawing(false);
  setPolygonDrawn(false);
  activeDrawHandlerRef.current = null;

  // 4) Clear coordinates in global state
  dispatch({ type: 'catchPolygonCoordinateChange', polygonChosen: [] });
}

const handleActivateRuler = () => {
  const fg = featureGroupRef.current;

  if (!fg || !fg._map) return;

  const map = fg._map;

  // Create a new ruler and add to map
  L.control.ruler({ measureUnits: { length: 'metres' } }).addTo(map);
};


  // Function to reset the polygon drawing state after form is submitted
  // This function will be passed to the Sidebar component
  // so it can be called when the user submits the form
  function resetPolygon() {
    setPolygonDrawn(false);  // Allow drawing again
    dispatch({ type: "catchPolygonCoordinateChange", polygonChosen: [] }); // Clear global polygon
  }

  // a function to fetch records from your backend
  const fetchRecords = async () => {
  try {
    const response = await Axios.get(`${BASE_URL}/api/records/`);
    setAllRecords(response.data);
    setDataIsLoading(false);
  } catch (error) {
    console.log("Error fetching records:", error.response);
  }
};

// This effect runs only once when the component first mounts
useEffect(() => {
  fetchRecords();
}, []);

  // If data is still loading, show a loading message
  if (dataIsLoading === true) {
    return (
      <Grid 
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        style={{ height: "100vh", width: "100vw" }}
        // Set width: "100vw" to make sure the Grid takes up the full screen width,
        // so the loading spinner can be perfectly centered horizontally
      >
        <CircularProgress />
        <Typography variant="body2" align="center" sx={{ mt: 2, maxWidth: 560, px: 2, opacity: 0.9 }}>
          If this takes a while, the server might be waking up.
        </Typography>
      </Grid>
    );
  }

  const handleDrawCreate = (e) => {
    const { layerType, layer } = e;
    if (layerType === "polygon") {
      const latlngs = layer.getLatLngs()[0].map((latlng) => [latlng.lat, latlng.lng]);
      dispatch({ type: 'catchPolygonCoordinateChange', polygonChosen: latlngs });
      setPolygonDrawn(true); // Set flag so user can't draw more

      // Open the correct panel depending on screen size
      if (isHandheld) {
        setPanelOpen(true);   // bottom sheet on touch/small devices
      } else {
        setSidebarOpen(true); // right sidebar on desktop
      }
    }
  };

  // If data is loaded, show the map
  // The MapContainer component is the main map component
  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 68.5px)",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Desktop */}
      {/* Sidebar */}
      {/* Sidebar: appears on the left, pushes map content over */}
      {/* The Sidebar component is imported from the Components folder */}
      {/* It takes 'open' and 'onClose' props to control its visibility */}
      {/* 'resetPolygon' prop is passed to reset polygon drawing state */}
     
      <Sidebar 
        open={!isHandheld && sidebarOpen}
        onClose={() => setSidebarOpen(false)} 
        resetPolygon={resetPolygon}
        fetchRecords={fetchRecords}
      />

      {/* Main content (map), shrinks when sidebar is open */}
      <div style={{ flex: 1, position: "relative" }}>
        {/* Show menu button only when user is logged in, not on mobile, and sidebar is closed */}
        {isLoggedIn && !isHandheld && !sidebarOpen && (
          <Tooltip title="Click to open record form" arrow>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                position: "absolute",
                top: "50%", // Vertically centered
                left: sidebarOpen ? "300px" : "0",   // Stick to the very left edge
                transform: "rotate(-90deg) translateX(-50%)", 
                transformOrigin: "top left",  // Pivot nicely from top-left
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: "0 0 4px 4px",
                padding: "8px 16px",
                fontSize: "16px",
                cursor: "pointer",
                zIndex: 1300,
              }}
            >
              Record Form
            </button>
          </Tooltip>
        )}


        {/* Mobile */}
        {/* Floating “Add Record” button on mobile */}
        {isHandheld && (
          <Fab
            color="primary"
            aria-label="Add record"
            onClick={openPanel}
            sx={{ position: 'fixed', right: 16, bottom: 16, zIndex: 1000 }}
          >
            <AddIcon />
          </Fab>
        )}

        <CreateRecordMobile
          open={panelOpen}
          onOpen={openPanel}
          onClose={closePanel}
          resetPolygon={resetPolygon}
          fetchRecords={fetchRecords}
          onSuccess={closePanel}  // close when submit succeeds
          hideBackdrop // Do not render backdrop that blocks clicks on map.
        />
      

        <CornerHelpBox 
          isLoggedIn={isLoggedIn}
          
        />

        <MapToolbar 
          handleStartPolygon={handleStartPolygon}
          handleDeletePolygon={handleDeletePolygon}
          isLoggedIn={isLoggedIn}
          isMobileDevice={isMobileDevice}
          isDrawing={isDrawing}
          polygonDrawn={polygonDrawn}
        />

        <MainLidarMap
          scheduledMonuments={scheduledMonuments}
          handleDrawCreate={handleDrawCreate}
          featureGroupRef={featureGroupRef}
          dispatch={dispatch}
          setPolygonDrawn={setPolygonDrawn}
          allRecords={allRecords}
          handleOpenMiniProfile={handleOpenMiniProfile}
          setSelectedFeature={setSelectedFeature}
          setModalOpen={setModalOpen}
        />
      </div>

      {/* See record detail Modal */}
      <RecordDetail
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          record={selectedFeature}
      />

      {/* See mini profile view Modal */}
      <MiniProfile
        open={miniProfileModalOpen}
        onClose={() => setMiniProfileOpen(false)}
        user={selectedUser}
      />

    </div>
  )
}

export default LidarPortal