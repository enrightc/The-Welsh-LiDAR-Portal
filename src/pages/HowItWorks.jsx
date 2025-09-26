import React from 'react'

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import profileIconUrl from '../assets/icons/profileIcon.svg';
import magnifyingIconUrl from '../assets/icons/magnifyingIcon.svg';
import recordIconUrl from '../assets/icons/recordIcon.svg';
import mapIconUrl from '../assets/icons/mapIcon.svg';
import completedRecordIconUrl from '../assets/icons/completedRecordIcon.svg';

import LidarFooter from "../Components/LidarFooter";
import SignUpCTA from "../Components/SignUpCTA";

function HowItWorks() {
  return (
    <div>
        <header className="hero">
            <div className="container">
                <div className="hero-content">
                <div className="hero__text">
                    <h1 className="hero__title">How to Add Records on the <span className="accent">Welsh LiDAR Portal</span></h1>
                    <p className="hero__tagline"></p>
                </div>
                </div>
            </div>
        </header> 

        <main>
            <Container 
                maxWidth="md"
                sx={{
                    mt: -4,    // pulls container upwards.
                    position: "relative",
                    zIndex: 2,
                }}
                >
                <Box sx={{ bgcolor: "#EEF3F4" }}>
                    <Box
                        sx={{
                            borderBottom: '2px solid black',
                            mx: 6,
                            py: 6,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: { xs: 'column', sm: 'row' }, 
                            gap: { xs: 2, sm: 0 },                      
                        }}
                        >
                        {/* Left group */}
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={{ xs: 2, sm: 8 }}
                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                            sx={{ flex: 1 }}
                        >
                            <Typography variant="h6" color="text.secondary" sx={{ width: { xs: '100%', sm: 'auto' }, textAlign: 'center' }}>
                            Step 1
                            </Typography>

                            <Typography variant="h6" sx={{ maxWidth: { xs: '100%', md: '65%' }, textAlign: 'center' }}>
                            <strong>Register &amp; Login</strong>
                            </Typography>
                        </Stack>

                        {/* Right side icon (becomes bottom on mobile) */}
                        <Box
                            component="img"
                            src={profileIconUrl}
                            alt="Profile icon"
                            sx={{ width: 50, height: 50 }}
                        /> 
                    </Box>
                </Box>

                <Box sx={{ bgcolor: "#EEF3F4" }}>
                    <Box
                        sx={{
                            borderBottom: '2px solid black',
                            mx: 6,
                            py: 6,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: { xs: 'column', sm: 'row' }, 
                            gap: { xs: 2, sm: 0 },                      
                        }}
                        >
                        {/* Left group: step + [title+body stacked] */}
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={{ xs: 2, sm: 8 }}
                            alignItems={{ xs: 'center', sm: 'center' }}
                            sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}
                        >
                            <Typography variant="h6" color="text.secondary">Step 2</Typography>

                            {/* <-- wrap title + body in a vertical Box/Stack */}
                            <Box sx={{ maxWidth: { xs: '100%', md: '65%' } }}>
                            <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 700 }}>
                                Visit the LiDAR Portal
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                All users can browse the records in the Portal, but only logged-in
                                users can create new records.
                            </Typography>
                            </Box>
                        </Stack>

                        {/* Right side icon (becomes bottom on mobile) */}
                        <Box
                            component="img"
                            src={mapIconUrl}
                            alt="map icon"
                            sx={{ width: 50, height: 50 }}
                        />
                    </Box>
                </Box>

                <Box sx={{ bgcolor: "#EEF3F4" }}>
                    <Box
                        sx={{
                            borderBottom: '2px solid black',
                            mx: 6,
                            py: 6,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: { xs: 'column', sm: 'row' }, 
                            gap: { xs: 2, sm: 0 },                      
                        }}
                        >
                        {/* Left group */}
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={{ xs: 2, sm: 8 }}
                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                            sx={{ flex: 1 }}
                        >
                            <Typography variant="h6" color="text.secondary" sx={{ width: { xs: '100%', sm: 'auto' }, textAlign: 'center' }}>
                            Step 3
                            </Typography>

                            <Typography variant="h6" sx={{ maxWidth: { xs: '100%', md: '65%' }, textAlign: { xs: 'center', sm: 'left' } }}>
                            <strong>Search the map for anything that could be of archaeological origin</strong>
                            </Typography>
                        </Stack>

                        {/* Right side icon (becomes bottom on mobile) */}
                        <Box
                            component="img"
                            src={magnifyingIconUrl}
                            alt="magnifying glass icon"
                            sx={{ width: 50, height: 50 }}
                        /> 
                    </Box>
                </Box>

                <Box sx={{ bgcolor: "#EEF3F4" }}>
                    <Box
                        sx={{
                            borderBottom: '2px solid black',
                            mx: 6,
                            py: 6,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: { xs: 'column', sm: 'row' }, 
                            gap: { xs: 2, sm: 0 },                      
                        }}
                        >
                        {/* Left group */}
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={{ xs: 2, sm: 8 }}
                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                            sx={{ flex: 1 }}
                        >
                            <Typography variant="h6" color="text.secondary" sx={{ width: { xs: '100%', sm: 'auto' }, textAlign: 'center' }}>
                            Step 4
                            </Typography>

                            <Typography variant="h6" sx={{ maxWidth: { xs: '100%', md: '65%' }, textAlign: { xs: 'center', sm: 'left' } }}>
                            <strong>Check to see if a record already exists</strong>
                            </Typography>
                        </Stack>

                        {/* Right side icon (becomes bottom on mobile) */}
                        <Box
                            component="img"
                            src={recordIconUrl}
                            alt="record icon"
                            sx={{ width: 50, height: 50 }}
                        /> 
                    </Box>
                </Box>

                <Box sx={{ bgcolor: "#EEF3F4", marginBottom: 6, paddingBottom: 6 }}>
                    <Box
                        sx={{
                            borderBottom: '2px solid black',
                            mx: 6,
                            py: 6,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: { xs: 'column', sm: 'row' }, 
                            gap: { xs: 2, sm: 0 },                      
                        }}
                        >
                        {/* Left group */}
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={{ xs: 2, sm: 8 }}
                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                            sx={{ flex: 1 }}
                        >
                            <Typography variant="h6" color="text.secondary" sx={{ width: { xs: '100%', sm: 'auto' }, textAlign: 'center' }}>
                            Step 5
                            </Typography>

                            <Typography variant="h6" sx={{ maxWidth: { xs: '100%', md: '65%' }, textAlign: { xs: 'center', sm: 'left' } }}>
                            <strong>Complete the recording form and save your record to add it to the database</strong>
                            </Typography>
                        </Stack>

                        {/* Right side icon (becomes bottom on mobile) */}
                        <Box
                            component="img"
                            src={completedRecordIconUrl}
                            alt="completed record icon"
                            sx={{ width: 50, height: 50 }}
                        />
                    </Box>
                </Box>    
            </Container>
        </main>

        <SignUpCTA />
        <LidarFooter />

    </div>
  )
}

export default HowItWorks