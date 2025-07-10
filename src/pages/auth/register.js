import React, { useEffect, useState } from "react";
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
  LinearProgress,
  Autocomplete,
} from "@mui/material";
import {
  Mail as MailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import { AuthLayout } from "@/layouts/AuthLayout";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearAuthError } from "@/store/slices/authSlice";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";

// Country codes data
const countryCodes = [
  { code: "+1", name: "United States", flag: "🇺🇸" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+86", name: "China", flag: "🇨🇳" },
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "+7", name: "Russia", flag: "🇷🇺" },
  { code: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "+55", name: "Brazil", flag: "🇧🇷" },
  { code: "+234", name: "Nigeria", flag: "🇳🇬" },
  { code: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "+52", name: "Mexico", flag: "🇲🇽" },
  { code: "+92", name: "Pakistan", flag: "🇵🇰" },
  { code: "+62", name: "Indonesia", flag: "🇮🇩" },
  { code: "+90", name: "Turkey", flag: "🇹🇷" },
  { code: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "+82", name: "South Korea", flag: "🇰🇷" },
  { code: "+971", name: "United Arab Emirates", flag: "🇦🇪" },
];

const validationSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  countryCode: yup
    .string()
    .matches(/^\+[0-9]{1,4}$/, "Invalid country code")
    .required("Country code is required"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{7,15}$/, "Invalid phone number")
    .required("Phone number is required"),
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
    <Box sx={{ width: "100%", mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="caption">Password strength</Typography>
        <Typography variant="caption" sx={{ color: getColor() }}>
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

const PhoneNumberInput = ({ formik }) => {
  const [showCustomCode, setShowCustomCode] = useState(false);

  const handleCountryCodeChange = (e, newValue) => {
    if (newValue) {
      formik.setFieldValue('countryCode', newValue.code);
      setShowCustomCode(false);
    } else {
      setShowCustomCode(true);
      formik.setFieldValue('countryCode', '+');
    }
  };

  const handleCustomCodeChange = (e) => {
    const value = e.target.value;
    const cleanValue = value.replace(/[^0-9+]/g, '');
    formik.setFieldValue('countryCode', cleanValue);
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
      {showCustomCode ? (
        <TextField
          fullWidth
          label="Country Code"
          value={formik.values.countryCode}
          onChange={handleCustomCodeChange}
          onBlur={() => formik.setFieldTouched('countryCode', true)}
          error={formik.touched.countryCode && Boolean(formik.errors.countryCode)}
          helperText={formik.touched.countryCode && formik.errors.countryCode}
          sx={{ width: 150 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography>🌐</Typography>
              </InputAdornment>
            ),
          }}
        />
      ) : (
        <Autocomplete
          options={countryCodes}
          getOptionLabel={(option) => `${option.flag} ${option.code}`}
          value={countryCodes.find(c => c.code === formik.values.countryCode) || countryCodes[0]}
          onChange={handleCountryCodeChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Country"
              sx={{ width: 150 }}
            />
          )}
          freeSolo
          onInputChange={(e, newInputValue) => {
            if (newInputValue && !countryCodes.some(c => 
              `${c.flag} ${c.code}` === newInputValue)) {
              setShowCustomCode(true);
            }
          }}
        />
      )}
      <TextField
        fullWidth
        label="Phone Number"
        name="phoneNumber"
        value={formik.values.phoneNumber}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
        helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PhoneIcon sx={{ color: "text.disabled" }} />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

const RegisterPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "+1",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      userTypeId: 1,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (!agreeToTerms) {
        setSubmitting(false);
        return;
      }

      try {
        const registrationData = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          userTypeId: values.userTypeId,
          phoneNumber: `${values.countryCode}${values.phoneNumber}`,
          password: values.password,
        };

        const result = await dispatch(registerUser(registrationData));

        if (registerUser.fulfilled.match(result)) {
          router.push({
            pathname: "/auth/verify-email",
            query: { email: values.email },
          });
        }
      } catch (err) {
        console.error("Registration error:", err);
      } finally {
        setSubmitting(false);
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
      subtitle="Join our platform to get started"
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message || "Registration failed. Please try again."}
        </Alert>
      )}

      <Box component="form" onSubmit={formik.handleSubmit} noValidate>
        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
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
            label="Last Name"
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: "text.disabled" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

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
          sx={{ mb: 4 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MailIcon sx={{ color: "text.disabled" }} />
              </InputAdornment>
            ),
          }}
        />

        <PhoneNumberInput formik={formik} />

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
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
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
                  {showConfirmPassword ? (
                    <VisibilityOffIcon />
                  ) : (
                    <VisibilityIcon />
                  )}
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
              color={
                !agreeToTerms && formik.submitCount > 0 ? "error" : "primary"
              }
            />
          }
          label={
            <Typography variant="body2">
              I agree to the{" "}
              <Link href="#" sx={{ color: "#42A605", textDecoration: "none" }}>
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" sx={{ color: "#42A605", textDecoration: "none" }}>
                Privacy Policy
              </Link>
            </Typography>
          }
          sx={{ mb: 3 }}
        />
        {!agreeToTerms && formik.submitCount > 0 && (
          <Typography
            color="error"
            variant="caption"
            sx={{ mt: -2, mb: 2, display: "block" }}
          >
            You must agree to the terms and conditions
          </Typography>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading || !agreeToTerms}
          sx={{
            bgcolor: "#42A605",
            height: 56,
            "&:hover": {
              bgcolor: "#3a9504",
            },
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
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
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