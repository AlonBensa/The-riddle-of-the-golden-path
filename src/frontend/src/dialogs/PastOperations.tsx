import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, Divider, Typography, Box } from '@mui/material';
import { PastOperation } from '../api/types';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

interface PastOperationsDialogProps {
  dialogOpen: boolean;
  handleDialogClose: () => void;
  operations: PastOperation[];
}

const PastOperationsDialog = ({ dialogOpen, handleDialogClose, operations }: PastOperationsDialogProps) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const handleDateChange = (newDate: Dayjs | null, setter: (date: Dayjs | null) => void) => {
    setter(newDate);
  };

  const filteredOperations = operations.filter(operation => {
    const operationDate = dayjs(operation.date);
    if (startDate && endDate) {
      return operationDate.isBetween(startDate, endDate, null, '[]') || operationDate.isSame(startDate, 'day') || operationDate.isSame(endDate, 'day');
    } else if (startDate) {
      return operationDate.isAfter(startDate, 'day') || operationDate.isSame(startDate, 'day');
    } else if (endDate) {
      return operationDate.isBefore(endDate, 'day') || operationDate.isSame(endDate, 'day');
    }
    return true;
  });

  return (
    <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
      <DialogTitle>Past Operations</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box display="flex" justifyContent="space-between" mb={2} mt={1}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(date) => handleDateChange(date, setStartDate)}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(date) => handleDateChange(date, setEndDate)}
            />
          </Box>
        </LocalizationProvider>
        <List>
          {filteredOperations.map((operation, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={<Typography variant="h6">{`Operation ${index + 1}`}</Typography>}
                  secondary={
                    <>
                      <Box my={1}>
                        <Typography variant="subtitle1" color="textSecondary">Plane Details</Typography>
                        <Typography variant="body2">
                          <strong>ICAO24:</strong> {operation.plane.icao24} <br />
                          <strong>Callsign:</strong> {operation.plane.callsign || 'N/A'} <br />
                          <strong>Origin Country:</strong> {operation.plane.origin_country} <br />
                          <strong>Position Source:</strong> {operation.plane.position_source}
                        </Typography>
                      </Box>
                      <Box my={1}>
                        <Typography variant="subtitle1" color="textSecondary">Drone Departure Details</Typography>
                        <Typography variant="body2">
                          <strong>Latitude:</strong> {operation.droneDeparture.latitude} <br />
                          <strong>Longitude:</strong> {operation.droneDeparture.longitude} <br />
                          <strong>Radius:</strong> {operation.droneDeparture.radius} meters <br />
                          <strong>Speed:</strong> {operation.droneDeparture.speed} knots
                        </Typography>
                      </Box>
                    </>
                  }
                />
              </ListItem>
              {index < filteredOperations.length - 1 && <Divider variant="middle" />}
            </React.Fragment>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PastOperationsDialog;
