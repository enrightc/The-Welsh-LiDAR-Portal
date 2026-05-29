import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const glassStyle = {
  bgcolor: 'rgba(255, 255, 255, 0.92)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
};

export default function CornerHelpBox({ isLoggedIn, isMobileDevice }) {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ position: 'absolute', bottom: 90, right: 16, zIndex: 1200 }}>
      {open ? (
        <Box sx={{ ...glassStyle, borderRadius: 2, p: 2, width: 280 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              How to use
            </Typography>
            <IconButton size="small" onClick={() => setOpen(false)} aria-label="Close help">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {!isLoggedIn ? (
            <Typography variant="body2" color="text.secondary">
              You must <Link to="/login">log in</Link> or <Link to="/register">register</Link> to create a new record.
            </Typography>
          ) : isMobileDevice ? (
            <Typography variant="body2" color="text.secondary">
              You're on a touch device. You can explore the map and view records, but drawing polygons works best with a mouse on desktop.
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Click <strong>Draw Polygon</strong> on the toolbar to outline a feature, then complete the form. You can only draw one polygon per record.
            </Typography>
          )}
        </Box>
      ) : (
        <Tooltip title="Help" arrow placement="left">
          <IconButton
            onClick={() => setOpen(true)}
            aria-label="Open help"
            sx={{
              ...glassStyle,
              borderRadius: '50%',
              '&:hover': { bgcolor: 'white' },
            }}
          >
            <HelpOutlineIcon sx={{ color: '#0E8890' }} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}
