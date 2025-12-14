import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import HeaderAppBar from './HeaderAppBar';
import MainMenu from './MainMenu';
import { Box, Toolbar, Typography, Chip, Button, TextField } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { fetchADRRecords } from '../api/adr';
import { ADRRecord, ADRStatus } from '../types';

const statusColors: Record<ADRStatus, 'warning' | 'info' | 'primary'> = {
  Requested: 'warning',
  Submitted: 'info',
  'Under Review': 'primary',
};

interface LocationState {
  adrSubmitted?: boolean;
  claimId?: string;
}

const ADRManagementPage: React.FC = () => {
  const [records, setRecords] = useState<ADRRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const highlightTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const claimId = params.get('claimId');
    if (claimId) {
      setSearch(claimId);
      setHighlightedId(claimId);
      if (highlightTimeout.current) clearTimeout(highlightTimeout.current);
      highlightTimeout.current = setTimeout(() => setHighlightedId(null), 4000);
    }
    return () => {
      if (highlightTimeout.current) clearTimeout(highlightTimeout.current);
    };
  }, [location.search]);

  const clearHighlight = (): void => {
    if (highlightedId) setHighlightedId(null);
    if (highlightTimeout.current) clearTimeout(highlightTimeout.current);
  };

  const loadRecords = (): void => {
    setLoading(true);
    fetchADRRecords()
      .then((res) => {
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

  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.adrSubmitted && state?.claimId) {
      setSnackbar({ open: true, message: `ADR Documents for Claim ${state.claimId} submitted successfully.` });
      loadRecords();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const columns: GridColDef[] = [
    {
      field: 'claimId',
      headerName: 'Claim Number',
      width: 140,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => <strong>{params.value}</strong>,
    },
    {
      field: 'paId',
      headerName: 'Associated PA ID',
      width: 140,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) =>
        params.value ? params.value : <span style={{ color: '#aaa' }}>N/A</span>,
    },
    { field: 'utn', headerName: 'UTN', width: 160, headerAlign: 'center', align: 'center' },
    { field: 'documentSummary', headerName: 'Requested Docs', width: 200, headerAlign: 'center', align: 'center' },
    {
      field: 'dueDate',
      headerName: 'ADR Deadline',
      width: 140,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => {
        const due = new Date(params.value as string);
        const now = new Date();
        const isDueSoon = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) <= 3;
        return (
          <span style={{ color: isDueSoon ? 'red' : undefined, fontWeight: isDueSoon ? 700 : 400 }}>
            {params.value as string}
          </span>
        );
      },
    },
    {
      field: 'adrStatus',
      headerName: 'Current Status',
      width: 140,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value as string}
          color={statusColors[params.value as ADRStatus] || 'default'}
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      field: 'action',
      headerName: 'Actions',
      width: 180,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) =>
        params.row.adrStatus === 'Requested' ? (
          <Button variant="contained" color="primary" onClick={() => navigate(`/adr/submit/${params.row.claimId}`)}>
            SUBMIT DOCUMENTS
          </Button>
        ) : null,
    },
  ];

  const filteredRecords = records.filter((row) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (row.claimId && row.claimId.toLowerCase().includes(q)) ||
      (row.paId && row.paId.toLowerCase().includes(q)) ||
      (row.utn && row.utn.toLowerCase().includes(q))
    );
  });

  return (
    <Box sx={{ display: 'flex' }}>
      <HeaderAppBar />
      <MainMenu />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          boxSizing: 'border-box',
          width: 'calc(100vw - 240px)',
          minWidth: 0,
          overflowX: 'auto',
          bgcolor: 'background.default',
          pl: '20px',
          pr: '20px',
          pt: 4,
          pb: 0,
          ml: '240px',
          marginLeft: 0,
        }}
      >
        <Toolbar sx={{ minHeight: 48 }} />
        <Typography variant="h5" gutterBottom>
          ADR Management Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 1 }}>
          <TextField
            placeholder="Search by Claim Number, PA ID, or UTN"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              clearHighlight();
            }}
            size="small"
            sx={{ minWidth: 220, maxWidth: 350 }}
          />
        </Box>
        <Box sx={{ height: 520, width: '100%' }}>
          <DataGrid
            rows={filteredRecords}
            columns={columns}
            pageSizeOptions={[25, 50, 100]}
            initialState={{
              pagination: { paginationModel: { pageSize: 25 } },
            }}
            loading={loading}
            getRowId={(row) => row.claimId}
            disableRowSelectionOnClick
            getRowClassName={(params) =>
              highlightedId && params.id === highlightedId ? 'highlight-adr-row' : ''
            }
            onCellClick={clearHighlight}
            onSortModelChange={clearHighlight}
            onFilterModelChange={clearHighlight}
          />
        </Box>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
        <style>{`
          .highlight-adr-row {
            background-color: #fff9c4 !important;
            transition: background-color 0.5s;
          }
        `}</style>
      </Box>
    </Box>
  );
};

export default ADRManagementPage;
