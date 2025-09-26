import React from 'react'
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material'

import LidarFooter from "../Components/LidarFooter";

function Account() {
  return (
    <>
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Account Page – Under Construction
      </Typography>
      <Typography variant="body1" gutterBottom>
        We're working on this page. In the future, you'll be able to manage:
      </Typography>
      <List sx={{ display: 'inline-block', textAlign: 'left' }}>
        <ListItem><ListItemText primary="Update your email and password" /></ListItem>
        <ListItem><ListItemText primary="Manage notification preferences" /></ListItem>
        <ListItem><ListItemText primary="Control privacy and data export" /></ListItem>
        <ListItem><ListItemText primary="Delete your account" /></ListItem>
      </List>
    </Box>
    
    <LidarFooter />

    </>
    
  )
}


export default Account;