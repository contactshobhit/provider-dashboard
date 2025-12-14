import React, { useEffect, useState } from 'react';
import { Typography, Paper, CircularProgress } from '@mui/material';
import { fetchUserProfile } from '../api/user';
import { UserProfile } from '../types';

const WelcomeBanner: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile()
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load user profile');
        setLoading(false);
      });
  }, []);

  const now = new Date();
  const dateString = now.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeString = now.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Paper elevation={2} sx={{ p: 4, mb: 3, bgcolor: '#E3F2FD', borderRadius: 2 }}>
      {loading ? (
        <CircularProgress size={28} />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : profile ? (
        <>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Welcome back, {profile.title} {profile.lastName}!
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary' }}>
            Here is your summary of active Prior Authorization requests and support activities.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1.5, color: 'text.disabled' }}>
            {dateString} &nbsp;|&nbsp; {timeString}
          </Typography>
        </>
      ) : null}
    </Paper>
  );
};

export default WelcomeBanner;
