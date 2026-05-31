import React, { useEffect, useState, useRef } from 'react'
import Axios from 'axios'; // Import Axios for making HTTP requests

// --- Local components & styles ----------------------------------
import '../assets/styles/map.css';
import CornerHelpBox from "../Components/CornerHelpBox";
import MapToolbar from "../Components/MapToolbar";
import MapFilterPanel from "../Components/MapFilterPanel";
import Sidebar from '../Components/Sidebar';
import RecordDetail from '../Components/RecordDetail';
import MiniProfile from '../Components/MiniProfile';
import MainLidarMap from '../Components/MainLidarMap';
import CreateRecordMobile from '../Components/CreateRecordMobile';

// MUI Imports ----------------------
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import StateContext from "../Contexts/StateContext";
import DispatchContext from "../Contexts/DispatchContext";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import useMediaQuery from '@mui/material/useMediaQuery';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

// --- Env / constants ------------------
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// --- Reusable local UI components ---------------------------------------
// Small, reusable spinner screen shown while data loads
function LoadingScreen() {
  return (
    <div className="map-loading-screen">
      <span className="map-loading-screen__brand">Welsh LiDAR Portal</span>
      <div className="map-spinner" aria-hidden="true" />
      <span className="map-loading-screen__sub">
        Loading map data… if this takes a moment, the server may be waking up.
      </span>
    </div>
  );
}

// Sidebar pull-tab shown on desktop when sidebar is closed
function SidebarTab({ visible, onOpen }) {
  if (!visible) return null;
  return (
    <Tooltip title="Open record form" arrow placement="right">
      <Box
        onClick={onOpen}
        role="button"
        aria-label="Open record form"
        sx={{
          position: 'absolute',
          top: '50%',
          left: 0,
          transform: 'translateY(-50%)',
          zIndex: 1300,
          bgcolor: '#0E8890',
          color: 'white',
          borderRadius: '0 8px 8px 0',
          px: 1,
          py: 2.5,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          boxShadow: '2px 2px 10px rgba(0,0,0,0.25)',
          '&:hover': { bgcolor: '#0B6E74' },
          transition: 'background-color 0.2s',
          userSelect: 'none',
        }}
      >
        <ChevronRightIcon fontSize="small" />
        <Typography sx={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          fontWeight: 700,
          fontSize: '0.65rem',
          letterSpacing: 1,
          textTransform: 'uppercase',
          color: 'white',
        }}>
          Record
        </Typography>
      </Box>
    </Tooltip>
  );
}

// Floating "Add Record" button on mobile
function MobileAddFab({ visible, onClick }) {
  if (!visible) return null;
  return (
    <Fab
      variant="extended"
      aria-label="Add record"
      onClick={onClick}
      sx={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        zIndex: 1000,
        backgroundColor: '#0E8890',
        color: 'white',
        fontWeight: 700,
        textTransform: 'none',
        fontSize: '0.875rem',
        boxShadow: '0 4px 16px rgba(14, 136, 144, 0.35)',
        '&:hover': { backgroundColor: '#0B6E74' },
      }}
    >
      <AddIcon sx={{ mr: 1 }} />
      Add Record
    </Fab>
  );
}

// Warning dialog for single-polygon limit
function PolygonLimitDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Polygon Limit</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You can only draw one polygon per record. Please finish or delete your current polygon before starting another.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}


