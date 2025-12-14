import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { PASubmissionFormValues, FormErrors } from '../../types';

interface SelectOption {
  value: string;
  label: string;
}

const SUBMISSION_TYPES: SelectOption[] = [
  { value: 'initial', label: 'Initial' },
  { value: 'resubmission', label: 'Resubmission' },
];

const LOCATIONS_OF_SERVICE: SelectOption[] = [
  { value: 'office', label: 'Office' },
  { value: 'outpatient', label: 'Outpatient' },
  { value: 'inpatient', label: 'Inpatient' },
  { value: 'home', label: 'Home' },
  { value: 'other', label: 'Other' },
];

interface SubmissionDetailsSectionProps {
  values: PASubmissionFormValues;
  errors: FormErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => void;
  onArrayChange?: ((field: string, idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => void) | null;
  hideProcedureFields?: boolean;
}

const SubmissionDetailsSection: React.FC<SubmissionDetailsSectionProps> = ({
  values,
  errors,
  onChange,
  onArrayChange,
}) => {
  const handlePreviousUTNChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 14);
    const syntheticEvent = {
      target: { name: 'previousUTN', value: val },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        A. Submission Details
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth required>
            <InputLabel sx={{ color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } }}>
              Submission Type
            </InputLabel>
            <Select
              name="submissionType"
              value={values.submissionType}
              label="Submission Type"
              onChange={onChange}
              error={!!errors.submissionType}
              displayEmpty
              renderValue={(selected) => {
                const found = SUBMISSION_TYPES.find((opt) => opt.value === selected);
                return found ? found.label : selected || '';
              }}
              sx={{ minWidth: 120, maxWidth: 220 }}
            >
              {SUBMISSION_TYPES.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
              {values.submissionType &&
                !SUBMISSION_TYPES.some((opt) => opt.value === values.submissionType) && (
                  <MenuItem value={values.submissionType}>{values.submissionType}</MenuItem>
                )}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth required>
            <InputLabel sx={{ color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } }}>
              Location of Service
            </InputLabel>
            <Select
              name="locationOfService"
              value={values.locationOfService}
              label="Location of Service"
              onChange={onChange}
              error={!!errors.locationOfService}
              displayEmpty
              renderValue={(selected) => {
                const found = LOCATIONS_OF_SERVICE.find((opt) => opt.value === selected);
                return found ? found.label : selected || '';
              }}
              sx={{ minWidth: 120, maxWidth: 220 }}
            >
              {LOCATIONS_OF_SERVICE.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
              {values.locationOfService &&
                !LOCATIONS_OF_SERVICE.some((opt) => opt.value === values.locationOfService) && (
                  <MenuItem value={values.locationOfService}>{values.locationOfService}</MenuItem>
                )}
            </Select>
          </FormControl>
        </Grid>
        {values.submissionType === 'resubmission' && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              name="previousUTN"
              label="Previous UTN"
              value={values.previousUTN}
              onChange={handlePreviousUTNChange}
              fullWidth
              required
              inputProps={{ maxLength: 14, inputMode: 'numeric', pattern: '[0-9]*' }}
              error={!!errors.previousUTN}
              helperText={errors.previousUTN}
            />
          </Grid>
        )}
        <Grid size={{ xs: 12, sm: 6 }}>
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
        <Grid size={{ xs: 12, sm: 6 }}>
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
        {typeof onArrayChange === 'function' &&
          [0, 1, 2, 3].map((idx) => (
            <React.Fragment key={idx}>
              <Grid size={3}>
                <TextField
                  name={`procedureCodes[${idx}]`}
                  label={`Procedure Code ${idx + 1}${idx === 0 ? ' *' : ''}`}
                  value={values.procedureCodes[idx] || ''}
                  onChange={onArrayChange('procedureCodes', idx)}
                  fullWidth
                  required={idx === 0}
                  error={!!(errors.procedureCodes && (errors.procedureCodes as unknown as string[])[idx])}
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  name={`modifiers[${idx}]`}
                  label={`Modifier ${idx + 1}`}
                  value={values.modifiers[idx] || ''}
                  onChange={onArrayChange('modifiers', idx)}
                  fullWidth
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  name={`units[${idx}]`}
                  label={`Units ${idx + 1}${idx === 0 ? ' *' : ''}`}
                  type="number"
                  value={values.units[idx] || ''}
                  onChange={onArrayChange('units', idx)}
                  fullWidth
                  required={idx === 0}
                  error={!!(errors.units && (errors.units as unknown as string[])[idx])}
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  name={`diagnosisCodes[${idx}]`}
                  label={`Diagnosis Code ${idx + 1}`}
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
