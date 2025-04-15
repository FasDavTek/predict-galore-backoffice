import React from "react";
import {
  TextField,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  CircularProgress,
  Typography,
  Link,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Mail as MailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { AuthLayout } from "@/layouts/AuthLayout";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearAuthError } from "@/store/slices/authSlice";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";

const validationSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = React.useState(false);
  const [verificationDialogOpen, setVerificationDialogOpen] = React.useState(false);
  const [unverifiedUser, setUnverifiedUser] = React.useState(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await dispatch(
          loginUser({ 
            email: values.email, 
            password: values.password 
          })
        ).unwrap();
        
        if (values.rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }
        
        toast.success("Login successful!");
        router.push("/dashboard");
      } catch (err) {
         // Handle email not verified case
         if (err.payload?.isEmailVerified === false) {
          setUnverifiedUser(err.payload.user);
          setVerificationDialogOpen(true);
        } else {
          toast.error(err.message || "Login failed. Please try again.");
        }
      
      }
    },
  });

  const handleResendVerification = async () => {
    try {
      await dispatch(resendVerificationEmail(unverifiedUser.email));
      toast.success("Verification email sent successfully!");
      setVerificationDialogOpen(false);
    } catch (error) {
      toast.error("Failed to resend verification email. Please try again.");
    }
  };

  const handleNavigateToVerify = () => {
    router.push(`/auth/verify-email?email=${encodeURIComponent(unverifiedUser.email)}`);
    setVerificationDialogOpen(false);
  };


  React.useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  return (
    <AuthLayout
      title="Log In"
      subtitle="Enter your credentials to access your account"
    >
   {error && error.isEmailVerified !== false && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      )}

      <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: "100%" }}>
        <TextField
          fullWidth
          label="Email address"
          name="email"
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

        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3
        }}>
          <FormControlLabel
            control={
              <Checkbox
                name="rememberMe"
                checked={formik.values.rememberMe}
                onChange={formik.handleChange}
              />
            }
            label="Remember me"
            sx={{ "& .MuiTypography-root": { fontFamily: "Inter" } }}
          />
          <Link
            href="/auth/forgot-password"
            sx={{
              textTransform: "none",
              fontFamily: "Inter",
              fontWeight: 500,
              color: "#42A605",
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
            "Log into Account"
          )}
        </Button>

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" sx={{ fontFamily: "Inter", color: "text.secondary" }}>
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              sx={{
                color: "#42A605",
                textDecoration: "none",
                fontWeight: 500,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Sign up
            </Link>
          </Typography>


            {/* Email Verification Dialog */}
        <Dialog
          open={verificationDialogOpen}
          onClose={() => setVerificationDialogOpen(false)}
        >
          <DialogTitle>Email Verification Required</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Your email address has not been verified yet. Please verify your email to continue.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setVerificationDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleResendVerification} color="primary">
              Resend Verification Email
            </Button>
            <Button onClick={handleNavigateToVerify} color="primary" variant="contained">
              Verify Email Now
            </Button>
          </DialogActions>
        </Dialog>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default LoginPage;