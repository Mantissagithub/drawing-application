// App.jsx
import React from 'react';
import { CssBaseline, Paper } from '@mui/material';
import AppAppBar from './components/Appbar';
import Canvas from './components/Canvas';

function App() {
  return (
    <div style={fullPageContainerStyle}>
      <CssBaseline />
      <AppAppBar />
      <Paper elevation={3} sx={innerContainerStyle}>
        <Canvas width={700} height={500} />
        {/* Add more components as needed */}
      </Paper>
    </div>
  );
}

const fullPageContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '#f0f0f0', // Light gray background color
};

const innerContainerStyle = {
  padding: '20px',
  marginTop: '2rem',
  textAlign: 'center',
  backgroundColor: '#ffffff', // White background color
};

export default App;
