import React, { useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  CircularProgress,
  Link,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { AuthLayout } from "@/layouts/AuthLayout";
import { useDispatch, useSelector } from "react-redux";
import { adminSignin, clearAuthError } from "@/store/slices/authSlice";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { redirect } = router.query;
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

 const formik = useFormik({
  initialValues: {
    username: "",
    password: "",
    rememberMe: false,
  },
  validationSchema,
  onSubmit: async (values, { setSubmitting }) => {
    try {
      const loginData = {
        username: values.username,
        password: values.password,
      };

      console.log("Login attempt with:", { username: values.username }); // Log attempt without password

      // console.log("Login attempt with:", { username: values.username }); // Log attempt without password

      
      await dispatch(adminSignin(loginData)).unwrap();

      if (values.rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      setSnackbar({
        open: true,
        message: "Login successful! Redirecting...",
        severity: "success",
      });

     // Redirect to the original requested page or dashboard if no redirect specified
        const destination = redirect && typeof redirect === 'string' 
          ? decodeURIComponent(redirect) 
          : "/dashboard";
        router.push(destination);
    } catch (err) {
      // Detailed error logging for debugging
      console.error("Login Error Details:", {
        fullError: err, // Complete error object
        statusCode: err?.status,
        serverMessage: err?.message,
        timestamp: new Date().toISOString()
      });

      // User-friendly error messages based on different error cases
      let errorMessage = "Login failed. Please try again.";
      
       if (err?.status === 400) {
        errorMessage = "Invalid request. Please check your input and try again.";
      } else if (err?.status === 401) {
        errorMessage = "Invalid username or password";
      } else if (err?.status === 403) {
        errorMessage = "Account not authorized";
      } else if (err?.status === 429) {
        errorMessage = "Too many attempts. Please wait before trying again";
      } else if (err?.status >= 500) {
        errorMessage = "Server error. Please try again later";
      } else if (err.message.includes("Network Error")) {
        errorMessage = "Network connection failed. Please check your internet";
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  },
});

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  return (
    <AuthLayout
      title="Log In"
      subtitle="Enter your credentials to access your account"
    >
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit(e);
        }}
        sx={{ width: "100%" }}
      >
        <TextField
          fullWidth
          label="Username"
          name="username"
          autoComplete="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.username && Boolean(formik.errors.username)} // Changed from email to username
          helperText={formik.touched.username && formik.errors.username} // Changed from email to username
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
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
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

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                name="rememberMe"
                checked={formik.values.rememberMe}
                onChange={formik.handleChange}
              />
            }
            label="Remember me"
          />
          <Link
            href="/auth/reset-password"
            sx={{
              color: "primary.main",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Forgot Password?
          </Link>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{
            height: 56,
            mb: 3,
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Log into Account"
          )}
        </Button>
      </Box>
    </AuthLayout>
  );
};

export default LoginPage;
