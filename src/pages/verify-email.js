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
import { verifyEmail, clearAuthError,  } from "@/store/slices/auth/authSlice";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const EmailVerfication = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);
  const [emailSent, setEmailSent] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const result = await dispatch(verifyEmail(values.email));
      if (verifyEmail.fulfilled.match(result)) {
        setEmailSent(true);
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
      subtitle={
        emailSent
          ? "We've sent a password reset link to your email"
          : "Enter your email address to reset your password"
      }
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      )}

      {emailSent ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Check your inbox for instructions on resetting your password. If you
            don&apos;t see the email, check your spam folder.
          </Typography>
          <Button
            fullWidth
            variant="contained"
            href="/auth/login"
            sx={{
              bgcolor: "#42A605",
              height: 56,
              "&:hover": {
                bgcolor: "#3a9504",
              },
              fontFamily: "Inter",
              fontWeight: 600,
            }}
          >
            Back to Login
          </Button>
        </Box>
      ) : (
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{ width: "100%" }}
        >
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
              "Verify Email"
            )}
          </Button>

          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="body2"
              sx={{ fontFamily: "Inter", color: "text.secondary" }}
            >
              Remember your password?{" "}
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
      )}
    </AuthLayout>
  );
};

export default EmailVerfication;