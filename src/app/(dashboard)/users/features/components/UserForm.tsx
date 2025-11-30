// features/components/UserForm.tsx
import React, { useCallback, useState } from "react";
import {
  useForm,
  FormProvider,
  FieldErrors,
  SubmitHandler,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Typography,
  Button,
  Breadcrumbs,
  Link,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Paper,
  Snackbar,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Avatar,
  Chip,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Check as CheckIcon,
  NavigateBefore as NavigateBeforeIcon,
  ChevronRight as ChevronRightIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Security as SecurityIcon,
  WorkspacePremium as PlanIcon,
} from "@mui/icons-material";

import { userFormSchema, UserFormValues } from "../validations/userSchema";
import { useCreateUserMutation, useUpdateUserMutation } from "../api/userApi";
import { User, UserRole, SubscriptionPlan } from "../types/user.types";
import { generateUserInitials } from "../utils/userTransformers";

interface UserFormProps {
  user?: User | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const STEPS = ["Profile Information", "Account Settings", "Review & Submit"];

export const UserForm: React.FC<UserFormProps> = ({
  user,
  onSuccess,
  onCancel,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const isEditing = Boolean(user?.id);

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const isLoading = isCreating || isUpdating;

  const methods = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      role: user?.role || "user",
      plan: user?.plan || "free",
      isActive: user?.isActive ?? true,
      sendWelcomeEmail: false,
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    setValue,
    trigger,
    control,
    formState: { errors },
  } = methods;

  // Use useWatch instead of watch for React Compiler compatibility
  const firstName = useWatch({ control, name: "firstName" });
  const lastName = useWatch({ control, name: "lastName" });
  const email = useWatch({ control, name: "email" });
  const phone = useWatch({ control, name: "phone" });
  const role = useWatch({ control, name: "role" });
  const plan = useWatch({ control, name: "plan" });
  const isActive = useWatch({ control, name: "isActive" });
  const sendWelcomeEmail = useWatch({ control, name: "sendWelcomeEmail" });

  // Handlers
  const handleFieldChange = useCallback(
    (field: keyof UserFormValues, value: string | boolean) => {
      setValue(field, value as never);
    },
    [setValue]
  );

  // Navigation
  const handleBack = () => {
    setActiveStep((prev) => Math.max(0, prev - 1));
  };

  const handleNext = async () => {
    const stepFields = {
      0: ["firstName", "lastName", "email", "phone"],
      1: ["role", "plan"],
    };

    const currentStepFields = stepFields[activeStep as keyof typeof stepFields];
    if (currentStepFields) {
      const isValid = await trigger(currentStepFields as (keyof UserFormValues)[]);
      if (!isValid) return;
    }

    if (activeStep === STEPS.length - 1) {
      await handleConfirmSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

const onSubmit: SubmitHandler<UserFormValues> = async (data) => {
  try {
    if (isEditing && user) {
      // Prepare update data - exclude sendWelcomeEmail for updates using IIFE pattern
      const updateData = (({ ...rest }) => rest)(data);
      await updateUser({
        userId: user.id,
        userData: updateData,
      }).unwrap();
      setSnackbar({
        open: true,
        message: "User updated successfully!",
        severity: "success",
      });
    } else {
      await createUser(data).unwrap();
      setSnackbar({
        open: true,
        message: "User created successfully!",
        severity: "success",
      });
    }

    setTimeout(() => {
      onSuccess?.();
      if (!isEditing) {
        methods.reset();
        setActiveStep(0);
      }
    }, 1500);
  } catch {
    setSnackbar({
      open: true,
      message: isEditing ? "Failed to update user" : "Failed to create user",
      severity: "error",
    });
  }
};

  const handleConfirmSubmit = handleSubmit(onSubmit);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!firstName && !!lastName && !!email;
      case 1:
        return !!role && !!plan;
      default:
        return true;
    }
  };

  const userInitials = generateUserInitials(firstName, lastName);

  // Step content rendering
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <ProfileInformationStep
            errors={errors}
            firstName={firstName}
            lastName={lastName}
            email={email}
            phone={phone || ""}
            isEditing={isEditing}
            onFieldChange={handleFieldChange}
          />
        );

