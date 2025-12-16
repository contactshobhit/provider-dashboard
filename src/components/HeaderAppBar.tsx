import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { fetchUserProfile } from '../api/user';

const HeaderAppBar: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    fetchUserProfile()
      .then((res) => {
        const { firstName, lastName } = res.data;
        setUserName(firstName || lastName || '');
      })
      .catch(() => {
        setUserName('');
      });
  }, []);

  return (
    <AppBar
      position="fixed"
      color="primary"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#fff',
        boxShadow: 3,
      }}
    >
      <Toolbar sx={{ minHeight: 56, px: 2, alignItems: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            cursor: 'pointer',
            userSelect: 'none',
          }}
          onClick={() => { navigate('/dashboard'); }}
          aria-label="Go to Dashboard"
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              navigate('/dashboard');
            }
          }}
        >
          <img
            src="/images/genzeon-logo.svg"
            alt="Genzeon"
            style={{ height: 32, marginRight: 16 }}
          />
          <Divider orientation="vertical" flexItem sx={{ mx: 2, borderColor: '#e0e0e0' }} />
          <img
            src="/images/hip-one-logo.svg"
            alt="HIP One"
            style={{ height: 32 }}
          />
        </Box>
        {userName && <Typography variant="body1" sx={{ mr: 2, color: 'text.primary' }}>{userName}</Typography>}
        <Button
          color="primary"
          startIcon={<ExitToAppIcon />}
          onClick={() => {
            localStorage.removeItem('sessionToken');
            window.location.reload();
          }}
          sx={{ fontWeight: 600 }}
        >
          SIGN OUT
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderAppBar;
