import React from 'react';
import { Box, TextField, Typography, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid';
import { PASubmissionFormValues, FormErrors } from '../../types';

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

interface FacilityProviderSectionProps {
  values: PASubmissionFormValues;
  errors: FormErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const FacilityProviderSection: React.FC<FacilityProviderSectionProps> = ({ values, errors, onChange }) => {
  const isPartA = values.medicarePartType === 'A';

  // Dynamic title based on Part A vs Part B
  const sectionTitle = isPartA
    ? 'Facility Provider Information'
    : 'Facility/Rendering Provider (ASC/Physician) Information';

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {sectionTitle}
      </Typography>
      <Grid container spacing={2}>
        <Grid size={6}>
          <TextField
            name="facilityName"
            label="Name *"
            value={values.facilityName}
            onChange={onChange}
            fullWidth
            required
            error={!!errors.facilityName}
            helperText={errors.facilityName}
            InputLabelProps={{
              sx: { color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } },
            }}
          />
        </Grid>
        <Grid size={3}>
          <TextField
            name="facilityNpi"
            label="NPI *"
            value={values.facilityNpi}
            onChange={onChange}
            fullWidth
            required
            error={!!errors.facilityNpi}
            helperText={errors.facilityNpi}
            InputLabelProps={{
              sx: { color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } },
            }}
          />
        </Grid>
        <Grid size={3}>
          <TextField
            name="facilityCcn"
            label="CCN *"
            value={values.facilityCcn}
            onChange={onChange}
            fullWidth
            required
            error={!!errors.facilityCcn}
            helperText={errors.facilityCcn}
            InputLabelProps={{
              sx: { color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } },
            }}
          />
        </Grid>
        <Grid size={8}>
          <TextField
            name="facilityAddress1"
            label="Address 1 *"
            value={values.facilityAddress1}
            onChange={onChange}
            fullWidth
            required
            error={!!errors.facilityAddress1}
            helperText={errors.facilityAddress1}
            InputLabelProps={{
              sx: { color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } },
            }}
          />
        </Grid>
        <Grid size={4}>
          <TextField
            name="facilityAddress2"
            label="Address 2"
            value={values.facilityAddress2}
            onChange={onChange}
            fullWidth
            error={!!errors.facilityAddress2}
            helperText={errors.facilityAddress2}
          />
        </Grid>
        <Grid size={4}>
          <TextField
            name="facilityCity"
            label="City *"
            value={values.facilityCity}
            onChange={onChange}
            fullWidth
            required
            error={!!errors.facilityCity}
            helperText={errors.facilityCity}
            InputLabelProps={{
              sx: { color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } },
            }}
          />
        </Grid>
        <Grid size={4}>
          <TextField
            name="facilityState"
            label="State *"
            value={values.facilityState}
            onChange={onChange}
            fullWidth
            required
            select
            error={!!errors.facilityState}
            helperText={errors.facilityState}
            InputLabelProps={{
              sx: { color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } },
            }}
          >
            {US_STATES.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={4}>
          <TextField
            name="facilityZip"
            label="ZIP *"
            value={values.facilityZip}
            onChange={onChange}
            fullWidth
            required
            error={!!errors.facilityZip}
            helperText={errors.facilityZip}
            InputLabelProps={{
              sx: { color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default FacilityProviderSection;
