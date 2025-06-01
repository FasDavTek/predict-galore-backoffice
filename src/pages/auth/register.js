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
  MenuItem,
  Autocomplete,
} from "@mui/material";
import {
  Mail as MailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from "@mui/icons-material";
import { AuthLayout } from "@/layouts/AuthLayout";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearAuthError } from "@/store/slices/authSlice";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";



const validationSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  countryCode: yup.string().required("Country code is required"),
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

// Custom TextField component for PhoneInput to match MUI styling
const PhoneNumberTextField = React.forwardRef(function PhoneNumberTextField(
  props,
  ref
) {
  return (
    <TextField
      {...props}
      fullWidth
      variant="outlined"
      label="Phone number"
      inputRef={ref}
      sx={{
        "& .MuiOutlinedInput-root": {
          paddingLeft: "14px",
          "& fieldset": {
            borderColor: props.error ? "#f44336" : "rgba(0, 0, 0, 0.23)",
          },
          "&:hover fieldset": {
            borderColor: props.error ? "#f44336" : "rgba(0, 0, 0, 0.87)",
          },
          "&.Mui-focused fieldset": {
            borderColor: props.error ? "#f44336" : "#42A605",
            borderWidth: "1px",
          },
        },
      }}
      InputProps={{
        ...props.InputProps,
        startAdornment: (
          <InputAdornment position="start">
            <PhoneIcon sx={{ color: "text.disabled" }} />
          </InputAdornment>
        ),
      }}
    />
  );
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
        <Typography variant="caption" sx={{ fontFamily: "Inter" }}>
          Password strength
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontFamily: "Inter",
            color: getColor(),
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

const RegisterPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [phoneValue, setPhoneValue] = useState();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "+1", // Default to US
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      userTypeId: 1, // Default user type
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
          countryCode: values.countryCode,
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

  const handlePhoneChange = (value) => {
    setPhoneValue(value);
    if (value) {
      const countryCode = value.match(/^\+\d+/)?.[0] || "+1";
      const phoneNumber = value.replace(countryCode, "");
      formik.setFieldValue("countryCode", countryCode);
      formik.setFieldValue("phoneNumber", phoneNumber);
    } else {
      formik.setFieldValue("countryCode", "+1");
      formik.setFieldValue("phoneNumber", "");
    }
  };

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

        <Box sx={{ mb: 4 }}>
          <PhoneInput
            international
            defaultCountry="US"
            value={phoneValue}
            onChange={handlePhoneChange}
            onBlur={() => {
              formik.setFieldTouched("countryCode", true);
              formik.setFieldTouched("phoneNumber", true);
            }}
            inputComponent={PhoneNumberTextField}
            countrySelectProps={{
              style: {
                padding: "16.5px 14px",
                borderRight: "1px solid rgba(0, 0, 0, 0.23)",
                marginRight: "8px",
              },
            }}
            style={{
              "--PhoneInput-color--focus": "#42A605",
              "--PhoneInputCountrySelectArrow-color": "#42A605",
            }}
          />
          {formik.touched.phoneNumber && formik.errors.phoneNumber && (
            <Typography
              color="error"
              variant="caption"
              sx={{ mt: 1, display: "block" }}
            >
              {formik.errors.phoneNumber}
            </Typography>
          )}
        </Box>

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
            <Typography variant="body2" sx={{ fontFamily: "Inter" }}>
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
