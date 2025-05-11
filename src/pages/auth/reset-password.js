import React from "react";
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
  CheckCircle as CheckCircleIcon
} from "@mui/icons-material";
import { AuthLayout } from "@/layouts/AuthLayout";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearAuthError } from "@/store/slices/authSlice";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

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
    <Box sx={{ width: "100%", mb:2 }}>
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
  const { token } = router.query;
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!token) return;
      
      const result = await dispatch(
        resetPassword({ token, password: values.password })
      );
      
      if (resetPassword.fulfilled.match(result)) {
        setShowSuccessDialog(true);
      }
    },
  });

  const passwordsMatch = 
    formik.values.password && 
    formik.values.password === formik.values.confirmPassword;

  React.useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Create a strong password to secure your account"
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      )}

      <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: "100%" }}>
        <TextField
          fullWidth
          label="New Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
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
        
        <PasswordStrengthIndicator password={formik.values.password} />

        <TextField
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
          helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
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
          {formik.values.confirmPassword ? 
            (passwordsMatch ? "Password matches" : "Passwords do not match") : 
            ""}
        </Typography>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading || !formik.isValid}
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
          <Typography variant="body2" sx={{  color: "text.secondary" }}>
            Remember your password?{" "}
            <Link href="/auth/login" sx={{ color: "#42A605", textDecoration: "none", fontWeight: 500 }}>
              Back to Login
            </Link>
          </Typography>
        </Box>

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
              <Typography variant="body1" sx={{  color: "text.secondary", mb: 3 }}>
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
      </Box>
    </AuthLayout>
  );
};

export default ResetPasswordPage;