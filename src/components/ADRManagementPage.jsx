import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import HeaderAppBar from './HeaderAppBar';
import MainMenu from './MainMenu';
import { Box, Toolbar, Typography, Chip, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { fetchADRRecords } from '../api/adr';

const statusColors = {
  Requested: 'warning',
  Submitted: 'info',
  'Under Review': 'primary',
};

const ADRManagementPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const loadRecords = () => {
    setLoading(true);
    fetchADRRecords()
      .then(res => {
        setRecords(res.data.records);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load ADR records');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadRecords();
  }, []);

  // Show snackbar and refresh if navigated from ADR submission
  useEffect(() => {
    if (location.state && location.state.adrSubmitted && location.state.claimId) {
      setSnackbar({ open: true, message: `ADR Documents for Claim ${location.state.claimId} submitted successfully.` });
      loadRecords();
      // Remove state so snackbar doesn't show again on back/refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const columns = [
    { field: 'claimId', headerName: 'Claim Number', width: 140, headerAlign: 'center', align: 'center', renderCell: (params) => <strong>{params.value}</strong> },
    { field: 'paId', headerName: 'Associated PA ID', width: 140, headerAlign: 'center', align: 'center', renderCell: (params) => params.value ? params.value : <span style={{ color: '#aaa' }}>N/A</span> },
    { field: 'utn', headerName: 'UTN', width: 160, headerAlign: 'center', align: 'center' },
    { field: 'documentSummary', headerName: 'Requested Docs', width: 200, headerAlign: 'center', align: 'center' },
    { field: 'dueDate', headerName: 'ADR Deadline', width: 140, headerAlign: 'center', align: 'center', renderCell: (params) => {
      const due = new Date(params.value);
      const now = new Date();
      const isDueSoon = (due - now) / (1000 * 60 * 60 * 24) <= 3;
      return <span style={{ color: isDueSoon ? 'red' : undefined, fontWeight: isDueSoon ? 700 : 400 }}>{params.value}</span>;
    } },
    { field: 'adrStatus', headerName: 'Current Status', width: 140, headerAlign: 'center', align: 'center', renderCell: (params) => <Chip label={params.value} color={statusColors[params.value] || 'default'} sx={{ fontWeight: 600 }} /> },
    { field: 'action', headerName: 'Actions', width: 180, headerAlign: 'center', align: 'center', sortable: false, filterable: false, renderCell: (params) =>
      params.row.adrStatus === 'Requested' ? (
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/adr/submit/${params.row.claimId}`)}
        >
          SUBMIT DOCUMENTS
        </Button>
      ) : null },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <HeaderAppBar />
      <MainMenu />
      <Box component="main" sx={{ flexGrow: 1, boxSizing: 'border-box', width: 'calc(100vw - 240px)', minWidth: 0, overflowX: 'auto', bgcolor: 'background.default', pl: '20px', pr: '20px', pt: 4, pb: 0, ml: '240px', marginLeft: 0 }}>
        <Toolbar sx={{ minHeight: 48 }} />
        <Typography variant="h5" gutterBottom>ADR Management Dashboard</Typography>
        <Box sx={{ height: 520, width: '100%' }}>
          <DataGrid
            rows={records}
            columns={columns}
            pageSize={25}
            rowsPerPageOptions={[25]}
            loading={loading}
            getRowId={row => row.claimId}
            disableSelectionOnClick
            autoHeight={false}
          />
        </Box>
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Box>
    </Box>
  );
};

export default ADRManagementPage;
