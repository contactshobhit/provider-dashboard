
import React, { useEffect, useState, useCallback } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import MainMenu from './MainMenu';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import SummaryCard from './SummaryCard';
import RecentActivityTable from './RecentActivityTable';
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
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Provider Portal
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>{providerName}</Typography>
          <Button color="inherit" onClick={() => { localStorage.removeItem('sessionToken'); window.location.reload(); }}>Log Out</Button>
        </Toolbar>
      </AppBar>
      {/* Sidebar */}
      <MainMenu />
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, ml: `${drawerWidth}px` }}>
        <Toolbar />
        <Typography variant="h4" gutterBottom>Provider Dashboard</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <SummaryCard
              title="Pending PAs"
              count={summary?.pendingPAsCount}
              subtitle="Prior Auth requests pending review"
              linkPath="/prior-auth?status=pending"
              loading={summaryLoading}
              error={summaryError}
              onRefresh={loadSummary}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <SummaryCard
              title="Recent Determinations"
              count={summary?.recentDeterminationsCount}
              subtitle={`Approved: ${summary?.approvedIn7Days || 0} | Denied: ${summary?.deniedIn7Days || 0}`}
              linkPath="/prior-auth?filter=determined7days"
              loading={summaryLoading}
              error={summaryError}
              onRefresh={loadSummary}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <SummaryCard
              title="Open Support Tickets"
              count={summary?.openTicketsCount}
              subtitle="Tickets awaiting provider or support response"
              linkPath="/ticketing"
              loading={summaryLoading}
              error={summaryError}
              onRefresh={loadSummary}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <SummaryCard
              title="Recent P2P Requests"
              count={summary?.recentP2PRequestsCount}
              subtitle="Peer-to-Peer requests in last 30 days"
              linkPath="/peer-to-peer"
              loading={summaryLoading}
              error={summaryError}
              onRefresh={loadSummary}
              actionLabel="Submit New PA"
              onAction={() => window.location.href = '/pa/new'}
            />
          </Grid>
        </Grid>
        <Box mt={6}>
          <Typography variant="h6" gutterBottom>Recent Activity</Typography>
          <RecentActivityTable data={activity} loading={activityLoading} error={activityError} />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
