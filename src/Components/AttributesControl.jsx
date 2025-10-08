import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, Typography, Box, useMediaQuery, useTheme } from "@mui/material";

export default function AttributesControl() {
  const [openAttributes, setOpenAttributes] = React.useState(false);
  const theme = useTheme();
  const isNarrow = useMediaQuery('(max-width:1090px)');

  return (
    <>
        {/* Floating button */}
        <Box
            sx={{
                position: 'absolute',
                bottom: 16,
                left: isNarrow ? 16 : 'auto',
                right: isNarrow ? 'auto' : 16,
                bgcolor: 'rgba(255, 255, 255, 0.5)',
                borderRadius: 1,
                boxShadow: "none",
                p: 1,
                cursor: 'pointer',
                userSelect: 'none',
                zIndex: 1000,
                color: "blue"
            }}
            onClick={() => setOpenAttributes(true)}
        >
            Attributes
        </Box>

        {/* Modal */}
        <Dialog
            open={openAttributes}
            onClose={() => setOpenAttributes(false)}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Map Attributions</DialogTitle>
            <DialogContent dividers sx={{ maxHeight: '60vh' }}>
                <Typography variant="body2">
                    <strong>OpenStreetMap </strong>© OpenStreetMap contributors
                </Typography>
                <Typography variant="body2">
                    <strong>Esri Imagery </strong>Tiles © Esri
                </Typography>
                <Typography variant="body2">
                    <strong>Scheduled Monuments </strong>© Crown copyright Cadw, DataMapWales, <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/">OGL v3.0</a>
                </Typography>
                <Typography variant="body2">
                    <strong>Registered Historic Parks & Gardens </strong> © Crown copyright Cadw, DataMapWales, <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/">OGL v3.0</a>
                </Typography>
                <Typography variant="body2">
                    <strong>National Monuments Record of Wales (NMRW) </strong> produced by the Royal Commission on the Ancient and Historical Monuments of Wales (RCAHMW). © Crown Database Right: RCAHMW, <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/">OGL v3.0</a>
                </Typography>
                <Typography variant="body2">
                    <strong>LiDAR </strong>© DataMapWales / Welsh Government
                </Typography>
            </DialogContent>
        </Dialog>
    </>
  );
}