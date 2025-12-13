import React from 'react';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  Button,
  Typography
} from '@mui/material';

const SUBMISSION_TYPES = [
  { value: 'initial', label: 'Initial' },
  { value: 'resubmission', label: 'Resubmission' },
];

const LOCATIONS_OF_SERVICE = [
  { value: 'office', label: 'Office' },
  { value: 'outpatient', label: 'Outpatient' },
  { value: 'inpatient', label: 'Inpatient' },
  { value: 'home', label: 'Home' },
  { value: 'other', label: 'Other' },
];

const SubmissionDetailsSection = ({ values, errors, onChange, onArrayChange }) => {
  // values: { submissionType, locationOfService, previousUTN, submittedDate, anticipatedDateOfService, procedureCodes, modifiers, units, diagnosisCodes }
  // procedureCodes, modifiers, units: arrays (up to 4)
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>A. Submission Details</Typography>
      <Grid container spacing={2}>
        <Grid columns={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel sx={{ color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } }}>Submission Type</InputLabel>
            <Select
              name="submissionType"
              value={values.submissionType}
              label="Submission Type"
              onChange={onChange}
              error={!!errors.submissionType}
            >
              {SUBMISSION_TYPES.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid columns={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel sx={{ color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } }}>Location of Service</InputLabel>
            <Select
              name="locationOfService"
              value={values.locationOfService}
              label="Location of Service"
              onChange={onChange}
              error={!!errors.locationOfService}
            >
              {LOCATIONS_OF_SERVICE.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {values.submissionType === 'resubmission' && (
          <Grid columns={12} sm={6}>
            <TextField
              name="previousUTN"
              label="Previous UTN"
              value={values.previousUTN}
              onChange={e => {
                // Only allow numeric input, max 14 chars
                const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 14);
                onChange({ target: { name: 'previousUTN', value: val } });
              }}
              fullWidth
              required
              inputProps={{ maxLength: 14, inputMode: 'numeric', pattern: '[0-9]*' }}
              error={!!errors.previousUTN}
              helperText={errors.previousUTN}
            />
          </Grid>
        )}
        <Grid columns={12} sm={6}>
          <TextField
            name="submittedDate"
            label="Submitted Date"
            type="date"
            value={values.submittedDate}
            onChange={onChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ width: 220 }}
          />
        </Grid>
        <Grid columns={12} sm={6}>
          <TextField
            name="anticipatedDateOfService"
            label="Anticipated Date of Service"
            type="date"
            value={values.anticipatedDateOfService}
            onChange={onChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ width: 220 }}
          />
        </Grid>
        {/* Procedure Codes, Modifiers, Units (up to 4) */}
        {typeof onArrayChange === 'function' && [0,1,2,3].map((idx) => (
          <React.Fragment key={idx}>
            <Grid columns={3}>
              <TextField
                name={`procedureCodes[${idx}]`}
                label={`Procedure Code ${idx+1}${idx===0?' *':''}`}
                value={values.procedureCodes[idx] || ''}
                onChange={onArrayChange('procedureCodes', idx)}
                fullWidth
                required={idx===0}
                error={!!(errors.procedureCodes && errors.procedureCodes[idx])}
              />
            </Grid>
            <Grid columns={3}>
              <TextField
                name={`modifiers[${idx}]`}
                label={`Modifier ${idx+1}`}
                value={values.modifiers[idx] || ''}
                onChange={onArrayChange('modifiers', idx)}
                fullWidth
              />
            </Grid>
            <Grid columns={3}>
              <TextField
                name={`units[${idx}]`}
                label={`Units ${idx+1}${idx===0?' *':''}`}
                type="number"
                value={values.units[idx] || ''}
                onChange={onArrayChange('units', idx)}
                fullWidth
                required={idx===0}
                error={!!(errors.units && errors.units[idx])}
              />
            </Grid>
            <Grid columns={3}>
              <TextField
                name={`diagnosisCodes[${idx}]`}
                label={`Diagnosis Code ${idx+1}`}
                value={values.diagnosisCodes[idx] || ''}
                onChange={onArrayChange('diagnosisCodes', idx)}
                fullWidth
              />
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </Box>
  );
};

export default SubmissionDetailsSection;
