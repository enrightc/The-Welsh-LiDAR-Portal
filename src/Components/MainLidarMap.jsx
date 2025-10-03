import * as React from 'react';
import * as L from 'leaflet';

// Workaround for Leaflet.draw touch adding vertices on drag (GH #935)
// https://github.com/Leaflet/Leaflet.draw/issues/935
if (L?.Draw?.Polyline) {
  L.Draw.Polyline.prototype._onTouch = L.Util.falseFn;
}

// MUI Imports
import Button from '@mui/material/Button';
import { Dialog, DialogTitle, DialogContent, Typography, Box } from '@mui/material';

// React Leaflet
import {
    MapContainer,
    TileLayer,
    WMSTileLayer,
    useMap,
    Popup,
    LayersControl,
    FeatureGroup,
    LayerGroup,
    Polygon,
    AttributionControl,
  } from 'react-leaflet'
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-loading'; // Leaflet plugin: shows a small spinner (top-left) when the map is "loading"

// React Leaflet Draw
import { EditControl } from "react-leaflet-draw"

// Custom Components
import CustomLayerControl from "./CustomLayerControl";
import '../assets/styles/map.css';
import AttributesControl from "./AttributesControl";

export default function MainLidarMap({
    handleDrawCreate,
    featureGroupRef,
    dispatch,
    setPolygonDrawn,
    allRecords,
    handleOpenMiniProfile,
    setSelectedFeature,
    setModalOpen,
}) {
    // Fallback to prevent map crash if allRecords isn't ready
    if (!Array.isArray(allRecords)) return null;

    const [showCommunity, setShowCommunity] = React.useState(true); // start ON

    function MapActionsRegistrar({ onRegister }) {
        const map = useMap();

        React.useEffect(() => {
            if (map && onRegister) onRegister(map);
            // Also defensively disable Tap handler if present (matches GH #935 note)
            if (map && map.tap && map.tap.disable) {
            try { map.tap.disable(); } catch (_) {}
            }
        }, [map, onRegister]);

        return null;
    }

    return (

        <MapContainer
            center={[
            52.1307, 
            -3.7837
            ]} 
            zoom={8.5} 
            scrollWheelZoom={true} 
            loadingControl={true} // shows the little spinner control
            tap={false}
            attributionControl={false}
        >

            <MapActionsRegistrar />

            <CustomLayerControl
                showCommunity={showCommunity}
                setShowCommunity={setShowCommunity}
            />

            <FeatureGroup ref={featureGroupRef}>
            <EditControl
            position="topright"
            draw={{
                polygon: false,  // Set to false to trigger manually with custom button.
                polyline: false,
                rectangle: false,
                circle: false,
                marker: false,
                circlemarker: false,
            }}
            edit={{
                edit: false,
                remove: false, // Hides the delete tool
            }}
            onCreated={handleDrawCreate}
            onDeleted={(e) => {
                setPolygonDrawn(false);
                dispatch({ type: 'catchPolygonCoordinateChange', polygonChosen: [] });
            }}
            />
            </FeatureGroup> 

            {/* Toggleable overlay for Community polygons (React-Leaflet, so the Button works) */}
            {showCommunity && (
            <LayerGroup>
            {/* Loop through each record and draw its polygon on the map */}
            {allRecords.map((record) => (
                Array.isArray(record.polygonCoordinate) && record.polygonCoordinate.length > 0 && (
                <Polygon
                    key={record.id}
                    positions={record.polygonCoordinate}
                    pathOptions={{ 
                        color: '#3388ff',
                        weight: 2,
                        fillOpacity: 0.2, 
                    }}
                >
                    <Popup>
                        <div 
                            style={{ 
                            fontFamily: "Arial, sans-serif", fontSize: "14px", lineHeight: "1.4", maxWidth: "300px", backgroundColor: "#fff", padding: "10px", borderRadius: "6px",  
                            }}
                        >
                            <strong style={{ color: "blue", fontSize: "15px", display: "block", marginBottom: "12px" }}>
                            LiDAR Feature
                            </strong>

                            <h3 style={{ margin: "0 0 6px 0", fontSize: "16px", color: "blue" }}>
                            {record.title}
                            </h3>

                            {record.picture1 && (
                            <img
                                src={record.picture1}
                                alt={record.title}
                                style={{ height: "10rem", width: "100%", objectFit: "cover", marginBottom: "8px", borderRadius: "4px" }}
                            />
                            )}

                            {record.prn && (
                            <p style={{ margin: 0 }}><strong>PRN:</strong> {record.prn}</p>
                            )}

                            <p style={{ margin: 0 }}>
                            <strong>Site Type: </strong>{record.site_type_display}
                            </p>
                            <p style={{ margin: 0 }}>
                            <strong>Monument Type: </strong>{record.monument_type_display}
                            </p>
                            <p style={{ margin: 0 }}>
                            <strong>Recorded By: </strong>
                            <span
                                onClick={() => handleOpenMiniProfile(record.recorded_by_user_id)}
                                style={{ color: "#1976d2", cursor: "pointer", textDecoration: "underline" }}
                            >
                                {record.recorded_by}
                            </span>
                            </p>
                            <p style={{ margin: 0 }}>
                            <strong>Date Recorded: </strong>{record.date_recorded}
                            </p>

                            <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                                setSelectedFeature(record);
                                setModalOpen(true);
                            }}
                            >
                            View Full Record
                            </Button>
                        </div>
                    </Popup>
                </Polygon>
                )
            ))}
            </LayerGroup>
            )}

            <AttributesControl />

        </MapContainer>
    )
}