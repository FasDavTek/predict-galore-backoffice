import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  InputAdornment,
  IconButton,
  Typography,
  Link,
  LinearProgress,
  Dialog,
  DialogContent,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon
} from "@mui/icons-material";
import { AuthLayout } from "@/layouts/AuthLayout";
import { useDispatch, useSelector } from "react-redux";
import { 
  generatePasswordResetToken,
  confirmPasswordResetToken,
  resetPassword,
  clearAuthError 
} from "@/store/slices/authSlice";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";

// Step definitions
const STEPS = {
  INITIAL: 0,
  TOKEN_GENERATED: 1,
  TOKEN_CONFIRMED: 2,
  COMPLETED: 3
};

// password strength indicator
const PasswordStrengthIndicator = ({ password }) => {
  const calculateStrength = () => {
    let strength = 0;
    if (password.length > 0) strength += 20;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 20;
    return Math.min(strength, 100);
  };

  const strength = calculateStrength();
  const strengthText = () => {
    if (password.length === 0) return "";
    if (strength < 40) return "Weak";
    if (strength < 80) return "Medium";
    return "Strong";
  };

  const getColor = () => {
    if (password.length === 0) return "grey";
    if (strength < 40) return "error.main";
    if (strength < 80) return "warning.main";
    return "success.main";
  };

  return (
    <Box sx={{ width: "100%", mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="caption" sx={{ fontFamily: "Inter" }}>
          Password strength
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            fontFamily: "Inter",
            color: getColor()
          }}
        >
          {strengthText()}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={strength}
        sx={{
          height: 6,
          borderRadius: 3,
          backgroundColor: "grey.200",
          "& .MuiLinearProgress-bar": {
            backgroundColor: getColor(),
          },
        }}
      />
    </Box>
  );
};


const ResetPasswordPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, generatedToken } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(STEPS.INITIAL);

  // Formik for initial username step
  const initialFormik = useFormik({
    initialValues: {
      username: "",
    },
    onSubmit: async (values) => {
      try {
        const result = await dispatch(generatePasswordResetToken(values.username));
        if (generatePasswordResetToken.fulfilled.match(result)) {
          setCurrentStep(STEPS.TOKEN_GENERATED);
        }
      } catch (error) {
        console.error("Token generation error:", error);
      }
    },
  });

  // Formik for token confirmation step
  const tokenFormik = useFormik({
    initialValues: {
      token: "",
    },
    validationSchema: yup.object({
      token: yup.string().required("Token is required"),
    }),
    onSubmit: async (values) => {
      try {
       const result = await dispatch(confirmPasswordResetToken({
        token: values.token,
        username: initialFormik.values.username 
      }));
        if (confirmPasswordResetToken.fulfilled.match(result)) {
          setCurrentStep(STEPS.TOKEN_CONFIRMED);
        }
      } catch (error) {
        console.error("Token confirmation error:", error);
      }
    },
  });

  // Formik for password reset step
  const passwordFormik = useFormik({
    initialValues: {
      username: initialFormik.values.username,
      password: "",
      confirmPassword: "",
    },
    validationSchema: yup.object({
      password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const result = await dispatch(resetPassword(values));
        if (resetPassword.fulfilled.match(result)) {
          setShowSuccessDialog(true);
          setCurrentStep(STEPS.COMPLETED);
        }
      } catch (error) {
        console.error("Password reset error:", error);
      }
    },
  });

  const passwordsMatch = 
    passwordFormik.values.password && 
    passwordFormik.values.password === passwordFormik.values.confirmPassword;

  // Apply backend field errors to formik errors
  useEffect(() => {
    if (error?.fieldErrors) {
      const currentFormik = 
        currentStep === STEPS.INITIAL ? initialFormik :
        currentStep === STEPS.TOKEN_GENERATED ? tokenFormik :
        passwordFormik;
      
      Object.entries(error.fieldErrors).forEach(([field, message]) => {
        currentFormik.setFieldError(field, message);
      });
    }
  }, [error, currentStep, initialFormik, passwordFormik, tokenFormik]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  return (
    <AuthLayout
      title="Reset Password"
      subtitle={
        currentStep === STEPS.INITIAL ? "Enter your username to receive a reset token" :
        currentStep === STEPS.TOKEN_GENERATED ? "Enter the token sent to your email" :
        "Create a strong password to secure your account"
      }
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      )}

      {/* Step 1: Username input */}
      {currentStep === STEPS.INITIAL && (
        <Box component="form" onSubmit={initialFormik.handleSubmit} sx={{ width: "100%" }}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={initialFormik.values.username}
            onChange={initialFormik.handleChange}
            onBlur={initialFormik.handleBlur}
            error={initialFormik.touched.username && Boolean(initialFormik.errors.username)}
            helperText={initialFormik.touched.username && initialFormik.errors.username}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: "text.disabled" }} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || !initialFormik.values.username}
            sx={{
              bgcolor: "#42A605",
              height: 56,
              "&:hover": {
                bgcolor: "#3a9504",
              },
              "&.Mui-disabled": {
                bgcolor: "#C4E3B2",
                color: "#fff"
              },
              mb: 3
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Generate Token"
            )}
          </Button>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Remember your password?{" "}
              <Link href="/auth/login" sx={{ color: "#42A605", textDecoration: "none", fontWeight: 500 }}>
                Back to Login
              </Link>
            </Typography>
          </Box>
        </Box>
      )}

      {/* Step 2: Token confirmation */}
      {currentStep === STEPS.TOKEN_GENERATED && (
        <Box component="form" onSubmit={tokenFormik.handleSubmit} sx={{ width: "100%" }}>
          <TextField
            fullWidth
            label="Reset Token"
            name="token"
            value={tokenFormik.values.token}
            onChange={tokenFormik.handleChange}
            onBlur={tokenFormik.handleBlur}
            error={tokenFormik.touched.token && Boolean(tokenFormik.errors.token)}
            helperText={tokenFormik.touched.token && tokenFormik.errors.token}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || !tokenFormik.values.token}
            sx={{
              bgcolor: "#42A605",
              height: 56,
              "&:hover": {
                bgcolor: "#3a9504",
              },
              "&.Mui-disabled": {
                bgcolor: "#C4E3B2",
                color: "#fff"
              },
              mb: 3
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Confirm Token"
            )}
          </Button>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Didn&apos;t receive a token?{" "}
              <Link 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentStep(STEPS.INITIAL);
                }}
                sx={{ color: "#42A605", textDecoration: "none", fontWeight: 500 }}
              >
                Resend Token
              </Link>
            </Typography>
          </Box>
        </Box>
      )}

      {/* Step 3: Password reset */}
      {currentStep === STEPS.TOKEN_CONFIRMED && (
        <Box component="form" onSubmit={passwordFormik.handleSubmit} sx={{ width: "100%" }}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={passwordFormik.values.username}
            disabled
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: "text.disabled" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="New Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={passwordFormik.values.password}
            onChange={passwordFormik.handleChange}
            onBlur={passwordFormik.handleBlur}
            error={passwordFormik.touched.password && Boolean(passwordFormik.errors.password)}
            helperText={passwordFormik.touched.password && passwordFormik.errors.password}
            sx={{ mb: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: "text.disabled" }} />
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
          
          <PasswordStrengthIndicator password={passwordFormik.values.password} />

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={passwordFormik.values.confirmPassword}
            onChange={passwordFormik.handleChange}
            onBlur={passwordFormik.handleBlur}
            error={passwordFormik.touched.confirmPassword && Boolean(passwordFormik.errors.confirmPassword)}
            helperText={passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword}
            sx={{ mt: 3, mb: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: "text.disabled" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Typography 
            variant="caption" 
            sx={{ 
              fontFamily: "Inter",
              color: passwordsMatch ? "success.main" : "grey.500",
              display: "block",
              mb: 3
            }}
          >
            {passwordFormik.values.confirmPassword ? 
              (passwordsMatch ? "Password matches" : "Passwords do not match") : 
              ""}
          </Typography>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || !passwordFormik.isValid}
            sx={{
              bgcolor: "#42A605",
              height: 56,
              "&:hover": {
                bgcolor: "#3a9504",
              },
              "&.Mui-disabled": {
                bgcolor: "#C4E3B2",
                color: "#fff"
              },
              mb: 3
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Reset Password"
            )}
          </Button>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Remember your password?{" "}
              <Link href="/auth/login" sx={{ color: "#42A605", textDecoration: "none", fontWeight: 500 }}>
                Back to Login
              </Link>
            </Typography>
          </Box>
        </Box>
      )}

      {/* Success Dialog */}
      <Dialog
        open={showSuccessDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 2
          }
        }}
      >
        <DialogContent>
          <Box sx={{ textAlign: "center", py: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: "#42A605", mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              Password Reset Successful
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
              Your password has been reset successfully. You can now log in with your new password.
            </Typography>
            <Button
              fullWidth
              variant="contained"
              href="/auth/login"
              sx={{
                bgcolor: "#42A605",
                height: 56,
                "&:hover": {
                  bgcolor: "#3a9504"
                },
                fontWeight: 600
              }}
            >
              Back to Login
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </AuthLayout>
  );
};

export default ResetPasswordPage;