import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { resetUserPassword } from '../../store/slices/auth/authSlice';
import AuthLayout from '../../components/AuthLayout';
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  CircularProgress,
} from '@mui/material';
import { FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { AUTH_FEATURES } from '../../utils/constants';
import Link from 'next/link';

const ResetPasswordPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    try {
      await dispatch(resetUserPassword({
        token,
        password: formData.password
      })).unwrap();

      toast.success('Password reset successfully!');
      router.push('/auth/password-reset-success');
    } catch (err) {
      toast.error(err.message || 'Failed to reset password');
    }
  };

  return (
    <AuthLayout title="Reset Password" features={AUTH_FEATURES.forgotPassword}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Set new password
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Your new password must be different from previous used passwords.
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="New Password"
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

        <Box sx={{ mt: 2, mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Password requirements:
          </Typography>
          <List dense sx={{ py: 0 }}>
            <ListItem sx={{ py: 0 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <FiCheck size={16} />
              </ListItemIcon>
              <ListItemText primary="Minimum 8 characters" />
            </ListItem>
            <ListItem sx={{ py: 0 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <FiCheck size={16} />
              </ListItemIcon>
              <ListItemText primary="At least one number" />
            </ListItem>
            <ListItem sx={{ py: 0 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <FiCheck size={16} />
              </ListItemIcon>
              <ListItemText primary="At least one special character" />
            </ListItem>
          </List>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          sx={{ mt: 2, mb: 2, py: 1.5 }}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>

        <Typography variant="body2" color="text.secondary" align="center">
          <Link href="/auth/login" passHref>
            <Typography component="a" variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
              Back to login
            </Typography>
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
};

export default ResetPasswordPage;