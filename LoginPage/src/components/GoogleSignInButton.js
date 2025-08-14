import { Google as GoogleIcon } from '@mui/icons-material';
import { Alert, Box, Button, Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';

function GoogleSignInButton({ 
  onSuccess, 
  onError, 
  disabled = false, 
  text = "Sign in with Google" 
}) {
  const googleButtonRef = useRef(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [error, setError] = useState(null);

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT token:', error);
      return null;
    }
  };

  const handleCredentialResponse = async (response) => {
    try {
      // Decode the JWT token to get user information
      const userInfo = parseJwt(response.credential);
      
      if (userInfo) {
        const user = {
          id: userInfo.sub,
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
          given_name: userInfo.given_name,
          family_name: userInfo.family_name,
        };
        
        if (onSuccess) {
          onSuccess(user);
        }
      } else {
        throw new Error('Failed to parse user information');
      }
    } catch (error) {
      console.error('Error handling Google credential response:', error);
      if (onError) {
        onError(error);
      }
    }
  };

  const initializeGoogleSignIn = useCallback(() => {
    try {
      // Initialize Google Sign-In
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || "your-google-client-id.apps.googleusercontent.com",
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Render the Google Sign-In button
      if (googleButtonRef.current) {
        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          {
            theme: "outline",
            size: "large",
            type: "standard",
            shape: "rectangular",
            text: text.includes("Sign up") ? "signup_with" : "signin_with",
            logo_alignment: "left",
            width: "100%",
          }
        );
      }
    } catch (err) {
      console.error('Error initializing Google Sign-In:', err);
      setError('Failed to initialize Google Sign-In');
    }
  }, [text, handleCredentialResponse]);

  useEffect(() => {
    // Check if Google Identity Services is already loaded
    if (window.google && window.google.accounts) {
      initializeGoogleSignIn();
      setIsGoogleLoaded(true);
      return;
    }

    // Load Google Identity Services script if not already loaded
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (window.google && window.google.accounts) {
        initializeGoogleSignIn();
        setIsGoogleLoaded(true);
      } else {
        setError('Failed to load Google Sign-In');
      }
    };
    
    script.onerror = () => {
      setError('Failed to load Google Sign-In script');
    };
    
    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [initializeGoogleSignIn]);

  const handleFallbackSignIn = () => {
    // Fallback button for when Google Sign-In is not available
    if (isGoogleLoaded && window.google && window.google.accounts) {
      window.google.accounts.id.prompt();
    } else {
      setError('Google Sign-In is not available. Please try again later.');
    }
  };

  if (error) {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleFallbackSignIn}
          disabled={disabled}
          sx={{
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
            borderColor: '#dadce0',
            color: '#3c4043',
            '&:hover': {
              borderColor: '#d2e3fc',
              backgroundColor: '#f8f9fa',
            },
          }}
        >
          {text}
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {isGoogleLoaded ? (
        <Box
          ref={googleButtonRef}
          sx={{
            width: '100%',
            '& iframe': {
              borderRadius: '8px !important',
            },
          }}
        />
      ) : (
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          disabled={true}
          sx={{
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
            borderColor: '#dadce0',
            color: '#3c4043',
          }}
        >
          Loading Google Sign-In...
        </Button>
      )}
      
      <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
        By signing in with Google, you agree to our Terms of Service and Privacy Policy
      </Typography>
    </Box>
  );
}

export default GoogleSignInButton;
