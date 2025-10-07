import React from 'react';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

/**
 * BaseMapRadios
 * Presentational radios for selecting the base map.
 * Keeps CustomLayerControl focused on map logic.
 */
export default function BaseMapRadios({ base, setBase }) {
  return (
    <>
      <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mb: 0 }}>
        Base
      </Typography>
      <RadioGroup
        value={base}
        onChange={(e) => setBase(e.target.value)}
        sx={{
          display: 'flex',
          gap: 0,
          '& .MuiFormControlLabel-root': {
            m: 0,
            p: 0,
            borderRadius: 1,
          },
          '& .MuiFormControlLabel-root:hover': {
            backgroundColor: 'rgba(0,0,0,0.04)',
          },
          '& .MuiFormControlLabel-label': {
            fontSize: { xs: '0.92rem', sm: '1rem' },
          },
        }}
      >
        <FormControlLabel value="osm" control={<Radio size="small" />} label="OpenStreetMap" />
        <FormControlLabel value="esri" control={<Radio size="small" />} label="ESRI Imagery" />
      </RadioGroup>
    </>
  );
}