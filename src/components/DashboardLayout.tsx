import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from './layout/PageLayout';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import SummaryCard from './SummaryCard';
import RecentActivityTable from './RecentActivityTable';
import WelcomeBanner from './WelcomeBanner';
import { fetchDashboardSummary, fetchRecentActivity } from '../api/dashboard';
import { DashboardSummary, RecentActivity } from '../types';

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState<boolean>(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const [activity, setActivity] = useState<RecentActivity[]>([]);
  const [activityLoading, setActivityLoading] = useState<boolean>(true);
  const [activityError, setActivityError] = useState<string | null>(null);

  // Simulate authentication check
  const isAuthenticated = Boolean(localStorage.getItem('sessionToken'));

  const loadSummary = useCallback(async () => {
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const res = await fetchDashboardSummary();
      setSummary(res.data);
    } catch {
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
    } catch {
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
    return (
      <Container maxWidth="sm">
        <Box mt={8}>
          <Typography variant="h5" color="error">
            You must be logged in to view the dashboard.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <PageLayout sx={{ pt: 1.5, marginTop: '64px' }}>
      <WelcomeBanner />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title="Pending PAs"
            count={summary?.pendingPAsCount}
            subtitle="Prior Auth requests pending review"
            loading={summaryLoading}
            error={summaryError}
            onRefresh={loadSummary}
            onClick={() => navigate('/pa/search?status=pending')}
            cardSx={{ bgcolor: '#FFF8E1', borderTop: '5px solid #FFC107' }}
            countColor="#FFA000"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title="Recent Determinations"
            count={summary?.recentDeterminationsCount}
            subtitle={`Approved: ${summary?.approvedIn7Days || 0} | Denied: ${summary?.deniedIn7Days || 0}`}
            loading={summaryLoading}
            error={summaryError}
            onRefresh={loadSummary}
            onClick={() => navigate('/pa/search?filter=determined7days')}
            cardSx={{ bgcolor: '#F5F5F5', borderTop: '5px solid #1976D2' }}
            countColor="#1976D2"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title="Open Support Tickets"
            count={summary?.openTicketsCount}
            subtitle="Tickets awaiting provider or support response"
            loading={summaryLoading}
            error={summaryError}
            onRefresh={loadSummary}
            onClick={() => navigate('/support/tickets')}
            cardSx={{ bgcolor: '#FFEBEE', borderTop: '5px solid #F44336' }}
            countColor="#F44336"
          />
        </Grid>
      </Grid>
      <Box mt={2}>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <RecentActivityTable
          data={activity as unknown as { id: string; type: string; patientName?: string; lastUpdated: string; currentStatus: string; itemType?: string; linkedId?: string; topic?: string }[]}
          loading={activityLoading}
          error={activityError}
        />
      </Box>
    </PageLayout>
  );
};

export default DashboardLayout;
