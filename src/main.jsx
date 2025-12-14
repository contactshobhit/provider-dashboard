import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from './AppRouter.jsx';
import './index.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1976D2' }, // Blue
    success: { main: '#4CAF50' }, // Green
    warning: { main: '#FFC107' }, // Orange/Amber
    error: { main: '#F44336' },   // Red
  },
});

async function enableMockingAndRender() {
  if (import.meta.env.MODE === 'development') {
    const { worker } = await import('./mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <AppRouter />
      </ThemeProvider>
    </StrictMode>
  );
}

enableMockingAndRender();
