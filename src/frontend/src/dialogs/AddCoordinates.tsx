import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';

interface AddCoordinatesProps {
    dialogOpen: boolean;
    formData: { latitude: number, longitude: number, radius: number, speed: number };
    setFormData: (data: { latitude: number, longitude: number, radius: number, speed: number }) => void;
    handleDialogClose: () => void;
    handleDialogSubmit: () => void;
}

export default function AddCoordinatesDialog(props: AddCoordinatesProps) {
  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    const { latitude, longitude, radius, speed } = props.formData;
    if (latitude === undefined || longitude === undefined || radius === undefined || speed === undefined) {
      setError('Please fill in all fields.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      props.handleDialogSubmit();
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
                value={props.formData.latitude !== undefined ? props.formData.latitude : ''}
                onChange={(e) => props.setFormData({ ...props.formData, latitude: parseFloat(e.target.value) })}
                sx={{ mb: 2, mt: 2 }}
            />
            <TextField
                label="Longitude"
                type="number"
                fullWidth
                variant="outlined"
                value={props.formData.longitude !== undefined ? props.formData.longitude : ''}
                onChange={(e) => props.setFormData({ ...props.formData, longitude: parseFloat(e.target.value) })}
                sx={{ mb: 2 }}
            />
            <TextField
                label="Radius"
                type="number"
                fullWidth
                variant="outlined"
                value={props.formData.radius !== undefined ? props.formData.radius : ''}
                onChange={(e) => props.setFormData({ ...props.formData, radius: parseFloat(e.target.value) })}
                sx={{ mb: 2 }}
            />
            <TextField
                label="Speed"
                type="number"
                fullWidth
                variant="outlined"
                value={props.formData.speed !== undefined ? props.formData.speed : ''}
                onChange={(e) => props.setFormData({ ...props.formData, speed: parseFloat(e.target.value) })}
                sx={{ mb: 2 }}
            />
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
        </DialogContent>
        <DialogActions>
            <Button onClick={props.handleDialogClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
    </Dialog>
  );
}
