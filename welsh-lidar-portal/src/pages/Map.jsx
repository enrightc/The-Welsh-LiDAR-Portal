import React from 'react'

// React Leaflet
import {
    MapContainer,
    TileLayer,
    useMap,
    Marker,
    Popup,
  } from 'react-leaflet'

const Map = () => {
  return (
        <div style={{ height: "100vh" }}>
            <MapContainer center={[52.1307, -3.7837]} zoom={8.5} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            </MapContainer>
        </div>
    )
}

export default Map