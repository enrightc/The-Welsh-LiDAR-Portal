import React from 'react'
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material'

function Dashboard() {
    return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
            Dashboard – Under Construction
        </Typography>
        <Typography variant="body1" gutterBottom>
            We're building your activity hub. Soon you'll be able to:
        </Typography>
        <List sx={{ display: 'inline-block', textAlign: 'left' }}>
            <ListItem><ListItemText primary="See all your contributions (submitted & published)" /></ListItem>
            <ListItem><ListItemText primary="Resume drafts and continue editing" /></ListItem>
            <ListItem><ListItemText primary="View quick stats (total finds, polygons, last 7 days)" /></ListItem>
            <ListItem><ListItemText primary="Access saved places and bookmarks" /></ListItem>
            <ListItem><ListItemText primary=" Preview a mini map of your activity" /></ListItem>
        </List>
        </Box>
    )
}

export default Dashboard;