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
  token: yup.string().required("Verification token is required"),
});

const EmailVerficationPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);
  const [emailSent, setEmailSent] = React.useState(false);
  
  // Get email from query params if available
  const email = router.query.email || "";

  const formik = useFormik({
    initialValues: {
      token: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await dispatch(verifyEmail(values.token));
        if (verifyEmail.fulfilled.match(result)) {
          toast.success("Email verified successfully! You can now login.");
          router.push("/auth/login");
        }
      } catch (error) {
        toast.error(error.message || "Email verification failed");
      }
    },
  });

  const handleResendVerification = async () => {
    if (!email) {
      toast.error("No email address provided for verification");
      return;
    }
    try {
      await dispatch(resendVerificationEmail(email));
      toast.success("Verification email sent successfully!");
      setEmailSent(true);
    } catch (error) {
      toast.error("Failed to resend verification email. Please try again.");
    }
  };

  React.useEffect(() => {
    // Check for token in URL (from email link)
    const { token } = router.query;
    if (token) {
      formik.setFieldValue("token", token);
      formik.submitForm();
    }
  }, [router.query, formik]);

  React.useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  return (
    <AuthLayout
      title="Verify Email"
      subtitle="Enter the verification token sent to your email"
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
          label="Verification Token"
          name="token"
          value={formik.values.token}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.token && Boolean(formik.errors.token)}
          helperText={formik.touched.token && formik.errors.token}
          sx={{ mb: 3 }}
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

        <Button
          fullWidth
          variant="outlined"
          onClick={handleResendVerification}
          disabled={!email || loading}
          sx={{
            height: 56,
            fontFamily: "Inter",
            fontWeight: 600,
            mb: 3,
          }}
        >
          Resend Verification Email
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