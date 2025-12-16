import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import { PASubmissionFormValues } from '../../types';

interface ReviewSubmitSectionProps {
  values: PASubmissionFormValues;
  files: File[];
}

interface ReviewFieldProps {
  label: string;
  value: string | undefined;
}

const ReviewField: React.FC<ReviewFieldProps> = ({ label, value }) => (
  <Box sx={{ mb: 1 }}>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 500 }}>
      {value || '—'}
    </Typography>
  </Box>
);

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
    {icon}
    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
      {title}
    </Typography>
  </Box>
);

const formatDate = (dateString: string): string => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getSubmissionTypeLabel = (type: string): string => {
  switch (type) {
    case 'initial':
      return 'Initial';
    case 'resubmission':
      return 'Resubmission';
    default:
      return type || '—';
  }
};

const getLocationOfServiceLabel = (value: string): string => {
  const labels: Record<string, string> = {
    office: 'Office',
    outpatient: 'Outpatient',
    inpatient: 'Inpatient',
    home: 'Home',
    other: 'Other',
  };
  return labels[value] || value || '—';
};

const getPlaceOfServiceLabel = (value: string): string => {
  const labels: Record<string, string> = {
    'on-campus-opd': 'On Campus - Hospital Outpatient Department',
    'off-campus-opd': 'Off Campus - Hospital Outpatient Department',
  };
  return labels[value] || value || '—';
};

const getTypeOfBillLabel = (value: string): string => {
  const labels: Record<string, string> = {
    '131': '131 - Hospital Outpatient (Admit through Discharge)',
    '132': '132 - Hospital Outpatient (Interim First Claim)',
    '133': '133 - Hospital Outpatient (Interim Continuing)',
    '134': '134 - Hospital Outpatient (Interim Last Claim)',
  };
  return labels[value] || value || '—';
};

