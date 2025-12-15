import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Divider, Chip, Link, CircularProgress, Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid';
import HeaderAppBar from './HeaderAppBar';
import Button from '@mui/material/Button';
import MainMenu from './MainMenu';
import { PADetail, P2PCall } from '../types';
import { fetchPADetail } from '../api/pa';
import { getStatusChipColor, getStatusStyles } from '../utils/statusStyles';
import PhoneIcon from '@mui/icons-material/Phone';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { formatDateUS } from '../utils/dateFormat';

// P2P Activity Card Component
const P2PActivityCard: React.FC<{ p2pCall: P2PCall; index: number }> = ({ p2pCall, index }) => {
  const statusStyles = getStatusStyles(p2pCall.status);

  const getStatusIcon = () => {
    switch (p2pCall.status) {
      case 'Requested':
        return <HourglassEmptyIcon sx={{ fontSize: 20 }} />;
      case 'Scheduled':
        return <EventIcon sx={{ fontSize: 20 }} />;
      case 'Completed':
        return <CheckCircleIcon sx={{ fontSize: 20 }} />;
      default:
        return <PhoneIcon sx={{ fontSize: 20 }} />;
    }
  };

  return (
    <Card sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            P2P Call #{index + 1}
          </Typography>
          <Chip
            icon={getStatusIcon()}
            label={p2pCall.status}
            size="small"
            sx={{
              bgcolor: statusStyles.bgcolor,
              color: statusStyles.color,
              fontWeight: 600,
              '& .MuiChip-icon': { color: statusStyles.color },
            }}
          />
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">Requested Date</Typography>
            <Typography variant="body1">{formatDateUS(p2pCall.requestedDate)}</Typography>
          </Grid>

          {p2pCall.scheduledDate && (
            <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">Scheduled Date & Time</Typography>
                <Typography variant="body1">
                  {formatDateUS(p2pCall.scheduledDate)} at {p2pCall.scheduledTime}
                </Typography>
              </Grid>
              {p2pCall.contactNumber && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">Contact Number</Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PhoneIcon sx={{ fontSize: 16 }} /> {p2pCall.contactNumber}
                  </Typography>
                </Grid>
              )}
              {p2pCall.medicalDirectorName && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">Medical Director</Typography>
                  <Typography variant="body1">{p2pCall.medicalDirectorName}</Typography>
                </Grid>
              )}
            </>
          )}

          {p2pCall.status === 'Completed' && (
            <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">Completed Date</Typography>
                <Typography variant="body1">{formatDateUS(p2pCall.completedDate || '')}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">Outcome</Typography>
                <Chip
                  label={p2pCall.outcome}
                  size="small"
                  color={p2pCall.outcome === 'Affirmed' ? 'success' : 'error'}
                  sx={{ fontWeight: 600 }}
                />
              </Grid>
              {p2pCall.notes && (
                <Grid size={12}>
                  <Typography variant="body2" color="text.secondary">Notes</Typography>
                  <Typography variant="body1">{p2pCall.notes}</Typography>
                </Grid>
              )}
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

const PADetailView: React.FC = () => {
  const { paId } = useParams<{ paId: string }>();
  const navigate = useNavigate();
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
          {(() => {
            const canRequestP2P = (data.currentStatus === 'Non-Affirmed' || data.currentStatus === 'Partial Affirmation');
            const hasActiveP2P = data.p2pCalls?.some(p => p.status === 'Requested' || p.status === 'Scheduled');
            const hasCompletedP2P = data.p2pCalls?.some(p => p.status === 'Completed');

            return (
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                {canRequestP2P && !hasActiveP2P && (
                  <Button variant="contained" color="primary" onClick={() => navigate(`/pa/p2p/${data.paId}`)}>
                    {hasCompletedP2P ? 'Request Another P2P' : 'Request Peer-to-Peer'}
                  </Button>
                )}
                {(data.currentStatus === 'Under Review' || data.currentStatus === 'Submitted') && data.missingDocuments && (
                  <Button variant="contained" color="info" onClick={() => navigate(`/pa/upload/${data.paId}`)}>
                    Upload More Documents
                  </Button>
                )}
                {(data.currentStatus === 'Non-Affirmed' || data.currentStatus === 'Partial Affirmation') && (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      const params = new URLSearchParams();
                      params.set('paId', data.paId);
                      if (data.utn) params.set('utn', data.utn);
                      navigate(`/pa/new?${params.toString()}`);
                    }}
                  >
                    Submit Resubmission
                  </Button>
                )}
                {data.currentStatus === 'Draft' && (
                  <Button variant="contained" color="primary" onClick={() => navigate(`/pa/new?draftId=${data.paId}`)}>
                    Continue Draft
                  </Button>
                )}
              </Box>
            );
          })()}

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
                <Chip label={data.currentStatus} color={getStatusChipColor(data.currentStatus)} />
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

            {/* P2P Activity Section */}
            {(data.currentStatus === 'Non-Affirmed' || data.currentStatus === 'Partial Affirmation' || data.currentStatus === 'Affirmed') &&
              (data.p2pCalls && data.p2pCalls.length > 0 ? (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon /> P2P Activity
                  </Typography>
                  {data.p2pCalls.map((p2pCall, idx) => (
                    <P2PActivityCard key={p2pCall.id} p2pCall={p2pCall} index={idx} />
                  ))}
                  <Divider sx={{ my: 2 }} />
                </>
              ) : (data.currentStatus === 'Non-Affirmed' || data.currentStatus === 'Partial Affirmation') && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon /> P2P Activity
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    No P2P calls have been requested for this PA. You can request a Peer-to-Peer review using the button above.
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                </>
              ))
            }

            {/* Resubmission Link */}
            {data.parentPaId && (
              <>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Resubmission Information
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  This PA is a resubmission of{' '}
                  <Link
                    component="button"
                    onClick={() => navigate(`/pa/details/${data.parentPaId}`)}
                    sx={{ fontWeight: 600, cursor: 'pointer' }}
                  >
                    {data.parentPaId}
                  </Link>
                </Typography>
                <Divider sx={{ my: 2 }} />
              </>
            )}

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
