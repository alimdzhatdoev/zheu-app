import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#406343',
    },
    secondary: {
      main: '#F2A65A',
    },
    background: {
      default: '#F9F9F9',
    },
    text: {
      primary: '#333',
    },
  },
  typography: {
    fontFamily: `'Roboto', 'Arial', sans-serif`,
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;
