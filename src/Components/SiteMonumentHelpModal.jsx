import React from 'react'

// Mui Imports
import Dialog from '@mui/material/Dialog'; // Container for the modal
import DialogTitle from '@mui/material/DialogTitle'; // The top header area
import DialogContent from '@mui/material/DialogContent'; // scrollable/content section
import DialogActions from '@mui/material/DialogActions'; // the bottom bar, usually for buttons like "close" or "save"
import Button from '@mui/material/Button';

// A reusable modal component for helping with monument and site types.
// Props:
//  - open (boolean): whether the dialog is visible.
//  - onClose (function): called when the dialog should be closed.
export default function SiteMonumentHelpModal({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" aria-labelledby="site-monument-help-title">
      <DialogTitle id="site-monument-help-title">Site Type → Monument Types</DialogTitle>
      <DialogContent dividers>
        {/* Add content later */}
        Coming soon…
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">Got it</Button>
      </DialogActions>
    </Dialog>
  );
}

