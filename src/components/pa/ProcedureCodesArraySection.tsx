import React from 'react';
import { Box, TextField, Typography, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { FormErrors } from '../../types';

interface ProcedureCodesArraySectionProps {
  procedureCodes: string[];
  modifiers: string[];
  units: string[];
  errors: FormErrors;
  onChange: (field: string, idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (idx: number) => void;
  onAdd: () => void;
}

const ProcedureCodesArraySection: React.FC<ProcedureCodesArraySectionProps> = ({
  procedureCodes,
  modifiers,
  units,
  errors,
  onChange,
  onRemove,
  onAdd,
}) => {
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        Procedure Codes
      </Typography>
      {procedureCodes.map((_, idx) => (
        <Grid container spacing={2} alignItems="center" key={idx} sx={{ mb: 1 }}>
          <Grid size={4}>
            <TextField
              name={`procedureCodes[${idx}]`}
              label={`Procedure Code ${idx + 1}${idx === 0 ? ' *' : ''}`}
              value={procedureCodes[idx] || ''}
              onChange={onChange('procedureCodes', idx)}
              fullWidth
              required={idx === 0}
              error={!!(errors.procedureCodes && (errors.procedureCodes as unknown as string[])[idx])}
              helperText={errors.procedureCodes && (errors.procedureCodes as unknown as string[])[idx]}
              InputLabelProps={{
                sx: { color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } },
              }}
            />
          </Grid>
          <Grid size={3}>
            <TextField
              name={`modifiers[${idx}]`}
              label={`Modifier ${idx + 1}`}
              value={modifiers[idx] || ''}
              onChange={onChange('modifiers', idx)}
              fullWidth
            />
          </Grid>
          <Grid size={3}>
            <TextField
              name={`units[${idx}]`}
              label={`Units ${idx + 1}${idx === 0 ? ' *' : ''}`}
              type="number"
              value={units[idx] || ''}
              onChange={onChange('units', idx)}
              fullWidth
              required={idx === 0}
              error={!!(errors.units && (errors.units as unknown as string[])[idx])}
              helperText={errors.units && (errors.units as unknown as string[])[idx]}
              InputLabelProps={{
                sx: { color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } },
              }}
            />
          </Grid>
          <Grid size={2}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {procedureCodes.length > 1 && (
                <IconButton aria-label="Remove" onClick={() => onRemove(idx)} size="small">
                  <RemoveCircleOutlineIcon />
                </IconButton>
              )}
              {idx === procedureCodes.length - 1 && procedureCodes.length < 4 && (
                <IconButton aria-label="Add" onClick={onAdd} size="small">
                  <AddCircleOutlineIcon />
                </IconButton>
              )}
            </Box>
          </Grid>
        </Grid>
      ))}
    </Box>
  );
};

export default ProcedureCodesArraySection;