// ================================================
// LidarPortal
// ================================================
const LidarPortal = () => {
  
  // --- Global state -------------------------
  const state = React.useContext(StateContext);
  const dispatch = React.useContext(DispatchContext);
  const isLoggedIn = !!state.userId;

  // --- Screen / device -------------------
  const isSmallScreen = useMediaQuery('(max-width:1090px)'); // ≤1090px treated as handheld
  const isTouchDevice = (typeof window !== 'undefined') && (('ontouchstart' in window) || navigator.maxTouchPoints > 0);
  const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod|Touch/.test(navigator.userAgent);
  const isHandheld = isSmallScreen || isTouchDevice || isMobileDevice; // broader check than screen width alone

  // --- UI state ------------------------
  // State to control layers
  const [layersOpen, setLayersOpen] = React.useState(false);

  // Selected Record Modal
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedFeature, setSelectedFeature] = React.useState(null);

  // Record form for mobile
  const [panelOpen, setPanelOpen] = React.useState(false);
  const openPanel = () => setPanelOpen(true);
  const closePanel = () => setPanelOpen(false);

  // Warning dialog state
  const [warningOpen, setWarningOpen] = useState(false);
  const handleWarningClose = () => setWarningOpen(false);

  // *Sidebar*
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // --- Filter state ---
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedPeriods, setSelectedPeriods] = useState([])
  const [selectedSiteTypes, setSelectedSiteTypes] = useState([])
    
  // Profile view Modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [miniProfileModalOpen, setMiniProfileOpen] = useState(false);

  // --- Map / drawing state ------------------
  // Tracks if the user is currently in the middle of drawing a polygon.
  // true = drawing in progress, false = not drawing.
  const [isDrawing, setIsDrawing] = useState(false);

  const [polygonDrawn, setPolygonDrawn] = useState(false);  // state to track if polygon has been drawn.

  // Create a "ref" (like an empty box) to store the Leaflet FeatureGroup.
  // Later we attach this ref to <FeatureGroup ref={featureGroupRef}> to link them.
  // Once attached, we can access the FeatureGroup using featureGroupRef.current.
  const featureGroupRef = useRef();

  // Holds a reference to the active Leaflet.Draw polygon handler.
  const activeDrawHandlerRef = useRef(null);

  // --- Measure tool state ---
  const [measuringMode, setMeasuringMode] = useState(false);
  const measureHandlersRef  = useRef(null); // {click, mousemove} for map.off cleanup
  const measurePointsRef    = useRef([]);   // committed latlng points
  const measureLayerRef     = useRef(null); // committed line + label LayerGroup
  const measureGhostRef     = useRef(null); // live preview line that follows the cursor
  const measureClickTimer   = useRef(null); // debounce timer to separate click from dblclick

  // --- Data ---------------------------
  // Use the useState hook to create a state variable called allRecords
  // It starts as an empty array []
  // setAllRecords is the function used to update the state later
  const [allRecords, setAllRecords] = useState([]); // Store records fetched from the backend
  const [dataIsLoading, setDataIsLoading] = useState(true); // Track loading state

  // --- Handlers: profiles -------------------
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

  // --- Handlers: drawing (Start Polygons, Delete Polygons, Ruler, Reset) --------------------
  // This function runs when the custom "Draw Polygon" button is clicked.
  // It starts the polygon drawing mode so the user can click on the map to draw.
  const handleStartPolygon = () => { 
    // If a polygon has already been drawn, stop here.
    if (polygonDrawn) {
      setWarningOpen(true);
      return;
    }

  // Get the FeatureGroup object from the ref.
  // This group is where Leaflet will store the shapes the user draws.
  // It also gives us access to the map object so we can manually control tools.
  const fg = featureGroupRef.current;
  
  // Safety check: if the FeatureGroup or map isn't available yet, stop.
  // This prevents errors from happening if the map hasn't loaded.
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

function measureLabel(text) {
  return L.divIcon({
    html: `<div style="background:white;padding:2px 8px;border-radius:4px;border:1px solid #ccc;font-size:12px;font-weight:bold;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,.2)">${text}</div>`,
    className: '',
    iconAnchor: [-8, 10],
  });
}

function calcDistance(points) {
  let total = 0;
  for (let i = 1; i < points.length; i++) total += points[i - 1].distanceTo(points[i]);
  return total >= 1000 ? `${(total / 1000).toFixed(2)} km` : `${Math.round(total)} m`;
}

function removeMeasureLayer(map, ref) {
  if (ref.current) { map.removeLayer(ref.current); ref.current = null; }
}

function stopMeasuring(map, keepLine = false) {
  if (measureClickTimer.current) {
    clearTimeout(measureClickTimer.current);
    measureClickTimer.current = null;
  }
  if (measureHandlersRef.current) {
    map.off('click',     measureHandlersRef.current.onClick);
    map.off('mousemove', measureHandlersRef.current.onMouseMove);
    measureHandlersRef.current = null;
  }
  map.getContainer().style.cursor = '';
  setTimeout(() => map.doubleClickZoom.enable(), 0);
  removeMeasureLayer(map, measureGhostRef);
  measurePointsRef.current = [];
  if (!keepLine) removeMeasureLayer(map, measureLayerRef);
  setMeasuringMode(false);
}

function drawCommittedLine(map, points) {
  removeMeasureLayer(map, measureLayerRef);
  if (points.length < 2) return;
  const line  = L.polyline(points, { color: '#e53e3e', weight: 3, dashArray: '6,4' });
  const label = L.marker(points[points.length - 1], { icon: measureLabel(calcDistance(points)), interactive: false, zIndexOffset: 1000 });
  measureLayerRef.current = L.layerGroup([line, label]).addTo(map);
}

function handleActivateMeasure() {
  const map = featureGroupRef.current?._map;
  if (!map) return;

  if (measureHandlersRef.current) { stopMeasuring(map, false); return; }

  removeMeasureLayer(map, measureLayerRef);
  setMeasuringMode(true);
  measurePointsRef.current = [];
  map.doubleClickZoom.disable();
  map.getContainer().style.cursor = 'crosshair';

  const onClick = (e) => {
    // If a click is already pending, this is the second click of a double-click — add
    // the final point at this location then finish
    if (measureClickTimer.current) {
      clearTimeout(measureClickTimer.current);
      measureClickTimer.current = null;
      measurePointsRef.current.push(e.latlng);
      const hasMeasurement = measurePointsRef.current.length >= 2;
      drawCommittedLine(map, measurePointsRef.current);
      stopMeasuring(map, hasMeasurement);
      return;
    }
    // Otherwise wait 250 ms; if no second click arrives it's a single click — add the point
    const latlng = e.latlng;
    measureClickTimer.current = setTimeout(() => {
      measureClickTimer.current = null;
      measurePointsRef.current.push(latlng);
      drawCommittedLine(map, measurePointsRef.current);
    }, 250);
  };

  const onMouseMove = (e) => {
    const pts = measurePointsRef.current;
    if (pts.length === 0) return;
    removeMeasureLayer(map, measureGhostRef);
    const preview    = [...pts, e.latlng];
    const ghostLine  = L.polyline(preview, { color: '#e53e3e', weight: 2, dashArray: '4,4', opacity: 0.5 });
    const ghostLabel = L.marker(e.latlng, { icon: measureLabel(calcDistance(preview)), interactive: false, zIndexOffset: 1001 });
    measureGhostRef.current = L.layerGroup([ghostLine, ghostLabel]).addTo(map);
  };

  measureHandlersRef.current = { onClick, onMouseMove };
  map.on('click',     onClick);
  map.on('mousemove', onMouseMove);
}

// Function to reset the polygon drawing state after form is submitted
// This function will be passed to the Sidebar component
// so it can be called when the user submits the form
function resetPolygon() {
  // 1) Clear any polygons on the map
  if (featureGroupRef.current) {
    featureGroupRef.current.clearLayers();
  }
  // 2) Reset flags so user can draw again
  setPolygonDrawn(false);
  setIsDrawing(false);
  // 3) Disable any active drawing tool (if user was in middle of drawing)
  const drawToolbar = activeDrawHandlerRef.current?._toolbars?.draw;
  const polygonHandler = drawToolbar?._modes?.polygon?.handler;
  if (polygonHandler?.enabled()) {
    polygonHandler.disable();
  }
  // 4) Clear polygon coordinates from global state
  dispatch({ type: "catchPolygonCoordinateChange", polygonChosen: [] });
}

// --- Data fetching ---------------------------
  // a function to fetch records from your backend
const fetchRecords = async () => {
  try {

    // make the API request
    const response = await Axios.get(`${BASE_URL}/api/records/`);

    // save data into state
    setAllRecords(response.data);
  } catch (error) {
    // if something goes wrong, log it (but don't crash)
    console.log("Error fetching records:", error?.response || error);
  } finally {
    // hide spinner once done (success or fail)
    setDataIsLoading(false);
  }
};

// This effect runs only once when the component first mounts
useEffect(() => {
  document.title = 'LiDAR Map | Welsh LiDAR Portal'
  fetchRecords();
}, []);

  // If data is still loading, show a loading message
  if (dataIsLoading === true) {
    return <LoadingScreen />;
}
 

  // --- Filter handlers ---
  function togglePeriod(value) {
    setSelectedPeriods(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  function toggleSiteType(value) {
    setSelectedSiteTypes(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  function clearAllFilters() {
    setSelectedPeriods([])
    setSelectedSiteTypes([])
  }

  const filteredRecords = allRecords.filter(r => {
    const periodMatch = selectedPeriods.length === 0 || selectedPeriods.includes(r.period)
    const siteMatch = selectedSiteTypes.length === 0 || selectedSiteTypes.includes(r.site_type)
    return periodMatch && siteMatch
  })

  const activeFilterCount = selectedPeriods.length + selectedSiteTypes.length

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
        height: "calc(100dvh - 68.5px)",
        width: "100%",
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
        <SidebarTab
          visible={isLoggedIn && !isHandheld && !sidebarOpen}
          onOpen={() => setSidebarOpen(true)}
        />

        {/* Measure tool status hint */}
        {measuringMode && (
          <div className="map-hint">
            Click to add points · Double-click to finish · Click ruler to cancel
          </div>
        )}

        {/* Filter active indicator — slides down when measure hint is also showing */}
        {activeFilterCount > 0 && (
          <Box sx={{
            position: 'absolute',
            top: measuringMode ? 48 : 10,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1100,
            bgcolor: 'rgba(14, 136, 144, 0.9)',
            backdropFilter: 'blur(8px)',
            color: 'white',
            px: 2,
            py: 0.75,
            borderRadius: 2,
            fontSize: 13,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            transition: 'top 0.2s',
          }}>
            Showing {filteredRecords.length} of {allRecords.length} records
          </Box>
        )}
            
        {/* Mobile */}
        {/* Floating "Add Record" button on mobile */}
        <MobileAddFab visible={isHandheld} onClick={openPanel} />

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

        <MapFilterPanel
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          selectedPeriods={selectedPeriods}
          selectedSiteTypes={selectedSiteTypes}
          onTogglePeriod={togglePeriod}
          onToggleSiteType={toggleSiteType}
          onClearAll={clearAllFilters}
          totalCount={allRecords.length}
          filteredCount={filteredRecords.length}
        />

        <MapToolbar
          handleStartPolygon={handleStartPolygon}
          handleDeletePolygon={handleDeletePolygon}
          isLoggedIn={isLoggedIn}
          isMobileDevice={isMobileDevice}
          isDrawing={isDrawing}
          polygonDrawn={polygonDrawn}
          layersOpen={layersOpen}
          setLayersOpen={setLayersOpen}
          filterOpen={filterOpen}
          onFilterToggle={() => setFilterOpen(o => !o)}
          activeFilterCount={activeFilterCount}
          measuringMode={measuringMode}
          onMeasureToggle={handleActivateMeasure}
        />

        <MainLidarMap
          handleDrawCreate={handleDrawCreate}
          featureGroupRef={featureGroupRef}
          dispatch={dispatch}
          setPolygonDrawn={setPolygonDrawn}
          allRecords={filteredRecords}
          handleOpenMiniProfile={handleOpenMiniProfile}
          setSelectedFeature={setSelectedFeature}
          setModalOpen={setModalOpen}
          layersOpen={layersOpen}
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

      <PolygonLimitDialog open={warningOpen} onClose={handleWarningClose} />

    </div>
  )
}

export default LidarPortal