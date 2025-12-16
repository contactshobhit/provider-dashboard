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
  Card,
  CardActionArea,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { PASubmissionFormValues, FormErrors } from '../../types';

interface SelectOption {
  value: string;
  label: string;
}

const SUBMISSION_TYPES: SelectOption[] = [
  { value: 'initial', label: 'Initial' },
  { value: 'resubmission', label: 'Resubmission' },
];

// Part B: Location of Service options
const LOCATIONS_OF_SERVICE: SelectOption[] = [
  { value: 'office', label: 'Office' },
  { value: 'outpatient', label: 'Outpatient' },
  { value: 'inpatient', label: 'Inpatient' },
  { value: 'home', label: 'Home' },
  { value: 'other', label: 'Other' },
];

// Part A: Place of Service options
const PLACES_OF_SERVICE: SelectOption[] = [
  { value: 'on-campus-opd', label: 'On Campus - Hospital Outpatient Department' },
  { value: 'off-campus-opd', label: 'Off Campus - Hospital Outpatient Department' },
];

// Part A: Type of Bill options
const TYPES_OF_BILL: SelectOption[] = [
  { value: '131', label: '131 - Hospital Outpatient (Admit through Discharge)' },
  { value: '132', label: '132 - Hospital Outpatient (Interim First Claim)' },
  { value: '133', label: '133 - Hospital Outpatient (Interim Continuing)' },
  { value: '134', label: '134 - Hospital Outpatient (Interim Last Claim)' },
];

interface SubmissionDetailsSectionProps {
  values: PASubmissionFormValues;
  errors: FormErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => void;
  onArrayChange?: ((field: string, idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => void) | null;
  hideProcedureFields?: boolean;
  onMedicarePartChange?: (part: 'A' | 'B') => void;
}

const SubmissionDetailsSection: React.FC<SubmissionDetailsSectionProps> = ({
  values,
  errors,
  onChange,
  onArrayChange,
  onMedicarePartChange,
}) => {
  const handlePreviousUTNChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 14);
    const syntheticEvent = {
      target: { name: 'previousUTN', value: val },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };

  const handlePartSelect = (part: 'A' | 'B'): void => {
    if (onMedicarePartChange) {
      onMedicarePartChange(part);
    }
  };

  const isPartA = values.medicarePartType === 'A';
  const isPartB = values.medicarePartType === 'B';
  const hasPartSelected = isPartA || isPartB;

  return (
    <Box>
      {/* Compact Medicare Part Selection */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Medicare Part *
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 8 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Card
                variant="outlined"
                onClick={() => handlePartSelect('A')}
                sx={{
                  cursor: 'pointer',
                  flex: 1,
                  borderWidth: 2,
                  borderColor: isPartA ? 'primary.main' : 'divider',
                  backgroundColor: isPartA ? 'action.selected' : 'background.paper',
                  transition: 'all 0.15s',
                  '&:hover': { borderColor: 'primary.main' },
                }}
              >
                <CardActionArea sx={{ py: 1.5, px: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalHospitalIcon sx={{ fontSize: 24, color: isPartA ? 'primary.main' : 'text.secondary' }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: isPartA ? 'primary.main' : 'text.primary' }}>
                          Part A
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Institutional
                        </Typography>
                      </Box>
                    </Box>
                    {isPartA && <CheckCircleIcon sx={{ color: 'primary.main', fontSize: 20 }} />}
                  </Box>
                </CardActionArea>
              </Card>

              <Card
                variant="outlined"
                onClick={() => handlePartSelect('B')}
                sx={{
                  cursor: 'pointer',
                  flex: 1,
                  borderWidth: 2,
                  borderColor: isPartB ? 'primary.main' : 'divider',
                  backgroundColor: isPartB ? 'action.selected' : 'background.paper',
                  transition: 'all 0.15s',
                  '&:hover': { borderColor: 'primary.main' },
                }}
              >
                <CardActionArea sx={{ py: 1.5, px: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MedicalServicesIcon sx={{ fontSize: 24, color: isPartB ? 'primary.main' : 'text.secondary' }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: isPartB ? 'primary.main' : 'text.primary' }}>
                          Part B
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Professional
                        </Typography>
                      </Box>
                    </Box>
                    {isPartB && <CheckCircleIcon sx={{ color: 'primary.main', fontSize: 20 }} />}
                  </Box>
                </CardActionArea>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Gate: Show form only after Part is selected */}
      {!hasPartSelected ? (
        <Box
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: 'grey.50',
            borderRadius: 1,
            border: '1px dashed',
            borderColor: 'grey.300',
          }}
        >
          <Typography color="text.secondary">
            Please select Medicare Part A or Part B above to continue
          </Typography>
        </Box>
      ) : (
        <>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Required Information
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
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
            >
              {SUBMISSION_TYPES.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {values.submissionType === 'resubmission' && (
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              name="previousUTN"
              label="Previous UTN *"
              value={values.previousUTN}
              onChange={handlePreviousUTNChange}
              fullWidth
              required
              inputProps={{ maxLength: 14, inputMode: 'numeric', pattern: '[0-9]*' }}
              error={!!errors.previousUTN}
              helperText={errors.previousUTN || 'Enter 14-digit UTN'}
              InputLabelProps={{
                sx: { color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } },
              }}
            />
          </Grid>
        )}

        {/* Part A specific fields */}
        {isPartA && (
          <>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth required>
                <InputLabel sx={{ color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } }}>
                  Place of Service
                </InputLabel>
                <Select
                  name="placeOfService"
                  value={values.placeOfService}
                  label="Place of Service"
                  onChange={onChange}
                  error={!!errors.placeOfService}
                >
                  {PLACES_OF_SERVICE.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth required>
                <InputLabel sx={{ color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } }}>
                  Type of Bill
                </InputLabel>
                <Select
                  name="typeOfBill"
                  value={values.typeOfBill}
                  label="Type of Bill"
                  onChange={onChange}
                  error={!!errors.typeOfBill}
                >
                  {TYPES_OF_BILL.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </>
        )}

        {/* Part B specific field */}
        {isPartB && (
          <Grid size={{ xs: 12, sm: 4 }}>
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
              >
                {LOCATIONS_OF_SERVICE.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            name="submittedDate"
            label="Submitted Date"
            type="date"
            value={values.submittedDate}
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true }}
            sx={{
              '& .MuiInputBase-input': {
                bgcolor: '#f5f5f5',
                color: 'text.secondary',
              },
            }}
            helperText="Auto-populated"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            name="anticipatedDateOfService"
            label="Anticipated Date of Service *"
            type="date"
            value={values.anticipatedDateOfService}
            onChange={onChange}
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
              sx: { color: 'primary.dark', '& .MuiInputLabel-asterisk': { color: 'primary.dark' } },
            }}
            error={!!errors.anticipatedDateOfService}
            helperText={errors.anticipatedDateOfService}
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
        </>
      )}
    </Box>
  );
};

export default SubmissionDetailsSection;
