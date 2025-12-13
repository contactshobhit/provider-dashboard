import React from 'react';
import { Box, Grid, TextField, Typography, MenuItem } from '@mui/material';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
];

const FacilityProviderSection = ({ values, errors, onChange }) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>C. Facility/Rendering Provider</Typography>
      <Grid container spacing={2}>
        <Grid columns={6}>
          <TextField
            name="facilityName"
            label="Facility/Rendering Provider Name *"
            value={values.facilityName}
            onChange={onChange}
            fullWidth
            required
            error={!!errors.facilityName}
            helperText={errors.facilityName}
          />
        </Grid>
        <Grid columns={3}>
          <TextField
            name="facilityNpi"
            label="Facility/Rendering NPI *"
            value={values.facilityNpi}
            onChange={onChange}
            fullWidth
            required
            type="number"
            error={!!errors.facilityNpi}
            helperText={errors.facilityNpi}
          />
        </Grid>
        <Grid columns={3}>
          <TextField
            name="facilityCcn"
            label="Facility/Rendering CCN *"
            value={values.facilityCcn}
            onChange={onChange}
            fullWidth
            required
            error={!!errors.facilityCcn}
            helperText={errors.facilityCcn}
          />
        </Grid>
        <Grid columns={8}>
          <TextField
            name="facilityAddress1"
            label="Address Line 1 *"
            value={values.facilityAddress1}
            onChange={onChange}
            fullWidth
            required
            error={!!errors.facilityAddress1}
            helperText={errors.facilityAddress1}
          />
        </Grid>
        <Grid columns={4}>
          <TextField
            name="facilityAddress2"
            label="Address Line 2"
            value={values.facilityAddress2}
            onChange={onChange}
            fullWidth
            error={!!errors.facilityAddress2}
            helperText={errors.facilityAddress2}
          />
        </Grid>
        <Grid columns={4}>
          <TextField
            name="facilityCity"
            label="City *"
            value={values.facilityCity}
            onChange={onChange}
            fullWidth
            required
            error={!!errors.facilityCity}
            helperText={errors.facilityCity}
          />
        </Grid>
        <Grid columns={4}>
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
          >
            {US_STATES.map((state) => (
              <MenuItem key={state} value={state}>{state}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid columns={4}>
          <TextField
            name="facilityZip"
            label="ZIP *"
            value={values.facilityZip}
            onChange={onChange}
            fullWidth
            required
            error={!!errors.facilityZip}
            helperText={errors.facilityZip}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default FacilityProviderSection;
