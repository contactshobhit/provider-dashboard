import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DescriptionIcon from '@mui/icons-material/Description';
import PageLayout from './layout/PageLayout';
import { Box, Toolbar, Typography, Chip, Button, TextField } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { fetchADRRecords } from '../api/adr';
import { ADRRecord } from '../types';
import { getStatusChipColor } from '../utils/statusStyles';
import { formatDateUS } from '../utils/dateFormat';

interface LocationState {
  adrSubmitted?: boolean;
  claimId?: string;
}

const ADRManagementPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialClaimId = searchParams.get('claimId');

  const [records, setRecords] = useState<ADRRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>(initialClaimId || '');
  const [highlightedId, setHighlightedId] = useState<string | null>(initialClaimId);
  const highlightTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasShownSnackbar = useRef<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const [viewDocsDialog, setViewDocsDialog] = useState<{ open: boolean; claimId: string; documents: string[] }>({
    open: false,
    claimId: '',
    documents: [],
  });

  // Set up highlight timeout on mount if there's an initial claimId
  useEffect(() => {
    if (initialClaimId && highlightedId) {
      highlightTimeout.current = setTimeout(() => setHighlightedId(null), 4000);
    }
    return () => {
      if (highlightTimeout.current) clearTimeout(highlightTimeout.current);
    };
  }, [initialClaimId, highlightedId]);

  const clearHighlight = (): void => {
    if (highlightedId) setHighlightedId(null);
    if (highlightTimeout.current) clearTimeout(highlightTimeout.current);
  };

  const loadRecords = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetchADRRecords();
      setRecords(res.data.records);
    } catch {
      setError('Failed to load ADR records');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    let cancelled = false;
    const fetchData = async (): Promise<void> => {
      if (cancelled) return;
      await loadRecords();
    };
    void fetchData();
    return () => { cancelled = true; };
  }, [loadRecords]);

  // Handle snackbar for successful ADR submission
  const state = location.state as LocationState;
  useEffect(() => {
    if (!state?.adrSubmitted || !state?.claimId || hasShownSnackbar.current) return;

    hasShownSnackbar.current = true;
    const showSnackbar = async (): Promise<void> => {
      setSnackbar({ open: true, message: `ADR Documents for Claim ${state.claimId} submitted successfully.` });
      await loadRecords();
      window.history.replaceState({}, document.title);
    };
    void showSnackbar();
  }, [state, loadRecords]);

  const handleViewDocuments = (claimId: string, documents: string[]): void => {
    setViewDocsDialog({ open: true, claimId, documents });
  };

  const columns: GridColDef[] = [
    {
      field: 'claimId',
      headerName: 'Claim Number',
      width: 130,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => <strong>{params.value}</strong>,
    },
    {
      field: 'memberId',
      headerName: 'Member ID',
      width: 130,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'patientName',
      headerName: 'Patient Name',
      width: 150,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'dateOfService',
      headerName: 'Date of Service',
      width: 130,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => formatDateUS(params.value as string),
    },
    {
      field: 'documentSummary',
      headerName: 'Requested Docs',
      width: 200,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'dueDate',
      headerName: 'ADR Deadline',
      width: 130,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => {
        const due = new Date(params.value as string);
        const now = new Date();
        const daysUntilDue = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        const isPastDue = daysUntilDue < 0;
        const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 3;
        return (
          <span
            style={{
              color: isPastDue ? '#d32f2f' : isDueSoon ? '#f57c00' : undefined,
              fontWeight: isPastDue || isDueSoon ? 700 : 400,
            }}
          >
            {formatDateUS(params.value as string)}
          </span>
        );
      },
    },
    {
      field: 'adrStatus',
      headerName: 'Current Status',
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value as string}
          color={getStatusChipColor(params.value as string)}
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
      renderCell: (params: GridRenderCellParams) => {
        const status = params.row.adrStatus;
        const documents = params.row.submittedDocuments || [];

        if (status === 'Requested') {
          return (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => navigate(`/adr/submit/${params.row.claimId}`)}
            >
              SUBMIT DOCS
            </Button>
          );
        }

        if (documents.length > 0) {
          return (
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => handleViewDocuments(params.row.claimId, documents)}
            >
              VIEW DOCS
            </Button>
          );
        }

        return null;
      },
    },
  ];

  const filteredRecords = records.filter((row) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (row.claimId && row.claimId.toLowerCase().includes(q)) ||
      (row.memberId && row.memberId.toLowerCase().includes(q)) ||
      (row.patientName && row.patientName.toLowerCase().includes(q))
    );
  });

  return (
    <PageLayout>
      <Toolbar sx={{ minHeight: 48 }} />
        <Typography variant="h5" gutterBottom>
          ADR Management Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 1 }}>
          <TextField
            placeholder="Search by Claim Number, Member ID, or Patient Name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              clearHighlight();
            }}
            size="small"
            sx={{ minWidth: 300, maxWidth: 400 }}
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
        <Dialog
          open={viewDocsDialog.open}
          onClose={() => setViewDocsDialog({ open: false, claimId: '', documents: [] })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Submitted Documents - {viewDocsDialog.claimId}</DialogTitle>
          <DialogContent>
            <List>
              {viewDocsDialog.documents.map((doc, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <DescriptionIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={doc} />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDocsDialog({ open: false, claimId: '', documents: [] })} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <style>{`
          .highlight-adr-row {
            background-color: #fff9c4 !important;
            transition: background-color 0.5s;
          }
        `}</style>
    </PageLayout>
  );
};

export default ADRManagementPage;
