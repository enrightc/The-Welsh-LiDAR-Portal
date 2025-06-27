import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function CornerHelpBox() {
  const [open, setOpen] = useState(true); // Show by default

  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 360,
        backgroundColor: '#f9f9f9',
        boxShadow: 6,
        borderRadius: 2,
        p: 2,
        zIndex: 1500,
        border: '1px solid #ddd',
      }}
    >
      <IconButton
        size="small"
        onClick={() => setOpen(false)}
        sx={{ position: 'absolute', top: 8, right: 8 }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          ❓ How to record a find:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Once you’ve identified a feature on the LiDAR map, click <strong>“Draw Polygon”</strong> to outline it.
          Then complete the form, ensuring all required fields are filled in.
          You can only draw one polygon per record.
        </Typography>
      </Box>
    </Box>
  );
}