import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Divider,
  CircularProgress,
  Alert,
    Skeleton
} from "@mui/material";
import { useDispatch } from "react-redux";
import TimezoneSelect from 'react-timezone-select';
import { fetchUserProfile, updateUserProfile } from "@/store/slices/authSlice";
import { useAuth } from "@/context/AuthContext";

const ProfileComponent = () => {
  const dispatch = useDispatch();
    const { token } = useAuth();
    // console.log("token:", token)

  // Initialize with safe defaults
  const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };

  
  // Profile data state
 const [profileData, setProfileData] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [originalData, setOriginalData] = useState(initialState);



  const [updateStatus, setUpdateStatus] = useState({
    loading: false,
    error: null,
    success: false
  });

 // Fetch profile data
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       // Pass the token to fetchUserProfile
  //       const response = await dispatch(fetchUserProfile(token)).unwrap();
  //       console.log("Profile data:", response)
        
  //       // Ensure response exists before accessing properties
  //       if (response) {
  //         const safeResponse = {
  //           firstName: response.firstName || '',
  //           lastName: response.lastName || '',
  //           email: response.email || '',
  //           timezone: response.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  //         };

  //         setProfileData(safeResponse);
  //         setFormData(safeResponse);
  //         setOriginalData(safeResponse);
  //         setError(null);
  //       }
  //     } catch (err) {
  //       setError(err.message || 'Failed to load profile');
  //       console.error("Profile fetch error:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [dispatch, token]);


  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle timezone change
  const handleTimezoneChange = (timezone) => {
    if (timezone) {
      setFormData(prev => ({
        ...prev,
        timezone: timezone.value || Intl.DateTimeFormat().resolvedOptions().timeZone
      }));
    }
  };

  // Toggle edit mode
  const toggleEdit = () => {
    if (isEditing) {
      // Cancel editing - revert to original data
      setFormData(originalData);
      setUpdateStatus({ loading: false, error: null, success: false });
    }
    setIsEditing(!isEditing);
  };

  // Check if form has changes
  const hasChanges = () => {
    return (
      formData.firstName !== originalData.firstName ||
      formData.lastName !== originalData.lastName ||
      formData.timezone !== originalData.timezone
    );
  };

  // Handle form submission
 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.firstName.trim() || !formData.lastName.trim()) {
    setUpdateStatus({
      loading: false,
      error: 'First name and last name are required',
      success: false
    });
    return;
  }

  const payload = {
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    email: originalData.email, 
    timezone: formData.timezone || originalData.timezone
  };

  console.log("Payload sent to API:", payload); 

  try {
    setUpdateStatus({ loading: true, error: null, success: false });

    const response = await dispatch(updateUserProfile({ data: payload, token })).unwrap();

    const updatedData = {
      firstName: response?.firstName || payload.firstName,
      lastName: response?.lastName || payload.lastName,
      email: response?.email || payload.email,
      timezone: response?.timezone || payload.timezone
    };

    setProfileData(updatedData);
    setOriginalData(updatedData);
    setUpdateStatus({ loading: false, error: null, success: true });
    setIsEditing(false);
  } catch (err) {
    console.error("Profile update error:", err);
    setUpdateStatus({
      loading: false,
      error: err.message || 'Failed to update profile',
      success: false
    });
  }
};


// Skeleton Loading Component
  const ProfileSkeleton = () => (
    <Box component="form">
      {/* Personal Information Section Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column Skeleton */}
        <Box className="md:col-span-4">
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="text" width="90%" height={24} />
          <Skeleton variant="text" width="80%" height={24} />
        </Box>

        {/* Right Column Skeleton */}
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

      {/* Timezone Section Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column Skeleton */}
        <Box className="md:col-span-4">
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="text" width="90%" height={24} />
        </Box>

        {/* Right Column Skeleton */}
        <Box className="md:col-span-8">
          <Box mb={3}>
            <Skeleton variant="rectangular" width="100%" height={56} />
          </Box>
        </Box>
      </div>

      {/* Action Buttons Skeleton */}
      <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
        <Skeleton variant="rectangular" width={120} height={36} />
      </Box>
    </Box>
  );


 if (loading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

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
          </Typography>
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
              disabled={!isEditing}
              required
              error={updateStatus.error && !formData.firstName.trim()}
              helperText={updateStatus.error && !formData.firstName.trim() ? 'Required field' : ''}
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
              disabled={!isEditing}
              required
              error={updateStatus.error && !formData.lastName.trim()}
              helperText={updateStatus.error && !formData.lastName.trim() ? 'Required field' : ''}
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
        </Box>
      </div>

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
              isDisabled={!isEditing}
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
        {updateStatus.error && (
          <Alert severity="error" sx={{ flexGrow: 1 }}>
            {updateStatus.error}
          </Alert>
        )}
        {updateStatus.success && (
          <Alert severity="success" sx={{ flexGrow: 1 }}>
            Profile updated successfully!
          </Alert>
        )}
        
        {isEditing ? (
          <>
            <Button
              variant="outlined"
              onClick={toggleEdit}
              disabled={updateStatus.loading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={updateStatus.loading || !hasChanges()}
              startIcon={updateStatus.loading ? <CircularProgress size={20} /> : null}
            >
              {updateStatus.loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            onClick={toggleEdit}
          >
            Edit Profile
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ProfileComponent;