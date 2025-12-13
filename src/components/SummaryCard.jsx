import React from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';



const SummaryCard = ({ title, count, subtitle, loading, error, onRefresh, onClick, cardSx = {}, countColor }) => (
  <Card
    sx={{
      minHeight: 120,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: 4,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'box-shadow 0.2s',
      '&:hover': onClick ? { boxShadow: 8 } : {},
      ...cardSx,
    }}
    onClick={onClick}
  >
    <CardContent sx={{ p: 2, pb: '16px !important', position: 'relative' }}>
      {/* Title and Refresh Icon (top row) */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 600, fontSize: 16 }}>
          {title}
        </Typography>
        {onRefresh && (
          <IconButton
            aria-label="refresh"
            onClick={e => { e.stopPropagation(); onRefresh(); }}
            size="small"
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      {/* Main Count */}
      <Box display="flex" alignItems="center" justifyContent="flex-start" minHeight={40}>
        {loading ? (
          <CircularProgress size={24} />
        ) : error ? (
          <Typography color="error" variant="body2">{error}</Typography>
        ) : (
          <Typography sx={{ fontWeight: 700, color: countColor || 'primary.main', fontSize: '2rem', lineHeight: 1 }}>
            {count}
          </Typography>
        )}
      </Box>
      {/* Subtitle and Arrow Icon (bottom row) */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
        <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.7, fontSize: 13 }}>
          {subtitle}
        </Typography>
        {onClick && !loading && !error && (
          <ArrowForwardIcon color="action" fontSize="small" sx={{ ml: 1, position: 'relative', bottom: 0 }} />
        )}
      </Box>
    </CardContent>
  </Card>
);

export default SummaryCard;
