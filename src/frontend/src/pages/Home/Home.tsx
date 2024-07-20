// Home.js
import React from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const ClickableMap = () => {
  useMapEvents({
    click: (e) => {
      console.log(`Latitude: ${e.latlng.lat}, Longitude: ${e.latlng.lng}`);
    },
  });
  return null;
};

export default function Home() {
  const bounds = [
    [-90, -180],
    [90, 180]
  ];

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <MapContainer 
        center={[0, 0]} 
        zoom={2}
        style={{ height: '100vh', width: '100vw' }}
        maxZoom={18}
        minZoom={4}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ClickableMap />
      </MapContainer>
    </div>
  );
};
