import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Divider, Chip, Link, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import HeaderAppBar from './HeaderAppBar';
import Button from '@mui/material/Button';
import MainMenu from './MainMenu';
import { PADetail, PAStatus } from '../types';

const fetchPADetail = async (paId: string): Promise<PADetail> => {
  const response = await fetch(`/api/pa/details/${paId}`);
  if (!response.ok) throw new Error('Failed to fetch PA details');
  return response.json();
};

const getStatusColor = (status: PAStatus): 'success' | 'error' | 'warning' => {
  if (status === 'Approved') return 'success';
  if (status === 'Denied') return 'error';
  return 'warning';
};

const PADetailView: React.FC = () => {
  const { paId } = useParams<{ paId: string }>();
  const [data, setData] = useState<PADetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!paId) return;
    fetchPADetail(paId)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => {
        setData(null);
        setLoading(false);
      });
  }, [paId]);

  if (loading) {
    return (
      <>
        <HeaderAppBar />
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <HeaderAppBar />
        <Box sx={{ p: 4 }}>No data found.</Box>
      </>
    );
  }

  return (
    <>
      <HeaderAppBar />
      <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f7f7fa' }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: 240,
            flexShrink: 0,
            bgcolor: 'background.paper',
            borderRight: 1,
            borderColor: 'divider',
            minHeight: '100vh',
          }}
        >
          <MainMenu />
        </Box>
        {/* Main Content */}
        <Box sx={{ flex: 1, maxWidth: 800, mx: 'auto', mt: 4 }}>
          <Button variant="outlined" onClick={() => window.history.back()} sx={{ mb: 2, fontWeight: 600 }}>
            ← Back to PA Status
          </Button>

          {/* Conditional Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            {(data.currentStatus === 'Denied' || data.currentStatus === 'Partial Denial') && (
              <Button variant="contained" color="primary" href="/pa/p2p">
                Request Peer-to-Peer
              </Button>
            )}
            {data.currentStatus === 'Pending' && data.missingDocuments && (
              <Button variant="contained" color="info" href={`/pa/resubmit/${data.paId}`}>
                Upload More Documents
              </Button>
            )}
            {data.currentStatus === 'Denied' && data.p2pExpired && (
              <Button variant="contained" color="secondary" href="/pa/submit">
                Submit Resubmission
              </Button>
            )}
            {data.currentStatus === 'Draft' && (
              <Button variant="contained" color="primary" href={`/pa/new?draftId=${data.paId}`}>
                Continue Draft
              </Button>
            )}
          </Box>

          <Paper sx={{ p: 4 }}>
            {/* PA Overview */}
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              PA Overview
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <strong>PA ID:</strong> {data.paId}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <strong>UTN:</strong> {data.utn}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <strong>Final Status:</strong>{' '}
                <Chip label={data.currentStatus} color={getStatusColor(data.currentStatus)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <strong>Date of Service:</strong> {data.serviceDetails?.dateOfService || '-'}
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />

            {/* Patient & Provider Details */}
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Patient & Provider Details
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <strong>Requesting Provider:</strong> {data.requestingProvider}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <strong>Provider Contact:</strong> {data.patientInfo?.phone || '-'}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <strong>Patient Name:</strong> {data.patientInfo?.name}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <strong>Patient DOB:</strong> {data.patientInfo?.dob}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <strong>Patient Gender:</strong> {data.patientInfo?.gender}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <strong>Member ID:</strong> {data.patientInfo?.memberId}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <strong>Patient Address:</strong> {data.patientInfo?.address}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <strong>Patient Email:</strong> {data.patientInfo?.email}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <strong>Service Location:</strong> {data.serviceDetails?.location}
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />

            {/* Clinical Justification */}
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Clinical Justification
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <strong>Procedure Codes:</strong> {data.serviceDetails?.codes?.join(', ') || '-'}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <strong>Diagnosis Codes:</strong>{' '}
                {data.patientInfo?.diagnosisCodes?.join(', ') ||
                  data.serviceDetails?.diagnosisCodes?.join(', ') ||
                  '-'}
              </Grid>
              <Grid size={12}>
                <strong>Justification:</strong> <br />
                {data.clinicalJustification || '-'}
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />

            {/* Documentation / Audit Section */}
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Documentation
            </Typography>
            <ul>
              {data.submittedFiles?.map((doc) => (
                <li key={doc.fileName}>
                  <Link href={doc.fileUrl} target="_blank" rel="noopener" underline="hover">
                    {doc.fileName}
                  </Link>
                  {doc.uploadDate && (
                    <span style={{ marginLeft: 8, color: '#888', fontSize: 13 }}>
                      (Uploaded: {doc.uploadDate})
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <Divider sx={{ my: 2 }} />

            {/* Event History */}
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              PA History
            </Typography>
            <ul>
              {data.paHistory?.map((event, idx) => (
                <li key={idx} style={{ marginBottom: 8 }}>
                  <div>
                    <strong>{event.eventDate}:</strong> {event.eventDescription}
                  </div>
                  {event.internalNotes && (
                    <div style={{ color: '#888', fontSize: 13 }}>Notes: {event.internalNotes}</div>
                  )}
                  <div>
                    Status: <strong>{event.statusChange}</strong>
                  </div>
                </li>
              ))}
            </ul>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default PADetailView;
