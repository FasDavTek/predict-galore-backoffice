import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/slices/auth/authSlice';
import AuthLayout from '../../components/AuthLayout';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  InputAdornment,
  IconButton,
  Box,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { AUTH_FEATURES } from '../../utils/constants';
import Link from 'next/link';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <AuthLayout title="Login" features={AUTH_FEATURES.login}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ 
          fontWeight: 700,
          fontSize: '28px',
          color: 'gray.950',
          fontFamily: 'Inter, sans-serif',
          mb: 2
        }}
      >
        Welcome back
      </Typography>
      <Typography 
        variant="body1" 
        sx={{
          color: 'gray.600',
          fontFamily: 'Inter, sans-serif',
          fontSize: '16px',
          mb: 4
        }}
      >
        Sign in to your admin account
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FiMail color="gray.300" />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            '& .MuiInputLabel-root': {
              fontSize: '14px',
              color: 'gray.600'
            },
            '& .MuiOutlinedInput-root': {
              fontSize: '16px'
            }
          }}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FiLock color="gray.300" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  sx={{ color: 'gray.400' }}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 1,
            '& .MuiInputLabel-root': {
              fontSize: '14px',
              color: 'gray.600'
            },
            '& .MuiOutlinedInput-root': {
              fontSize: '16px'
            }
          }}
        />

        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          my: 2
        }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                color="primary"
                sx={{
                  color: 'gray.400',
                  '&.Mui-checked': {
                    color: 'green.500'
                  }
                }}
              />
            }
            label={
              <Typography sx={{ 
                fontSize: '14px',
                color: 'gray.600',
                fontFamily: 'Inter, sans-serif'
              }}>
                Remember me
              </Typography>
            }
          />
          <Link href="/auth/forgot-password" passHref legacyBehavior>
            <MuiLink 
              component="a" 
              sx={{ 
                fontSize: '14px',
                color: 'error.600',
                fontFamily: 'Inter, sans-serif',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Forgot password?
            </MuiLink>
          </Link>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ 
            mt: 2, 
            mb: 3, 
            py: 1.5,
            backgroundColor: 'green.500',
            '&:hover': {
              backgroundColor: 'green.600'
            },
            fontSize: '16px',
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            textTransform: 'none',
            borderRadius: '8px'
          }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>

        <Typography 
          variant="body2" 
          sx={{ 
            color: 'gray.600',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            textAlign: 'center'
          }}
        >
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" passHref legacyBehavior>
            <MuiLink 
              component="a" 
              sx={{ 
                color: 'green.500',
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Sign up
            </MuiLink>
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
};

export default LoginPage;