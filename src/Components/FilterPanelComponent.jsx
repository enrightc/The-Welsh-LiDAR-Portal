import React from 'react';
import { useState } from "react";
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { Tooltip, IconButton, Typography, RadioGroup, FormControlLabel, Radio, Checkbox, Stack } from "@mui/material";
import FilterAltIcon from '@mui/icons-material/FilterAlt';

function FilterPanelComponent({ periodOptions= [], period, onChangePeriod, siteTypeOptions= [], siteType, onChangeSiteType }) {
  // Local state just for this first step

  // Collapsible state — default closed
    const [collapsed, setCollapsed] = useState(true);

  return (
    <Box
      sx={{
        position: "absolute",
        zIndex: 1000,
        top: { xs: 80, sm: 20 },   
        right: { xs: 20, sm: 300 }, 
        bgcolor: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(10px)",
        borderRadius: 2, // 16px
        display: "flex",
        flexDirection: "column",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        minWidth: 260,
      }}
    >
      {/* Header bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          justifyContent: "space-between",
          px: 1.5,
          py: 1,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <FilterAltIcon fontSize="small" />
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Filters
          </Typography>
          <Typography variant="subtitle3" sx={{ fontWeight: 300 }}>
            (under construction)
          </Typography>
        </Stack>

        <Tooltip title={collapsed ? "Show filters" : "Hide filters"} arrow>
          <IconButton
            aria-label={collapsed ? "Show filters" : "Hide filters"}
            size="small"
            onClick={() => setCollapsed((c) => !c)}
            sx={{
              border: "1px solid rgba(0,0,0,0.15)",
              bgcolor: "white",
              "&:hover": { bgcolor: "#f5f5f5" },
            }}
          >
            <FilterAltIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </Box>

      {!collapsed && (
        <Box sx={{ px: 1.5, pb: 1.5 }}>
          <FormControl size="small" fullWidth sx={{
                mb: 3,
                }}>
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

          <FormControl size="small" fullWidth sx={{
                mb: 3,
                }}>
            <InputLabel id="site-type-label">Site Type</InputLabel>
            <Select
                labelId="site-type-label"
                id="site-type-select"
                value={siteType}
                label="site-type"
                onChange={(e) => onChangeSiteType(e.target.value)}
            >
              <MenuItem value=""><em>All Site Types</em></MenuItem>
                {siteTypeOptions.map((name) => (
                    <MenuItem key={name} value={name}>{name}</MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
      )}
    </Box>



    
    
  );
}

export default FilterPanelComponent;