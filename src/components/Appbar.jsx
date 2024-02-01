import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function Appbar() {
  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleMenuItemClick = (menuItem) => {
    // Add functionality for each menu item click
    console.log(`Clicked on ${menuItem}`);
    handleMenuClose();
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleMenuOpen}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Drawing App
        </Typography>
        <Button color="inherit" onClick={() => handleMenuItemClick('Gallery')}>
          Gallery
        </Button>
        <Button color="inherit" onClick={() => handleMenuItemClick('Settings')}>
          Settings
        </Button>

        {/* Add more buttons or components as needed */}
      </Toolbar>

      {/* Menu component */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleMenuItemClick('Profile')}>Profile</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('Help')}>Help</MenuItem>
        {/* Add more menu items as needed */}
      </Menu>
    </AppBar>
  );
}

export default Appbar;
