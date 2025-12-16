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

interface PhysicianRequesterSectionProps {
  values: PASubmissionFormValues;
  errors: FormErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const PhysicianRequesterSection: React.FC<PhysicianRequesterSectionProps> = ({ values, errors, onChange }) => {
  const isPartA = values.medicarePartType === 'A';

  // Dynamic label based on Part A vs Part B
  const physicianSectionTitle = isPartA ? 'Attending Physician Information' : 'Ordering/Referring Physician Information';

  return (
    <Box>
      {/* Physician Section */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {physicianSectionTitle}
      </Typography>
      <Grid container spacing={2}>
        <Grid size={6}>
          <TextField
            name="physicianName"
            label="Name *"
            value={values.physicianName}
            onChange={onChange}
            fullWidth
            required
            error={!!errors.physicianName}
            helperText={errors.physicianName}
            InputLabelProps={{
              sx: { color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } },
            }}
          />
        </Grid>
        <Grid size={3}>
          <TextField
            name="physicianNpi"
            label="NPI *"
            value={values.physicianNpi}
            onChange={onChange}
            fullWidth
            required
            error={!!errors.physicianNpi}
            helperText={errors.physicianNpi}
            InputLabelProps={{
              sx: { color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } },
            }}
          />
        </Grid>
        <Grid size={3}>
          <TextField
            name="physicianPtan"
            label="PTAN *"
            value={values.physicianPtan}
            onChange={onChange}
            fullWidth
            required
            error={!!errors.physicianPtan}
            helperText={errors.physicianPtan}
            InputLabelProps={{
              sx: { color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } },
            }}
          />
        </Grid>
        <Grid size={6}>
          <TextField
            name="physicianAddress"
            label="Address *"
            value={values.physicianAddress}
            onChange={onChange}
            fullWidth
            required
            error={!!errors.physicianAddress}
            helperText={errors.physicianAddress}
            InputLabelProps={{
              sx: { color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } },
            }}
          />
        </Grid>
        <Grid size={2}>
          <TextField
            name="physicianCity"
            label="City *"
            value={values.physicianCity}
            onChange={onChange}
            fullWidth
            required
            error={!!errors.physicianCity}
            helperText={errors.physicianCity}
            InputLabelProps={{
              sx: { color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } },
            }}
          />
        </Grid>
        <Grid size={2}>
          <TextField
            name="physicianState"
            label="State *"
            value={values.physicianState}
            onChange={onChange}
            fullWidth
            required
            select
            error={!!errors.physicianState}
            helperText={errors.physicianState}
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
        <Grid size={2}>
          <TextField
            name="physicianZip"
            label="ZIP *"
            value={values.physicianZip}
            onChange={onChange}
            fullWidth
            required
            error={!!errors.physicianZip}
            helperText={errors.physicianZip}
            InputLabelProps={{
              sx: { color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } },
            }}
          />
        </Grid>
      </Grid>

      {/* Requester Section */}
      <Typography variant="h6" sx={{ mb: 2, mt: 4, fontWeight: 600 }}>
        Requester Information
      </Typography>
      <Grid container spacing={2}>
        <Grid size={3}>
          <TextField
            name="requesterName"
            label="Name *"
            value={values.requesterName}
            onChange={onChange}
            fullWidth
            required
            error={!!errors.requesterName}
            helperText={errors.requesterName}
            InputLabelProps={{
              sx: { color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } },
            }}
          />
        </Grid>
        <Grid size={3}>
          <TextField
            name="requesterPhone"
            label="Phone/Extension *"
            value={values.requesterPhone}
            onChange={onChange}
            fullWidth
            required
            error={!!errors.requesterPhone}
            helperText={errors.requesterPhone}
            InputLabelProps={{
              sx: { color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } },
            }}
          />
        </Grid>
        <Grid size={3}>
          <TextField
            name="requesterEmail"
            label="Email ID *"
            value={values.requesterEmail}
            onChange={onChange}
            fullWidth
            required
            type="email"
            error={!!errors.requesterEmail}
            helperText={errors.requesterEmail}
            InputLabelProps={{
              sx: { color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } },
            }}
          />
        </Grid>
        <Grid size={3}>
          <TextField
            name="requesterFax"
            label="Fax *"
            value={values.requesterFax}
            onChange={onChange}
            fullWidth
            required
            error={!!errors.requesterFax}
            helperText={errors.requesterFax}
            InputLabelProps={{
              sx: { color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PhysicianRequesterSection;
