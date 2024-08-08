import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Flight } from '@mui/icons-material';
import { RocketLaunch } from '@mui/icons-material';
import { Box } from '@mui/material';
import { renderToStaticMarkup } from 'react-dom/server';
import Navbar from '../../components/Navbar';
import PlanesAmountDialog from '../../dialogs/PlanesAmount';
import AddCoordinatesDialog from '../../dialogs/AddCoordinates';
import { Plane, NavbarOptions, DroneDeparture } from '../../api/types';
import { useEvaluateThreatMutation } from '../../api/planes';
import { useSaveOperationMutation, useFetchSavedOperationsQuery } from '../../api/database';

export const PLANES_AMOUNT_DEFAULT = 1000;

interface PlaneAndDronesLauncherMarkersProps {
  planes: Plane[];
  drones: DroneDeparture[];
  closureTimes: number[];
  vectorClosureTimes: number[];
}

interface Threat {
  drone: DroneDeparture;
  plane?: Plane;
  closureTime?: number;
  vectorClosureTime?: number;
  minDistance?: number;
  message?: string;
}

const PlaneAndDronesLauncherMarkers = ({ planes, drones, closureTimes, vectorClosureTimes }: PlaneAndDronesLauncherMarkersProps) => {
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
        plane.latitude != null && plane.longitude != null && (
          <Marker
            key={`plane-${index}`}
            position={[plane.latitude, plane.longitude]}
            icon={createPlaneIcon(plane.heading)}
          >
            <Popup>
              Aircraft: {plane.callsign}<br />
              Altitude: {plane.altitude} meters<br />
              Speed: {plane.velocity} knots<br />
              Closure Time: {Math.round(closureTimes[index]) + " seconds" || 'Calculating...'}<br />
              Vector Closure Time: {Math.round(vectorClosureTimes[index]) + " seconds" || 'Calculating...'}
            </Popup>
          </Marker>
        )
      ))}
      {drones.map((drone, index) => (
        drone.latitude != null && drone.longitude != null && (
          <React.Fragment key={`drone-${index}`}>
            <Marker
              position={[drone.latitude, drone.longitude]}
              icon={createRocketIcon()}
            >
              <Popup>
                Latitude: {drone.latitude}<br />
                Longitude: {drone.longitude}<br />
                Radius: {drone.radius} meters<br />
                Velocity: {drone.speed} knots
              </Popup>
            </Marker>
            <Circle
              center={[drone.latitude, drone.longitude]}
              radius={drone.radius}
              pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.2 }}
            />
          </React.Fragment>
        )
      ))}
    </>
  );
};

export default function Home() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [planesAmount, setPlanesAmount] = useState<number>(PLANES_AMOUNT_DEFAULT);

  const [addCoordinatesDialogOpen, setAddCoordinatesDialogOpen] = useState<boolean>(false);
  const [planesAmountDialogOpen, setPlanesAmountDialogOpen] = useState<boolean>(false);

  const { mutate: fetchThreats } = useEvaluateThreatMutation({
    onSuccess: (data) => {
      threats.forEach((threat, index) => {
        threat.plane = data.closestPlanes[index];
        threat.closureTime = data.closureTimes[index];
        threat.vectorClosureTime = data.vectorClosureTimes[index];
        threat.minDistance = data.minDistances[index];
        threat.message = data.messages[index];
      });
      setThreats([...threats]);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onNavbarOptionSelected = (option: NavbarOptions) => {
    if (option === NavbarOptions.AddCoordinates) {
      setAddCoordinatesDialogOpen(true);
    } else if (option === NavbarOptions.ChangePlanesAmount) {
      setPlanesAmountDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setAddCoordinatesDialogOpen(false);
    setPlanesAmountDialogOpen(false);
  };

  const handlePlanesAmountDialogSubmit = (planesAmount: number) => {
    setPlanesAmount(planesAmount);
  };

  const handleAddCoordinatesDialogSubmit = (droneDeparture: DroneDeparture) => {
    setThreats([...threats, { drone: droneDeparture }]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchThreats({ dronesDeparture: threats.map(threat => threat.drone), planesAmount });
    }, 5000);

    return () => clearInterval(interval);
  }, [threats, planesAmount]);

  return (
    <Box sx={{ height: '100vh', width: '100vw' }}>
      <Navbar onNavbarOptionSelected={onNavbarOptionSelected} />
      
      <PlanesAmountDialog
        dialogOpen={planesAmountDialogOpen}
        handleDialogClose={handleDialogClose}
        handleDialogSubmit={handlePlanesAmountDialogSubmit}
      />

      <AddCoordinatesDialog
        dialogOpen={addCoordinatesDialogOpen}
        handleDialogClose={handleDialogClose}
        handleDialogSubmit={handleAddCoordinatesDialogSubmit}
      />

      <MapContainer 
        center={[0, 0]} 
        zoom={4}
        style={{ height: 'calc(100vh - 64px)', width: '100vw' }}
        maxZoom={20}
        minZoom={3}
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
        <PlaneAndDronesLauncherMarkers
          planes={threats.map(threat => threat.plane).filter((plane): plane is Plane => plane !== undefined && plane !== null)}
          drones={threats.map(threat => threat.drone)}
          closureTimes={threats.map(threat => threat.closureTime || 0)}
          vectorClosureTimes={threats.map(threat => threat.vectorClosureTime || 0)}
        />
      </MapContainer>
    </Box>
  );
}
