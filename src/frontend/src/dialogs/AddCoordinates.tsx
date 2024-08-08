import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { DroneDeparture } from '../api/types';

interface AddCoordinatesProps {
    dialogOpen: boolean;
    handleDialogClose: () => void;
    handleDialogSubmit: (droneDeparture: DroneDeparture) => void;
}

export default function AddCoordinatesDialog(props: AddCoordinatesProps) {
  const [error, setError] = useState<string | null>(null);
  const [droneDeparture, setDroneDeparture] = useState<Partial<DroneDeparture> | null>(null);

  const validateForm = () => {
    if (!droneDeparture || droneDeparture.latitude === undefined || droneDeparture.latitude === null ||
      droneDeparture.longitude === undefined || droneDeparture.longitude === null || droneDeparture.radius === undefined ||
      droneDeparture.radius === null || droneDeparture.speed === undefined || droneDeparture.speed === null
    ) {
      setError('Please fill in all fields.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = (droneDeparture: DroneDeparture) => {
    if (validateForm()) {
      setDroneDeparture(null);
      props.handleDialogSubmit(droneDeparture);
      props.handleDialogClose();
    }
  };

  return (
    <Dialog open={props.dialogOpen} onClose={props.handleDialogClose}>
        <DialogTitle>Add Coordinates</DialogTitle>
        <DialogContent>
          <TextField
            label="Latitude"
            type="number"
            fullWidth
            variant="outlined"
            value={droneDeparture?.latitude ?? ''}
            onChange={(e) => setDroneDeparture(droneDeparture ? { ...droneDeparture, latitude: parseFloat(e.target.value) } : { latitude: parseFloat(e.target.value) })}
            sx={{ mb: 2, mt: 2 }}
          />
          <TextField
            label="Longitude"
            type="number"
            fullWidth
            variant="outlined"
            value={droneDeparture?.longitude ?? ''}
            onChange={(e) => setDroneDeparture(droneDeparture ? { ...droneDeparture, longitude: parseFloat(e.target.value) } : { longitude: parseFloat(e.target.value) })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Radius"
            type="number"
            fullWidth
            variant="outlined"
            value={droneDeparture?.radius ?? ''}
            onChange={(e) => setDroneDeparture(droneDeparture ? { ...droneDeparture, radius: parseFloat(e.target.value) } : { radius: parseFloat(e.target.value) })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Speed"
            type="number"
            fullWidth
            variant="outlined"
            value={droneDeparture?.speed ?? ''}
            onChange={(e) => setDroneDeparture(droneDeparture ? { ...droneDeparture, speed: parseFloat(e.target.value) } : { speed: parseFloat(e.target.value) })}
            sx={{ mb: 2 }}
          />
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
            <Button onClick={() => {
              props.handleDialogClose();
              setDroneDeparture(null);
            }}>Cancel</Button>
            <Button onClick={() => handleSubmit(droneDeparture as DroneDeparture)}>Submit</Button>
        </DialogActions>
    </Dialog>
  );
}
