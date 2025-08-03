import * as React from 'react';

// MUI Imports
import Button from '@mui/material/Button';
import { GeoJSON } from "react-leaflet";

// React Leaflet
import {
    MapContainer,
    TileLayer,
    WMSTileLayer,
    useMap,
    // Marker,
    Popup,
    LayersControl,
    FeatureGroup,
    Polygon,
  } from 'react-leaflet'
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-loading';

// React Leaflet Draw
import { EditControl } from "react-leaflet-draw"

export default function MainLidarMap({
  scheduledMonuments,
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

    return (

        <MapContainer
        center={[
          52.1307, 
          -3.7837
        ]} 
        zoom={8.5} 
        scrollWheelZoom={true} 
        loadingControl={true}
      >

      {/* DraggableMarker */}
      {/* <Marker
        draggable
        eventHandlers={eventHandlers}
        position={markerPosition}
        ref={markerRef}>
      </Marker> */}

      {/* LayersControl for switching between map layers */}
      <LayersControl position="topright">
          {/* Default OpenStreetMap Layer */}
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          {/* Esri World Imagery Satellite Layer */}
          <LayersControl.BaseLayer name="Esri World Imagery">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            />
          </LayersControl.BaseLayer>

          {/* WMS LiDAR DSM Hillshade Layer */}
          <LayersControl.Overlay name="LiDAR DSM Hillshade">
            <WMSTileLayer
                url="https://datamap.gov.wales/geoserver/ows?"
                layers="geonode:wales_lidar_dsm_1m_hillshade_cog"
                format="image/png"
                transparent={true}
                tileSize={1024}  // ✅ Increase tile size for better clarity
                version="1.1.1"  // ✅ Try version 1.1.1 if 1.3.0 is not working well
                maxZoom={18}  // ✅ Allows for higher resolution zoom levels
                minZoom={6}  // ✅ Ensures tiles load at lower zoom levels
                opacity={1}  // ✅ Make sure the layer is fully visible
                detectRetina={true}  // ✅ Enable high-resolution tiles for Retina screens
                attribution='&copy; <a href="https://datamap.gov.wales/">DataMap Wales</a>'
            />
          </LayersControl.Overlay>

          {/* WMS LiDAR DSM Multi-directinonal Hillshade Layer */}
          <LayersControl.Overlay name="LiDAR DSM Multi-directional Hillshade">
            <WMSTileLayer
                url="https://datamap.gov.wales/geoserver/ows?"
                layers="geonode:wales_lidar_dsm_1m_hillshade_multi_cog"
                format="image/png"
                transparent={true}
                tileSize={1024}  // ✅ Increase tile size for better clarity
                version="1.1.1"  // ✅ Try version 1.1.1 if 1.3.0 is not working well
                maxZoom={18}  // ✅ Allows for higher resolution zoom levels
                minZoom={6}  // ✅ Ensures tiles load at lower zoom levels
                opacity={1}  // ✅ Make sure the layer is fully visible
                detectRetina={true}  // ✅ Enable high-resolution tiles for Retina screens
                attribution='&copy; <a href="https://datamap.gov.wales/">DataMap Wales</a>'
            />
          </LayersControl.Overlay>

          {/* Cadw Scheduled Monuments */}
          <LayersControl.Overlay name="Scheduled Monuments">
            {scheduledMonuments && (
              <GeoJSON
                data={scheduledMonuments}
                style={{
                  color: "#e60000",      // super bright red outline
                  weight: 3,
                  fillColor: "#ffe100",  // super bright yellow fill
                  fillOpacity: 0.6,
                }}
                onEachFeature={(feature, layer) => {
                  if (feature.properties) {
                    layer.bindPopup(
                      `<div class="custom-popup">
                      <strong>Scheduled Monument</strong>
                      <br>
                      <strong>${feature.properties.Name}</strong>
                      <br>
                      <em>Site Type: </em>${feature.properties.SiteType}
                      <br>
                      <em>Period: </em>${feature.properties.Period}
                      <br>
                      <em>Cadw Report: </em><a href="${feature.properties.Report}" target="_blank" rel="noopener noreferrer">View</a>
                      <br>
                      `
                    );
                  }
                }}
              />
            )}
          </LayersControl.Overlay>

        </LayersControl>

        

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

      {/* // Below code is the default leaflet draw control buttons */}
        {/* <FeatureGroup>
          <EditControl
            position="topright"
            draw={{
              polygon: !polygonDrawn, // Only allow polygon if one hasn't been drawn yet
              polyline: false,
              rectangle: false,
              circle: false,
              marker: false,
              circlemarker: false,
            }}
            // onCreated={(e) => {
            //   const layer = e.layer;
            //   const coords = layer.getLatLngs();
            //   console.log("Polygon drawn:", coords);
            //   // You can store these in state or send to your Django backend
            // }}
            onCreated={handleDrawCreate}
            onDeleted={(e) => {
              // If the polygon is deleted, allow drawing again
              setPolygonDrawn(false);
              dispatch({ type: 'catchPolygonCoordinateChange', polygonChosen: [] });
            }}
          />
        </FeatureGroup> */}

        {/* Map markers for each record */}
        {/* <Marker position={[latitude, longitude ]}></Marker> */}
        {allRecords.map((record) => (
          <React.Fragment key={record.id}>
            {/* Display Marker */}
            {/* <Marker 
              key={record.id}  
              position={[
                record.latitude, 
                record.longitude
              ]}
            >
              <Popup>
                {record.picture1 && (
                  <img
                    src={record.picture1}
                    alt={record.title}
                    style={{ height: "14rem", width: "18rem", marginBottom: "0.5rem" }}
                  />
                )}
                {record.recorded_by} <br />
                {record.title} <br />
                {record.description} <br />
              </Popup>
            </Marker> */}
            {/* Display Polygon if it exists */}
            {Array.isArray(record.polygonCoordinate) && record.polygonCoordinate.length > 0 && (
                                  <Polygon
                positions={record.polygonCoordinate} // Pass polygon coordinates
                pathOptions={{ 
                  Bordercolor: "blue", 
                }}
              >
                <Popup>
                  <div 
                    style={{ 
                      fontFamily: "Arial, sans-serif", fontSize: "14px", lineHeight: "1.4", maxWidth: "300px", backgroundColor: "#fff", padding: "10px", borderRadius: "6px",  
                    }}
                  >
                    <strong 
                      style={{ 
                        color: "blue", fontSize: "15px", display: "block", marginBottom: "12px" 
                      }}
                    >
                      LiDAR Feature
                    </strong>
                    <h3 
                      style={{ 
                        margin: "0 0 6px 0", fontSize: "16px", color: "blue" }}>{record.title}
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
                    <p 
                      style={{ 
                        margin: 0 }}><strong>Site Type: {' '}</strong> {record.site_type_display}
                    </p>
                    <p 
                      style={{ 
                        margin: 0 }}>
                        <strong>
                          Monument Type: {' '}
                        </strong> 
                        {record.monument_type_display}
                      </p>
                    <p style= {{ margin: 0 }}>
                      <strong>
                        Recorded By: {' '}      
                      </strong> 
                      <span
                        onClick={() => {
                          handleOpenMiniProfile(record.recorded_by_user_id);
                        }}
                        style={{
                          color: "#1976d2",
                          cursor: "pointer",
                          textDecoration: "underline"
                        }}
                      >
                        {record.recorded_by}
                      </span>
                    </p>
                    <p style={{ margin: 0 }}>
                      <strong>Date Recorded: {' '}</strong> {record.date_recorded}
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
            )}
          </React.Fragment>
        ))}
      
      </MapContainer>
    
    )
}
 