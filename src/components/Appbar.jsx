import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem } from '@mui/material';
import ShapeSelector from './shapeSelector'; // Corrected the import statement

function Appbar({ currentShape, setCurrentShape }) { // Pass currentShape and setCurrentShape as props
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
    <AppBar position="static" color="primary" sx={{ boxShadow: 'none', borderBottom: '1px solid #ccc' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          Drawing App
        </Typography>
        <div>
          <Button color="inherit" onClick={() => handleMenuItemClick('Gallery')}>
            Gallery
          </Button>
          <Button color="inherit" onClick={() => handleMenuItemClick('Settings')}>
            Settings
          </Button>
          {/* Include the ShapeSelector component with necessary props */}
          <ShapeSelector currentShape={currentShape} setCurrentShape={setCurrentShape} />
        </div>
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
