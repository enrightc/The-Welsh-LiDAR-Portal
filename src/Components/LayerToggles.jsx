import React from 'react';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

/**
 * LayerToggles
 * Presentational list of overlay checkboxes.
 * Keeps CustomLayerControl focused on map logic.
 */
export default function LayerToggles({
  showCommunity, setShowCommunity,
  showCadwSm, setShowCadwSm,
  showParksWfs, setShowParksWfs,
  showNMRWfs, setShowNMRWfs,
  showDsmHillshade, setShowDsmHillshade,
  showMultiHillshade, setShowMultiHillshade, showDtmHillshade, setShowDtmHillshade
}) {
  const labelSx = {
    m: 0,
    p: { xs: 0.25, sm: 0.25 },
    borderRadius: 1,
    '& .MuiFormControlLabel-label': {
      fontSize: { xs: '0.92rem', sm: '1rem' },
      lineHeight: 1.2,
    },
    '&:hover': { backgroundColor: 'rgba(0,0,0,0.035)' },
  };

  return (
    <Stack spacing={0}>
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={showCommunity}
            onChange={(e) => setShowCommunity(e.target.checked)}
          />
        }
        label="Community Finds"
        sx={labelSx}
      />

      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={showCadwSm}
            onChange={(e) => setShowCadwSm(e.target.checked)}
          />
        }
        label="Cadw Scheduled Monuments"
        sx={labelSx}
      />

      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={showParksWfs}
            onChange={(e) => setShowParksWfs(e.target.checked)}
          />
        }
        label="Registered Historic Parks and Gardens"
        sx={labelSx}
      />

      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={showNMRWfs}
            onChange={(e) => setShowNMRWfs(e.target.checked)}
          />
        }
        label="National Monuments Record of Wales"
        sx={labelSx}
      />

      <Divider sx={{ my: 1.25, opacity: 0.6 }} />
      <Typography
        variant="overline"
        sx={{ px: 1, pb: 0.25, color: 'text.secondary', letterSpacing: 0.6 }}
      >
        LiDAR 
      </Typography>

      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={showDtmHillshade}
            onChange={(e) => setShowDtmHillshade(e.target.checked)}
          />
        }
        label="DTM Hillshade"
        sx={labelSx}
      />

      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={showDsmHillshade}
            onChange={(e) => setShowDsmHillshade(e.target.checked)}
          />
        }
        label="DSM Hillshade"
        sx={labelSx}
      />

      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={showMultiHillshade}
            onChange={(e) => setShowMultiHillshade(e.target.checked)}
          />
        }
        label="DSM Multi-directional"
        sx={labelSx}
      />
    </Stack>
  );
}