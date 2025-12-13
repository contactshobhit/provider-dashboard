
import React, { useEffect, useState, useCallback } from 'react';
import HeaderAppBar from './HeaderAppBar';
import Toolbar from '@mui/material/Toolbar';
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
      <HeaderAppBar />
      {/* Sidebar */}
      <MainMenu />
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, boxSizing: 'border-box', width: 'calc(100vw - 240px)', minWidth: 0, overflowX: 'auto', bgcolor: 'background.default', pl: '20px', pr: '20px', pt: 4, pb: 0, ml: `${drawerWidth}px`, marginLeft: 0, marginTop: '64px' }}>
        <Toolbar sx={{ minHeight: 16, p: 0 }} />
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
