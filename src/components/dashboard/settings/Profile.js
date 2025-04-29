import { Box, Typography, TextField, Button, Divider } from "@mui/material";
import { useState } from "react";
import TimezoneSelect from 'react-timezone-select';

const ProfileTab = () => {
  // Mockup profile data
  const [profileData, setProfileData] = useState({
    firstName: "Andrew",
    lastName: "Smith",
    email: "andrewsmith@gmail.com",
    role: "Super Admin",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone // Auto-detect timezone
  });

  // Handle changes for all fields
  const handleInputChange = (field) => (event) => {
    setProfileData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  // Handle timezone change
  const handleTimezoneChange = (timezone) => {
    setProfileData(prev => ({
      ...prev,
      timezone: timezone.value // react-timezone-select returns an object with value property
    }));
  };

  // Handle save action
  const handleSave = () => {
    console.log("Saved data:", profileData);
    // Here you would typically make an API call to save the data
    alert("Profile changes saved!");
  };

  return (
    <Box>
      {/* Personal Information Grid */}
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
          >
            Save Changes
          </Button>
        </Box>

        {/* Right Column - Form Fields */}
        <Box className="md:col-span-8">
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            {/* First Name */}
            <TextField
              label="First name"
              value={profileData.firstName}
              onChange={handleInputChange('firstName')}
              fullWidth
            />

            {/* Last Name */}
            <TextField
              label="Last name"
              value={profileData.lastName}
              onChange={handleInputChange('lastName')}
              fullWidth
            />
          </Box>

          {/* Email Address */}
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Email Address"
              value={profileData.email}
              onChange={handleInputChange('email')}
              fullWidth
              disabled
            />
          </Box>

          {/* Role */}
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Role"
              value={profileData.role}
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

      {/* Timezone Grid */}
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
              value={profileData.timezone}
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