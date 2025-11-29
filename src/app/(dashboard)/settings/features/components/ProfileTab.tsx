import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Skeleton,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import TimezoneSelect, { ITimezone } from 'react-timezone-select';

// Hooks
import { useSettings } from "../hooks/useSettings";

// Types
import { TabComponentProps, ProfileFormData, SettingsTimezone } from "../types";

// Utils
import { generateUserInitials } from "../utils/settingsTransformers";

// Skeleton Loading Component
const ProfileSkeleton = () => (
  <Box component="form">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <Box className="md:col-span-4">
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="text" width="90%" height={24} />
        <Skeleton variant="text" width="80%" height={24} />
      </Box>
      <Box className="md:col-span-8">
        <Box display="flex" gap={2} mb={3}>
          <Skeleton variant="rectangular" width="100%" height={56} />
          <Skeleton variant="rectangular" width="100%" height={56} />
        </Box>
        <Box mb={3}>
          <Skeleton variant="rectangular" width="100%" height={56} />
        </Box>
      </Box>
    </div>
    <Divider sx={{ my: 4 }} />
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <Box className="md:col-span-4">
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="text" width="90%" height={24} />
      </Box>
      <Box className="md:col-span-8">
        <Box mb={3}>
          <Skeleton variant="rectangular" width="100%" height={56} />
        </Box>
      </Box>
    </div>
    <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
      <Skeleton variant="rectangular" width={120} height={36} />
    </Box>
  </Box>
);

/**
 * ProfileTab - Handles user profile information and timezone settings
 */
