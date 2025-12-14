import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, TextField, Checkbox, FormControlLabel, Chip } from '@mui/material';
import { fetchADRRecords } from '../api/adr';
import { submitADRDocuments } from '../api/adrSubmission';

const ADRSubmissionForm = ({ open = true, onClose }) => {
  const { claimId } = useParams();
  const navigate = useNavigate();
  // Custom close handler: navigates to /adr/management
  const handleClose = () => {
    if (onClose) onClose();
    navigate('/adr/management');
  };
  const [adr, setAdr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attachments, setAttachments] = useState([]);
  const [attest, setAttest] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchADRRecords()
      .then(res => {
        const found = res.data.records.find(r => r.claimId === claimId);
        setAdr(found);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load ADR details');
        setLoading(false);
      });
  }, [claimId]);

  const handleFileChange = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!attest) {
      setError('You must attest to the accuracy of the documents.');
      return;
    }
    if (attachments.length === 0) {
      setError('Please upload at least one document.');
      return;
    }
    try {
      await submitADRDocuments(claimId, { attachments });
      if (onClose) onClose();
      navigate('/adr/management', { state: { adrSubmitted: true, claimId } });
    } catch (err) {
      setError('Submission failed. Please try again.');
    }
  };

  if (loading) return <Dialog open={open}><DialogTitle>Submit ADR Documents</DialogTitle><DialogContent>Loading...</DialogContent></Dialog>;
  if (!adr) return <Dialog open={open} onClose={onClose}><DialogTitle>Submit ADR Documents</DialogTitle><DialogContent>ADR not found.</DialogContent></Dialog>;

  // Handle Escape key to close dialog
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };
  if (!adr) return <Dialog open={open} onClose={handleClose}><DialogTitle>Submit ADR Documents</DialogTitle><DialogContent>ADR not found.</DialogContent></Dialog>;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth onKeyDown={handleKeyDown}>
      <DialogTitle>Submit ADR Documents</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Claim Number: <Chip label={adr.claimId} color="primary" sx={{ fontWeight: 700, fontSize: 16 }} /></Typography>
          <Typography variant="subtitle1" sx={{ mt: 1 }}>UTN: <Chip label={adr.utn} color="info" sx={{ fontWeight: 700, fontSize: 15 }} /></Typography>
          <Typography variant="subtitle1" sx={{ mt: 1, color: 'error.main', fontWeight: 700 }}>ADR Deadline: {adr.dueDate}</Typography>
        </Box>
        <TextField
          label="Documentation Required"
          value={adr.documentSummary}
          InputProps={{ readOnly: true }}
          fullWidth
          multiline
          minRows={2}
          sx={{ mb: 2 }}
        />
        <Button
          variant="outlined"
          component="label"
          sx={{ mb: 2 }}
        >
          Upload Documents
          <input
            type="file"
            hidden
            multiple
            onChange={handleFileChange}
          />
        </Button>
        {attachments.length > 0 && (
          <Box sx={{ mb: 2 }}>
            {attachments.map((file, idx) => (
              <Typography key={idx} variant="caption">{file.name}</Typography>
            ))}
          </Box>
        )}
        <FormControlLabel
          control={<Checkbox checked={attest} onChange={e => setAttest(e.target.checked)} />}
          label="I attest that the documents submitted are complete and accurate to the best of my knowledge."
        />
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ADRSubmissionForm;
