import React from 'react';
import { Box, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { PASubmissionFormValues, FormErrors } from '../../types';

interface BeneficiaryInfoSectionProps {
  values: PASubmissionFormValues;
  errors: FormErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BeneficiaryInfoSection: React.FC<BeneficiaryInfoSectionProps> = ({ values, errors, onChange }) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        B. Beneficiary Information
      </Typography>
      <Grid container spacing={2}>
        <Grid size={6}>
          <TextField
            name="beneficiaryLastName"
            label="Beneficiary Last Name *"
            value={values.beneficiaryLastName}
            onChange={onChange}
            fullWidth
            required
            error={!!errors.beneficiaryLastName}
            helperText={errors.beneficiaryLastName}
            InputLabelProps={{
              sx: { color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } },
            }}
          />
        </Grid>
        <Grid size={6}>
          <TextField
            name="beneficiaryFirstName"
            label="Beneficiary First Name *"
            value={values.beneficiaryFirstName}
            onChange={onChange}
            fullWidth
            required
            error={!!errors.beneficiaryFirstName}
            helperText={errors.beneficiaryFirstName}
            InputLabelProps={{
              sx: { color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } },
            }}
          />
        </Grid>
        <Grid size={6}>
          <TextField
            name="medicareId"
            label="Medicare ID *"
            value={values.medicareId}
            onChange={onChange}
            fullWidth
            required
            error={!!errors.medicareId}
            helperText={errors.medicareId}
            InputLabelProps={{
              sx: { color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } },
            }}
          />
        </Grid>
        <Grid size={6}>
          <TextField
            name="beneficiaryDob"
            label="Beneficiary Date of Birth *"
            type="date"
            value={values.beneficiaryDob}
            onChange={onChange}
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
              sx: { color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } },
            }}
            error={!!errors.beneficiaryDob}
            helperText={errors.beneficiaryDob}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BeneficiaryInfoSection;
