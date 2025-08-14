import { yupResolver } from '@hookform/resolvers/yup';
import {
    CheckCircle,
    Login,
    Visibility,
    VisibilityOff
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Chip,
    Divider,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import GoogleSignInButton from './GoogleSignInButton';

// Validation schema
const loginSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

function LoginForm({ onSwitchToRegister }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginStatus, setLoginStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setLoginStatus(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock validation - replace with real authentication
      if (data.email === 'admin@example.com' && data.password === 'password123') {
        setLoginStatus({
          type: 'success',
          message: 'Login successful! Welcome back!',
        });
        setTimeout(() => {
          alert('Redirecting to dashboard...');
          reset();
        }, 2000);
      } else {
        setLoginStatus({
          type: 'error',
          message: 'Invalid email or password. Please try again.',
        });
      }
    } catch (error) {
      setLoginStatus({
        type: 'error',
        message: 'An error occurred. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = (user) => {
    setLoginStatus({
      type: 'success',
      message: `Welcome ${user.name}! Login successful via Google.`,
    });
    setTimeout(() => {
      alert('Redirecting to dashboard...');
    }, 2000);
  };

  const handleGoogleError = (error) => {
    setLoginStatus({
      type: 'error',
      message: 'Google login failed. Please try again.',
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Sign in to your account
        </Typography>
      </Box>

      {loginStatus && (
        <Alert 
          severity={loginStatus.type} 
          sx={{ mb: 2 }}
          icon={loginStatus.type === 'success' ? <CheckCircle /> : undefined}
        >
          {loginStatus.message}
        </Alert>
      )}

      <Stack spacing={3}>
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isLoading}
              InputProps={{
                style: { borderRadius: 8 },
              }}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isLoading}
              InputProps={{
                style: { borderRadius: 8 },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={!isValid || isLoading}
          startIcon={<Login />}
          sx={{
            mt: 2,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        <Divider sx={{ my: 2 }}>
          <Chip label="OR" size="small" />
        </Divider>

        <GoogleSignInButton
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          disabled={isLoading}
        />

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Don't have an account?{' '}
            <Button
              variant="text"
              onClick={onSwitchToRegister}
              sx={{ 
                textTransform: 'none',
                fontWeight: 600,
                p: 0,
                minWidth: 'auto',
              }}
            >
              Sign up here
            </Button>
          </Typography>
        </Box>

        {/* Demo Credentials */}
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="caption" display="block" gutterBottom>
            <strong>Demo Credentials:</strong>
          </Typography>
          <Typography variant="caption" display="block">
            Email: admin@example.com
          </Typography>
          <Typography variant="caption" display="block">
            Password: password123
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

export default LoginForm;
