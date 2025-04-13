import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/slices/auth/authSlice';
import AuthLayout from '../../components/AuthLayout';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  InputAdornment,
  IconButton,
  FormHelperText,
  Box,
  CircularProgress
} from '@mui/material';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { AUTH_FEATURES } from '../../utils/constants';
import Link from 'next/link';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });
  const dispatch = useDispatch();
  const { loading, status, error } = useSelector((state) => state.auth);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleShowPassword = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (!formData.agreeTerms) {
      toast.error("You must agree to the terms and conditions");
      return;
    }

    try {
      const result = await dispatch(registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })).unwrap();

      toast.success('Registration successful! Please check your email to verify your account.');
      router.push('/auth/email-verification');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <AuthLayout title="Create Account" features={AUTH_FEATURES.register}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Get started
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Create your admin account
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Full Name"
          name="name"
          autoComplete="name"
          autoFocus
          value={formData.name}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FiUser />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FiMail />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type={showPassword.password ? 'text' : 'password'}
          id="password"
          value={formData.password}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FiLock />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => toggleShowPassword('password')}
                  edge="end"
                >
                  {showPassword.password ? <FiEyeOff /> : <FiEye />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <FormHelperText sx={{ mx: 2 }}>
          Must be at least 8 characters
        </FormHelperText>

        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type={showPassword.confirmPassword ? 'text' : 'password'}
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FiLock />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => toggleShowPassword('confirmPassword')}
                  edge="end"
                >
                  {showPassword.confirmPassword ? <FiEyeOff /> : <FiEye />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <FormControlLabel
          control={
            <Checkbox
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              color="primary"
            />
          }
          label={
            <Typography variant="body2">
              I agree to the{' '}
              <Link href="#" passHref>
                <Typography component="a" color="primary" sx={{ cursor: 'pointer' }}>
                  Terms of Service
                </Typography>
              </Link>{' '}
              and{' '}
              <Link href="#" passHref>
                <Typography component="a" color="primary" sx={{ cursor: 'pointer' }}>
                  Privacy Policy
                </Typography>
              </Link>
            </Typography>
          }
          sx={{ mt: 2 }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading || !formData.agreeTerms}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          sx={{ mt: 2, mb: 2, py: 1.5 }}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>

        <Typography variant="body2" color="text.secondary" align="center">
          Already have an account?{' '}
          <Link href="/auth/login" passHref>
            <Typography component="a" variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
              Sign in
            </Typography>
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
};

export default RegisterPage;