import {
    Box,
    Container,
    createTheme,
    CssBaseline,
    Paper,
    Tab,
    Tabs,
    ThemeProvider
} from '@mui/material';
import { useState } from 'react';
import './App.css';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

// Custom Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      light: '#9aa7ff',
      dark: '#3454b7',
    },
    secondary: {
      main: '#764ba2',
      light: '#a478d2',
      dark: '#462274',
    },
    background: {
      default: 'transparent',
      paper: 'rgba(255, 255, 255, 0.95)',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 600,
      color: '#333',
    },
    h6: {
      fontWeight: 500,
      color: '#555',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        },
      },
    },
  },
});

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            mt: 4,
            mb: 4,
            borderRadius: 3,
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab 
                label="Login" 
                id="auth-tab-0"
                aria-controls="auth-tabpanel-0"
                sx={{ 
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                }}
              />
              <Tab 
                label="Register" 
                id="auth-tab-1"
                aria-controls="auth-tabpanel-1"
                sx={{ 
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                }}
              />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <LoginForm onSwitchToRegister={() => setTabValue(1)} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <RegisterForm onSwitchToLogin={() => setTabValue(0)} />
          </TabPanel>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;
