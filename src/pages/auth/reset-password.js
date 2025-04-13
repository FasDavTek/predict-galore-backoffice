import React from "react";
import {
  TextField,
  Button,
  Box,
  InputAdornment,
  IconButton,
  Typography,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
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
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { AuthLayout } from "@/layouts/AuthLayout";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearAuthError } from "@/store/slices/authSlice";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";

const PasswordRequirement = ({ met, text }) => (
  <ListItem disableGutters sx={{ p: 0, mb: 1 }}>
    <ListItemIcon sx={{ minWidth: 24 }}>
      {met ? (
        <CheckCircleIcon sx={{ color: "#42A605", fontSize: 16 }} />
      ) : (
        <CancelIcon sx={{ color: "#D72638", fontSize: 16 }} />
      )}
    </ListItemIcon>
    <ListItemText
      primary={text}
      sx={{
        "& .MuiListItemText-primary": {
          fontSize: "14px",
          fontFamily: "Inter",
          color: met ? "#42A605" : "#D72638",
        },
      }}
    />
  </ListItem>
);

const validationSchema = yup.object({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

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

  // Password requirements state
  const requirements = {
    length: formik.values.password.length >= 8,
    uppercase: /[A-Z]/.test(formik.values.password),
    lowercase: /[a-z]/.test(formik.values.password),
    number: /[0-9]/.test(formik.values.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formik.values.password),
    match:
      formik.values.password &&
      formik.values.password === formik.values.confirmPassword,
  };

  React.useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Create a new password for your account"
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
          sx={{ mb: 2 }}
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
          label="Confirm New Password"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
          helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
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

        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontFamily: "Inter",
              fontWeight: 500,
              color: "text.primary",
              mb: 1
            }}
          >
            Password Requirements:
          </Typography>
          <List dense disablePadding>
            <PasswordRequirement
              met={requirements.length}
              text="Minimum of 8 characters"
            />
            <PasswordRequirement
              met={requirements.uppercase}
              text="At least one uppercase letter"
            />
            <PasswordRequirement
              met={requirements.lowercase}
              text="At least one lowercase letter"
            />
            <PasswordRequirement
              met={requirements.number}
              text="At least one number"
            />
            <PasswordRequirement
              met={requirements.special}
              text="At least one special character"
            />
            <PasswordRequirement
              met={formik.values.password === formik.values.confirmPassword && formik.values.password !== ""}
              text="Passwords match"
            />
          </List>
        </Box>

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
            fontFamily: "Inter",
            fontWeight: 600,
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
          <Typography variant="body2" sx={{ fontFamily: "Inter", color: "text.secondary" }}>
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
              <Typography variant="h5" sx={{ fontFamily: "Inter", fontWeight: 600, mb: 1 }}>
                Password Reset Successful
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: "Inter", color: "text.secondary", mb: 3 }}>
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
                  fontFamily: "Inter",
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