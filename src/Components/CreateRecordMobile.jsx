// --- Imports ------------------------------------------------
import * as React from 'react';


// --- MUI Imports ------------------------------------------------
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';

// --- Icons ------------------------------------------------
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// --- Local components ------------------------------------------------
import CreateRecord from './CreateRecord';


// =============================================
// CreateRecordMobile
//==============================================
// A bottom sheet that slides up on mobile devices.
// It has two snap points: "peek" (about 30% height) and "full" (about 65% height).
// Users can toggle between these heights while keeping the map interactive behind it.
export default function CreateRecordMobile({
  open,
  onClose,
  resetPolygon,
  fetchRecords,
  onSuccess,
}) {
  // --- State -------------------------------
  // 'peek' | 'full'
  const [position, setPosition] = React.useState('full');

  // --- Config -------------------------------
  const heights = {
    peek: '30vh',
    full: '65vh',
  };

  // --- Handlers ------------------------------
  const toggle = () => setPosition((p) => (p === 'peek' ? 'full' : 'peek'));

  // --- Render -------------------------------
  return (
    <>
      {/* Fixed bottom sheet that does NOT block clicks outside it */}
      <Box
        sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: (theme) => theme.zIndex.drawer, // above map UI
          pointerEvents: 'none',                   // let clicks pass through by default
        }}
      >
        {/* The sheet itself captures events */}
        {open && (
          <Paper
            elevation={6}
            sx={{
                pointerEvents: 'auto',
                height: heights[position],
                overflow: 'hidden',
                bgcolor: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                flexDirection: 'column',
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
            }}
          >
            {/* Handle / header */}
            <Box sx={{ p: 1, pb: 0.5 }}>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 0.5 }}>
                <IconButton size="small" onClick={toggle} aria-label="Toggle size">
                  {position === 'peek' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
                <IconButton size="small" onClick={onClose} aria-label="Close">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            <Divider />

            {/* Scrollable content */}
            <Box sx={{ p: 1.5, flex: 1, minHeight: 0, overflow: 'auto', pb: 8 }}>
              <CreateRecord
                resetPolygon={resetPolygon}
                fetchRecords={fetchRecords}
                onSuccess={onSuccess}
              />
            </Box>
          </Paper>
        )}
      </Box>
    </>
  );
}