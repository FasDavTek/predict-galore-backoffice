// pages/auth/verify-email.js
import React from "react";
import {
  TextField,
  Button,
  Box,
  InputAdornment,
  Typography,
  Link,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Mail as MailIcon } from "@mui/icons-material";
import { AuthLayout } from "@/layouts/AuthLayout";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail, clearAuthError, resendVerificationEmail } from "@/store/slices/authSlice";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";

const validationSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const EmailVerficationPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);
  
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await dispatch(verifyEmail(values.email));
        if (verifyEmail.fulfilled.match(result)) {
          toast.success(`We've sent a 6-digit code to ${values.email}. Please check your inbox.`);
          // Navigate to OTP verification page after 3 seconds
          setTimeout(() => {
            router.push({
              pathname: "/auth/verify-otp",
              query: { email: values.email }
            });
          }, 3000);
        }
      } catch (error) {
        toast.error(error.message || "Email verification failed");
      }
    },
  });

  React.useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  return (
    <AuthLayout
      title="Verify Email"
      subtitle="Enter your email address to receive verification token"
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{ width: "100%" }}
      >
        <TextField
          fullWidth
          label="Email Address"
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
                <MailIcon />
              </InputAdornment>
            ),
          }}
        />

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
            mb: 2,
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Verify Email"
          )}
        </Button>

        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="body2"
            sx={{ fontFamily: "Inter", color: "text.secondary" }}
          >
            Already verified?{" "}
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

export default EmailVerficationPage;