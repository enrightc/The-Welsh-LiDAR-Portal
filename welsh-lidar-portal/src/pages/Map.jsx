import React from 'react'

// React Leaflet
import {
    MapContainer,
    TileLayer,
    WMSTileLayer,
    useMap,
    Marker,
    Popup,
    LayersControl,
  } from 'react-leaflet'

import 'leaflet-loading';

const Map = () => {
  return (
    <div style={{ height: "100vh", marginTop: "64px" }}>
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
              attribution='&copy; <a href="https://datamap.gov.wales/">DataMap Wales</a>'
            />
          </LayersControl.Overlay>

        </LayersControl>

      </MapContainer>
    </div>
    )
}

export default Map