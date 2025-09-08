import React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

function FilterPanelComponent({ periodOptions= [], period, onChangePeriod }) {
  // Local state just for this first step (we will lift this to the map later)

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 12,
        left: 300,
        zIndex: 1000,
        bgcolor: 'rgba(255,255,255,0.95)',
        borderRadius: 1,
        boxShadow: 2,
        p: 1,
        minWidth: 220,
      }}
    >
      <FormControl size="small" fullWidth>
        <InputLabel id="period-label">Period</InputLabel>
        <Select
            labelId="period-label"
            id="period-select"
            value={period}
            label="Period"
            onChange={(e) => onChangePeriod(e.target.value)}
        >
          <MenuItem value=""><em>All Periods</em></MenuItem>
            {periodOptions.map((name) => (
                <MenuItem key={name} value={name}>{name}</MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default FilterPanelComponent;