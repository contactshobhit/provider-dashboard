import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
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
          onClick={() => { navigate('/dashboard'); }}
          aria-label="Go to Dashboard"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              navigate('/dashboard');
            }
          }}
        >
          Provider Portal
        </Typography>
        {userName && <Typography variant="body1" sx={{ mr: 2 }}>{userName}</Typography>}
        <Button
          color="inherit"
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
