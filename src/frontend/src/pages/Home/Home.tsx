import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Correct import
import axios from 'axios';
import FlightIcon from '@mui/icons-material/Flight';
import { renderToStaticMarkup } from 'react-dom/server';

interface Plane {
  latitude: number;
  longitude: number;
  heading: number;
  callsign: string;
  altitude: number;
  speed: number;
}

type PlaneState = [unknown, string, unknown, unknown, unknown, number, number, number, unknown, number, unknown, unknown, number];

const PlaneMarkers = ({ planes }: { planes: Plane[] }) => {
  const createPlaneIcon = (heading: number) => {
    const iconMarkup = renderToStaticMarkup(
      <FlightIcon style={{ transform: `rotate(${heading}deg)`, color: 'blue' }} />
    );
    return L.divIcon({
      html: iconMarkup,
      iconSize: [32, 32],
      className: 'plane-icon'
    });
  };

  return (
    <>
      {planes.map((plane, index) => (
        <Marker
          key={index}
          position={[plane.latitude, plane.longitude]}
          icon={createPlaneIcon(plane.heading)}
        >
          <Popup>
            Aircraft: {plane.callsign}<br />
            Altitude: {plane.altitude} meters<br />
            Speed: {plane.speed} knots
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default function Home() {
  const [planes, setPlanes] = useState<Plane[]>([]);

  useEffect(() => {
    const fetchPlaneData = async () => {
      try {
        const response = await axios.get('https://opensky-network.org/api/states/all', {
          auth: {
            username: 'alonitor',
            password: 'alonitor007',
          },
        });

        const { states } = response.data;
        const planeData = states.map((state: PlaneState) => ({
          latitude: state[6],
          longitude: state[5],
          callsign: state[1],
          altitude: state[7],
          speed: state[9],
          heading: state[10]
        }))
        .filter((plane: Plane) => plane.latitude && plane.longitude)
        .slice(0, 100);

        setPlanes(planeData);
      } catch (error) {
        console.error('Error fetching plane data:', error);
      }
    };

    fetchPlaneData();
    const intervalId = setInterval(fetchPlaneData, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const handleClick = (e: L.LeafletMouseEvent) => {
    if (e.latlng) {
      console.log(`Latitude: ${e.latlng.lat}, Longitude: ${e.latlng.lng}`);
    } else {
      console.log('Click event does not contain latlng data');
    }
  };

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <MapContainer 
        center={[0, 0]} 
        zoom={4}
        style={{ height: '100vh', width: '100vw' }}
        maxZoom={18}
        minZoom={4}
        maxBounds={[
          [-90, -180],
          [90, 180]
        ]}
        maxBoundsViscosity={1.0}
        onClick={handleClick}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <PlaneMarkers planes={planes} />
      </MapContainer>
    </div>
  );
}