      case 1:
        return (
          <AccountSettingsStep
            errors={errors}
            role={role}
            plan={plan}
            isActive={isActive}
            sendWelcomeEmail={sendWelcomeEmail}
            isEditing={isEditing}
            onFieldChange={handleFieldChange}
          />
        );

      case 2:
        return (
          <SubmissionPreviewStep
            firstName={firstName}
            lastName={lastName}
            email={email}
            phone={phone || ""}
            role={role}
            plan={plan}
            isActive={isActive}
            sendWelcomeEmail={sendWelcomeEmail}
            isEditing={isEditing}
            userInitials={userInitials}
          />
        );

      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <Box
        sx={{
        }}
      >
        <Box sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Breadcrumbs sx={{ mb: 2 }}>
              <Link
                color="inherit"
                href="/users"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                }}
              >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
                Users
              </Link>
              <Typography color="text.primary" sx={{ fontWeight: 500 }}>
                {isEditing ? "Edit User" : "Create New User"}
              </Typography>
            </Breadcrumbs>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 56,
                  height: 56,
                  fontSize: "1.25rem",
                }}
              >
                {isEditing && user ? generateUserInitials(user.firstName, user.lastName) : userInitials}
              </Avatar>
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  fontWeight="600"
                  gutterBottom
                >
                  {isEditing && user ? `Edit ${user.firstName} ${user.lastName}` : "Create New User"}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {isEditing
                    ? "Update user information and account settings"
                    : "Add a new user to the platform with profile and account settings"}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Progress Stepper */}
          <Paper
            sx={{
              p: 3,
              mb: 4,
              background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Stepper activeStep={activeStep} sx={{ mb: 2 }}>
              {STEPS.map((label, index) => (
                <Step key={label} completed={activeStep > index}>
                  <StepLabel
                    StepIconProps={{
                      sx: {
                        "&.Mui-completed": { color: "success.main" },
                        "&.Mui-active": { color: "primary.main" },
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Step {activeStep + 1} of {STEPS.length}
              </Typography>
              {isStepValid(activeStep) && (
                <Chip
                  label="Step Complete"
                  color="success"
                  size="small"
                  variant="outlined"
                  icon={<CheckIcon />}
                />
              )}
            </Box>
          </Paper>

          {/* Step Content */}
          <Paper
            sx={{
              p: 4,
              mb: 3,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
            }}
          >
            {renderStepContent(activeStep)}
          </Paper>

          {/* Navigation Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 4,
            }}
          >
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              size="large"
              startIcon={<NavigateBeforeIcon />}
            >
              Back
            </Button>

            <Box sx={{ display: "flex", gap: 2 }}>
              {onCancel && (
                <Button 
                  onClick={onCancel} 
                  variant="text" 
                  size="large"
                  startIcon={<CancelIcon />}
                >
                  Cancel
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!isStepValid(activeStep) || isLoading}
                size="large"
                endIcon={
                  isLoading ? (
                    <CircularProgress size={20} />
                  ) : activeStep === STEPS.length - 1 ? (
                    <SaveIcon />
                  ) : (
                    <ChevronRightIcon />
                  )
                }
                sx={{
                  minWidth: 140,
                  background:
                    activeStep === STEPS.length - 1
                      ? "linear-gradient(45deg, #2E7D32 30%, #4CAF50 90%)"
                      : undefined,
                }}
              >
                {activeStep === STEPS.length - 1
                  ? isLoading
                    ? isEditing
                      ? "Updating..."
                      : "Creating..."
                    : isEditing
                    ? "Update User"
                    : "Create User"
                  : "Next"}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </FormProvider>
  );
};

// Step Components
interface ProfileInformationStepProps {
  errors: FieldErrors<UserFormValues>;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isEditing: boolean;
  onFieldChange: (field: keyof UserFormValues, value: string | boolean) => void;
}

const ProfileInformationStep: React.FC<ProfileInformationStepProps> = ({
  errors,
  firstName,
  lastName,
  email,
  phone,
  isEditing,
  onFieldChange,
}) => {
  return (
    <Box>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
      >
        <PersonIcon color="primary" />
        Profile Information
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Name fields */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 3 }}>
          <TextField
            fullWidth
            label="First Name *"
            value={firstName}
            onChange={(e) => onFieldChange("firstName", e.target.value)}
            error={!!errors.firstName}
            helperText={errors.firstName?.message || "Enter the user's first name"}
            InputProps={{
              startAdornment: (
                <PersonIcon sx={{ color: "text.secondary", mr: 1 }} fontSize="small" />
              ),
            }}
          />
          <TextField
            fullWidth
            label="Last Name *"
            value={lastName}
            onChange={(e) => onFieldChange("lastName", e.target.value)}
            error={!!errors.lastName}
            helperText={errors.lastName?.message || "Enter the user's last name"}
          />
        </Box>

        {/* Email field */}
        <TextField
          fullWidth
          label="Email Address *"
          type="email"
          value={email}
          onChange={(e) => onFieldChange("email", e.target.value)}
          error={!!errors.email}
          helperText={errors.email?.message || "Enter a valid email address"}
          disabled={isEditing}
          InputProps={{
            startAdornment: (
              <EmailIcon sx={{ color: "text.secondary", mr: 1 }} fontSize="small" />
            ),
          }}
        />

        {/* Phone field */}
        <TextField
          fullWidth
          label="Phone Number"
          value={phone}
          onChange={(e) => onFieldChange("phone", e.target.value)}
          error={!!errors.phone}
          helperText={errors.phone?.message || "Optional phone number"}
          InputProps={{
            startAdornment: (
              <PhoneIcon sx={{ color: "text.secondary", mr: 1 }} fontSize="small" />
            ),
          }}
          placeholder="+1 (555) 123-4567"
        />
      </Box>

      {/* Profile Preview */}
      <Card sx={{ mt: 3, border: "1px solid", borderColor: "primary.light" }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PersonIcon fontSize="small" />
            Profile Preview
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 60,
                height: 60,
                fontSize: "1.25rem",
              }}
            >
              {generateUserInitials(firstName, lastName)}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {firstName} {lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {email}
              </Typography>
              {phone && (
                <Typography variant="body2" color="text.secondary">
                  {phone}
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

interface AccountSettingsStepProps {
  errors: FieldErrors<UserFormValues>;
  role: UserRole;
  plan: SubscriptionPlan;
  isActive: boolean;
  sendWelcomeEmail: boolean;
  isEditing: boolean;
  onFieldChange: (field: keyof UserFormValues, value: string | boolean) => void;
}

const AccountSettingsStep: React.FC<AccountSettingsStepProps> = ({
  errors,
  role,
  plan,
  isActive,
  sendWelcomeEmail,
  isEditing,
  onFieldChange,
}) => {
  const roleOptions: { value: UserRole; label: string; color: "default" | "primary" | "secondary" }[] = [
    { value: "user", label: "User", color: "default" },
    { value: "admin", label: "Admin", color: "primary" },
    { value: "moderator", label: "Moderator", color: "secondary" },
  ];

  const planOptions: { value: SubscriptionPlan; label: string; color: "default" | "primary" | "info" | "warning" }[] = [
    { value: "free", label: "Free", color: "default" },
    { value: "basic", label: "Basic", color: "info" },
    { value: "premium", label: "Premium", color: "warning" },
    { value: "enterprise", label: "Enterprise", color: "primary" },
  ];

  return (
    <Box>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
      >
        <SecurityIcon color="primary" />
        Account Settings
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Role and Plan selection */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 3 }}>
          <FormControl fullWidth error={!!errors.role}>
            <InputLabel>Role *</InputLabel>
            <Select
              value={role}
              onChange={(e) => onFieldChange("role", e.target.value)}
              label="Role *"
            >
              {roleOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip label={option.label} color={option.color} size="small" />
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {errors.role && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
                {errors.role.message}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth error={!!errors.plan}>
            <InputLabel>Subscription Plan *</InputLabel>
            <Select
              value={plan}
              onChange={(e) => onFieldChange("plan", e.target.value)}
              label="Subscription Plan *"
            >
              {planOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip label={option.label} color={option.color} size="small" variant="outlined" />
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {errors.plan && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
                {errors.plan.message}
              </Typography>
            )}
          </FormControl>
        </Box>

        {/* Status Toggles */}
        <Card variant="outlined">
          <CardContent>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={isActive}
                    onChange={(e) => onFieldChange("isActive", e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle1">
                      Account Status
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {isActive
                        ? "User account is active and accessible"
                        : "User account is disabled and cannot access the platform"}
                    </Typography>
                  </Box>
                }
              />
              {!isEditing && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={sendWelcomeEmail}
                      onChange={(e) => onFieldChange("sendWelcomeEmail", e.target.checked)}
                      color="secondary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle1">
                        Send Welcome Email
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Send account activation and welcome instructions to the user
                      </Typography>
                    </Box>
                  }
                />
              )}
            </FormGroup>
          </CardContent>
        </Card>
      </Box>

      {/* Role & Plan Info Cards */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
        <Card sx={{ border: "1px solid", borderColor: "info.light", bgcolor: "info.50" }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SecurityIcon fontSize="small" />
              Role Information
            </Typography>
            <Typography variant="body2">
              {role === "admin" && "Admins have full access to all system features and user management."}
              {role === "moderator" && "Moderators can manage content and users but have limited administrative access."}
              {role === "user" && "Users have standard access to platform features based on their subscription plan."}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ border: "1px solid", borderColor: "warning.light", bgcolor: "warning.50" }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PlanIcon fontSize="small" />
              Plan Features
            </Typography>
            <Typography variant="body2">
              {plan === "free" && "Free plan includes basic features with limited access."}
              {plan === "basic" && "Basic plan includes enhanced features and standard support."}
              {plan === "premium" && "Premium plan includes all features with priority support."}
              {plan === "enterprise" && "Enterprise plan includes custom features and dedicated support."}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

interface SubmissionPreviewStepProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  plan: SubscriptionPlan;
  isActive: boolean;
  sendWelcomeEmail: boolean;
  isEditing: boolean;
  userInitials: string;
}

const SubmissionPreviewStep: React.FC<SubmissionPreviewStepProps> = ({
  firstName,
  lastName,
  email,
  phone,
  role,
  plan,
  isActive,
  sendWelcomeEmail,
  isEditing,
  userInitials,
}) => {
  const roleLabels = {
    user: "User",
    admin: "Admin",
    moderator: "Moderator",
  };

  const planLabels = {
    free: "Free",
    basic: "Basic",
    premium: "Premium",
    enterprise: "Enterprise",
  };

  return (
    <Box>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
      >
        <GroupIcon color="primary" />
        Review & Submit
      </Typography>

      {/* Profile Summary Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PersonIcon fontSize="small" />
            Profile Summary
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, mt: 2 }}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 80,
                height: 80,
                fontSize: "1.5rem",
              }}
            >
              {userInitials}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                {firstName} {lastName}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Email:</strong> {email}
                </Typography>
                {phone && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Phone:</strong> {phone}
                  </Typography>
                )}
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <Chip
                    label={roleLabels[role]}
                    color={role === "admin" ? "primary" : role === "moderator" ? "secondary" : "default"}
                    size="small"
                  />
                  <Chip
                    label={planLabels[plan]}
                    color={plan === "enterprise" ? "primary" : plan === "premium" ? "warning" : plan === "basic" ? "info" : "default"}
                    variant="outlined"
                    size="small"
                  />
                  <Chip
                    label={isActive ? "Active" : "Inactive"}
                    color={isActive ? "success" : "error"}
                    size="small"
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Account Details */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Card>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SecurityIcon fontSize="small" />
              Account Details
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mt: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Role
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {roleLabels[role]}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Subscription Plan
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {planLabels[plan]}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Account Status
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {isActive ? "Active" : "Inactive"}
                </Typography>
              </Box>
              {!isEditing && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Welcome Email
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {sendWelcomeEmail ? "Will be sent" : "Not sending"}
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Action Summary */}
      <Card sx={{ mt: 3, bgcolor: "primary.50", border: "1px solid", borderColor: "primary.light" }}>
        <CardContent>
          <Typography variant="subtitle2" gutterBottom color="primary.main">
            Ready to {isEditing ? "Update" : "Create"} User Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEditing
              ? `All changes to ${firstName}'s account will be applied immediately.`
              : `A new user account for ${firstName} ${lastName} will be created with the selected settings.`}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserForm;