import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { Flight } from '@mui/icons-material';
import { RocketLaunch } from '@mui/icons-material';
import { Box } from '@mui/material';
import { renderToStaticMarkup } from 'react-dom/server';
import Navbar from '../../components/Navbar';
import PlanesAmountDialog from '../../dialogs/PlanesAmount';
import AddCoordinatesDialog from '../../dialogs/AddCoordinates';
import { Plane, DroneDeparture, NavbarOptions } from '../../types';

type PlaneState = [unknown, string, unknown, unknown, unknown, number, number, number, unknown, number, unknown, unknown, number];

interface PlanesAmountFormData {
  planesAmount: number;
}

type CoordinatesFormData = DroneDeparture

type FormData = Partial<PlanesAmountFormData> | Partial<CoordinatesFormData>;

interface PlaneMarkersProps {
  planes: Plane[];
  drones: DroneDeparture[];
}

const PlaneAndDronesLauncherMarkers = ({ planes, drones }: PlaneMarkersProps) => {
  const createPlaneIcon = (heading: number) => {
    const iconMarkup = renderToStaticMarkup(
      <Flight style={{ transform: `rotate(${heading}deg)` }} />
    );
    return L.divIcon({
      html: iconMarkup,
      iconSize: [32, 32],
      className: 'plane-icon'
    });
  };

  const createRocketIcon = () => {
    const iconMarkup = renderToStaticMarkup(
      <RocketLaunch style={{ fontSize: '32px' }} />
    );
    return L.divIcon({
      html: iconMarkup,
      iconSize: [32, 32],
      className: 'rocket-icon'
    });
  };

  return (
    <>
      {planes.map((plane, index) => (
        <Marker
          key={`plane-${index}`}
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
      {drones.map((drone, index) => (
        <React.Fragment key={`drone-${index}`}>
          <Marker
            position={[drone.latitude, drone.longitude]}
            icon={createRocketIcon()}
          >
            <Popup>
              Latitude: {drone.latitude}<br />
              Longitude: {drone.longitude}<br />
              Radius: {drone.radius} meters<br />
              Speed: {drone.speed} knots
            </Popup>
          </Marker>
          <Circle
            center={[drone.latitude, drone.longitude]}
            radius={drone.radius}
            pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.2 }}
          />
        </React.Fragment>
      ))}
    </>
  );
};

export default function Home() {
  const [planes, setPlanes] = useState<Plane[]>([]);
  const [planesAmount, setPlanesAmount] = useState<number>(10);
  const [dronesDeparture, setDronesDeparture] = useState<DroneDeparture[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<NavbarOptions | null>(null);
  const [formData, setFormData] = useState<FormData>({});

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
      .slice(0, planesAmount);

      setPlanes(planeData);
    } catch (error) {
      console.error('Error fetching plane data:', error);
    }
  };

  useEffect(() => {
    fetchPlaneData();
    const intervalId = setInterval(fetchPlaneData, 3000000);

    return () => clearInterval(intervalId);
  }, [planesAmount]);

  const handleDialogClose = () => {
    setDialogOpen(false);
    setFormData({});
  };

  const handleDialogSubmit = () => {
    if (dialogType === NavbarOptions.AddCoordinates && formData as CoordinatesFormData) {
      const { latitude, longitude, radius, speed } = formData as CoordinatesFormData;
      setDronesDeparture([...dronesDeparture, { latitude, longitude, radius, speed }]);
    } else if (dialogType === NavbarOptions.ChangePlanesAmount && formData as PlanesAmountFormData) {
      const { planesAmount } = formData as PlanesAmountFormData;
      setPlanesAmount(planesAmount);
    }
    handleDialogClose();
  };

  const onNavbarOptionSelected = (option: NavbarOptions) => {
    setDialogType(option);
    setDialogOpen(true);
  };

  return (
    <Box sx={{ height: '100vh', width: '100vw' }}>
      <Navbar onNavbarOptionSelected={onNavbarOptionSelected} />
      
      <PlanesAmountDialog
        dialogOpen={dialogOpen && dialogType === NavbarOptions.ChangePlanesAmount}
        formData={formData as PlanesAmountFormData}
        setFormData={(data) => setFormData(data as PlanesAmountFormData)}
        handleDialogClose={handleDialogClose}
        handleDialogSubmit={handleDialogSubmit}
      />

      <AddCoordinatesDialog
        dialogOpen={dialogOpen && dialogType === NavbarOptions.AddCoordinates}
        formData={formData as CoordinatesFormData}
        setFormData={(data) => setFormData(data as CoordinatesFormData)}
        handleDialogClose={handleDialogClose}
        handleDialogSubmit={handleDialogSubmit}
      />

      <MapContainer 
        center={[0, 0]} 
        zoom={4}
        style={{ height: 'calc(100vh - 64px)', width: '100vw' }}
        maxZoom={18}
        minZoom={4}
        maxBounds={[
          [-90, -180],
          [90, 180]
        ]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <PlaneAndDronesLauncherMarkers planes={planes} drones={dronesDeparture} />
      </MapContainer>
    </Box>
  );
}
