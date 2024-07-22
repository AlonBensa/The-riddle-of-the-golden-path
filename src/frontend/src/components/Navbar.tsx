import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Typography, Button, Box } from '@mui/material';
import { NavbarOptions } from '../types';

interface NavbarProps {
  onNavbarOptionSelected: (option: NavbarOptions) => void;
}

export default function Navbar(props: NavbarProps) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            MyApp
          </Typography>
          <Button 
            color="inherit"
            sx={{mr: 6}}
            onClick={() => props.onNavbarOptionSelected(NavbarOptions.ChangePlanesAmount)}
          >
            Change planes amount
          </Button>
          <Button
            color="inherit"
            sx={{mr: 6}}
            onClick={() => props.onNavbarOptionSelected(NavbarOptions.AddCoordinates)}
          >
            Add coordinates
          </Button>
          <Button
            color="inherit"
            sx={{mr: 2}}
            onClick={() => props.onNavbarOptionSelected(NavbarOptions.RetrievePastOperations)}
          >
            Retrieve Past Operations
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
