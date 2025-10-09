import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function Support() {
  return (
    <Box
      component="section"
      aria-labelledby="support-title"
      sx={{
        backgroundColor: '#102034',
        color: '#f1f5f9',
        textAlign: 'center',
        py: { xs: 6, md: 10 },
        px: { xs: 2, md: 6 },
      }}
    >
      <Typography
        id="support-title"
        variant="h1"
        component="h2"
        sx={{
          mb: 3,
          fontWeight: 600,
          letterSpacing: '0.5px',
        }}
      >
        Support Mapping the Past
      </Typography>

      <Typography variant="body1" sx={{ maxWidth: 700, mx: 'auto', mb: 3 }}>
        Mapping the Past is built independently by an archaeologist and aspiring developer — no funding, no institution behind it, just curiosity, late nights, and a desire to give something back to the community
      </Typography>

      <Typography variant="body1" sx={{ maxWidth: 700, mx: 'auto', mb: 3 }}>
        It’s free to use, but it takes time and money to keep it running and to build new features that help people explore and record Wales’s heritage. Your support helps cover the essentials: hosting, data access, and the tools that keep the site fast, accurate, and free for everyone.
      </Typography>

      <Typography variant="body1" sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
        If you’ve found the site useful, inspiring, or simply enjoy exploring it, you can help keep it going.
      </Typography>

      <Button
        variant="contained"
        color="warning"
        size="large"
        href="https://lnkd.in/esC9Heuy"
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          fontWeight: 600,
          textTransform: 'none',
          px: 4,
          py: 1.2,
          borderRadius: '8px',
          backgroundColor: '#ffb74d',
          '&:hover': {
            backgroundColor: '#ffa726',
          },
        }}
      >
        Support
      </Button>
    </Box>
  );
}

export default Support;