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
      <Table size="small" padding="none">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, fontSize: 14 }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: 14 }}>Type</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: 14 }}>Patient</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: 14 }}>Last Updated</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: 14 }}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data && data.length > 0 ? data.map((row) => (
            <TableRow key={row.id} hover sx={{ '& td': { py: 0.5, px: 1, fontSize: 14 } }}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.patientName}</TableCell>
              <TableCell>{new Date(row.lastUpdated).toLocaleString()}</TableCell>
              <TableCell>
                <Chip
                  label={row.currentStatus}
                  color={
                    row.currentStatus === 'Approved'
                      ? 'success'
                      : row.currentStatus === 'Denied'
                      ? 'error'
                      : row.currentStatus === 'Pending' || row.currentStatus === 'Awaiting Provider Response'
                      ? 'warning'
                      : 'default'
                  }
                  variant="filled"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
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
