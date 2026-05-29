import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  typography: {
    fontFamily: '"Roboto", sans-serif',
    h1: {
      fontFamily: '"Outfit", sans-serif',
      fontSize: "3rem",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: '"Outfit", sans-serif',
      fontSize: "1.5rem",
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: '"Outfit", sans-serif',
      fontSize: "1.25rem",
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h4: {
      fontFamily: '"Outfit", sans-serif',
      fontSize: "1.125rem",
      fontWeight: 700,
    },
    h5: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
    },
    h6: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
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
    primary: {
      main: '#0E8890',
      light: '#5AC6CD',
      dark: '#0B6E74',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#1A2D3A',
      secondary: '#646465ff',
    },
  },
});

// make fonts shrink for mobile
theme = responsiveFontSizes(theme);

export default theme;