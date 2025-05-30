import React, { useEffect, useState } from 'react'
import Axios from 'axios'; // Import Axios for making HTTP requests

// React Leaflet
import {
    MapContainer,
    TileLayer,
    WMSTileLayer,
    useMap,
    Marker,
    Popup,
    LayersControl,
    FeatureGroup
  } from 'react-leaflet'
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-loading';

// React Leaflet Draw
import { EditControl } from "react-leaflet-draw"

// MUI Imports
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';

// Fetches all records from the Django backend API at /api/records/
// Converts the response to JSON and logs the data to the browser console
function records() {
  // fetch('http://127.0.0.1:8000/api/records/').then((response) => response.json()).then(data=>console.log(data))
}
records();

const Map = () => {

  // Use the useState hook to create a state variable called allRecords
  // It starts as an empty array []
  // setAllRecords is the function used to update the state later
  const [allRecords, setAllRecords] = useState([]); // Store records fetched from the backend
  const [dataIsLoading, setDataIsLoading] = useState(true); // Track loading state

  // useEffect runs code when the component first loads (mounts)
  // The empty array [] means "only run this once"
  useEffect(() => {
    const source = Axios.CancelToken.source(); // Create a cancel token for Axios requests
    // Define an async function to fetch the records
    async function GetAllRecords() {
      // Make a GET request to our Django backend to fetch the records
      try {
        const response = await Axios.get('http://127.0.0.1:8000/api/records/', {cancelToken: source.token});
        // If the request is successful, the response will contain the data

        // The response will have a .data property containing the actual records
        // save those into allRecords state
        setAllRecords(response.data);
        setDataIsLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.log("Error fetching records:", error.response);
    }
  }
    // Call the function we just defined
    GetAllRecords();
    return () => {
      // Cleanup function to run when the component unmounts
      // This is where you can cancel any ongoing requests or clean up resources
      source.cancel(); // Cancel the Axios request if the component unmounts
    }

  }, []); // ← This empty array makes sure it runs only once when the component loads
  
  if (dataIsLoading === false) {
    console.log(allRecords[0]); // Log the records to the console for debugging
  }
  
  // If data is still loading, show a loading message
  if (dataIsLoading === true) {
    return (
      <Grid 
        container 
        justifyContent="center" 
        alignItems="center" 
        style={{ height: "100vh", width: "100vw" }}
        // Set width: "100vw" to make sure the Grid takes up the full screen width,
        // so the loading spinner can be perfectly centered horizontally
      >
        <CircularProgress />
      </Grid>
    )
  }
  // If data is loaded, show the map
  // The MapContainer component is the main map component
  return (
    <div style={{ height: "calc(100vh - 68.5px)", width: "100vw ",positiom: "relative", overflow: "hidden" }}>
      <MapContainer center={[52.1307, -3.7837]} zoom={8.5} scrollWheelZoom={true} loadingControl={true}>

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
            <WMSTileLayer
                url="https://datamap.gov.wales/geoserver/ows?" 
                layers="inspire-wg:Cadw_SAM"
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

        </LayersControl>

        <FeatureGroup>
        <EditControl
          position="topright"
          draw={{
            polygon: true,
            polyline: true,
            rectangle: true,
            circle: true,
            marker: true,
            circlemarker: false,
          }}
          onCreated={(e) => {
            const layer = e.layer;
            const coords = layer.getLatLngs();
            console.log("Polygon drawn:", coords);
            // You can store these in state or send to your Django backend
          }}
        />
      </FeatureGroup>

        {/* Map markers for each record */}
        {/* <Marker position={[latitude, longitude ]}></Marker> */}
        {allRecords.map((record) => (
          <React.Fragment key={record.id}>
            {/* Display Marker */}
            <Marker 
              key={record.id}  
              position={[
                record.latitude, 
                record.longitude
              ]}
            >
              <Popup>
                {record.title} <br />
                {record.description} <br />
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
      
      </MapContainer>
    </div>
    )
}

export default Map