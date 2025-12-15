import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageLayout from './layout/PageLayout';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import { Typography, TextField, MenuItem, Button, Modal, Chip, Menu, MenuItem as MuiMenuItem, IconButton, Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PhoneIcon from '@mui/icons-material/Phone';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { fetchPARecords } from '../api/pa';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PARecord, P2PCall } from '../types';
import { getStatusChipColor, getStatusStyles } from '../utils/statusStyles';
import { formatDateUS } from '../utils/dateFormat';

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Submitted', label: 'Submitted' },
  { value: 'Under Review', label: 'Under Review' },
  { value: 'Affirmed', label: 'Affirmed' },
  { value: 'Non-Affirmed', label: 'Non-Affirmed' },
  { value: 'Partial Affirmation', label: 'Partial Affirmation' },
  { value: 'Dismissed', label: 'Dismissed' },
];

const activityOptions = [
  { value: '', label: 'All' },
  { value: 'p2p_requested', label: 'P2P Requested' },
  { value: 'p2p_scheduled', label: 'P2P Scheduled' },
  { value: 'p2p_completed', label: 'P2P Completed' },
  { value: 'no_p2p', label: 'No P2P Activity' },
];

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #1976d2',
  boxShadow: 24,
  p: 4,
};


// Helper to get current P2P status for a PA
const getP2PActivity = (p2pCalls?: P2PCall[]): string | null => {
  if (!p2pCalls || p2pCalls.length === 0) return null;
  // Get the most recent P2P call
  const latestP2P = p2pCalls[p2pCalls.length - 1];
  return latestP2P.status;
};

const PriorAuthSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<PARecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [_error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [activity, setActivity] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalLetterId, setModalLetterId] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const highlightTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paId = params.get('paId');
    const statusParam = params.get('status');
    const activityParam = params.get('activity');
    if (paId) {
      setSearch(paId);
      setHighlightedId(paId);
      if (highlightTimeout.current) clearTimeout(highlightTimeout.current);
      highlightTimeout.current = setTimeout(() => setHighlightedId(null), 4000);
    }
    if (statusParam) {
      // Handle URL parameter format
      const statusValue = decodeURIComponent(statusParam);
      setStatus(statusValue);
    }
    if (activityParam) {
      setActivity(activityParam);
    }
    return () => {
      if (highlightTimeout.current) clearTimeout(highlightTimeout.current);
    };
  }, [location.search]);

  const clearHighlight = (): void => {
    if (highlightedId) setHighlightedId(null);
    if (highlightTimeout.current) clearTimeout(highlightTimeout.current);
  };

  useEffect(() => {
    setLoading(true);
    fetchPARecords()
      .then((res) => {
        setRecords(res.data.records);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load records');
        setLoading(false);
      });
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matchesSearch =
        !search ||
        rec.id.toLowerCase().includes(search.toLowerCase()) ||
        rec.patientName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !status || rec.status === status;
      const reqDate = new Date(rec.requestDate);
      const matchesStart = !startDate || reqDate >= startDate;
      const matchesEnd = !endDate || reqDate <= endDate;

      // Activity filter
      let matchesActivity = true;
      if (activity) {
        const p2pStatus = getP2PActivity(rec.p2pCalls);
        switch (activity) {
          case 'p2p_requested':
            matchesActivity = p2pStatus === 'Requested';
            break;
          case 'p2p_scheduled':
            matchesActivity = p2pStatus === 'Scheduled';
            break;
          case 'p2p_completed':
            matchesActivity = p2pStatus === 'Completed';
            break;
          case 'no_p2p':
            matchesActivity = !p2pStatus;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesStart && matchesEnd && matchesActivity;
    });
  }, [records, search, status, activity, startDate, endDate]);

  const ActionCell: React.FC<{ row: PARecord }> = ({ row }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
      setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = (): void => {
      setAnchorEl(null);
    };
    const handleViewLetter = (): void => {
      setModalLetterId(row.id);
      setModalOpen(true);
      handleMenuClose();
    };
    const handleViewRecords = (): void => {
      navigate(`/pa/records/${row.id}`);
      handleMenuClose();
    };

    if (row.status === 'Draft') {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => { navigate(`/pa/new?draft=${row.id}`); }}
            aria-label={`Continue draft for ${row.id}`}
          >
            Continue Draft
          </Button>
        </Box>
      );
    }

    interface MenuOption {
      label: string;
      action: () => void;
    }

    const p2pStatus = getP2PActivity(row.p2pCalls);
    const canRequestP2P = (row.status === 'Non-Affirmed' || row.status === 'Partial Affirmation') &&
      (!p2pStatus || p2pStatus === 'Completed');
    const hasDetermination = ['Affirmed', 'Non-Affirmed', 'Partial Affirmation', 'Dismissed'].includes(row.status);

    let menuOptions: MenuOption[] = [];

    // View determination letter for determined statuses
    if (hasDetermination) {
      menuOptions.push({ label: 'View Determination Letter', action: handleViewLetter });
    }

    // View supporting records for all non-draft
    menuOptions.push({ label: 'View Supporting Records', action: handleViewRecords });

    // P2P request for Non-Affirmed/Partial Affirmation without active P2P
    if (canRequestP2P) {
      menuOptions.push({
        label: p2pStatus === 'Completed' ? 'Request Another P2P' : 'Request Peer-to-Peer Review',
        action: () => { navigate(`/pa/p2p/${row.id}`); handleMenuClose(); }
      });
    }

    // Resubmit for Non-Affirmed/Partial Affirmation
    if (row.status === 'Non-Affirmed' || row.status === 'Partial Affirmation') {
      menuOptions.push({
        label: 'Resubmit PA',
        action: () => {
          const params = new URLSearchParams();
          params.set('paId', row.id);
          if (row.utn) params.set('utn', row.utn);
          navigate(`/pa/new?${params.toString()}`);
          handleMenuClose();
        },
      });
    }

    // Upload additional documents for Submitted/Under Review
    if (row.status === 'Submitted' || row.status === 'Under Review') {
      menuOptions.push({
        label: 'Upload Additional Documents',
        action: () => { navigate(`/pa/upload/${row.id}`); handleMenuClose(); }
      });
    }

    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <IconButton aria-label="more actions" onClick={handleMenuOpen} size="small">
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          {menuOptions.map((opt, idx) => (
            <MuiMenuItem key={opt.label} onClick={opt.action} autoFocus={idx === 0}>
              {opt.label}
            </MuiMenuItem>
          ))}
        </Menu>
      </Box>
    );
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'PA ID',
      width: 160,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as PARecord;
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Button color="primary" sx={{ fontWeight: 700 }} onClick={() => { navigate(`/pa/details/${params.value}`); }}>
              {params.value}
            </Button>
            {row.parentPaId && (
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', fontSize: 11, cursor: 'pointer' }}
                onClick={() => { navigate(`/pa/details/${row.parentPaId}`); }}
              >
                ↩ {row.parentPaId}
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      field: 'utn',
      headerName: 'UTN',
      width: 160,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => {
        const hasDetermination = ['Affirmed', 'Non-Affirmed', 'Partial Affirmation', 'Dismissed'].includes(params.row.status);
        return hasDetermination && params.value ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
            <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>{params.value || ''}</Typography>
          </Box>
        ) : null;
      },
      sortable: false,
      filterable: false,
    },
    { field: 'patientName', headerName: 'Patient Name', width: 130, headerAlign: 'center', align: 'center' },
    { field: 'serviceType', headerName: 'Service Type', width: 180, headerAlign: 'center', align: 'center' },
    {
      field: 'requestDate',
      headerName: 'Request Date',
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => <span>{formatDateUS(params.value as string)}</span>,
    },
    {
      field: 'status',
      headerName: 'Current Status',
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
          <Chip label={params.value} color={getStatusChipColor(params.value as string)} sx={{ fontWeight: 600 }} />
        </Box>
      ),
    },
    {
      field: 'p2pActivity',
      headerName: 'P2P Activity',
      width: 120,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as PARecord;
        const p2pStatus = getP2PActivity(row.p2pCalls);
        if (!p2pStatus) return null;

        const styles = getStatusStyles(p2pStatus);
        let icon = <PhoneIcon fontSize="small" />;
        let tooltip = '';

        if (p2pStatus === 'Requested') {
          icon = <PhoneIcon fontSize="small" />;
          tooltip = 'P2P Requested';
        } else if (p2pStatus === 'Scheduled') {
          icon = <ScheduleIcon fontSize="small" />;
          const latestP2P = row.p2pCalls?.[row.p2pCalls.length - 1];
          tooltip = `P2P Scheduled: ${latestP2P?.scheduledDate || ''} ${latestP2P?.scheduledTime || ''}`;
        } else if (p2pStatus === 'Completed') {
          icon = <CheckCircleIcon fontSize="small" />;
          const latestP2P = row.p2pCalls?.[row.p2pCalls.length - 1];
          tooltip = `P2P Completed: ${latestP2P?.outcome || ''}`;
        }

        return (
          <Tooltip title={tooltip}>
            <Chip
              icon={icon}
              label={p2pStatus}
              size="small"
              sx={{
                bgcolor: styles.bgcolor,
                color: styles.color,
                fontWeight: 600,
                '& .MuiChip-icon': { color: styles.color },
              }}
            />
          </Tooltip>
        );
      },
    },
    {
      field: 'determinationDate',
      headerName: 'Determination Date',
      width: 140,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => {
        const rowStatus = params.row.status;
        const determinedStatuses = ['Affirmed', 'Non-Affirmed', 'Partial Affirmation', 'Dismissed'];
        if (determinedStatuses.includes(rowStatus) && params.value && params.value !== 'N/A') {
          return <span>{formatDateUS(params.value as string)}</span>;
        }
        return <span>-</span>;
      },
    },
    { field: 'submittedRecords', headerName: 'Records', width: 90, headerAlign: 'center', align: 'center' },
    {
      field: 'action',
      headerName: 'Actions',
      width: 160,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => <ActionCell row={params.row as PARecord} />,
    },
  ];

  return (
    <PageLayout>
      <Toolbar sx={{ minHeight: 48 }} />
        <Typography variant="h5" gutterBottom>
          PA Request Search & Status
        </Typography>
        <Box mb={2}>
          <Grid container spacing={2}>
            <Grid>
              <TextField
                label="Search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); clearHighlight(); }}
                fullWidth
                placeholder="Search by PA ID or Patient Name"
              />
            </Grid>
            <Grid>
              <TextField
                select
                label="Status"
                value={status}
                onChange={(e) => { setStatus(e.target.value); clearHighlight(); }}
                fullWidth
                sx={{ minWidth: { xs: 160, sm: 180 }, maxWidth: 220 }}
              >
                {statusOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid>
              <TextField
                select
                label="P2P Activity"
                value={activity}
                onChange={(e) => { setActivity(e.target.value); clearHighlight(); }}
                fullWidth
                sx={{ minWidth: { xs: 140, sm: 160 }, maxWidth: 200 }}
                helperText="Peer-to-Peer call status"
              >
                {activityOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Request Start Date"
                  value={startDate}
                  onChange={(d) => { setStartDate(d); clearHighlight(); }}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Request End Date"
                  value={endDate}
                  onChange={(d) => { setEndDate(d); clearHighlight(); }}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredRecords}
            columns={columns}
            pageSizeOptions={[25, 50, 100]}
            initialState={{
              pagination: { paginationModel: { pageSize: 50 } },
            }}
            loading={loading}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            getRowClassName={(params) => (highlightedId && params.id === highlightedId ? 'highlight-pa-row' : '')}
            onCellClick={clearHighlight}
            onSortModelChange={clearHighlight}
            onFilterModelChange={clearHighlight}
          />
          <style>{`
            .highlight-pa-row {
              background-color: #fff9c4 !important;
              transition: background-color 0.5s;
            }
          `}</style>
        </Box>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box sx={modalStyle}>
            {(() => {
              const pa = records.find((r) => r.id === modalLetterId);
              if (!pa) return <Typography>Record not found.</Typography>;
              return (
                <>
                  <Typography variant="h6" gutterBottom>
                    Determination Letter
                  </Typography>
                  <Box sx={{ mb: 2, p: 1, bgcolor: '#f5f7fa', borderRadius: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>PA ID:</Typography>
                      <Typography sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{pa.id}</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, ml: 2 }}>Status:</Typography>
                      <Chip label={pa.status} color={getStatusChipColor(pa.status)} size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Determination Date:</Typography>
                      <Typography sx={{ fontFamily: 'monospace' }}>
                        {pa.determinationDate && pa.determinationDate !== 'N/A' ? pa.determinationDate : 'N/A'}
                      </Typography>
                    </Box>
                    {(pa.status === 'Affirmed' || pa.status === 'Non-Affirmed') && pa.utn && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>UTN:</Typography>
                        <TextField
                          value={pa.utn}
                          InputProps={{ readOnly: true }}
                          size="small"
                          sx={{ width: 200, fontFamily: 'monospace', fontWeight: 700, bgcolor: 'white' }}
                          inputProps={{ style: { fontFamily: 'monospace', fontWeight: 700, fontSize: 16 } }}
                        />
                        <Button size="small" onClick={() => { navigator.clipboard.writeText(pa.utn); }}>
                          Copy
                        </Button>
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Determination Letter
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      The determination letter for {modalLetterId} is not available for preview at this time.
                      Please contact support if you need a copy of this document.
                    </Typography>
                  </Box>
                  <Box mt={3} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant="outlined" onClick={() => setModalOpen(false)}>
                      Close
                    </Button>
                    <Button variant="contained" disabled>
                      Download PDF
                    </Button>
                  </Box>
                </>
              );
            })()}
          </Box>
        </Modal>
    </PageLayout>
  );
};

export default PriorAuthSearchPage;
