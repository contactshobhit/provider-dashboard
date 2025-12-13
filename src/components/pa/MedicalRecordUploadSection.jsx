import React from 'react';
import { Box, Typography, Button, LinearProgress, List, ListItem, ListItemText, Paper } from '@mui/material';

const ACCEPTED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/tiff',
];

const MedicalRecordUploadSection = ({ files, onFilesChange, uploadProgress, onDrop }) => {
  const fileInputRef = React.useRef();

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).filter(file => ACCEPTED_TYPES.includes(file.type));
    onFilesChange(newFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files).filter(file => ACCEPTED_TYPES.includes(file.type));
    onFilesChange(newFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>E. Medical Record Submission</Typography>
      <Typography variant="body2" sx={{ mb: 2 }} color="text.secondary">
        Please attach supporting medical documentation (PDF, JPEG, PNG, TIFF) as required by the Medicare Part B coversheet. Drag and drop files below or click to select.
      </Typography>
      <Paper
        variant="outlined"
        sx={{ p: 3, mb: 2, border: '2px dashed #1976d2', textAlign: 'center', bgcolor: '#f8fafc', cursor: 'pointer' }}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Typography variant="body1" sx={{ mb: 1 }}>
          Drag and drop files here, or click to browse
        </Typography>
        <input
          type="file"
          hidden
          multiple
          accept={ACCEPTED_TYPES.join(',')}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </Paper>
      <List>
        {files && files.length > 0 ? files.map((file, idx) => (
          <ListItem key={file.name + idx}>
            <ListItemText primary={file.name} secondary={file.type} />
            {uploadProgress && uploadProgress[idx] !== undefined && (
              <Box sx={{ width: 120, ml: 2 }}>
                <LinearProgress variant="determinate" value={uploadProgress[idx]} />
              </Box>
            )}
          </ListItem>
        )) : (
          <ListItem>
            <ListItemText primary="No files uploaded yet." />
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default MedicalRecordUploadSection;
