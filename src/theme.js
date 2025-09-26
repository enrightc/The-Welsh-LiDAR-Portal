import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Roboto", sans-serif',
    h1: {
      fontFamily: '"Outfit", sans-serif',
      fontSize: "3rem", // 48px
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: '"Outfit", sans-serif',
      fontSize: "1.5rem", // 24px
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: '"Outfit", sans-serif',
      fontSize: "1.25rem", // 20px
      lineHeight: 1.4,
    },
    h4: {
      fontFamily: '"Outfit", sans-serif',
      fontSize: "1.125rem", // 18px
    },
    body1: {
    fontSize: "1.125rem",   // default is 1rem (16px)
    lineHeight: 1.6,
  },
  body2: {
    fontSize: "0.95rem",  // default is 0.875rem (14px)
    lineHeight: 1.5,
  },
  },
  palette: {
    text: {
      primary: '#1A2D3A',   // dark text
      secondary: '#646465ff',     // muted text
    },
  },
});

export default theme;