import React from 'react'
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material'

function WhatIsLidar() {
  return (
    <>
        <header className="hero">
            <div className="container">
                <div className="hero-content">
                <div className="hero__text">
                    <h1 className="hero__title">LiDAR <span className="accent">Explained</span></h1>
                    <p className="hero__tagline"></p>
                </div>
                </div>
            </div>
        </header> 

        <main>
            <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                What Is LiDAR – Under Construction
            </Typography>
        </Box>
        </main>
        
    </>
    
    
  )
}

export default WhatIsLidar;