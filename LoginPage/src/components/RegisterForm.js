import { yupResolver } from '@hookform/resolvers/yup';
import {
    CheckCircle,
    Email,
    Person,
    PersonAdd,
    Phone,
    Visibility,
    VisibilityOff,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    Chip,
    Divider,
    FormControlLabel,
    Grid,
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
const registerSchema = yup.object({
  firstName: yup
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces')
    .required('First name is required'),
  lastName: yup
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces')
    .required('Last name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  terms: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions'),
});

function RegisterForm({ onSwitchToLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerStatus, setRegisterStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: 'onChange',
  });

  const password = watch('password', '');

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: 'grey' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    const strengthMap = {
      0: { label: 'Very Weak', color: 'error' },
      1: { label: 'Weak', color: 'error' },
      2: { label: 'Fair', color: 'warning' },
      3: { label: 'Good', color: 'info' },
      4: { label: 'Strong', color: 'success' },
      5: { label: 'Very Strong', color: 'success' },
    };

    return { strength, ...strengthMap[strength] };
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setRegisterStatus(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock registration success
      setRegisterStatus({
        type: 'success',
        message: 'Registration successful! Please check your email for verification.',
      });
      
      setTimeout(() => {
        reset();
        onSwitchToLogin();
      }, 3000);
    } catch (error) {
      setRegisterStatus({
        type: 'error',
        message: 'Registration failed. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = (user) => {
    setRegisterStatus({
      type: 'success',
      message: `Welcome ${user.name}! Registration successful via Google.`,
    });
    setTimeout(() => {
      alert('Redirecting to dashboard...');
    }, 2000);
  };

  const handleGoogleError = (error) => {
    setRegisterStatus({
      type: 'error',
      message: 'Google registration failed. Please try again.',
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Account
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Join us today! It's quick and easy.
        </Typography>
      </Box>

      {registerStatus && (
        <Alert 
          severity={registerStatus.type} 
          sx={{ mb: 2 }}
          icon={registerStatus.type === 'success' ? <CheckCircle /> : undefined}
        >
          {registerStatus.message}
        </Alert>
      )}

      <Stack spacing={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="firstName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="First Name"
                  variant="outlined"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                    style: { borderRadius: 8 },
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="lastName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Last Name"
                  variant="outlined"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                    style: { borderRadius: 8 },
                  }}
                />
              )}
            />
          </Grid>
        </Grid>

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
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
                style: { borderRadius: 8 },
              }}
            />
          )}
        />

        <Controller
          name="phone"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Phone Number"
              type="tel"
              variant="outlined"
              error={!!errors.phone}
              helperText={errors.phone?.message || 'Enter 10-digit phone number'}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
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

        {password && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" color={`${passwordStrength.color}.main`}>
              Password Strength: {passwordStrength.label}
            </Typography>
            <Box sx={{ width: '100%', bgcolor: 'grey.200', borderRadius: 1, height: 4, mt: 0.5 }}>
              <Box
                sx={{
                  width: `${(passwordStrength.strength / 5) * 100}%`,
                  bgcolor: `${passwordStrength.color}.main`,
                  height: '100%',
                  borderRadius: 1,
                  transition: 'all 0.3s ease',
                }}
              />
            </Box>
          </Box>
        )}

        <Controller
          name="confirmPassword"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              variant="outlined"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              disabled={isLoading}
              InputProps={{
                style: { borderRadius: 8 },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          name="terms"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={field.value}
                  color="primary"
                  disabled={isLoading}
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the{' '}
                  <Button
                    variant="text"
                    size="small"
                    sx={{ 
                      textTransform: 'none',
                      p: 0,
                      minWidth: 'auto',
                      fontSize: 'inherit',
                    }}
                  >
                    Terms and Conditions
                  </Button>
                  {' '}and{' '}
                  <Button
                    variant="text"
                    size="small"
                    sx={{ 
                      textTransform: 'none',
                      p: 0,
                      minWidth: 'auto',
                      fontSize: 'inherit',
                    }}
                  >
                    Privacy Policy
                  </Button>
                </Typography>
              }
              sx={{ alignItems: 'flex-start' }}
            />
          )}
        />
        {errors.terms && (
          <Typography variant="caption" color="error" sx={{ mt: -2, ml: 1 }}>
            {errors.terms.message}
          </Typography>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={!isValid || isLoading}
          startIcon={<PersonAdd />}
          sx={{
            mt: 2,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <Divider sx={{ my: 2 }}>
          <Chip label="OR" size="small" />
        </Divider>

        <GoogleSignInButton
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          disabled={isLoading}
          text="Sign up with Google"
        />

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Already have an account?{' '}
            <Button
              variant="text"
              onClick={onSwitchToLogin}
              sx={{ 
                textTransform: 'none',
                fontWeight: 600,
                p: 0,
                minWidth: 'auto',
              }}
            >
              Sign in here
            </Button>
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

export default RegisterForm;
