import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import 'leaflet-loading'; // Leaflet plugin: small spinner in top-left when the map is "loading"

import { Box, Tooltip, IconButton, Divider, Typography, RadioGroup, FormControlLabel, Radio, Checkbox, Stack, useMediaQuery, Snackbar, Alert } from "@mui/material";
import LayersIcon from "@mui/icons-material/Layers";

import '../assets/styles/map.css';
import 'leaflet/dist/leaflet.css';

export default function CustomLayerControl({ showCommunity, setShowCommunity, layersOpen }) {

  const isMobile = useMediaQuery('(max-width:600px)'); // ~≤600px isMobile becomes true on small screens

  const map = useMap();

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

  // Overlay toggles (each one controls whether a layer is shown). This gives a checkbox-controlled-boolean - when true the layer shows; when fallse it hides.
  const [showDsmHillshade, setShowDsmHillshade] = useState(false); 
  const [showMultiHillshade, setShowMultiHillshade] = useState(false);
  const [showCadwSm, setShowCadwSm] = useState(false);
  const [showParksWfs, setShowParksWfs] = useState(false);
  const [showNMRWfs, setShowNMRWfs] = useState(false);

  // One-time hint when NMR is enabled but zoom is too low
  const [nmrHintOpen, setNmrHintOpen] = useState(false);

// This stores the actual Leaflet GeoJSON layer object so it can add/remove it without rebuilding every render. 
  const osmRef = useRef(null);
  const esriRef = useRef(null);
  const dsmHillshadeRef = useRef(null);
  const multiHillshadeRef = useRef(null);
  const cadwSmRef = useRef(null); 
  const parksRef = useRef(null);
  const NMRRef = useRef(null);

  // Ref for NMR requests
  const nmrMoveDebounceRef = useRef(null); // waits 300ms after you stop moving
  const nmrAbortRef = useRef(null);        // cancels an old request if a new one starts
  const MIN_ZOOM_NMR = 11;                 // only fetch NMR when zoomed in enough 
  const nmrCanvasRendererRef = useRef(L.canvas({ padding: 0.5 })); // Use a canvas renderer for faster drawin

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

  // --- WMS: LiDAR DSM Hillshade ---
  // This effect runs whenever `showDsmHillshade` changes (toggled by the checkbox)
  // or when the `map` object is first ready.
  useEffect(() => {
    const URL = "https://datamap.gov.wales/geoserver/ows?";
    const LAYERS = "geonode:wales_lidar_dsm_1m_hillshade_cog";
    const ATTR = "© DataMapWales / Welsh Government";

    if (showDsmHillshade) { 
      // ✅ If the checkbox is ON (true) → THe layer should be visible

      if (!dsmHillshadeRef.current) { 
        // If we haven't already created a DSM hillshade layer object and stored it in the ref...

        dsmHillshadeRef.current = L.tileLayer.wms(URL, { 
          // Create a new WMS tile layer from the server at `URL`
          // and save it into the ref for reuse later.
          layers: LAYERS, // Which dataset to request from the WMS server
          format: "image/png", // Image format (supports transparency)
          transparent: true, // Allow background to be see-through
          tileSize: 1024, // Size of each tile (larger than default 256)
          version: "1.1.1", // WMS protocol version used by DataMapWales
          maxZoom: 18, // Only request tiles up to zoom level 18
          opacity: 1, // Fully visible (1 = 100%)
          attribution: ATTR, // Credits shown in the map corner
          pane: "lidarPane",
          zIndex: 350,
        });
      }

      if (!map.hasLayer(dsmHillshadeRef.current)) {
        // If the DSM hillshade layer exists but is not currently displayed on the map...
        dsmHillshadeRef.current.addTo(map); 
        // Add it to the map (make it visible).
      }

    } else if (dsmHillshadeRef.current && map.hasLayer(dsmHillshadeRef.current)) {
      // ❌ If the checkbox is OFF (false), AND the layer exists AND is currently displayed...

      map.removeLayer(dsmHillshadeRef.current);
      // Remove it from the map (hide it), but keep the ref so we can re-add quickly later.
    }

  }, [showDsmHillshade, map]); 
  // 🔄 This hook re-runs whenever the checkbox state or the map changes

  // --- WMS: LiDAR DSM Multi‑directional Hillshade ---
  useEffect(() => {
    const URL = "https://datamap.gov.wales/geoserver/ows?";
    const LAYERS = "geonode:wales_lidar_dsm_1m_hillshade_multi_cog";

    if (showMultiHillshade) {
      if (!multiHillshadeRef.current) {
        multiHillshadeRef.current = L.tileLayer.wms(URL, {
          layers: LAYERS,
          format: "image/png",
          transparent: true,
          tileSize: 1024,
          version: "1.1.1",
          maxZoom: 18,
          opacity: 1,
          attribution: "© DataMapWales / Welsh Government",
          pane: "lidarPane",
          zIndex: 340,
        });
      }
      if (!map.hasLayer(multiHillshadeRef.current)) multiHillshadeRef.current.addTo(map);
    } else if (multiHillshadeRef.current && map.hasLayer(multiHillshadeRef.current)) {
      map.removeLayer(multiHillshadeRef.current);
    }
  }, [showMultiHillshade, map]);

  // React hook, runs after the component renders. only re-runs if something in its dependency list changes. 
  useEffect(() => {
  if (!map.getPane("lidarPane")) { // checks if leaflet already has a pane called "lidarPane". If it doesnt exist yet (! means "not"), then it creates one
    const pane = map.createPane("lidarPane"); // creates new pane in leaflet called "lidarPane"
    pane.style.zIndex = 340; // above basemap (200), below vectors (400)
    pane.style.pointerEvents = "none"; // Make LiDAR tiles ignore mouse/touch events. 
    // This way they don't block clicks, drags, or hovers on the map and vector layers.
  }
}, [map]); // closes the useEffect, [map] means the effect will run when the map object is read (from useMap())

  // --- Vector Layers ---
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
            layer.bindPopup(
              `<div class="custom-popup cadw-popup">
                 <strong>Scheduled Monument</strong><br/>
                 <strong>${name}</strong><br/>
                 Site Type: ${type}<br/>
                 Period: ${period}<br/>
                 Cadw Report: ${report}
               </div>`
            );
          },
        });
        cadwSmRef.current.addTo(map);
        if (map.attributionControl) map.attributionControl.addAttribution(CADW_SM_ATTR);
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
      if (map.attributionControl) {
        map.attributionControl.removeAttribution(CADW_SM_ATTR);
      }
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

            layer.bindPopup(
              `<div class="custom-popup parks-popup">
                 <strong>Registered Historic Park &amp; Garden</strong><br/>
                 <strong>${name}</strong><br/>
                 Grade: ${grade}<br/>
                 Main Phase: ${main_phase}<br/>
                 Cadw Report: ${reportLink}
               </div>`
            );
          },
        });

        parksRef.current.addTo(map); // Put the leaflet layer on the map
      } catch (e) {
        console.error('Failed to load Parks & Gardens WFS:', e);
      } finally {
        map.fire('dataload'); // Hide the spinner
      }
    }

    // Adds/Removes attribution as needed. 
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
        NMRRef.current = L.geoJSON(null, {
          // Points-only: NMR is a point dataset, so render everything as a two-layer halo + dot group for high visibility
          pointToLayer: (feature, latlng) => {
            // Single circleMarker with thick white stroke so it remains clickable
            return L.circleMarker(latlng, {
              radius: 7,                 // larger, easy to tap
              renderer: nmrCanvasRendererRef?.current, // keep canvas performance if available
              color: '#ffffff',          // bright white outer stroke (halo effect)
              weight: 4,                 // thick outline for contrast
              opacity: 1,
              fillColor: '#ff2a6d',      // vivid magenta fill
              fillOpacity: 0.95,
            });
          },
          onEachFeature: (f, layer) => {
            const p = f?.properties || {};

            const name = p.name || p.Name || 'No name';

            // Support both `site_type` and `site_ty` (seen in your screenshots)
            const rawSiteType = p.site_type ?? p.SiteType ?? p.type ?? '';
            const siteType = String(rawSiteType || '')
              .split(/[;,.]/)
              .map(s => s.trim())
              .filter(Boolean)
              .filter((v, i, a) => a.indexOf(v) === i)
              .join(', ') || 'N/A';

            const period = p.period ?? p.Period ?? 'N/A';

            // Coflein link
            // Coflein URL (several possible keys)
            const reportUrl = p.url ?? p.URL ?? p.report ?? p.Report ?? null;
            const reportLink = reportUrl
              ? `<a href="${reportUrl}" target="_blank" rel="noopener noreferrer">View</a>`
              : 'N/A';

            layer.bindPopup(
              `<div class="custom-popup nmr-popup">
                 <strong>NMR Record</strong><br/>
                 <strong>${name}</strong><br/>
                 <Site Type: ${siteType}<br/>
                 Period: ${period}<br/>
                 Record Link: ${reportLink}
               </div>`
            );
          },
          pane: "overlayPane",
        });
      }
      if (!map.hasLayer(NMRRef.current)) NMRRef.current.addTo(map);
    };

    const clearLayer = () => {
      if (NMRRef.current) NMRRef.current.clearLayers();
    };

    const buildBBoxParam = (bounds) => {
      const bbox = bounds.toBBoxString(); // west,south,east,north
      return `&bbox=${bbox},EPSG:4326`;
    };

    const abortInFlight = () => {
      if (nmrAbortRef.current) {
        try { nmrAbortRef.current.abort(); } catch (_) {}
        nmrAbortRef.current = null;
      }
    };

    const loadInView = async () => {
      // Only fetch when zoomed in close enough
      if (map.getZoom() < MIN_ZOOM_NMR) {
        clearLayer();
        return;
      }

      ensureLayer();
      abortInFlight();

      const url = `${NMR_BASE}${buildBBoxParam(map.getBounds())}&count=5000`;
      const controller = new AbortController();
      nmrAbortRef.current = controller;

      map.fire('dataloading');
      try {
        const res = await fetch(url, { signal: controller.signal });
        const data = await res.json();
        clearLayer();
        
        // Add the new data to the layer
        NMRRef.current.addData(data);
      } catch (e) {
        if (e?.name !== 'AbortError') {
          console.error('Failed to load NMR WFS:', e);
        }
      } finally {
        map.fire('dataload');
      }
    };

    // Debounced pan/zoom handler
    const debouncedLoad = () => {
      if (nmrMoveDebounceRef.current) clearTimeout(nmrMoveDebounceRef.current);
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
    }

    // Cleanup on unmount or dependency change
    return () => {
      map.off('moveend zoomend', debouncedLoad);
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
        right: { xs: 12, sm: 20 },
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

      {!effectiveCollapsed && (
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
          <Typography variant="caption" sx={{ opacity: 0.8, display: "block", mb: 0 }}>
            Base
          </Typography>
          <RadioGroup
            value={base}
            onChange={(e) => setBase(e.target.value)}
            sx={{
              display: "flex",
              gap: 0,
              "& .MuiFormControlLabel-root": {
                m: 0,
                p: 0,
                borderRadius: 1,
              },
              "& .MuiFormControlLabel-root:hover": {
                backgroundColor: "rgba(0,0,0,0.04)",
              },
              "& .MuiFormControlLabel-label": {
                fontSize: { xs: '0.92rem', sm: '1rem' },
              },
            }}
          >
            <FormControlLabel value="osm" control={<Radio size="small" />} label="OpenStreetMap" />
            <FormControlLabel value="esri" control={<Radio size="small" />} label="ESRI Imagery" />
          </RadioGroup>

          <Divider sx={{ my: 1 }} />

          {/* Overlays */}
          <Typography variant="caption" sx={{ opacity: 0.8, display: "block", mb: 0 }}>
            Overlays
          </Typography>

          <Stack spacing={0}>

            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={showCommunity}
                  onChange={(e) => setShowCommunity(e.target.checked)}
                />
              }
              label="Community Finds"
              sx={{
                m: 0,
                p: { xs: 0.25, sm: 0.25 },
                borderRadius: 1,
                "& .MuiFormControlLabel-label": {
                  fontSize: { xs: '0.92rem', sm: '1rem' },
                  lineHeight: 1.2,
                },
                "&:hover": { backgroundColor: "rgba(0,0,0,0.035)" },
              }}
            />

            {/* Cadw Scheduled Monuments */}
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={showCadwSm}
                  onChange={(e) => setShowCadwSm(e.target.checked)}
                />
              }
              label="Cadw Scheduled Monuments"
              sx={{
                m: 0,
                p: { xs: 0.25, sm: 0.25 },
                borderRadius: 1,
                "& .MuiFormControlLabel-label": {
                  fontSize: { xs: '0.92rem', sm: '1rem' },
                  lineHeight: 1.2,
                },
                "&:hover": { backgroundColor: "rgba(0,0,0,0.035)" },
              }}
            />

            {/* Parks and Gardens */}
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={showParksWfs}
                  onChange={(e) => setShowParksWfs(e.target.checked)}
                />
              }
              label="Registered Historic Parks and Gardens"
              sx={{
                m: 0,
                p: { xs: 0.25, sm: 0.25 },
                borderRadius: 1,
                "& .MuiFormControlLabel-label": {
                  fontSize: { xs: '0.92rem', sm: '1rem' },
                  lineHeight: 1.2,
                },
                "&:hover": { backgroundColor: "rgba(0,0,0,0.035)" },
              }}
            />

            {/* National Monuments Record of Wales */}
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={showNMRWfs}
                  onChange={(e) => setShowNMRWfs(e.target.checked)}
                />
              }
              label="National Monuments Record of Wales"
              sx={{
                m: 0,
                p: { xs: 0.25, sm: 0.25 },
                borderRadius: 1,
                "& .MuiFormControlLabel-label": {
                  fontSize: { xs: '0.92rem', sm: '1rem' },
                  lineHeight: 1.2,
                },
                "&:hover": { backgroundColor: "rgba(0,0,0,0.035)" },
              }}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={showDsmHillshade}
                  onChange={(e) => setShowDsmHillshade(e.target.checked)}
                />
              }
              label="LiDAR DSM Hillshade"
              sx={{
                m: 0,
                p: { xs: 0.25, sm: 0.25 },
                borderRadius: 1,
                "& .MuiFormControlLabel-label": {
                  fontSize: { xs: '0.92rem', sm: '1rem' },
                  lineHeight: 1.2,
                },
                "&:hover": { backgroundColor: "rgba(0,0,0,0.035)" },
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={showMultiHillshade}
                  onChange={(e) => setShowMultiHillshade(e.target.checked)}
                />
              }
              label="LiDAR DSM Multi-directional"
              sx={{
                m: 0,
                p: { xs: 0.25, sm: 0.25 },
                borderRadius: 1,
                "& .MuiFormControlLabel-label": {
                  fontSize: { xs: '0.92rem', sm: '1rem' },
                  lineHeight: 1.2,
                },
                "&:hover": { backgroundColor: "rgba(0,0,0,0.035)" },
              }}
            />
          </Stack>

          {/* Scroll for more hint */}
          {isMobile && !effectiveCollapsed && (
            <Box sx={{ px: 1, pb: 0.75, pt: 0.25 }}>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Scroll for more
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
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
    </>
  );
}