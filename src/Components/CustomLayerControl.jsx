// --- Imports --------------------------------
import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import 'leaflet-loading'; // Leaflet plugin: small spinner in top-left when the map is "loading"
import 'leaflet/dist/leaflet.css';

// --- Mui Components -------------------------
import { Box, Tooltip, IconButton, Divider, Typography, Stack, useMediaQuery, Snackbar, Alert, Collapse, FormControlLabel, Checkbox } from "@mui/material";

// --- Icons --------------------------------
import LayersIcon from "@mui/icons-material/Layers";

// --- Styles --------------------------------
import '../assets/styles/map.css';

// --- Custom Components------------------------
import LayerToggles from './LayerToggles';
import BaseMapToggles from './BaseMapToggles';

// --- Helper Functions -----------------------
/**
 * ensureWmsLayer
 * Creates and caches a Leaflet WMS tile layer if it doesn't already exist.
 * Keeps your useEffects cleaner by reusing the same pattern for LiDAR WMS layers.
 */
function ensureWmsLayer(ref, map, { url, layers, zIndex, attribution }) {
  if (!ref.current) {
    ref.current = L.tileLayer.wms(url, {
      layers,
      format: "image/png",
      transparent: true,
      tileSize: 1024,
      version: "1.1.1",
      maxZoom: 18,
      opacity: 1,
      attribution,
      pane: "lidarPane",
      zIndex,
    });
  }
  return ref.current;
}

/**
 * toggleLayer
 * Adds or removes a layer from the map depending on the `visible` flag.
 * Prevents repeating `.addTo()` and `.removeLayer()` code everywhere.
 */
function toggleLayer(map, layerRef, visible) {
  const layer = layerRef.current;
  if (!layer) return;
  if (visible && !map.hasLayer(layer)) layer.addTo(map);
  if (!visible && map.hasLayer(layer)) map.removeLayer(layer);
}

// --- NMR Helpers 
function makeNmrLayer(rendererRef) {
  return L.geoJSON(null, {
    pointToLayer: (_, latlng) =>
      L.circleMarker(latlng, {
        radius: 7,
        renderer: rendererRef?.current,
        color: "#ffffff",
        weight: 4,
        opacity: 1,
        fillColor: "#ff2a6d",
        fillOpacity: 0.95,
      }),
    onEachFeature: (f, layer) => {
      const p = f?.properties || {};
      const name = p.name || p.Name || "No name";
      const siteType = String(p.site_type ?? p.SiteType ?? p.type ?? "")
        .split(/[;,.]/)
        .map(s => s.trim())
        .filter(Boolean)
        .filter((v, i, a) => a.indexOf(v) === i)
        .join(", ") || "N/A";
      const period = p.period ?? p.Period ?? "N/A";
      const reportUrl = p.url ?? p.URL ?? p.report ?? p.Report ?? null;
      const reportLink = reportUrl
        ? `<a href="${reportUrl}" target="_blank" rel="noopener noreferrer">View</a>`
        : "N/A";
      const popupHtml = makePopup({
        title: 'NMR Record',
        name,
        className: 'nmr-popup',
        rows: [
          { label: 'Site Type', value: siteType },
          { label: 'Period', value: period },
          { label: 'Record Link', value: reportLink },
        ],
      });
      layer.bindPopup(popupHtml);
    },
    pane: "overlayPane",
  });
}

// Append the current map view as a BBOX (WGS84) + a feature limit
// Used by NMR Layer
function buildBboxUrl(base, map) {
  return `${base}&bbox=${map.getBounds().toBBoxString()},EPSG:4326&count=5000`;
}

/**
 * makePopup
 * Builds a small HTML string for Leaflet popups using a consistent layout.
 * Keeps WFS layer code cleaner by avoiding repeated template strings.
 */
function makePopup({ title, name, rows, className = '' }) {
  const body = rows
    .filter(Boolean)
    .map((r) => `${r.label}: ${r.value}`)
    .join('<br/>');
  return `
    <div class="custom-popup ${className}">
      <strong>${title}</strong><br/>
      <strong>${name}</strong><br/>
      ${body}
    </div>
  `;
}

