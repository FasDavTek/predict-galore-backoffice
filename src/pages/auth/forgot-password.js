import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotUserPassword } from '../../store/slices/auth/authSlice';
import AuthLayout from '../../components/AuthLayout';
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  Alert,
  CircularProgress,
  Box
} from '@mui/material';
import { FiMail, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { AUTH_FEATURES } from '../../utils/constants';
import Link from 'next/link';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(forgotUserPassword(email)).unwrap();
      setEmailSent(true);
      toast.success('Password reset link sent to your email!');
    } catch (err) {
      toast.error(err.message || 'Failed to send reset link');
    }
  };

  if (emailSent) {
    return (
      <AuthLayout title="Check Your Email" features={AUTH_FEATURES.forgotPassword}>
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: '50%',
            bgcolor: 'success.light',
            color: 'success.main',
            mb: 3
          }}>
            <FiCheckCircle size={24} />
          </Box>

          <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Check your email
          </Typography>

          <Typography variant="body1" color="text.secondary" gutterBottom>
            We&apos;ve sent a password reset link to{' '}
            <Box component="span" fontWeight="fontWeightMedium">
              {email}
            </Box>
          </Typography>

          <Alert severity="info" sx={{ mt: 3, textAlign: 'left' }}>
            If you don&apos;t see the email, check your spam folder or try resending.
          </Alert>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ mt: 4 }}
          >
            {loading ? 'Resending...' : 'Resend Email'}
          </Button>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link href="/auth/login" passHref>
              <Typography component="a" color="primary">
                Back to login
              </Typography>
            </Link>
          </Box>
        </Box>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Forgot Password" features={AUTH_FEATURES.forgotPassword}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Reset your password
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Enter your email address and we&apos;ll send you a link to reset your password.
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FiMail />
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          sx={{ mt: 2, mb: 2, py: 1.5 }}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>

        <Typography variant="body2" color="text.secondary" align="center">
          Remember your password?{' '}
          <Link href="/auth/login" passHref>
            <Typography component="a" variant="body2" color="primary">
              Sign in
            </Typography>
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;