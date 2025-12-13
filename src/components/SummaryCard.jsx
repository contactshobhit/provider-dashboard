import React from 'react';
import { Card, CardContent, Typography, Box, Button, CircularProgress, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const SummaryCard = ({ title, count, subtitle, linkPath, loading, error, onRefresh, actionLabel, onAction }) => (
  <Card sx={{ minHeight: 160, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" color="text.secondary">{title}</Typography>
        {onRefresh && (
          <IconButton aria-label="refresh" onClick={onRefresh} size="small">
            <RefreshIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      <Box mt={2} mb={1}>
        {loading ? (
          <CircularProgress size={32} />
        ) : error ? (
          <Typography color="error" variant="body2">{error}</Typography>
        ) : (
          <Typography variant="h3" color="primary.main">{count}</Typography>
        )}
      </Box>
      <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
    </CardContent>
    {actionLabel && onAction && (
      <Box p={2} pt={0}>
        <Button variant="contained" color="primary" fullWidth onClick={onAction} sx={{ mt: 1 }}>
          {actionLabel}
        </Button>
      </Box>
    )}
  </Card>
);

export default SummaryCard;
