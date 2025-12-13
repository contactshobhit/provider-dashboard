
import React, { useEffect, useState, useCallback } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MainMenu from './MainMenu';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import SummaryCard from './SummaryCard';
import RecentActivityTable from './RecentActivityTable';
import WelcomeBanner from './WelcomeBanner';
import { fetchDashboardSummary, fetchRecentActivity } from '../api/dashboard';

const drawerWidth = 240;

const DashboardLayout = () => {
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState(null);

  const [activity, setActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState(null);

  // Simulate authentication check
  const isAuthenticated = Boolean(localStorage.getItem('sessionToken'));
  const providerName = localStorage.getItem('providerName') || 'Provider';

  const loadSummary = useCallback(async () => {
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const res = await fetchDashboardSummary();
      setSummary(res.data);
    } catch (e) {
      setSummaryError('Failed to load summary');
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  const loadActivity = useCallback(async () => {
    setActivityLoading(true);
    setActivityError(null);
    try {
      const res = await fetchRecentActivity();
      setActivity(res.data);
    } catch (e) {
      setActivityError('Failed to load recent activity');
    } finally {
      setActivityLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
    loadActivity();
  }, [loadSummary, loadActivity]);

  if (!isAuthenticated) {
    return <Container maxWidth="sm"><Box mt={8}><Typography variant="h5" color="error">You must be logged in to view the dashboard.</Typography></Box></Container>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar */}
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
          <IconButton color="inherit" edge="start" sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}
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
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      {/* Sidebar */}
      <MainMenu />
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, boxSizing: 'border-box', width: 'calc(100vw - 240px)', minWidth: 0, overflowX: 'auto', bgcolor: 'background.default', pl: '20px', pr: '20px', pt: 4, pb: 0, ml: `${drawerWidth}px`, marginLeft: 0 }}>
        <Toolbar sx={{ minHeight: 48 }} />
        <WelcomeBanner />
        <Typography variant="h4" sx={{ fontWeight: 700, mt: 2, mb: 2 }}>Provider Dashboard</Typography>
        <Grid container spacing={2}>
          <Grid columns={12} md={4}>
            <SummaryCard
              title="Pending PAs"
              count={summary?.pendingPAsCount}
              subtitle="Prior Auth requests pending review"
              loading={summaryLoading}
              error={summaryError}
              onRefresh={loadSummary}
              onClick={() => window.location.href = '/pa/search?status=pending'}
              cardSx={{
                bgcolor: '#FFF8E1',
                borderTop: '5px solid #FFC107',
              }}
              countColor="#FFA000"
            />
          </Grid>
          <Grid columns={12} md={4}>
            <SummaryCard
              title="Recent Determinations"
              count={summary?.recentDeterminationsCount}
              subtitle={`Approved: ${summary?.approvedIn7Days || 0} | Denied: ${summary?.deniedIn7Days || 0}`}
              loading={summaryLoading}
              error={summaryError}
              onRefresh={loadSummary}
              onClick={() => window.location.href = '/pa/search?filter=determined7days'}
              cardSx={{
                bgcolor: '#F5F5F5',
              }}
              countColor="#1976D2"
            />
          </Grid>
          <Grid columns={12} md={4}>
            <SummaryCard
              title="Open Support Tickets"
              count={summary?.openTicketsCount}
              subtitle="Tickets awaiting provider or support response"
              loading={summaryLoading}
              error={summaryError}
              onRefresh={loadSummary}
              onClick={() => window.location.href = '/support/tickets'}
              cardSx={{
                bgcolor: '#FFEBEE',
                borderTop: '5px solid #F44336',
              }}
              countColor="#F44336"
            />
          </Grid>
        </Grid>
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>Recent Activity</Typography>
          <RecentActivityTable data={activity} loading={activityLoading} error={activityError} />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
