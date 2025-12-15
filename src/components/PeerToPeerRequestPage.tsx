import React, { useState, useEffect } from 'react';
import PageLayout from './layout/PageLayout';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useNavigate, useParams } from 'react-router-dom';
import { PAStatus } from '../types';

interface MockProvider {
  name: string;
  phone: string;
  email: string;
}

interface PAListItem {
  id: string;
  status: PAStatus;
}

interface FormState {
  paId: string;
  providerName: string;
  phone: string;
  email: string;
  date1: string;
  time1: string;
  date2: string;
  time2: string;
  date3: string;
  time3: string;
  reason: string;
}

interface FormErrors {
  paId?: string;
  phone?: string;
  email?: string;
  date1?: string;
  time1?: string;
  time2?: string;
  reason?: string;
}

const MOCK_PROVIDER: MockProvider = {
  name: 'Dr. Smith',
  phone: '555-123-4567',
  email: 'dr.smith@provider.com',
};

const MOCK_PA_LIST: PAListItem[] = [
  { id: 'PA-001235', status: 'Non-Affirmed' },
  { id: 'PA-001236', status: 'Non-Affirmed' },
  { id: 'PA-001238', status: 'Partial Affirmation' },
  { id: 'PA-001241', status: 'Non-Affirmed' },
  { id: 'PA-001244', status: 'Non-Affirmed' },
  { id: 'PA-001246', status: 'Partial Affirmation' },
  { id: 'PA-001251', status: 'Partial Affirmation' },
  { id: 'PA-001252', status: 'Partial Affirmation' },
  { id: 'PA-001253', status: 'Partial Affirmation' },
];

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];

const PeerToPeerRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const { paId: urlPaId } = useParams<{ paId: string }>();
  const [form, setForm] = useState<FormState>({
    paId: '',
    providerName: MOCK_PROVIDER.name,
    phone: MOCK_PROVIDER.phone,
    email: MOCK_PROVIDER.email,
    date1: '',
    time1: '',
    date2: '',
    time2: '',
    date3: '',
    time3: '',
    reason: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false);

  // Pre-select PA ID from URL parameter
  useEffect(() => {
    if (urlPaId) {
      setForm((prev) => ({ ...prev, paId: urlPaId }));
    }
  }, [urlPaId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name as string]: value }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.paId) newErrors.paId = 'Required';
    if (!form.phone) newErrors.phone = 'Required';
    if (!form.email) newErrors.email = 'Required';
    if (!form.date1) newErrors.date1 = 'Required';
    if (!form.time1) newErrors.time1 = 'Required';
    if (!form.reason) newErrors.reason = 'Required';
    if (
      form.date1 &&
      form.date2 &&
      form.date1 === form.date2 &&
      form.time1 &&
      form.time2 &&
      form.time1 === form.time2
    ) {
      newErrors.time2 = 'Time Slot 2 must be different from Time Slot 1';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validate()) return;
    await new Promise((res) => setTimeout(res, 600));
    setConfirmationOpen(true);
  };

  return (
    <PageLayout sx={{ marginTop: '64px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <Toolbar sx={{ minHeight: 24, p: 0 }} />
        <Paper elevation={2} sx={{ p: 4, mt: 4, minWidth: 400, maxWidth: 800, width: '100%' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Schedule Peer-to-Peer Call
          </Typography>
          <form onSubmit={handleSubmit} autoComplete="off">
            {/* Row 1: PA ID and Physician Name */}
            <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth margin="normal" required error={!!errors.paId}>
                  <InputLabel id="pa-id-label">Associated PA ID</InputLabel>
                  <Select
                    labelId="pa-id-label"
                    id="pa-id"
                    name="paId"
                    value={form.paId}
                    label="Associated PA ID"
                    onChange={handleChange}
                  >
                    {MOCK_PA_LIST.filter((pa) => pa.status === 'Non-Affirmed' || pa.status === 'Partial Affirmation').map(
                      (pa) => (
                        <MenuItem key={pa.id} value={pa.id}>
                          {pa.id} ({pa.status})
                        </MenuItem>
                      )
                    )}
                  </Select>
                  <Typography variant="caption" sx={{ color: errors.paId ? 'error.main' : 'text.secondary', mt: 0.5 }}>
                    {errors.paId || 'Only non-affirmed or partially affirmed PAs are eligible'}
                  </Typography>
                </FormControl>
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Physician Name"
                  name="providerName"
                  margin="normal"
                  value={form.providerName}
                  InputProps={{ readOnly: true }}
                  sx={{
                    '& .MuiInputBase-input': {
                      bgcolor: '#f5f5f5',
                      color: 'text.secondary',
                    },
                  }}
                  helperText="Auto-filled from your profile"
                />
              </Box>
            </Box>

            {/* Row 2: Contact Phone and Email */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Contact Phone"
                  name="phone"
                  margin="normal"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  error={!!errors.phone}
                  helperText={errors.phone}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Contact Email"
                  name="email"
                  margin="normal"
                  value={form.email}
                  onChange={handleChange}
                  required
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Box>
            </Box>

            {/* Scheduling Preferences Section */}
            <Box
              sx={{
                bgcolor: '#f8f9fa',
                borderRadius: 2,
                p: 2,
                mt: 2,
                mb: 1,
                border: '1px solid #e0e0e0',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                Scheduling Preferences
              </Typography>

              {/* Date/Time Row 1 - Required */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Preferred Date 1 *
                  </Typography>
                  <TextField
                    name="date1"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={form.date1}
                    onChange={handleChange}
                    required
                    error={!!errors.date1}
                    helperText={errors.date1}
                    fullWidth
                    sx={{ bgcolor: '#fff' }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Time Slot 1 *
                  </Typography>
                  <FormControl fullWidth size="small" required error={!!errors.time1}>
                    <Select
                      id="time1"
                      name="time1"
                      value={form.time1}
                      displayEmpty
                      onChange={handleChange}
                      sx={{ bgcolor: '#fff' }}
                    >
                      <MenuItem value="" disabled>
                        Select time
                      </MenuItem>
                      {TIME_SLOTS.map((slot) => (
                        <MenuItem key={slot} value={slot}>
                          {slot}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.time1 && (
                      <Typography color="error" variant="caption">
                        {errors.time1}
                      </Typography>
                    )}
                  </FormControl>
                </Box>
              </Box>

              {/* Date/Time Row 2 - Optional */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: 'text.secondary' }}>
                    Preferred Date 2 (optional)
                  </Typography>
                  <TextField
                    name="date2"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={form.date2}
                    onChange={handleChange}
                    fullWidth
                    sx={{ bgcolor: '#fff' }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: 'text.secondary' }}>
                    Time Slot 2 (optional)
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      id="time2"
                      name="time2"
                      value={form.time2}
                      displayEmpty
                      onChange={handleChange}
                      sx={{ bgcolor: '#fff' }}
                    >
                      <MenuItem value="">None</MenuItem>
                      {TIME_SLOTS.map((slot) => (
                        <MenuItem key={slot} value={slot}>
                          {slot}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* Date/Time Row 3 - Optional */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: 'text.secondary' }}>
                    Preferred Date 3 (optional)
                  </Typography>
                  <TextField
                    name="date3"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={form.date3}
                    onChange={handleChange}
                    fullWidth
                    sx={{ bgcolor: '#fff' }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: 'text.secondary' }}>
                    Time Slot 3 (optional)
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      id="time3"
                      name="time3"
                      value={form.time3}
                      displayEmpty
                      onChange={handleChange}
                      sx={{ bgcolor: '#fff' }}
                    >
                      <MenuItem value="">None</MenuItem>
                      {TIME_SLOTS.map((slot) => (
                        <MenuItem key={slot} value={slot}>
                          {slot}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Box>
            <TextField
              fullWidth
              label="Reason for Request"
              name="reason"
              margin="normal"
              required
              multiline
              minRows={3}
              value={form.reason}
              onChange={handleChange}
              error={!!errors.reason}
              helperText={errors.reason}
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ flex: 1, fontWeight: 700, fontSize: 16, py: 1.2 }}
              >
                SUBMIT REQUEST
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ flex: 1, fontWeight: 700, fontSize: 16, py: 1.2 }}
                onClick={() => navigate('/dashboard')}
              >
                CANCEL
              </Button>
            </Box>
            <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
              <DialogTitle>P2P Request Submitted</DialogTitle>
              <DialogContent>
                <Typography sx={{ mt: 1, mb: 1 }}>
                  You will be contacted shortly to confirm scheduling.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setConfirmationOpen(false);
                    navigate('/dashboard');
                  }}
                  variant="contained"
                  color="primary"
                >
                  OK
                </Button>
              </DialogActions>
            </Dialog>
          </form>
        </Paper>
    </PageLayout>
  );
};

export default PeerToPeerRequestPage;