export const ProfileTab: React.FC<TabComponentProps> = ({ showNotification }) => {
  const {
    profile,
    isProfileLoading,
    profileError,
    updateProfile,
    isUpdatingProfile,
    refetchProfile, 
  } = useSettings();

  const [isEditing, setIsEditing] = useState(false);
  const [hasProfileError, setHasProfileError] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  
  // Initialize form data with defaults
  const getDefaultFormData = useCallback((): ProfileFormData => {
    return {
      firstName: '',
      lastName: '',
      email: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      phone: '',
    };
  }, []);

  // Initialize form state
  const [formState, setFormState] = useState(() => {
    const defaultData = getDefaultFormData();

    if (profile) {
      return {
        formData: {
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          email: profile.email || '',
          timezone: profile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          phone: profile.phone || '',
        },
        originalData: {
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          email: profile.email || '',
          timezone: profile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          phone: profile.phone || '',
        }
      };
    }

    return {
      formData: defaultData,
      originalData: defaultData
    };
  });

  const { formData, originalData } = formState;
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Update form data when profile loads - using requestAnimationFrame to avoid sync updates
  useEffect(() => {
    if (profile && !isProfileLoading && !isRefetching) {
      const updateFormData = () => {
        const newFormData = {
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          email: profile.email || '',
          timezone: profile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          phone: profile.phone || '',
        };
        
        setFormState({
          formData: newFormData,
          originalData: newFormData
        });
        setHasProfileError(false);
      };

      // Use requestAnimationFrame to avoid synchronous state updates
      const frameId = requestAnimationFrame(updateFormData);
      return () => cancelAnimationFrame(frameId);
    }
  }, [profile, isProfileLoading, isRefetching]);

  // Handle profile errors - using requestAnimationFrame
  useEffect(() => {
    if (profileError && !isRefetching) {
      const setError = () => {
        setHasProfileError(true);
      };
      
      const frameId = requestAnimationFrame(setError);
      console.error('Profile loading error:', profileError);
      
      return () => cancelAnimationFrame(frameId);
    }
  }, [profileError, isRefetching]);

  // Handle refetch profile data
  const handleRefetchProfile = async () => {
    if (!refetchProfile) {
      console.warn('refetchProfile function not available in useSettings hook');
      return;
    }

    setIsRefetching(true);
    setHasProfileError(false);
    
    try {
      await refetchProfile();
      showNotification('Profile data refreshed successfully!', 'success');
    } catch (error) {
      console.error('Failed to refetch profile:', error);
      showNotification('Failed to refresh profile data', 'error');
    } finally {
      setIsRefetching(false);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: value
      }
    }));
    setUpdateError(null);
  };

  // Handle timezone change
  const handleTimezoneChange = (timezone: ITimezone) => {
    const tz = timezone as SettingsTimezone;
    setFormState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        timezone: tz.value || Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    }));
    setUpdateError(null);
  };

  // Toggle edit mode
  const toggleEdit = () => {
    if (isEditing) {
      // Cancel editing - revert to original data
      setFormState(prev => ({
        ...prev,
        formData: prev.originalData
      }));
      setUpdateError(null);
    }
    setIsEditing(!isEditing);
  };

  // Check if form has changes
  const hasChanges = () => {
    return (
      formData.firstName !== originalData.firstName ||
      formData.lastName !== originalData.lastName ||
      formData.timezone !== originalData.timezone ||
      formData.phone !== originalData.phone
    );
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setUpdateError('First name and last name are required');
      return;
    }

    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: originalData.email,
      timezone: formData.timezone || originalData.timezone,
      phone: formData.phone?.trim() || undefined,
    };

    try {
      const success = await updateProfile(payload);
      if (success) {
        showNotification('Profile updated successfully!', 'success');
        // Update original data to match current form data
        setFormState(prev => ({
          ...prev,
          originalData: prev.formData
        }));
        setIsEditing(false);
        setUpdateError(null);
        
        // Optionally refetch profile data to ensure consistency
        if (refetchProfile) {
          setTimeout(() => {
            refetchProfile();
          }, 500);
        }
      } else {
        setUpdateError('Failed to update profile. Please try again.');
      }
    } catch (error) {
      setUpdateError('Failed to update profile. Please try again.');
      console.error("Profile update error:", error);
    }
  };

  // Show loading state when refetching
  if ((isProfileLoading || isRefetching) && !profile) {
    return <ProfileSkeleton />;
  }

  // Show error state with refetch option
  if (hasProfileError && !profile) {
    return (
      <Box>
        <Alert 
          severity="error" 
          sx={{ my: 2 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={handleRefetchProfile}
              disabled={isRefetching}
              startIcon={isRefetching ? <CircularProgress size={16} /> : null}
            >
              {isRefetching ? 'Refetching...' : 'Refetch Profile'}
            </Button>
          }
        >
          Failed to load profile data. {profileError}
        </Alert>
        <Box sx={{ mt: 2, p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            You can still edit your profile information, but some data may not be saved correctly.
          </Typography>
          <Button 
            variant="outlined" 
            sx={{ mt: 2 }}
            onClick={() => setIsEditing(true)}
            disabled={isRefetching}
          >
            Edit Profile Anyway
          </Button>
        </Box>
      </Box>
    );
  }

  const userInitials = generateUserInitials(formData.firstName, formData.lastName);

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* Personal Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column - Header and Description */}
        <Box className="md:col-span-4">
          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Update your personal details here.
            {hasProfileError && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                Profile data may be incomplete due to loading issues.
              </Alert>
            )}
          </Typography>
          
          {/* Refetch button for manual refresh */}
          {profile && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleRefetchProfile}
              disabled={isRefetching}
              startIcon={isRefetching ? <CircularProgress size={16} /> : null}
              sx={{ mt: 1 }}
            >
              {isRefetching ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          )}
        </Box>

        {/* Right Column - Form Fields */}
        <Box className="md:col-span-8">
          <Box display="flex" gap={2} mb={3}>
            <TextField
              name="firstName"
              label="First name"
              value={formData.firstName}
              onChange={handleChange}
              fullWidth
              disabled={!isEditing || isUpdatingProfile || isRefetching}
              required
              error={!!updateError && !formData.firstName.trim()}
              helperText={updateError && !formData.firstName.trim() ? 'Required field' : ''}
              InputProps={{
                readOnly: !isEditing,
              }}
            />

            <TextField
              name="lastName"
              label="Last name"
              value={formData.lastName}
              onChange={handleChange}
              fullWidth
              disabled={!isEditing || isUpdatingProfile || isRefetching}
              required
              error={!!updateError && !formData.lastName.trim()}
              helperText={updateError && !formData.lastName.trim() ? 'Required field' : ''}
              InputProps={{
                readOnly: !isEditing,
              }}
            />
          </Box>

          <Box mb={3}>
            <TextField
              name="email"
              label="Email Address"
              value={formData.email}
              fullWidth
              disabled
              InputProps={{
                readOnly: true,
              }}
            />
          </Box>

          <Box mb={3}>
            <TextField
              name="phone"
              label="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              disabled={!isEditing || isUpdatingProfile || isRefetching}
              placeholder="+1 (555) 123-4567"
              InputProps={{
                readOnly: !isEditing,
              }}
            />
          </Box>
        </Box>
      </div>

      {/* Profile Preview */}
      <Card sx={{ mb: 4, border: "1px solid", borderColor: "primary.light" }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            Profile Preview
            {isRefetching && (
              <CircularProgress size={16} sx={{ ml: 1 }} />
            )}
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
              {userInitials}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {formData.firstName} {formData.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formData.email}
              </Typography>
              {formData.phone && (
                <Typography variant="body2" color="text.secondary">
                  {formData.phone}
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Divider sx={{ my: 4 }} />

      {/* Timezone Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column - Header and Description */}
        <Box className="md:col-span-4">
          <Typography variant="h6" gutterBottom>
            Timezone
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Adjust the time zone to match your local time.
          </Typography>
        </Box>

        {/* Right Column - Timezone Selector */}
        <Box className="md:col-span-8">
          <Box mb={3}>
            <TimezoneSelect
              value={formData.timezone}
              onChange={handleTimezoneChange}
              labelStyle="original"
              className="timezone-select"
              menuPosition="fixed"
              isDisabled={!isEditing || isUpdatingProfile || isRefetching}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: '56px',
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                  '&:hover': {
                    borderColor: 'rgba(0, 0, 0, 0.87)'
                  },
                  backgroundColor: !isEditing ? 'rgba(0, 0, 0, 0.06)' : 'inherit',
                  pointerEvents: !isEditing ? 'none' : 'auto'
                })
              }}
            />
          </Box>
        </Box>
      </div>

      {/* Action Buttons and Status Messages */}
      <Box mt={4} display="flex" justifyContent="flex-end" gap={2} alignItems="center">
        {updateError && (
          <Alert severity="error" sx={{ flexGrow: 1 }}>
            {updateError}
          </Alert>
        )}
        
        {isEditing ? (
          <>
            <Button
              variant="outlined"
              onClick={toggleEdit}
              disabled={isUpdatingProfile || isRefetching}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={isUpdatingProfile || isRefetching || !hasChanges()}
              startIcon={isUpdatingProfile ? <CircularProgress size={20} /> : null}
            >
              {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            onClick={toggleEdit}
            disabled={isRefetching}
          >
            Edit Profile
          </Button>
        )}
      </Box>
    </Box>
  );
};