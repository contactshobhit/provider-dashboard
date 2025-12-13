import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, CircularProgress, Typography } from '@mui/material';

const statusColor = (status) => {
  if (status === 'Approved') return 'success';
  if (status === 'Denied') return 'error';
  if (status === 'Pending' || status === 'Awaiting Provider Response') return 'warning';
  if (status === 'Resolved') return 'default';
  return 'default';
};

const RecentActivityTable = ({ data, loading, error }) => (
  <TableContainer component={Paper} sx={{ mt: 4 }}>
    {loading ? (
      <CircularProgress sx={{ m: 4 }} />
    ) : error ? (
      <Typography color="error" sx={{ m: 4 }}>{error}</Typography>
    ) : (
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Patient</TableCell>
            <TableCell>Last Updated</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data && data.length > 0 ? data.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.patientName}</TableCell>
              <TableCell>{new Date(row.lastUpdated).toLocaleString()}</TableCell>
              <TableCell>
                <Chip label={row.currentStatus} color={statusColor(row.currentStatus)} size="small" />
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={5} align="center">No recent activity found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    )}
  </TableContainer>
);

export default RecentActivityTable;
