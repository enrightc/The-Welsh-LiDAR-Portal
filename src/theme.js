import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  typography: {
    fontFamily: '"Roboto", sans-serif',
    h1: {
      fontFamily: '"Outfit", sans-serif',
      fontSize: "3rem", // base (desktop)
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: '"Outfit", sans-serif',
      fontSize: "1.5rem",
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: '"Outfit", sans-serif',
      fontSize: "1.25rem",
      lineHeight: 1.4,
    },
    h4: {
      fontFamily: '"Outfit", sans-serif',
      fontSize: "1.125rem",
    },
    body1: {
      fontSize: "1.125rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.95rem",
      lineHeight: 1.5,
    },
  },
  palette: {
    text: {
      primary: '#1A2D3A',
      secondary: '#646465ff',
    },
  },
});

// make fonts shrink for mobile
theme = responsiveFontSizes(theme);

export default theme;