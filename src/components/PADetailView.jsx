
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Divider, Grid, Chip, Link, CircularProgress } from '@mui/material';
import HeaderAppBar from './HeaderAppBar';
import Button from '@mui/material/Button';
import MainMenu from './MainMenu';

const fetchPADetail = async (paId) => {
  // Simulate API call to /api/pa/details/[PA-ID]
  const response = await fetch(`/api/pa/details/${paId}`);
  if (!response.ok) throw new Error('Failed to fetch PA details');
  return response.json();
};

const PADetailView = () => {
  const { paId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setLoading(true);
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


  if (loading) return (
    <>
      <HeaderAppBar />
      <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>
    </>
  );
  if (!data) return (
    <>
      <HeaderAppBar />
      <Box sx={{ p: 4 }}>No data found.</Box>
    </>
  );

  // Sectioned display for new PADetailData structure
  return (
    <>
      <HeaderAppBar />
      <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f7f7fa' }}>
        {/* Sidebar */}
        <Box sx={{ width: 240, flexShrink: 0, bgcolor: 'background.paper', borderRight: 1, borderColor: 'divider', minHeight: '100vh' }}>
          <MainMenu />
        </Box>
        {/* Main Content */}
        <Box sx={{ flex: 1, maxWidth: 800, mx: 'auto', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => window.history.back()}
            sx={{ mb: 2, fontWeight: 600 }}
          >
            ← Back to PA Status
          </Button>

          {/* Conditional Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            {/* Denied or Partial Denial: Request Peer-to-Peer */}
            {(data.currentStatus === 'Denied' || data.currentStatus === 'Partial Denial') && (
              <Button variant="contained" color="primary" href="/pa/p2p">
                Request Peer-to-Peer
              </Button>
            )}
            {/* Pending (payer requested more info): Upload More Documents */}
            {data.currentStatus === 'Pending' && data.missingDocuments && (
              <Button variant="contained" color="info" href={`/pa/resubmit/${data.paId}`}>
                Upload More Documents
              </Button>
            )}
            {/* Denied (after P2P window expires): Submit Resubmission */}
            {data.currentStatus === 'Denied' && data.p2pExpired && (
              <Button variant="contained" color="secondary" href="/pa/submit">
                Submit Resubmission
              </Button>
            )}
            {/* Draft: Continue Draft */}
            {data.currentStatus === 'Draft' && (
              <Button variant="contained" color="primary" href={`/pa/new?draftId=${data.paId}`}>
                Continue Draft
              </Button>
            )}
          </Box>

          <Paper sx={{ p: 4 }}>
        {/* PA Overview */}
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>PA Overview</Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}><strong>PA ID:</strong> {data.paId}</Grid>
          <Grid item xs={12} sm={6}><strong>UTN:</strong> {data.utn}</Grid>
          <Grid item xs={12} sm={6}><strong>Final Status:</strong> <Chip label={data.currentStatus} color={data.currentStatus === 'Approved' ? 'success' : data.currentStatus === 'Denied' ? 'error' : 'warning'} /></Grid>
          <Grid item xs={12} sm={6}><strong>Date of Service:</strong> {data.serviceDetails?.dateOfService || '-'}</Grid>
          <Grid item xs={12} sm={6}><strong>Determination Date:</strong> {data.determinationDate || '-'}</Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        {/* Patient & Provider Details */}
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Patient & Provider Details</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><strong>Requesting Provider:</strong> {data.requestingProvider}</Grid>
          <Grid item xs={12} sm={6}><strong>Provider Contact:</strong> {data.patientInfo?.phone || '-'}</Grid>
          <Grid item xs={12} sm={6}><strong>Patient Name:</strong> {data.patientInfo?.name}</Grid>
          <Grid item xs={12} sm={6}><strong>Patient DOB:</strong> {data.patientInfo?.dob}</Grid>
          <Grid item xs={12} sm={6}><strong>Patient Gender:</strong> {data.patientInfo?.gender}</Grid>
          <Grid item xs={12} sm={6}><strong>Member ID:</strong> {data.patientInfo?.memberId}</Grid>
          <Grid item xs={12} sm={6}><strong>Patient Address:</strong> {data.patientInfo?.address}</Grid>
          <Grid item xs={12} sm={6}><strong>Patient Email:</strong> {data.patientInfo?.email}</Grid>
          <Grid item xs={12} sm={6}><strong>Service Location:</strong> {data.serviceDetails?.location}</Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        {/* Clinical Justification */}
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Clinical Justification</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><strong>Procedure Codes:</strong> {data.serviceDetails?.codes?.join(', ') || '-'}</Grid>
          <Grid item xs={12} sm={6}><strong>Diagnosis Codes:</strong> {data.patientInfo?.diagnosisCodes?.join(', ') || data.serviceDetails?.diagnosisCodes?.join(', ') || '-'}</Grid>
          <Grid item xs={12}><strong>Justification:</strong> <br />{data.clinicalJustification || '-'}</Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        {/* Documentation / Audit Section */}
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Documentation</Typography>
        <ul>
          {data.submittedFiles?.map((doc) => (
            <li key={doc.fileName}>
              <Link href={doc.fileUrl} target="_blank" rel="noopener" underline="hover">{doc.fileName}</Link>
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
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>PA History</Typography>
        <ul>
          {data.paHistory && data.paHistory.map((event, idx) => (
            <li key={idx} style={{ marginBottom: 8 }}>
              <div><strong>{event.eventDate}:</strong> {event.eventDescription}</div>
              {event.internalNotes && <div style={{ color: '#888', fontSize: 13 }}>Notes: {event.internalNotes}</div>}
              <div>Status: <strong>{event.statusChange}</strong></div>
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
