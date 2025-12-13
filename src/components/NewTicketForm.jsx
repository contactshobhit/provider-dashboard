import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Typography
} from '@mui/material';

const CATEGORY_OPTIONS = [
  { value: 'Login/Access', label: 'Login/Access' },
  { value: 'PA Inquiry (General)', label: 'PA Inquiry (General)' },
  { value: 'PA Determination Question', label: 'PA Determination Question' },
  { value: 'Claim Inquiry', label: 'Claim Inquiry' },
  { value: 'Other', label: 'Other' },
];

const NewTicketForm = ({ open, onClose, onSubmit, paOptions = [], loading = false }) => {
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [paId, setPaId] = useState('');
  const [manualPaId, setManualPaId] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  const validate = () => {
    const newErrors = {};
    if (!category) newErrors.category = 'Category is required.';
    if (!subject) newErrors.subject = 'Subject is required.';
    else if (subject.length > 100) newErrors.subject = 'Max 100 characters.';
    if (!description) newErrors.description = 'Description is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ category, subject, paId, description, attachments });
  };

  const showPaId = [
    'PA Inquiry (General)',
    'PA Determination Question',
    'Claim Inquiry',
  ].includes(category);

  // Only show PAs with final determination
  const finalStatuses = ['Approved', 'Denied', 'Partial Denial'];
  const filteredPaOptions = paOptions.filter(pa => finalStatuses.includes(pa.status));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>New Support Ticket</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth required error={!!errors.category}>
            <InputLabel>Request Category</InputLabel>
            <Select
              value={category}
              label="Request Category"
              onChange={e => setCategory(e.target.value)}
            >
              {CATEGORY_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
            {errors.category && <Typography color="error" variant="caption">{errors.category}</Typography>}
          </FormControl>
          <TextField
            label="Subject"
            value={subject}
            onChange={e => setSubject(e.target.value.slice(0, 100))}
            required
            error={!!errors.subject}
            helperText={errors.subject || `${subject.length}/100`}
            inputProps={{ maxLength: 100 }}
            fullWidth
          />
          {showPaId && (
            <FormControl fullWidth>
              <InputLabel>Associated PA ID</InputLabel>
              {paId === '__manual__' ? (
                <TextField
                  label="Enter PA ID"
                  value={manualPaId}
                  onChange={e => setManualPaId(e.target.value)}
                  fullWidth
                  autoFocus
                  sx={{ mt: 1 }}
                />
              ) : (
                <Select
                  value={paId}
                  label="Associated PA ID"
                  onChange={e => setPaId(e.target.value)}
                >
                  <MenuItem value=""><em>None (General Question)</em></MenuItem>
                  {filteredPaOptions.map(pa => (
                    <MenuItem key={pa.id} value={pa.id}>{pa.id}</MenuItem>
                  ))}
                  <MenuItem value="__manual__">Other PA (Manual Entry)</MenuItem>
                </Select>
              )}
            </FormControl>
          )}
          <TextField
            label="Detailed Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            error={!!errors.description}
            helperText={errors.description}
            multiline
            minRows={4}
            fullWidth
          />
          <Button
            variant="outlined"
            component="label"
            sx={{ alignSelf: 'flex-start' }}
          >
            Attachments
            <input
              type="file"
              hidden
              multiple
              onChange={handleFileChange}
            />
          </Button>
          {attachments.length > 0 && (
            <Box sx={{ mt: 1 }}>
              {attachments.map((file, idx) => (
                <Typography key={idx} variant="caption">{file.name}</Typography>
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="secondary" disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>SUBMIT TICKET</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewTicketForm;
