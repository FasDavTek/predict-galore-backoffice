import React, { useRef, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  Link,
  TextField,
  styled,
  Alert,
  CircularProgress,
} from "@mui/material";
import { AuthLayout } from "@/layouts/AuthLayout";
import { useDispatch, useSelector } from "react-redux";
import { 
  verifyOTP, 
  resendOTP, 
  clearOtpError,
  resetResendSuccess
} from "@/store/slices/authSlice";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";

const OTPInput = styled(TextField)({
  width: '64px',
  height: '64px',
  '& .MuiInputBase-input': {
    height: '64px',
    padding: 0,
    textAlign: 'center',
    fontSize: '24px',
    fontFamily: 'Inter',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#d9d9de',
    },
    '&:hover fieldset': {
      borderColor: '#42A605',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#42A605',
    },
  },
});

const validationSchema = yup.object({
  otp: yup
    .string()
    .required('OTP is required')
    .length(6, 'OTP must be exactly 6 digits')
    .matches(/^[0-9]+$/, 'OTP must contain only numbers')
});

const OTPVerificationPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    otpLoading,
    resendLoading,
    otpError,
    resendSuccess
  } = useSelector((state) => state.auth);
  
  const inputRefs = useRef([]);

  const formik = useFormik({
    initialValues: {
      otp: ['', '', '', '', '', '']
    },
    validationSchema,
    onSubmit: async (values) => {
      const otpValue = values.otp.join('');
      await dispatch(verifyOTP(otpValue));
    },
  });

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    return () => {
      dispatch(clearOtpError());
      dispatch(resetResendSuccess());
    };
  }, [dispatch]);

  const handleChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...formik.values.otp];
      newOtp[index] = value;
      formik.setFieldValue('otp', newOtp);

      // Move to next input if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !formik.values.otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResendCode = async (e) => {
    e.preventDefault();
    dispatch(resendOTP());
  };

  return (
    <AuthLayout
      title="Verify OTP"
      subtitle="Enter the 6-digit code sent to your email"
    >
      {otpError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {otpError.message}
        </Alert>
      )}
      
      {resendSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          New verification code has been sent successfully!
        </Alert>
      )}

      <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: '100%' }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mb: 3,
          gap: 2
        }}>
          {formik.values.otp.map((digit, index) => (
            <OTPInput
              key={index}
              inputRef={el => inputRefs.current[index] = el}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              error={formik.submitCount > 0 && formik.errors.otp}
              inputProps={{
                maxLength: 1,
                inputMode: 'numeric',
                pattern: '[0-9]*'
              }}
            />
          ))}
        </Box>

        {formik.submitCount > 0 && formik.errors.otp && (
          <Typography color="error" variant="caption" sx={{ display: 'block', mb: 2, textAlign: 'center' }}>
            {formik.errors.otp}
          </Typography>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={otpLoading}
          sx={{
            bgcolor: '#42A605',
            height: 56,
            '&:hover': {
              bgcolor: '#3a9504'
            },
            fontFamily: 'Inter',
            fontWeight: 600,
            mb: 3
          }}
        >
          {otpLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Verify OTP'
          )}
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ fontFamily: 'Inter', color: 'text.secondary', mb: 1 }}>
            Didn&apos;t receive the code?{' '}
            <Link 
              href="#" 
              onClick={handleResendCode}
              sx={{ 
                color: '#42A605', 
                textDecoration: 'none', 
                fontWeight: 500 
              }}
            >
              {resendLoading ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                'Resend'
              )}
            </Link>
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'Inter', color: 'text.secondary' }}>
            Wrong email address?{' '}
            <Link 
              href="/auth/register" 
              sx={{ 
                color: '#42A605', 
                textDecoration: 'none', 
                fontWeight: 500 
              }}
            >
              Change email
            </Link>
          </Typography>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default OTPVerificationPage;