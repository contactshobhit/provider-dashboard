import React from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, IconButton, SxProps, Theme } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface SummaryCardProps {
  title: string;
  count?: number;
  subtitle?: string;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onClick?: () => void;
  cardSx?: SxProps<Theme>;
  countColor?: string;
  completed?: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  count,
  subtitle,
  loading,
  error,
  onRefresh,
  onClick,
  cardSx = {},
  countColor,
  completed,
}) => (
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
      border: completed ? '2px solid #4fc3f7' : undefined,
      background: completed ? 'linear-gradient(135deg, #e3f7fa 0%, #f0fdf6 100%)' : undefined,
      ...cardSx,
    }}
    onClick={onClick}
  >
    <CardContent sx={{ p: 2, pb: '16px !important', position: 'relative' }}>
      {/* Title and Refresh Icon (top row) */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1} sx={{ position: 'relative', pr: 5 }}>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{
            fontWeight: 600,
            fontSize: 16,
            pr: 2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </Typography>
        {onRefresh && (
          <Box sx={{ position: 'absolute', top: 4, right: 4, zIndex: 2 }}>
            <IconButton
              aria-label="refresh"
              onClick={(e) => {
                e.stopPropagation();
                onRefresh();
              }}
              size="large"
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'rgba(240,240,240,0.85)',
                boxShadow: 1,
                '&:hover': {
                  background: 'rgba(220,220,220,1)',
                },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 0,
              }}
            >
              <RefreshIcon fontSize="medium" />
            </IconButton>
          </Box>
        )}
      </Box>
      {/* Main Count */}
      <Box display="flex" alignItems="center" justifyContent="flex-start" minHeight={40}>
        {loading ? (
          <CircularProgress size={24} />
        ) : error ? (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        ) : (
          <Typography
            sx={{
              fontWeight: 700,
              color: countColor || (completed ? '#388e3c' : 'primary.main'),
              fontSize: '2rem',
              lineHeight: 1,
            }}
          >
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
