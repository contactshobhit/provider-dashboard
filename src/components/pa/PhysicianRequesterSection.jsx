import React from 'react';
import { Box, Grid, TextField, Typography } from '@mui/material';

const PhysicianRequesterSection = ({ values, errors, onChange }) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>D. Physician & Requester</Typography>
      <Grid container spacing={2}>
        <Grid columns={6}>
          <TextField
            name="physicianName"
            label="Physician Name"
            value={values.physicianName}
            onChange={onChange}
            fullWidth
            error={!!errors.physicianName}
            helperText={errors.physicianName}
          />
        </Grid>
        <Grid columns={6}>
          <TextField
            name="physicianNpiPtan"
            label="Physician NPI/PTAN"
            value={values.physicianNpiPtan}
            onChange={onChange}
            fullWidth
            error={!!errors.physicianNpiPtan}
            helperText={errors.physicianNpiPtan}
          />
        </Grid>
        <Grid columns={4}>
          <TextField
            name="requesterName"
            label="Requester Name *"
            value={values.requesterName}
            onChange={onChange}
            fullWidth
            required
            error={!!errors.requesterName}
            helperText={errors.requesterName}
            InputLabelProps={{ sx: { color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } } }}
          />
        </Grid>
        <Grid columns={4}>
          <TextField
            name="requesterPhone"
            label="Requester Phone/Ext *"
            value={values.requesterPhone}
            onChange={onChange}
            fullWidth
            required
            error={!!errors.requesterPhone}
            helperText={errors.requesterPhone}
            InputLabelProps={{ sx: { color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } } }}
          />
        </Grid>
        <Grid columns={4}>
          <TextField
            name="requesterEmail"
            label="Requester Email ID *"
            value={values.requesterEmail}
            onChange={onChange}
            fullWidth
            required
            error={!!errors.requesterEmail}
            helperText={errors.requesterEmail}
            InputLabelProps={{ sx: { color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } } }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PhysicianRequesterSection;
