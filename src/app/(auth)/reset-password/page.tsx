'use client';

import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  InputAdornment,
  IconButton,
  Typography,
  Link,
  CircularProgress,
} from '@mui/material';
import {
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { AuthCard } from '@/app/(auth)/features/components/AuthCard';
import { ErrorMessage } from '@/app/(auth)/features/components/ErrorMessage';
import { PasswordStrengthIndicator } from '../features/components/PasswordStrengthIndicator';
import {
  resetPasswordFirstStepFormValidation,
  resetPasswordTokenValidation,
  resetPasswordFinalStepFormValidation,
  ResetPasswordFirstStepData,
  ResetPasswordTokenData,
  ResetPasswordFinalStepData,
} from '../features/validations/auth';
import { ResetPasswordStep } from '@/app/(auth)/features/types/authTypes';
import { 
  useGenerateResetTokenMutation, 
  useConfirmResetTokenMutation, 
  useResetPasswordMutation 
} from '../features/api/authApi';

// Define error response type
interface ApiError {
  data?: {
    message?: string;
    fieldErrors?: Record<string, string>;
  };
  status?: number;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<ResetPasswordStep>(ResetPasswordStep.INITIAL);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authToken, setAuthToken] = useState<string>('');
  const [username, setUsername] = useState('');
  const [apiError, setApiError] = useState<ApiError | null>(null);

  // API mutations
  const [generateResetToken, { isLoading: isGeneratingToken }] = useGenerateResetTokenMutation();
  const [confirmResetToken, { isLoading: isConfirmingToken }] = useConfirmResetTokenMutation();
  const [resetPassword, { isLoading: isResettingPassword }] = useResetPasswordMutation();

  // Forms
  const { register: registerInitial, handleSubmit: handleSubmitInitial, formState: { errors: errorsInitial, isValid: isValidInitial } } = useForm<ResetPasswordFirstStepData>({
    resolver: zodResolver(resetPasswordFirstStepFormValidation),
    mode: 'onChange',
  });

  const { register: registerToken, handleSubmit: handleSubmitToken, formState: { errors: errorsToken, isValid: isValidToken } } = useForm<ResetPasswordTokenData>({
    resolver: zodResolver(resetPasswordTokenValidation),
    mode: 'onChange',
  });

  const { register: registerFinal, handleSubmit: handleSubmitFinal, formState: { errors: errorsFinal, isValid: isValidFinal }, getValues } = useForm<ResetPasswordFinalStepData>({
    resolver: zodResolver(resetPasswordFinalStepFormValidation),
    mode: 'onChange',
  });

  // Use getValues instead of watch to avoid React Compiler issues
  const getPasswordValue = () => getValues('password') || '';

  const handleInitialSubmit = async (data: ResetPasswordFirstStepData) => {
    setApiError(null);
    try {
      await generateResetToken({ username: data.username }).unwrap();
      setUsername(data.username);
      setCurrentStep(ResetPasswordStep.TOKEN_GENERATED);
      toast.success('Reset token sent to your email');
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setApiError(apiError);
      toast.error(apiError?.data?.message || 'Failed to generate token');
    }
  };

  const handleTokenSubmit = async (data: ResetPasswordTokenData) => {
    setApiError(null);
    try {
      const result = await confirmResetToken({ token: data.token }).unwrap();
      setAuthToken(result.token || data.token);
      setCurrentStep(ResetPasswordStep.TOKEN_CONFIRMED);
      toast.success('Token verified successfully');
    } catch (error: unknown) {
      setApiError(error as ApiError);
      toast.error('Invalid or expired token');
    }
  };

  const handleFinalSubmit = async (data: ResetPasswordFinalStepData) => {
    setApiError(null);
    try {
      await resetPassword({
        username,
        password: data.password,
        confirmPassword: data.confirmPassword,
        token: authToken,
      }).unwrap();
      
      setCurrentStep(ResetPasswordStep.COMPLETED);
      toast.success('Password reset successfully!');
      
      setTimeout(() => router.push('/login'), 2000);
    } catch (error: unknown) {
      setApiError(error as ApiError);
      toast.error('Failed to reset password');
    }
  };

  const handleResendToken = async () => {
    try {
      await generateResetToken({ username }).unwrap();
      toast.success('New token sent to your email');
    } catch (error: unknown) {
      toast.error('Failed to resend token');
      setApiError(error as ApiError);
    }
  };

  const getStepSubtitle = (): string => {
    switch (currentStep) {
      case ResetPasswordStep.INITIAL: return 'Enter your username to receive a reset token';
      case ResetPasswordStep.TOKEN_GENERATED: return 'Enter the token sent to your email';
      case ResetPasswordStep.TOKEN_CONFIRMED: return 'Create a strong password to secure your account';
      case ResetPasswordStep.COMPLETED: return 'Password reset successful! Redirecting to login...';
      default: return '';
    }
  };

  return (
    <AuthCard title="Reset Password" subtitle={getStepSubtitle()}>
      {apiError && <ErrorMessage error={apiError} />}

      {/* Step 1: Username Input */}
      {currentStep === ResetPasswordStep.INITIAL && (
        <Box component="form" onSubmit={handleSubmitInitial(handleInitialSubmit)} sx={{ width: '100%' }}>
          <TextField
            fullWidth
            label="Username"
            {...registerInitial('username')}
            error={!!errorsInitial.username}
            helperText={errorsInitial.username?.message}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="disabled" />
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" fullWidth variant="contained" disabled={isGeneratingToken || !isValidInitial} sx={{ height: 48, mb: 3 }}>
            {isGeneratingToken ? <CircularProgress size={24} /> : 'Generate Token'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Remember your password?{' '}
              <Link href="/login" sx={{ color: 'primary.main', fontWeight: 600 }}>Back to Login</Link>
            </Typography>
          </Box>
        </Box>
      )}

      {/* Step 2: Token Verification */}
      {currentStep === ResetPasswordStep.TOKEN_GENERATED && (
        <Box component="form" onSubmit={handleSubmitToken(handleTokenSubmit)} sx={{ width: '100%' }}>
          <TextField
            fullWidth
            label="Reset Token"
            {...registerToken('token')}
            error={!!errorsToken.token}
            helperText={errorsToken.token?.message}
            sx={{ mb: 3 }}
            placeholder="Enter the 6-digit token"
          />
          <Button type="submit" fullWidth variant="contained" disabled={isConfirmingToken || !isValidToken} sx={{ height: 48, mb: 2 }}>
            {isConfirmingToken ? <CircularProgress size={24} /> : 'Verify Token'}
          </Button>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Button variant="text" onClick={handleResendToken} disabled={isGeneratingToken} sx={{ color: 'primary.main' }}>
              {isGeneratingToken ? 'Sending...' : 'Resend Token'}
            </Button>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Wrong username?{' '}
              <Link href="#" onClick={() => setCurrentStep(ResetPasswordStep.INITIAL)} sx={{ color: 'primary.main', fontWeight: 600 }}>
                Go Back
              </Link>
            </Typography>
          </Box>
        </Box>
      )}

      {/* Step 3: New Password */}
      {currentStep === ResetPasswordStep.TOKEN_CONFIRMED && (
        <Box component="form" onSubmit={handleSubmitFinal(handleFinalSubmit)} sx={{ width: '100%' }}>
          <TextField
            fullWidth
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            {...registerFinal('password')}
            error={!!errorsFinal.password}
            helperText={errorsFinal.password?.message}
            sx={{ mb: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="disabled" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" color="inherit">
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <PasswordStrengthIndicator password={getPasswordValue()} />
          
          <TextField
            fullWidth
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            {...registerFinal('confirmPassword')}
            error={!!errorsFinal.confirmPassword}
            helperText={errorsFinal.confirmPassword?.message}
            sx={{ mt: 2, mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="disabled" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" color="inherit">
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <Button type="submit" fullWidth variant="contained" disabled={isResettingPassword || !isValidFinal} sx={{ height: 48, mb: 3 }}>
            {isResettingPassword ? <CircularProgress size={24} /> : 'Reset Password'}
          </Button>
        </Box>
      )}

      {/* Success State */}
      {currentStep === ResetPasswordStep.COMPLETED && (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="h6" sx={{ color: 'success.main', mb: 2, fontWeight: 600 }}>
            Password Reset Successful!
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
            Redirecting to login page...
          </Typography>
          <Button fullWidth variant="contained" onClick={() => router.push('/login')} sx={{ height: 48 }}>
            Go to Login
          </Button>
        </Box>
      )}
    </AuthCard>
  );
}