import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import TimezoneSelect from 'react-timezone-select';
import { updateProfile } from "@/store/slices/settingsSlice";

/**
 * ProfileTab - Handles user profile information
 * Features:
 * - Displays and edits personal information
 * - Timezone selection
 * - Save functionality with Redux integration
 */
const ProfileTab = ({ showNotification }) => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => ({
    profile: state.settings.profile,
    loading: state.settings.loading.profile,
    error: state.settings.error.profile
  }));

  // Local form state initialized with Redux data
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    email: profile?.email || '',
    timezone: profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  // Update local state when Redux profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        timezone: profile.timezone
      });
    }
  }, [profile]);

  // Handle input changes for text fields
  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  // Handle timezone change
  const handleTimezoneChange = (timezone) => {
    setFormData(prev => ({
      ...prev,
      timezone: timezone.value
    }));
  };

  // Handle form submission
  const handleSave = async () => {
    try {
      await dispatch(updateProfile(formData)).unwrap();
      showNotification('Profile updated successfully!');
    } catch (error) {
      showNotification('Failed to update profile', 'error');
    }
  };

  return (
    <Box>
      {/* Personal Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column - Header and Description */}
        <Box className="md:col-span-4">
          <Typography variant="h6" sx={{ mb: 1 }}>
            Personal Information
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Update your personal details here.
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mb: 4 }}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
          {error && (
            <Typography color="error" variant="body2">
              {error.message || 'Failed to update profile'}
            </Typography>
          )}
        </Box>

        {/* Right Column - Form Fields */}
        <Box className="md:col-span-8">
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            {/* First Name */}
            <TextField
              label="First name"
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              fullWidth
            />

            {/* Last Name */}
            <TextField
              label="Last name"
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              fullWidth
            />
          </Box>

          {/* Email Address (readonly) */}
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Email Address"
              value={formData.email}
              fullWidth
              disabled
              InputProps={{
                readOnly: true,
              }}
            />
          </Box>
        </Box>
      </div>

      <Divider sx={{ my: 4 }} />

      {/* Timezone Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column - Header and Description */}
        <Box className="md:col-span-4">
          <Typography variant="h6" sx={{ mb: 2 }}>
            Timezone
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Adjust the time zone to match your local time.
          </Typography>
        </Box>

        {/* Right Column - Timezone Selector */}
        <Box className="md:col-span-8">
          <Box sx={{ mb: 3 }}>
            <TimezoneSelect
              value={formData.timezone}
              onChange={handleTimezoneChange}
              labelStyle="original"
              className="timezone-select"
              menuPosition="fixed"
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: '56px',
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                  '&:hover': {
                    borderColor: 'rgba(0, 0, 0, 0.87)'
                  }
                })
              }}
            />
          </Box>
        </Box>
      </div>
    </Box>
  );
};

export default ProfileTab;