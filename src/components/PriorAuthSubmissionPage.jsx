
import React, { useEffect } from 'react';
import HeaderAppBar from './HeaderAppBar';
import MainMenu from './MainMenu';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import { Typography, Stepper, Step, StepLabel, Card, CardContent, Button, TextField, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchPARecords } from '../api/pa';
import SubmissionDetailsSection from './pa/SubmissionDetailsSection';
import ProcedureCodesArraySection from './pa/ProcedureCodesArraySection';
import BeneficiaryInfoSection from './pa/BeneficiaryInfoSection';
import FacilityProviderSection from './pa/FacilityProviderSection';
import PhysicianRequesterSection from './pa/PhysicianRequesterSection';
import MedicalRecordUploadSection from './pa/MedicalRecordUploadSection';

const steps = [
  'Patient & Service Details',
  'Provider & Facility Info',
  'Diagnosis & Justification',
  'File Uploads',
  'Review & Submit',
];


const initialValues = {
  submissionType: '',
  locationOfService: '',
  previousUTN: '',
  submittedDate: '',
  anticipatedDateOfService: '',
  procedureCodes: [''],
  modifiers: [''],
  units: [''],
  diagnosisCodes: ['', '', '', ''],
  beneficiaryLastName: '',
  beneficiaryFirstName: '',
  medicareId: '',
  beneficiaryDob: '',
  facilityName: '',
  facilityNpi: '',
  facilityCcn: '',
  facilityAddress1: '',
  facilityAddress2: '',
  facilityCity: '',
  facilityState: '',
  facilityZip: '',
  physicianName: '',
  physicianNpiPtan: '',
  requesterName: '',
  requesterPhone: '',
  requesterEmail: '',
};


const PriorAuthSubmissionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = React.useState('');
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);
  const handleCancel = () => setCancelDialogOpen(true);
  const handleCancelConfirm = () => {
    setCancelDialogOpen(false);
    navigate('/dashboard');
  };
  const handleCancelClose = () => setCancelDialogOpen(false);
  // Mock save as draft
  const handleSaveDraft = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSnackbarMsg('Draft saved successfully.');
    setSnackbarOpen(true);
    setTimeout(() => {
      setSnackbarOpen(false);
      navigate('/dashboard');
    }, 1500);
  };
  const [files, setFiles] = React.useState([]);
  const [uploadProgress, setUploadProgress] = React.useState([]);
  const handleFilesChange = (newFiles) => {
    setFiles(newFiles);
    setUploadProgress(newFiles.map(() => 0));
  };
  const [activeStep, setActiveStep] = React.useState(0);
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState({});

  // Fast-Track Resubmission: Check for paId and utn in query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paId = params.get('paId');
    const utn = params.get('utn');
    if (paId && utn) {
      setValues((prev) => ({
        ...prev,
        submissionType: 'resubmission',
        previousUTN: utn,
      }));
      // Optionally fetch and prefill patient data
      fetchPARecords().then((res) => {
        const record = res.data.records.find((r) => r.id === paId);
        if (record) {
          setValues((prev) => ({
            ...prev,
            beneficiaryLastName: record.patientName?.split(' ').slice(-1)[0] || '',
            beneficiaryFirstName: record.patientName?.split(' ').slice(0, -1).join(' ') || '',
            // Add more fields as needed, e.g., anticipatedDateOfService, etc.
          }));
        }
      });
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear previousUTN error on change
    if (name === 'previousUTN') {
      setErrors((prev) => ({ ...prev, previousUTN: undefined }));
    }
    // If user changes submissionType away from 'resubmission', clear previousUTN
    if (name === 'submissionType' && value !== 'resubmission') {
      setValues((prev) => ({ ...prev, previousUTN: '' }));
    }
  };

  // For array fields (procedureCodes, modifiers, units, diagnosisCodes)
  const handleArrayChange = (field, idx) => (e) => {
    const { value } = e.target;
    setValues((prev) => {
      const arr = [...prev[field]];
      arr[idx] = value;
      return { ...prev, [field]: arr };
    });
  };

  // Validation for Previous UTN
  const validateStep1 = () => {
    const newErrors = {};
    if (values.submissionType === 'resubmission') {
      if (!values.previousUTN || values.previousUTN.length !== 14) {
        newErrors.previousUTN = 'Previous UTN must be exactly 14 digits';
      }
    }
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  // Add/remove logic for procedure code rows
  const handleAddProcedureRow = () => {
    setValues((prev) => ({
      ...prev,
      procedureCodes: [...prev.procedureCodes, ''],
      modifiers: [...prev.modifiers, ''],
      units: [...prev.units, ''],
    }));
  };
  const handleRemoveProcedureRow = (idx) => {
    setValues((prev) => ({
      ...prev,
      procedureCodes: prev.procedureCodes.filter((_, i) => i !== idx),
      modifiers: prev.modifiers.filter((_, i) => i !== idx),
      units: prev.units.filter((_, i) => i !== idx),
    }));
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <HeaderAppBar />
      <MainMenu />
      <Box component="main" sx={{ flexGrow: 1, boxSizing: 'border-box', width: 'calc(100vw - 240px)', minWidth: 0, overflowX: 'auto', bgcolor: 'background.default', pl: '20px', pr: '20px', pt: 4, pb: 0, ml: '240px', marginLeft: 0 }}>
        <Toolbar sx={{ minHeight: 48 }} />
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
          New Prior Authorization Request
        </Typography>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Card>
        <CardContent>
          {/* Step 1: Patient & Service Details (BeneficiaryInfoSection + SubmissionDetailsSection) */}
          {activeStep === 0 && (
            <Box>
              {/* Group A: Beneficiary Info */}
              <BeneficiaryInfoSection
                values={values}
                errors={errors}
                onChange={handleChange}
              />
              {/* Group B: Submission Details (no procedure/modifier/unit fields) */}
              <Box mt={3}>
                <SubmissionDetailsSection
                  values={values}
                  errors={errors}
                  onChange={handleChange}
                  onArrayChange={null} // disables array fields in this section
                  hideProcedureFields
                />
              </Box>
              {/* Group C: Procedure Codes Array */}
              <Box mt={3}>
                <ProcedureCodesArraySection
                  procedureCodes={values.procedureCodes}
                  modifiers={values.modifiers}
                  units={values.units}
                  errors={errors}
                  onChange={handleArrayChange}
                  onAdd={handleAddProcedureRow}
                  onRemove={handleRemoveProcedureRow}
                />
              </Box>
            </Box>
          )}
          {/* Step 2: Provider & Facility Info (PhysicianRequesterSection + FacilityProviderSection) */}
          {activeStep === 1 && (
            <Box>
              <PhysicianRequesterSection
                values={values}
                errors={errors}
                onChange={handleChange}
              />
              <Box mt={3}>
                <FacilityProviderSection
                  values={values}
                  errors={errors}
                  onChange={handleChange}
                />
              </Box>
            </Box>
          )}
          {/* Step 3: Diagnosis & Justification (new text area) */}
          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Diagnosis & Justification</Typography>
              <TextField
                name="diagnosisJustification"
                label="Detailed Medical History / Justification *"
                value={values.diagnosisJustification || ''}
                onChange={handleChange}
                fullWidth
                required
                multiline
                minRows={4}
                error={!!errors.diagnosisJustification}
                helperText={errors.diagnosisJustification}
              />
            </Box>
          )}
          {/* Step 4: File Uploads */}
          {activeStep === 3 && (
            <MedicalRecordUploadSection
              files={files}
              onFilesChange={handleFilesChange}
              uploadProgress={uploadProgress}
            />
          )}
          {/* Step 5: Review & Submit (to be implemented) */}
          {activeStep === 4 && (
            <Typography variant="body1">Review & Submit (confirmation screen coming soon)</Typography>
          )}
        </CardContent>
      </Card>
      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, gap: 2 }}>
        {/* Left-aligned CANCEL */}
        <Button
          variant="text"
          color="inherit"
          onClick={handleCancel}
        >
          CANCEL
        </Button>
        {/* Right-aligned group */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSaveDraft}
          >
            SAVE AS DRAFT
          </Button>
          <Button
            variant="outlined"
            disabled={activeStep === 0}
            onClick={() => setActiveStep((prev) => prev - 1)}
          >
            Back
          </Button>
          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={() => {
                if (activeStep === 0) {
                  if (!validateStep1()) return;
                }
                setActiveStep((prev) => prev + 1);
              }}
              color="primary"
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              // onClick={handleSubmit} // To be implemented
            >
              SUBMIT PRIOR AUTHORIZATION
            </Button>
          )}
        </Box>
      </Box>
      <Dialog open={cancelDialogOpen} onClose={handleCancelClose}>
        <DialogTitle>Cancel Prior Authorization?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel? Any unsaved data will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClose} color="primary">
            Stay on Form
          </Button>
          <Button onClick={handleCancelConfirm} color="error" autoFocus>
            Yes, Cancel & Return
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1500}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
      </Box>
    </Box>
  );
};

export default PriorAuthSubmissionPage;
