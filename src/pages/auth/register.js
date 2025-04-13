import React, { useEffect } from "react";
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
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Mail as MailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { AuthLayout } from "@/layouts/AuthLayout";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearAuthError } from "@/store/slices/authSlice";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object({
  fullName: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const RegisterPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [agreeToTerms, setAgreeToTerms] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!agreeToTerms) return;
      
      const result = await dispatch(
        registerUser({
          name: values.fullName,
          email: values.email,
          password: values.password,
        })
      );
      
      if (registerUser.fulfilled.match(result)) {
        router.push("/auth/verify-email");
      }
    },
  });

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Sign up as an admin to get started"
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      )}
      
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: "100%" }}>
        <TextField
          fullWidth
          label="Full Name"
          name="fullName"
          value={formik.values.fullName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.fullName && Boolean(formik.errors.fullName)}
          helperText={formik.touched.fullName && formik.errors.fullName}
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
          label="Email address"
          name="email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MailIcon sx={{ color: "text.disabled" }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          sx={{ mb: 3 }}
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

        <TextField
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)
          }
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
          sx={{ mb: 3 }}
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

        <FormControlLabel
          control={
            <Checkbox
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              color={!agreeToTerms && formik.submitCount > 0 ? "error" : "primary"}
            />
          }
          label={
            <Typography variant="body2" sx={{ fontFamily: "Inter" }}>
              I agree to the{" "}
              <Link href="#" sx={{ color: "#42A605", textDecoration: "none" }}>
                Terms of Service
              </Link>
              {" "}and{" "}
              <Link href="#" sx={{ color: "#42A605", textDecoration: "none" }}>
                Privacy Policy
              </Link>
            </Typography>
          }
          sx={{ mb: 3 }}
        />
        {!agreeToTerms && formik.submitCount > 0 && (
          <Typography color="error" variant="caption" sx={{ mt: -2, mb: 2, display: "block" }}>
            You must agree to the terms and conditions
          </Typography>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{
            bgcolor: "#42A605",
            height: 56,
            "&:hover": {
              bgcolor: "#3a9504",
            },
            fontFamily: "Inter",
            fontWeight: 600,
            mb: 3,
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Create Account"
          )}
        </Button>

        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="body2"
            sx={{ fontFamily: "Inter", color: "text.secondary" }}
          >
            Already have an account?{" "}
            <Link
              href="/auth/login"
              sx={{
                color: "#42A605",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Log In
            </Link>
          </Typography>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default RegisterPage;