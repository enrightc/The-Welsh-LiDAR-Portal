import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import 'leaflet-loading'; // Leaflet plugin: small spinner in top-left when the map is "loading"

import { Box, Tooltip, IconButton, Divider, Typography, RadioGroup, FormControlLabel, Radio, Checkbox, Stack } from "@mui/material";
import LayersIcon from "@mui/icons-material/Layers";
import MapIcon from '@mui/icons-material/Map';

import '../assets/styles/map.css';

export default function CustomLayerControl() {
  const map = useMap();

  // Base map selection
  const [base, setBase] = useState("osm"); // "osm" or "esri"

  // Collapsible state — default open
  const [collapsed, setCollapsed] = useState(false);

  // Overlay toggles
  const [showDsmHillshade, setShowDsmHillshade] = useState(false);
  const [showMultiHillshade, setShowMultiHillshade] = useState(false);
  const [showCadwWfs, setShowCadwWfs] = useState(false);

  // Refs for Leaflet layers
  const osmRef = useRef(null);
  const esriRef = useRef(null);
  const dsmHillshadeRef = useRef(null);
  const multiHillshadeRef = useRef(null);
  const cadwRef = useRef(null); // WFS -> GeoJSON layer (created once, reused)

  const CADW_ATTR = 'Scheduled Monuments © Crown copyright Cadw, DataMapWales, <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/">OGL v3.0</a>';

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
  useEffect(() => {
    const URL = "https://datamap.gov.wales/geoserver/ows?";
    const LAYERS = "geonode:wales_lidar_dsm_1m_hillshade_cog";

    if (showDsmHillshade) {
      if (!dsmHillshadeRef.current) {
        dsmHillshadeRef.current = L.tileLayer.wms(URL, {
          layers: LAYERS,
          format: "image/png",
          transparent: true,
          tileSize: 1024,
          version: "1.1.1",
          maxZoom: 18,
          opacity: 1,
          attribution: "© DataMapWales / Welsh Government"
        });
      }
      if (!map.hasLayer(dsmHillshadeRef.current)) dsmHillshadeRef.current.addTo(map);
    } else if (dsmHillshadeRef.current && map.hasLayer(dsmHillshadeRef.current)) {
      map.removeLayer(dsmHillshadeRef.current);
    }
  }, [showDsmHillshade, map]);

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
          attribution: "© DataMapWales / Welsh Government"
        });
      }
      if (!map.hasLayer(multiHillshadeRef.current)) multiHillshadeRef.current.addTo(map);
    } else if (multiHillshadeRef.current && map.hasLayer(multiHillshadeRef.current)) {
      map.removeLayer(multiHillshadeRef.current);
    }
  }, [showMultiHillshade, map]);

  // --- WFS: Cadw Scheduled Monuments ---
  useEffect(() => {
    const CADW_WFS_URL =
      "https://datamap.gov.wales/geoserver/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=inspire-wg:Cadw_SAM&srsName=EPSG:4326&outputFormat=application/json";

    async function addCadw() {
      // If already created once, just re-add it
      if (cadwRef.current) {
        if (!map.hasLayer(cadwRef.current)) cadwRef.current.addTo(map);
        return;
      }
      try {
        // Tell the Leaflet.loading plugin a data request is starting
        // This makes the small top-left spinner appear while the WFS loads
        map.fire('dataloading'); // start spinner
        const res = await fetch(CADW_WFS_URL);
        const data = await res.json();

        // Build the GeoJSON layer from the fetched data
        cadwRef.current = L.geoJSON(data, {
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
                 <em>Site Type: </em>${type}<br/>
                 <em>Period: </em>${period}<br/>
                 <em>Cadw Report: </em>${report}
               </div>`
            );
          },
        });
        cadwRef.current.addTo(map);
        if (map.attributionControl) map.attributionControl.addAttribution(CADW_ATTR);
      } catch (e) {
        console.error("Failed to load Cadw WFS:", e);
      } finally {
        // 👉 Tell the plugin that loading is finished (success OR error)
        // This hides the small top-left spinner
        map.fire('dataload'); // stop spinner
      }
    }

    if (showCadwWfs) { // state boolean controlled by checkbox: "Cadw Scheduled Monuments".
      addCadw(); // if showCadwWfs is true call addCadw function.
    } else if (cadwRef.current // Otherwise, if the checkbox is OFF and... 
        && map.hasLayer(cadwRef.current)) { // ...the Cadw layer is currently on the map
      map.removeLayer(cadwRef.current); // Remove the layer from the map
      if (map.attributionControl) 
        map. attributionControl. // Also remove its attribution 
       removeAttribution(CADW_ATTR);
    }
  }, [showCadwWfs, map]);

  return (
    <Box
      sx={{
        position: "absolute",
        zIndex: 1000,
        top: 20,
        right: 20,
        bgcolor: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(10px)",
        borderRadius: 2, // 16px
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        minWidth: 260,
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
        <Stack direction="row" spacing={1} alignItems="center">
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
              border: "1px solid rgba(0,0,0,0.15)",
              bgcolor: "white",
              "&:hover": { bgcolor: "#f5f5f5" },
            }}
          >
            <LayersIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </Box>

      {!collapsed && (
        <Box sx={{ px: 1.5, pb: 1.5 }}>
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
                  checked={showCadwWfs}
                  onChange={(e) => setShowCadwWfs(e.target.checked)}
                />
              }
              label="Cadw Scheduled Monuments"
              sx={{
                m: 0,
                p: 0.25,
                borderRadius: 1,
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
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
                p: 0.25,
                borderRadius: 1,
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
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
                p: 0.25,
                borderRadius: 1,
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
              }}
            />
          </Stack>
        </Box>
      )}
    </Box>
  );
}