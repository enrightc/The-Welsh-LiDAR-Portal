import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-loading';

function FitPolygon({ coordinates }) { // Function to draw the polygon on the map and zoom the map to fit the extent of the polygon
  const map = useMap(); // gives access to map after its loaded

  useEffect(() => { // This runs after the map is loaded
    if (coordinates && coordinates.length) { // safety check to make sure coordinates exist and have at least one point
      map.fitBounds(coordinates); // work out map zoom and extent from coordinates
    }
  }, [coordinates, map]); // Dependancy array - only run the useEffect if the coordinates or map change.

  return <Polygon positions={coordinates} />; // draws the polygon on the map
}

function FeatureMap({ coordinates }) { // Main map component
  
  return (
    <MapContainer
        bounds={coordinates} // passes all points to leaflet so it can zoom to view
        scrollWheelZoom={true}
        style={{ height: '450px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitPolygon coordinates={coordinates} /> 
    </MapContainer>
  );
}

export default FeatureMap;