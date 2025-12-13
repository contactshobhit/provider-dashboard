import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, TextField, MenuItem, Grid, Button, Modal, Chip } from '@mui/material';
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
  const columns = [
    {
      field: 'id',
      headerName: 'PA ID',
      width: 140,
      renderCell: (params) => (
        <Button color="primary" onClick={() => window.location.href = `/pa/details/${params.value}`}>{params.value}</Button>
      ),
    },
    { field: 'patientName', headerName: 'Patient Name', width: 140 },
    { field: 'serviceType', headerName: 'Service Type', width: 140 },
    { field: 'requestDate', headerName: 'Request Date', width: 120 },
    {
      field: 'status',
      headerName: 'Current Status',
      width: 140,
      renderCell: (params) => (
        <Chip label={params.value} color={statusColors[params.value]} />
      ),
    },
    { field: 'determinationDate', headerName: 'Determination Date', width: 140 },
    { field: 'submittedRecords', headerName: 'Records Submitted', width: 140 },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const row = params.row;
        return (
          <Box display="flex" gap={1}>
            {(row.status === 'Approved' || row.status === 'Denied') && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setModalLetterId(row.id);
                  setModalOpen(true);
                }}
              >
                View Letter
              </Button>
            )}
            <Button
              variant="outlined"
              size="small"
              onClick={() => console.log(`Navigating to records for ${row.id}`)}
            >
              View Records
            </Button>
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
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
  );
};

export default PriorAuthSearchPage;
