import React, { useEffect, useState, useMemo } from 'react';
import HeaderAppBar from './HeaderAppBar';
import MainMenu from './MainMenu';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import { Typography, TextField, MenuItem, Grid, Button, Modal, Chip, Menu, MenuItem as MuiMenuItem, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { DataGrid } from '@mui/x-data-grid';
import { fetchPARecords } from '../api/pa';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const statusColors = {
  Approved: 'success',
  Denied: 'error',
  Pending: 'warning',
};

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Denied', label: 'Denied' },
  { value: 'Pending', label: 'Pending' },
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #1976d2',
  boxShadow: 24,
  p: 4,
};

const PriorAuthSearchPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLetterId, setModalLetterId] = useState(null);

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

  // Filtering logic
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      // Global search
      const matchesSearch =
        !search ||
        rec.id.toLowerCase().includes(search.toLowerCase()) ||
        rec.patientName.toLowerCase().includes(search.toLowerCase());
      // Status filter
      const matchesStatus = !status || rec.status === status;
      // Date range filter
      const reqDate = new Date(rec.requestDate);
      const matchesStart = !startDate || reqDate >= startDate;
      const matchesEnd = !endDate || reqDate <= endDate;
      return matchesSearch && matchesStatus && matchesStart && matchesEnd;
    });
  }, [records, search, status, startDate, endDate]);

  // DataGrid columns
  const statusChipColor = (status) => {
    if (status === 'Approved') return 'success';
    if (status === 'Denied') return 'error';
    if (status === 'Pending' || status === 'Draft') return 'warning';
    if (status === 'Expired') return 'default';
    return 'default';
  };

  const columns = [
    {
      field: 'id',
      headerName: 'PA ID',
      width: 140,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Button color="primary" sx={{ fontWeight: 700 }} onClick={() => window.location.href = `/pa/details/${params.value}`}>{params.value}</Button>
      ),
    },
    { field: 'patientName', headerName: 'Patient Name', width: 140, headerAlign: 'center', align: 'center' },
    { field: 'serviceType', headerName: 'Service Type', width: 140, headerAlign: 'center', align: 'center' },
    {
      field: 'requestDate',
      headerName: 'Request Date',
      width: 120,
      headerAlign: 'center',
      align: 'center',
      valueFormatter: (params) => params.value ? params.value.slice(0, 10) : '',
    },
    {
      field: 'status',
      headerName: 'Current Status',
      width: 140,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Chip
            label={params.value}
            color={statusChipColor(params.value)}
            sx={{ fontWeight: 600 }}
          />
        </Box>
      ),
    },
    {
      field: 'determinationDate',
      headerName: 'Determination Date',
      width: 140,
      headerAlign: 'center',
      align: 'center',
      valueFormatter: (params) => (params.value && params.value !== 'N/A') ? params.value.slice(0, 10) : 'N/A',
    },
    { field: 'submittedRecords', headerName: 'Records Submitted', width: 140, headerAlign: 'center', align: 'center' },
    {
      field: 'action',
      headerName: 'Actions',
      width: 200,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const row = params.row;
        const [anchorEl, setAnchorEl] = React.useState(null);
        const open = Boolean(anchorEl);
        const handleMenuOpen = (event) => {
          setAnchorEl(event.currentTarget);
        };
        const handleMenuClose = () => {
          setAnchorEl(null);
        };
        const handleViewLetter = () => {
          setModalLetterId(row.id);
          setModalOpen(true);
          handleMenuClose();
        };
        const handleViewRecords = () => {
          window.location.href = `/pa/records/${row.id}`;
          handleMenuClose();
        };
        // Conditional menu options
        if (row.status === 'Draft') {
          return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => window.location.href = `/pa/new?draft=${row.id}`}
                aria-label={`Continue draft for ${row.id}`}
              >
                Continue Draft
              </Button>
            </Box>
          );
        }
        let menuOptions = [];
        if (row.status === 'Approved') {
          menuOptions = [
            { label: 'View Determination Letter', action: handleViewLetter },
            { label: 'View Supporting Records', action: handleViewRecords },
          ];
        } else if (row.status === 'Denied') {
          menuOptions = [
            { label: 'View Determination Letter', action: handleViewLetter },
            { label: 'View Supporting Records', action: handleViewRecords },
            { label: 'Request Peer-to-Peer Review', action: () => { window.location.href = `/pa/p2p/${row.id}`; handleMenuClose(); } },
          ];
        } else if (row.status === 'Pending') {
          menuOptions = [
            { label: 'View Supporting Records', action: handleViewRecords },
            { label: 'Upload Additional Documents', action: () => { window.location.href = `/pa/upload/${row.id}`; handleMenuClose(); } },
          ];
        } else if (row.status === 'Expired' || row.status === 'Resolved') {
          menuOptions = [
            { label: 'View Supporting Records', action: handleViewRecords },
          ];
        }
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <IconButton
              aria-label="more actions"
              onClick={handleMenuOpen}
              size="small"
            >
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
      },
    },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <HeaderAppBar />
      <MainMenu />
      <Box component="main" sx={{ flexGrow: 1, boxSizing: 'border-box', width: 'calc(100vw - 240px)', minWidth: 0, overflowX: 'auto', bgcolor: 'background.default', pl: '20px', pr: '20px', pt: 4, pb: 0, ml: '240px', marginLeft: 0 }}>
        <Toolbar sx={{ minHeight: 48 }} />
        <Typography variant="h5" gutterBottom>Prior Authorization Search & Status</Typography>
        <Box mb={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Global Search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                fullWidth
                placeholder="Search by PA ID or Patient Name"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                label="Status"
                value={status}
                onChange={e => setStatus(e.target.value)}
                fullWidth
              >
                {statusOptions.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} md={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6} md={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredRecords}
            columns={columns}
            pageSize={50}
            rowsPerPageOptions={[50]}
            loading={loading}
            getRowId={row => row.id}
            disableSelectionOnClick
            autoHeight={false}
          />
        </Box>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box sx={style}>
            <Typography variant="h6" gutterBottom>Determination Letter</Typography>
            <Typography variant="body1">Determination Letter Placeholder for {modalLetterId}</Typography>
            <Box mt={2} textAlign="right">
              <Button variant="contained" onClick={() => setModalOpen(false)}>Close</Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default PriorAuthSearchPage;