// =============================================
// CustomLayerControl
// =============================================
// Provides checkboxes and radio buttons to toggle base maps and overlays.
// Handles all WMS (LiDAR) and WFS (Cadw, Parks, NMR) layers.
// Synchronises the map layers with user selections and manages visibility.
export default function CustomLayerControl({ showCommunity, setShowCommunity, layersOpen }) {

  // --- Responsive--------------------------
  const isMobile = useMediaQuery('(max-width:600px)'); // ~≤600px isMobile becomes true on small screens

  const map = useMap();

  // --- State ---------------------------------
  // Base map selection
  const [base, setBase] = useState("osm"); // "osm" or "esri"

  // Collapsible state — default open
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') { // Safety check - checks if running in browser where window exists, if yes...
      return window.innerWidth <= 600; // default collapsed on phones
    }
    return false;
  });

  // On mobile the panels open/closed state follows the toolbar.
  // on desk top it keeps using own collapsed state
  const effectiveCollapsed = isMobile ? !layersOpen : collapsed;

  // Overlay toggles 
  // each one controls whether a layer is shown. 
  // This gives a checkbox-controlled-boolean - when true the layer shows; when false it hides.
  const [showDsmHillshade, setShowDsmHillshade] = useState(false); 
  const [showMultiHillshade, setShowMultiHillshade] = useState(false);
  const [showCadwSm, setShowCadwSm] = useState(false);
  const [showParksWfs, setShowParksWfs] = useState(false);
  const [showNMRWfs, setShowNMRWfs] = useState(false);
  // Toggle for S3-hosted XYZ DTM hillshade tiles
  const [showDtmHillshade, setShowDtmHillshade] = useState(false);

  // Hint for NMR
  const [nmrHintOpen, setNmrHintOpen] = useState(false);

  // --- Refs ----------------------------------
  // This stores the actual Leaflet GeoJSON layer object so it can add/remove it without rebuilding every render. 
  const osmRef = useRef(null);
  const esriRef = useRef(null);
  const dsmHillshadeRef = useRef(null);
  const multiHillshadeRef = useRef(null);
  const cadwSmRef = useRef(null); 
  const parksRef = useRef(null);
  const NMRRef = useRef(null);
  // Ref for S3 XYZ DTM hillshade
  const dtmHillshadeRef = useRef(null);

  // Ref for NMR requests
  const nmrMoveDebounceRef = useRef(null); // waits 300ms after you stop moving
  const nmrAbortRef = useRef(null);        // cancels an old request if a new one starts
  const MIN_ZOOM_NMR = 11;                 // only fetch NMR when zoomed in enough 
  const nmrCanvasRendererRef = useRef(L.canvas({ padding: 0.5 })); // Use a canvas renderer for faster drawing

  // Only allow S3 hillshade when zoomed in enough
  const MIN_ZOOM_DTM = 16; // change to 16 if you want even closer

  // Hint for S3 layer when user is zoomed out
  const [dtmHintOpen, setDtmHintOpen] = useState(false);

  // --- useEffects ---------------------------------------------------------

  // React hook, runs after the component renders. only re-runs if something in its dependency list changes. 
  useEffect(() => {
    if (!map.getPane("lidarPane")) { // checks if leaflet already has a pane called "lidarPane". If it doesnt exist yet (! means "not"), then it creates one
      const pane = map.createPane("lidarPane"); // creates new pane in leaflet called "lidarPane"
      pane.style.zIndex = 340; // above basemap (200), below vectors (400)
      pane.style.pointerEvents = "none"; // Make LiDAR tiles ignore mouse/touch events. 
      // This way they don't block clicks, drags, or hovers on the map and vector layers.
    }
  }, [map]); // closes the useEffect, [map] means the effect will run when the map object is read (from useMap())

  // --- Base maps (create once, then swap) ---
  useEffect(() => {
    if (!osmRef.current) {
      osmRef.current = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      });
    }
    if (!esriRef.current) {
      esriRef.current = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Tiles © Esri" }
      );
    }

    const toAdd = base === "osm" ? osmRef.current : esriRef.current;
    const toRemove = base === "osm" ? esriRef.current : osmRef.current;

    if (toRemove && map.hasLayer(toRemove)) map.removeLayer(toRemove);
    if (toAdd && !map.hasLayer(toAdd)) toAdd.addTo(map);
  }, [base, map]);

  // --- WMS (LiDAR Layers) ------------

  // --- WMS: LiDAR DSM Hillshade ---
  useEffect(() => {
    const ATTR = "© DataMapWales / Welsh Government";
    ensureWmsLayer(dsmHillshadeRef, map, {
      url: "https://datamap.gov.wales/geoserver/ows?",
      layers: "geonode:wales_lidar_dsm_1m_hillshade_cog",
      zIndex: 350,
      attribution: ATTR,
    });
    toggleLayer(map, dsmHillshadeRef, showDsmHillshade);
  }, [showDsmHillshade, map]);

  // --- WMS: LiDAR DSM Multi-directional Hillshade ---
  useEffect(() => {
    const ATTR = "© DataMapWales / Welsh Government";
    ensureWmsLayer(multiHillshadeRef, map, {
      url: "https://datamap.gov.wales/geoserver/ows?",
      layers: "geonode:wales_lidar_dsm_1m_hillshade_multi_cog",
      zIndex: 340,
      attribution: ATTR,
    });
    toggleLayer(map, multiHillshadeRef, showMultiHillshade);
  }, [showMultiHillshade, map]);

  // --- XYZ: S3-hosted LiDAR DTM hillshade tiles (create once) ---
  useEffect(() => {
    // Wales bounds to stop world wrapping / out-of-extent requests
    const WALES_BOUNDS = L.latLngBounds([51.25, -5.80], [53.60, -2.60]);

    if (!dtmHillshadeRef.current) {
      dtmHillshadeRef.current = L.tileLayer(
          "https://welsh-lidar-portal.s3.eu-north-1.amazonaws.com/tiles/{z}/{x}/{y}.webp",
        {
          attribution: "LiDAR hillshade © DataMapWales",
          pane: "lidarPane",
          zIndex: 345,

          // Generated tiles are TMS (gdal2tiles default)
          tms: true,

          // Native (real) zooms you uploaded
          minNativeZoom: 16,
          maxNativeZoom: 17, // set 15 if you haven't uploaded 16 yet

          // Reduce extra requests
          keepBuffer: 0,
          updateWhenIdle: true,
          updateWhenZooming: false,
          detectRetina: false,

          // Don’t fetch across the dateline or outside Wales
          noWrap: true,
          bounds: WALES_BOUNDS,

          // Let map zoom however it likes; Leaflet will scale tiles
          minZoom: 1,
          maxZoom: 22,
          opacity: 1,
          
          // Avoid pink error tiles if a tile is missing
          errorTileUrl:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottQAAAABJRU5ErkJggg==",
        }
      );
    }
  }, [map]);

  // Add/remove DTM Hillshade layer only when zoomed in enough
  useEffect(() => {
    const handleVisibility = () => {
      const z = map.getZoom();
      const shouldShow = showDtmHillshade && z >= MIN_ZOOM_DTM;
      toggleLayer(map, dtmHillshadeRef, shouldShow);
      if (showDtmHillshade && z < MIN_ZOOM_DTM) {
        setDtmHintOpen(true); // pop a helpful hint
      }
    };

  // Run once on mount/toggle
  handleVisibility();

  // Update when user finishes zooming/panning
  map.on("zoomend", handleVisibility);
  map.on("moveend", handleVisibility);

  return () => {
    map.off("zoomend", handleVisibility);
    map.off("moveend", handleVisibility);
  };
}, [showDtmHillshade, map]);

  // --- Vector Layers ------------------------
  // --- WFS: Cadw Scheduled Monuments ---
  useEffect(() => {
    const CADW_SM_URL =
      "https://datamap.gov.wales/geoserver/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=inspire-wg:Cadw_SAM&srsName=EPSG:4326&outputFormat=application/json";

    async function addCadw() {
      // If already created once, just re-add it
      if (cadwSmRef.current) {
        if (!map.hasLayer(cadwSmRef.current)) cadwSmRef.current.addTo(map);
        return;
      }
      try {
        // Tell the Leaflet.loading plugin a data request is starting
        // This makes the small top-left spinner appear while the WFS loads
        map.fire('dataloading'); // start spinner
        const res = await fetch(CADW_SM_URL);
        const data = await res.json();

        // Build the GeoJSON layer from the fetched data
        cadwSmRef.current = L.geoJSON(data, {
          style: {
            color: "#e60000",
            weight: 2,
            fillColor: "#ffe100",
            fillOpacity: 0.4,
          },
          onEachFeature: (f, layer) => {
            const p = f?.properties || {};
            const name = p.Name || "No name";
            const type = p.SiteType || "N/A";
            const period = p.Period || "N/A";
            const report = p.Report
              ? `<a href="${p.Report}" target="_blank" rel="noopener noreferrer">View</a>`
              : "N/A";
            const popupHtml = makePopup({
              title: 'Scheduled Monument',
              name,
              className: 'cadw-popup',
              rows: [
                { label: 'Site Type', value: type },
                { label: 'Period', value: period },
                { label: 'Cadw Report', value: report },
              ],
            });
            layer.bindPopup(popupHtml);
          },
        });
        cadwSmRef.current.addTo(map);
      } catch (e) {
        console.error("Failed to load Cadw WFS:", e);
      } finally {
        // 👉 Tell the plugin that loading is finished (success OR error)
        // This hides the small top-left spinner
        map.fire('dataload'); // stop spinner
      }
    }

    if (showCadwSm) { // state boolean controlled by checkbox: "Cadw Scheduled Monuments".
      addCadw(); // if showCadwSm is true call addCadw function.
    } else if (cadwSmRef.current // Otherwise, if the checkbox is OFF and... 
        && map.hasLayer(cadwSmRef.current)) { // ...the Cadw layer is currently on the map
      map.removeLayer(cadwSmRef.current); // Remove the layer from the map
    }
  }, [showCadwSm, map]);

  // --- WFS: Registered Historic Parks & Gardens ---
  useEffect(() => {
  
    const PARKS_WFS_URL = "https://datamap.gov.wales/geoserver/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=geonode:cadw_rhpg_registeredareas&srsName=EPSG:4326&outputFormat=application/json";

    async function addParks() {
      // If already built once, just re-add it
      if (parksRef.current) {
        if (!map.hasLayer(parksRef.current)) parksRef.current.addTo(map);
        return;
      }
      try {
        // Show the small top-left spinner while loading
        map.fire('dataloading');

        const res = await fetch(PARKS_WFS_URL); // Fetch the WFS
        const data = await res.json(); // Parse as a GeoJSON

        // Helpful for discovering actual property names in your dataset
        if (data?.features?.[0]?.properties) {
          // Open DevTools console to see this once
          // and then tailor the popup fields below
          console.log('[Parks & Gardens WFS] example properties:', data.features[0].properties);
        }

        parksRef.current = L.geoJSON(data, { // Build the leaflet layer
          style: {
            color: '#006d2c',       // outline
            weight: 2,
            fillColor: '#c7e9c0',   // light green fill
            fillOpacity: 0.35,
          },
          onEachFeature: (f, layer) => {
            const p = f?.properties || {};
            // Try common field names; adjust once you check the console log above
            // Map to the real fields from DataMapWales
            const name = p.site_name_en || p.site_name_cy || 'Unknown site';
            const grade = p.grade_gradd || p.grade || 'N/A';
            const main_phase = p.main_phase_en || 'N/A';
            const reportLink = p.report_en
              ? `<a href="${p.report_en}" target="_blank" rel="noopener noreferrer">Cadw report</a>`
              : 'N/A';

            const popupHtml = makePopup({
              title: 'Registered Historic Park & Garden',
              name,
              className: 'parks-popup',
              rows: [
                { label: 'Grade', value: grade },
                { label: 'Main Phase', value: main_phase },
                { label: 'Cadw Report', value: reportLink },
              ],
            });
            layer.bindPopup(popupHtml);
          },
        });

        parksRef.current.addTo(map); // Put the leaflet layer on the map
      } catch (e) {
        console.error('Failed to load Parks & Gardens WFS:', e);
      } finally {
        map.fire('dataload'); // Hide the spinner
      }
    } 
    if (showParksWfs) {
      addParks();
    } else if (parksRef.current && map.hasLayer(parksRef.current)) { // Hide the layer
      map.removeLayer(parksRef.current)
    }
  }, [showParksWfs, map]);

  // --- WFS: National Monuments Records (NMR) ---
  useEffect(() => {
    const NMR_BASE =
      "https://datamap.gov.wales/geoserver/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=geonode:rcahmw_nmrw_terrestrialsites_rcahmw_bng&srsName=EPSG:4326&outputFormat=application/json";

    const ensureLayer = () => {
      if (!NMRRef.current) {
        NMRRef.current = makeNmrLayer(nmrCanvasRendererRef);
        NMRRef.current.addTo(map);
      } else if (!map.hasLayer(NMRRef.current)) {
        NMRRef.current.addTo(map);
      }
    };

    const clearLayer = () => NMRRef.current?.clearLayers();

    const abortInFlight = () => {
      if (nmrAbortRef.current) {
        try { nmrAbortRef.current.abort(); } catch (_) {}
        nmrAbortRef.current = null;
      }
    };

    const loadInView = async () => {
      if (map.getZoom() < MIN_ZOOM_NMR) {
        clearLayer();
        return;
      }

      ensureLayer();
      abortInFlight();

      const controller = new AbortController();
      nmrAbortRef.current = controller;

      map.fire("dataloading");
      try {
        const res = await fetch(buildBboxUrl(NMR_BASE, map), { signal: controller.signal });
        const data = await res.json();
        clearLayer();
        NMRRef.current.addData(data);
      } catch (e) {
        if (e?.name !== "AbortError") console.error("Failed to load NMR WFS:", e);
      } finally {
        map.fire("dataload");
      }
    };

    const debouncedLoad = () => {
      clearTimeout(nmrMoveDebounceRef.current);
      nmrMoveDebounceRef.current = setTimeout(loadInView, 300);
    };

    if (showNMRWfs) {
      // If the user turned NMR on but is zoomed out too far, show a helpful hint
      if (map.getZoom() < MIN_ZOOM_NMR) {
        setNmrHintOpen(true);
      }
      ensureLayer();
      loadInView(); // initial fetch for current view
      map.on('moveend zoomend', debouncedLoad);
    } else {
      map.off('moveend zoomend', debouncedLoad);
      abortInFlight();
      if (NMRRef.current && map.hasLayer(NMRRef.current)) map.removeLayer(NMRRef.current);
    }

    return () => {
      map.off("moveend zoomend", debouncedLoad);
      abortInFlight();
    };
  }, [showNMRWfs, map]);

  return (
    <>
      <Box
      sx={{     
        position: "absolute",
        zIndex: 1000,
        top: { xs: 12, sm: 20 },
                left: { xs: 12, sm: 'auto' },
        right: { xs: 'auto', sm: 20 },
        bgcolor: { 
          xs:"transparent", sm: "rgba(255, 255, 255, 0.85)" },
        backdropFilter: 
          { xs:"none", sm: "blur(8px)" },
        borderRadius: 2,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        border: { xs: "none", sm:"1px solid rgba(0,0,0,0.08)" },
        boxShadow: { xs: "none", sm:"0 4px 16px rgba(0,0,0,0.12)" },
        minWidth: { xs: 210, sm: 260 },
        maxWidth: { xs: 260, sm: 320 },
      }}
    >
      {/* Header bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          justifyContent: "space-between",
          px: 1.5,
          py: 1,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ display: { xs: 'none', sm: 'flex' } }}>
          <LayersIcon fontSize="small" />
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Layers
          </Typography>
        </Stack>

        <Tooltip title={collapsed ? "Show layers" : "Hide layers"} arrow>
          <IconButton
            aria-label={collapsed ? "Show layers" : "Hide layers"}
            size="small"
            onClick={() => setCollapsed((c) => !c)}
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              border: "1px solid rgba(0,0,0,0.15)",
              bgcolor: "white",
              "&:hover": { bgcolor: "#f5f5f5" },
            }}
          >
            <LayersIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </Box>

      <Collapse in={!effectiveCollapsed}>
        <Box 
          sx={{
            px: { xs: 1,  sm: 1.5 },
            pb: { xs: 1,  sm: 1.5 },
            maxHeight: { xs: '50vh', sm: 'unset' }, // phones: cap height on phones never exceed half the screen height.
            overflowY: { xs: 'auto',  sm: 'visible' }, // If there is more content the inner area scrolls instead of covering map
            bgcolor: { xs: "rgba(255,255,255,0.85)", sm: "transparent" },
            backdropFilter: { xs: "blur(8px)", sm: "none" },
            border: { xs: "1px solid rgba(0,0,0,0.08)", sm: "none" },
            boxShadow: { xs: "0 4px 16px rgba(0,0,0,0.12)", sm: "none" },
            borderRadius: { xs: 2, sm: 0 },
            mt: { xs: 0.5, sm: 0 },
          }}
        >
          {/* Base maps */}
          <BaseMapToggles base={base} setBase={setBase} />

          <Divider sx={{ my: 1 }} />

          {/* Overlays */}
          <Typography variant="caption" sx={{ opacity: 0.8, display: "block", mb: 0 }}>
            Overlays
          </Typography>

          {/* Temporary local toggle for S3 XYZ DTM hillshade (no need to edit LayerToggles yet) */}


          <LayerToggles
            showCommunity={showCommunity}
            setShowCommunity={setShowCommunity}
            showCadwSm={showCadwSm}
            setShowCadwSm={setShowCadwSm}
            showParksWfs={showParksWfs}
            setShowParksWfs={setShowParksWfs}
            showNMRWfs={showNMRWfs}
            setShowNMRWfs={setShowNMRWfs}
            showDsmHillshade={showDsmHillshade}
            setShowDsmHillshade={setShowDsmHillshade}
            showMultiHillshade={showMultiHillshade}
            setShowMultiHillshade={setShowMultiHillshade}
            showDtmHillshade={showDtmHillshade}
            setShowDtmHillshade={setShowDtmHillshade}
          />

          {/* Scroll for more hint */}
          {/* Removed until more options added */}
          {/* {isMobile && !effectiveCollapsed && (
            <Box sx={{ px: 1, pb: 0.75, pt: 0.25 }}>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Scroll for more
              </Typography>
            </Box>
          )} */}
        </Box>
      </Collapse>
    </Box>

    {/* Alerts  */}
    <Snackbar
      open={nmrHintOpen}
      autoHideDuration={4000}
      onClose={() => setNmrHintOpen(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={() => setNmrHintOpen(false)} severity="info" variant="filled" sx={{ width: '100%' }}>
        Zoom in to see National Monuments Record points (zoom 11+).
      </Alert>
    </Snackbar>

    <Snackbar
      open={dtmHintOpen}
      autoHideDuration={3500}
      onClose={() => setDtmHintOpen(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={() => setDtmHintOpen(false)} severity="info" variant="filled" sx={{ width: '100%' }}>
        Zoom in to see the LiDAR hillshade (zoom {MIN_ZOOM_DTM}+).
      </Alert>
    </Snackbar>
    </>
  );
}