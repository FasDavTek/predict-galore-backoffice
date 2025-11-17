'use client';

import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Typography,
  Link,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import {
  Mail as MailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { useForm, UseFormRegister, UseFormSetValue, FieldErrors, useWatch, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { ErrorMessage } from '@/features/auth/components/ErrorMessage';
import { PasswordStrengthIndicator } from '../../../features/auth/components/PasswordStrengthIndicator';
import { registerFormValidation, RegisterFormData, CountryCode } from '../../../features/auth/validations/auth';
import { useAppDispatch } from '@/hooks/redux';
import { useRegisterMutation, useCheckEmailQuery } from '../../../features/auth/api/authApi';
import { setToken, setAuthUser, setAuthStatus } from '../../../features/auth/slices/authSlice';
import { AuthStatus } from '@/features/auth/types/authTypes';

const countryCodes: CountryCode[] = [
  { code: '+1', name: 'United States', flag: '🇺🇸' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: '+33', name: 'France', flag: '🇫🇷' },
];

interface PhoneNumberInputProps {
  register: UseFormRegister<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
  setValue: UseFormSetValue<RegisterFormData>;
  control: Control<RegisterFormData>;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  register,
  errors,
  setValue,
  control,
}) => {
  const countryCodeValue = useWatch({ control, name: 'countryCode' });
  const selectedCountry = countryCodes.find(c => c.code === countryCodeValue) || countryCodes[0];

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <Autocomplete
        options={countryCodes}
        getOptionLabel={(option) => `${option.flag} ${option.code}`}
        value={selectedCountry}
        onChange={(_event, newValue) => {
          if (newValue) setValue('countryCode', newValue.code);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Code"
            error={!!errors.countryCode}
            helperText={errors.countryCode?.message}
            sx={{ width: 140 }}
          />
        )}
        disableClearable
      />
      <TextField
        fullWidth
        label="Phone Number"
        {...register('phoneNumber')}
        error={!!errors.phoneNumber}
        helperText={errors.phoneNumber?.message}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PhoneIcon color="disabled" />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

interface ApiError {
  data?: {
    message?: string;
    errors?: Record<string, string>;
  };
  status?: number;
}

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [apiError, setApiError] = useState<ApiError | null>(null);

  const [registerUser, { isLoading: isRegistering }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    control,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormValidation),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      countryCode: '+1',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      userTypeId: 1,
    },
  });

  // Use useWatch hook
  const email = useWatch({ control, name: 'email' });
  const watchPassword = useWatch({ control, name: 'password' });

  // Email availability check
  const { data: emailCheck } = useCheckEmailQuery(email, {
    skip: !email || !!errors.email,
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (!agreeToTerms) {
      toast.error('You must agree to the terms and conditions');
      return;
    }

    if (emailCheck && !emailCheck.available) {
      toast.error('Email is already registered');
      return;
    }

    setApiError(null);

    try {
      const registrationData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        userTypeId: data.userTypeId,
        phoneNumber: `${data.countryCode}${data.phoneNumber}`,
        password: data.password,
      };

      const result = await registerUser(registrationData).unwrap();
      
      if (result.token) {
        dispatch(setToken(result.token));
        dispatch(setAuthStatus(AuthStatus.AUTHENTICATED));
        
        if (result.user) {
          dispatch(setAuthUser(result.user));
        }
      }

      toast.success('Registration successful! Please verify your email.');
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (error: unknown) {
      console.error('Registration error:', error);
      setApiError(error as ApiError);
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <Box sx={{
      overflowY: 'auto',
      maxHeight: '70vh',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': { 
        display: 'none'
      },
      pr: 1,
    }}
    >
      <AuthCard
        title="Create an Account"
        subtitle="Join our platform to get started"
      >
        {apiError && <ErrorMessage error={apiError} />}

        <Box 
          component="form" 
          onSubmit={handleSubmit(onSubmit)} 
          sx={{ 
            width: '100%',
          }}
        >
          {/* Name Fields */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              label="First Name"
              {...register('firstName')}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="disabled" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Last Name"
              {...register('lastName')}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="disabled" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Email Field */}
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            {...register('email')}
            error={!!errors.email || (emailCheck && !emailCheck.available)}
            helperText={
              errors.email?.message || 
              (emailCheck && !emailCheck.available ? 'Email is already registered' : '')
            }
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailIcon color="disabled" />
                </InputAdornment>
              ),
            }}
          />

          {/* Phone Number */}
          <PhoneNumberInput
            register={register}
            errors={errors}
            setValue={setValue}
            control={control}
          />

          {/* Password Field */}
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{ mb: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="disabled" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    color="inherit"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <PasswordStrengthIndicator password={watchPassword || ''} />

          {/* Confirm Password Field */}
          <TextField
            fullWidth
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            sx={{ mt: 2, mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="disabled" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    color="inherit"
                  >
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Terms Agreement */}
          <FormControlLabel
            control={
              <Checkbox
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="body2">
                I agree to the{' '}
                <Link href="/terms" sx={{ color: 'primary.main' }}>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" sx={{ color: 'primary.main' }}>
                  Privacy Policy
                </Link>
              </Typography>
            }
            sx={{ mb: 3 }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isRegistering || !isValid || !agreeToTerms}
            sx={{ height: 48, mb: 3 }}
          >
            {isRegistering ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Create Account'
            )}
          </Button>

          {/* Login Link */}
          <Box sx={{ textAlign: 'center', pb: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Already have an account?{' '}
              <Link href="/login" sx={{ color: 'primary.main', fontWeight: 600 }}>
                Log In
              </Link>
            </Typography>
          </Box>
        </Box>
      </AuthCard>
    </Box>
  );
}