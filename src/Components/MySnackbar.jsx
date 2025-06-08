import React from 'react';
import Snackbar from '@mui/material/Snackbar';

export default function MySnackbar({ open, onClose, message }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      message={message}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    />
  );
}
