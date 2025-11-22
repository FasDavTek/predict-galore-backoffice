"use client";

import React, { useState, useEffect } from "react";
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
  Typography,
} from "@mui/material";
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AuthCard } from "@/app/(auth)/features/components/AuthCard";
import { ErrorMessage } from "@/app/(auth)/features/components/ErrorMessage";
import {
  loginFormValidation,
  LoginFormData,
} from "../features/validations/auth";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useLoginMutation } from "../features/api/authApi";
import {
  setToken,
  setAuthUser,
  setAuthStatus,
} from "../features/slices/authSlice";
import { AuthStatus } from "@/app/(auth)/features/types/authTypes";

// Define error response type
interface ApiError {
  data?: {
    fieldErrors?: Record<string, string>;
    message?: string;
    error?: string;
    detail?: string;
  };
  status?: number;
  error?: string;
  message?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector((state) => state.auth.authStatus);

  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<ApiError | null>(null);

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormValidation),
    mode: "onChange",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (authStatus === AuthStatus.AUTHENTICATED) {
      router.push("/dashboard");
    }
  }, [authStatus, router]);

  const onSubmit = async (data: LoginFormData) => {
    setApiError(null);

    try {
      const result = await login(data).unwrap();

      if (result.token) {
        dispatch(setToken(result.token));
        dispatch(setAuthStatus(AuthStatus.AUTHENTICATED));

        if (result.user) {
          dispatch(setAuthUser(result.user));
        }

        toast.success("Login successful! Redirecting...");
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      // Improved error handling
      console.error("Login Error Details:", {
        error,
        type: typeof error,
        stringified: JSON.stringify(error, null, 2),
      });

      const apiError = error as ApiError;
      setApiError(apiError);

      // Extract error message from various possible locations
      const errorMessage =
        apiError?.data?.message ||
        apiError?.data?.error ||
        apiError?.data?.detail ||
        apiError?.error ||
        apiError?.message ||
        "An unexpected error occurred during login";

      // Handle field-specific errors
      if (apiError.data?.fieldErrors) {
        Object.entries(apiError.data.fieldErrors).forEach(
          ([field, message]) => {
            setError(field as keyof LoginFormData, {
              type: "server",
              message: message as string,
            });
          }
        );
      } else {
        // Set general error if no field-specific errors
        setError("root", {
          type: "server",
          message: errorMessage,
        });
      }

      // Show toast notification
      toast.error(errorMessage);
    }
  };

  const isLoading = isLoggingIn;

  return (
    <AuthCard
      title="Log In"
      subtitle="Enter your credentials to access your account"
    >
      {apiError && <ErrorMessage error={apiError} />}

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ width: "100%" }}
      >
        <TextField
          fullWidth
          label="Username"
          {...register("username")}
          error={!!errors.username}
          helperText={errors.username?.message}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon color="disabled" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color="disabled" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  color="inherit"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Display root/server error */}
        {errors.root && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {errors.root.message}
          </Typography>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <FormControlLabel
            control={<Checkbox {...register("rememberMe")} color="primary" />}
            label="Remember me"
          />
          <Link
            href="/reset-password"
            sx={{ color: "primary.main", textDecoration: "none" }}
          >
            Forgot Password?
          </Link>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={!mounted || isLoading || !isValid}
          sx={{ height: 48, mb: 3 }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Log into Account"
          )}
        </Button>

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              sx={{ color: "primary.main", fontWeight: 600 }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </AuthCard>
  );
}
