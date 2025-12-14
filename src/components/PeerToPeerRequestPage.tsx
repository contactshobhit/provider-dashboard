import React, { useState } from 'react';
import HeaderAppBar from './HeaderAppBar';
import MainMenu from './MainMenu';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useNavigate } from 'react-router-dom';
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
  { id: 'PA-001235', status: 'Pending' },
  { id: 'PA-001236', status: 'Denied' },
  { id: 'PA-001240', status: 'Pending' },
  { id: 'PA-001241', status: 'Denied' },
  { id: 'PA-001245', status: 'Pending' },
  { id: 'PA-001246', status: 'Denied' },
];

const TIME_SLOTS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

const PeerToPeerRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    paId: '',
    providerName: MOCK_PROVIDER.name,
    phone: MOCK_PROVIDER.phone,
    email: MOCK_PROVIDER.email,
    date1: '',
    time1: '',
    date2: '',
    time2: '',
    reason: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false);

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
    <Box sx={{ display: 'flex' }}>
      <HeaderAppBar />
      <MainMenu />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: 'calc(100vw - 240px)',
          minWidth: 0,
          bgcolor: 'background.default',
          pl: '20px',
          pr: '20px',
          pt: 4,
          pb: 0,
          ml: '240px',
          marginLeft: 0,
          marginTop: '64px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <Toolbar sx={{ minHeight: 24, p: 0 }} />
        <Paper elevation={2} sx={{ p: 4, mt: 4, minWidth: 400, maxWidth: 500, width: '100%' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Schedule Peer-to-Peer Call
          </Typography>
          <form onSubmit={handleSubmit} autoComplete="off">
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
                {MOCK_PA_LIST.filter((pa) => pa.status === 'Denied' || pa.status === 'Partial Denial').map(
                  (pa) => (
                    <MenuItem key={pa.id} value={pa.id}>
                      {pa.id} ({pa.status})
                    </MenuItem>
                  )
                )}
              </Select>
              {errors.paId && (
                <Typography color="error" variant="caption">
                  {errors.paId}
                </Typography>
              )}
            </FormControl>
            <TextField
              fullWidth
              label="Physician Name"
              name="providerName"
              margin="normal"
              value={form.providerName}
              InputProps={{ readOnly: true }}
            />
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
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: 16, marginBottom: 20, width: '100%' }}>
                  <div style={{ width: '50%' }}>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Preferred Date 1</label>
                    <TextField
                      name="date1"
                      type="date"
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                      value={form.date1}
                      onChange={handleChange}
                      required
                      error={!!errors.date1}
                      helperText={errors.date1}
                      fullWidth
                    />
                  </div>
                  <div style={{ width: '50%' }}>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Time Slot 1</label>
                    <FormControl fullWidth margin="normal" required error={!!errors.time1}>
                      <Select
                        labelId="time1-label"
                        id="time1"
                        name="time1"
                        value={form.time1}
                        displayEmpty
                        onChange={handleChange}
                        sx={{ background: '#fff', borderRadius: 1 }}
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
                  </div>
                </div>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <div
                  style={{
                    marginBottom: 20,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 16,
                    alignItems: 'flex-end',
                  }}
                >
                  <div style={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
                      Preferred Date 2 (optional)
                    </label>
                    <TextField
                      name="date2"
                      type="date"
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                      value={form.date2}
                      onChange={handleChange}
                      fullWidth
                    />
                  </div>
                  <div style={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
                      Time Slot 2 (optional)
                    </label>
                    <FormControl fullWidth margin="normal">
                      <Select
                        labelId="time2-label"
                        id="time2"
                        name="time2"
                        value={form.time2}
                        displayEmpty
                        onChange={handleChange}
                        sx={{ background: '#fff', borderRadius: 1 }}
                      >
                        <MenuItem value="">None</MenuItem>
                        {TIME_SLOTS.map((slot) => (
                          <MenuItem key={slot} value={slot}>
                            {slot}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </Grid>
            </Grid>
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
      </Box>
    </Box>
  );
};

export default PeerToPeerRequestPage;
