import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { loginUser } from '../store/slices/auth/authSlice';
import {
  TextField,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";

import {
  Mail as MailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
 import { AuthLayout } from "@/layouts/AuthLayout";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <AuthLayout
      title="Log In"
      subtitle="Enter your credentials to access your account"
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        <TextField
          fullWidth
          label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MailIcon sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}>
          <FormControlLabel
            control={<Checkbox />}
            label="Remember me"
            sx={{ '& .MuiTypography-root': { fontFamily: 'Inter' } }}
          />
          <Button
            color="error"
            sx={{
              textTransform: 'none',
              fontFamily: 'Inter',
              fontWeight: 500
            }}
          >
            Forgot Password?
          </Button>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
            disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{
            bgcolor: '#42A605',
            height: 56,
            '&:hover': {
              bgcolor: '#3a9504'
            },
            fontFamily: 'Inter',
            fontWeight: 600
          }}
        >
             {loading ? 'Signing in...' : ' Log into Account'}
         
        </Button>
      </Box>
    </AuthLayout>
  );
};

export default LoginPage;