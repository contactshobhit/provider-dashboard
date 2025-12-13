import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Box from '@mui/material/Box';

const providerName = localStorage.getItem('providerName') || 'Dr. Smith';

const HeaderAppBar = () => (
  <AppBar
    position="fixed"
    color="primary"
    sx={{
      zIndex: (theme) => theme.zIndex.drawer + 1,
      backgroundColor: (theme) => theme.palette.primary.dark,
      boxShadow: 3,
    }}
  >
    <Toolbar sx={{ minHeight: 56, px: 2, alignItems: 'center' }}>
      <Typography
        variant="h5"
        noWrap
        component="div"
        sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1, cursor: 'pointer', userSelect: 'none' }}
        onClick={() => window.location.href = '/dashboard'}
        aria-label="Go to Dashboard"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') window.location.href = '/dashboard'; }}
      >
        Provider Portal
      </Typography>
      <Typography variant="body1" sx={{ mr: 2 }}>{providerName}</Typography>
      <Button
        color="inherit"
        startIcon={<ExitToAppIcon />}
        onClick={() => { localStorage.removeItem('sessionToken'); window.location.reload(); }}
        sx={{ fontWeight: 600 }}
      >
        SIGN OUT
      </Button>
    </Toolbar>
  </AppBar>
);

export default HeaderAppBar;