const ReviewSubmitSection: React.FC<ReviewSubmitSectionProps> = ({ values, files }) => {
  const isPartA = values.medicarePartType === 'A';
  const isPartB = values.medicarePartType === 'B';

  // Filter out empty procedure codes
  const procedureEntries = values.procedureCodes
    .map((code, idx) => ({
      code,
      modifier: values.modifiers[idx] || '',
      units: values.units[idx] || '',
    }))
    .filter((entry) => entry.code);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        Review & Submit
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please review all information below before submitting your Prior Authorization request.
      </Typography>

      {/* Medicare Part Selection */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isPartA ? (
            <LocalHospitalIcon sx={{ fontSize: 28, color: 'primary.main' }} />
          ) : (
            <MedicalServicesIcon sx={{ fontSize: 28, color: 'primary.main' }} />
          )}
          <Box>
            <Typography variant="body2" color="text.secondary">
              Medicare Part
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Part {values.medicarePartType} — {isPartA ? 'Institutional' : 'Professional'}
            </Typography>
          </Box>
          <Chip
            label={getSubmissionTypeLabel(values.submissionType)}
            size="small"
            color={values.submissionType === 'resubmission' ? 'warning' : 'default'}
            sx={{ ml: 'auto' }}
          />
        </Box>
      </Paper>

      <Grid container spacing={2}>
        {/* Submission Details */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <SectionHeader
              icon={<DescriptionIcon color="primary" />}
              title="Submission Details"
            />
            <Grid container spacing={2}>
              <Grid size={6}>
                <ReviewField label="Submission Type" value={getSubmissionTypeLabel(values.submissionType)} />
              </Grid>
              {values.submissionType === 'resubmission' && (
                <Grid size={6}>
                  <ReviewField label="Previous UTN" value={values.previousUTN} />
                </Grid>
              )}
              <Grid size={6}>
                <ReviewField label="Submitted Date" value={formatDate(values.submittedDate)} />
              </Grid>
              <Grid size={6}>
                <ReviewField label="Anticipated Date of Service" value={formatDate(values.anticipatedDateOfService)} />
              </Grid>
              {isPartA && (
                <>
                  <Grid size={6}>
                    <ReviewField label="Place of Service" value={getPlaceOfServiceLabel(values.placeOfService)} />
                  </Grid>
                  <Grid size={6}>
                    <ReviewField label="Type of Bill" value={getTypeOfBillLabel(values.typeOfBill)} />
                  </Grid>
                </>
              )}
              {isPartB && (
                <Grid size={6}>
                  <ReviewField label="Location of Service" value={getLocationOfServiceLabel(values.locationOfService)} />
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Beneficiary Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <SectionHeader
              icon={<PersonIcon color="primary" />}
              title="Beneficiary Information"
            />
            <Grid container spacing={2}>
              <Grid size={6}>
                <ReviewField label="Last Name" value={values.beneficiaryLastName} />
              </Grid>
              <Grid size={6}>
                <ReviewField label="First Name" value={values.beneficiaryFirstName} />
              </Grid>
              <Grid size={6}>
                <ReviewField label="Medicare ID" value={values.medicareId} />
              </Grid>
              <Grid size={6}>
                <ReviewField label="Date of Birth" value={formatDate(values.beneficiaryDob)} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Procedure Codes */}
        <Grid size={12}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <SectionHeader
              icon={<MedicalInformationIcon color="primary" />}
              title="Procedure Codes"
            />
            {procedureEntries.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {procedureEntries.map((entry, idx) => (
                  <Chip
                    key={idx}
                    label={`${entry.code}${entry.modifier ? ` (${entry.modifier})` : ''} — ${entry.units || '1'} unit(s)`}
                    variant="outlined"
                    color="primary"
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No procedure codes entered
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Physician Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <SectionHeader
              icon={<MedicalServicesIcon color="primary" />}
              title={isPartA ? 'Attending Physician' : 'Ordering/Referring Physician'}
            />
            <Grid container spacing={2}>
              <Grid size={12}>
                <ReviewField label="Name" value={values.physicianName} />
              </Grid>
              <Grid size={6}>
                <ReviewField label="NPI" value={values.physicianNpi} />
              </Grid>
              <Grid size={6}>
                <ReviewField label="PTAN" value={values.physicianPtan} />
              </Grid>
              <Grid size={12}>
                <ReviewField label="Address" value={values.physicianAddress} />
              </Grid>
              <Grid size={4}>
                <ReviewField label="City" value={values.physicianCity} />
              </Grid>
              <Grid size={4}>
                <ReviewField label="State" value={values.physicianState} />
              </Grid>
              <Grid size={4}>
                <ReviewField label="ZIP" value={values.physicianZip} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Facility Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <SectionHeader
              icon={<BusinessIcon color="primary" />}
              title={isPartA ? 'Facility Provider' : 'Facility/Rendering Provider'}
            />
            <Grid container spacing={2}>
              <Grid size={12}>
                <ReviewField label="Name" value={values.facilityName} />
              </Grid>
              <Grid size={6}>
                <ReviewField label="NPI" value={values.facilityNpi} />
              </Grid>
              <Grid size={6}>
                <ReviewField label="CCN" value={values.facilityCcn} />
              </Grid>
              <Grid size={12}>
                <ReviewField
                  label="Address"
                  value={[values.facilityAddress1, values.facilityAddress2].filter(Boolean).join(', ')}
                />
              </Grid>
              <Grid size={4}>
                <ReviewField label="City" value={values.facilityCity} />
              </Grid>
              <Grid size={4}>
                <ReviewField label="State" value={values.facilityState} />
              </Grid>
              <Grid size={4}>
                <ReviewField label="ZIP" value={values.facilityZip} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Requester Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <SectionHeader
              icon={<ContactPhoneIcon color="primary" />}
              title="Requester Information"
            />
            <Grid container spacing={2}>
              <Grid size={6}>
                <ReviewField label="Name" value={values.requesterName} />
              </Grid>
              <Grid size={6}>
                <ReviewField label="Phone/Extension" value={values.requesterPhone} />
              </Grid>
              <Grid size={6}>
                <ReviewField label="Email" value={values.requesterEmail} />
              </Grid>
              <Grid size={6}>
                <ReviewField label="Fax" value={values.requesterFax} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Diagnosis & Justification */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <SectionHeader
              icon={<DescriptionIcon color="primary" />}
              title="Diagnosis & Justification"
            />
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {values.diagnosisJustification || '—'}
            </Typography>
          </Paper>
        </Grid>

        {/* Uploaded Files */}
        <Grid size={12}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <SectionHeader
              icon={<AttachFileIcon color="primary" />}
              title="Uploaded Files"
            />
            {files.length > 0 ? (
              <List dense disablePadding>
                {files.map((file, idx) => (
                  <ListItem key={idx} disablePadding sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <AttachFileIcon fontSize="small" color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary={file.name}
                      secondary={`${(file.size / 1024).toFixed(1)} KB`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No files uploaded
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Paper
        sx={{
          p: 2,
          bgcolor: 'info.lighter',
          border: '1px solid',
          borderColor: 'info.light',
        }}
      >
        <Typography variant="body2" color="info.dark">
          By clicking "Submit Prior Authorization", you certify that all information provided is accurate and complete
          to the best of your knowledge. False or misleading information may result in denial of the request.
        </Typography>
      </Paper>
    </Box>
  );
};

export default ReviewSubmitSection;
