import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userFormSchema, UserFormSchema } from '../validations/userSchema';
import { generateUserInitials } from '../utils/userTransformers';
import { UserFormProps } from '../types/form.types';

export const UserForm: React.FC<UserFormProps> = ({
  user,
  onSubmit,
  onCancel,
  isLoading = false,
  open = true,
}) => {
  const isEditing = Boolean(user?.id);

  // React Hook Form with Zod validation
  const { control, handleSubmit, formState: { errors, isDirty }, watch, reset } = useForm<UserFormSchema>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      role: user?.role || 'user',
      plan: user?.plan || 'free',
    },
  });

  // Watch form values for real-time preview
  const watchedValues = watch();
  const userInitials = generateUserInitials(watchedValues.firstName, watchedValues.lastName);

  const handleFormSubmit = async (data: UserFormSchema) => {
    const success = await onSubmit(data);
    if (success) reset();
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}>
      
      {/* Dialog Header */}
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {isEditing ? generateUserInitials(user!.firstName, user!.lastName) : userInitials}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {isEditing ? 'Edit User' : 'Create New User'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isEditing ? `Update ${user?.fullName}'s information` : 'Add a new user to the platform'}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <Divider />

      {/* Form Content */}
      <DialogContent>
        <Box component="form" id="user-form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ pt: 2 }}>
          
          {/* Profile Information Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom color="primary">
              Profile Information
            </Typography>
            
            {/* Name fields in responsive row */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Controller name="firstName" control={control} render={({ field }) => (
                  <TextField {...field} label="First Name" fullWidth error={Boolean(errors.firstName)}
                    helperText={errors.firstName?.message} disabled={isLoading} />
                )}/>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Controller name="lastName" control={control} render={({ field }) => (
                  <TextField {...field} label="Last Name" fullWidth error={Boolean(errors.lastName)}
                    helperText={errors.lastName?.message} disabled={isLoading} />
                )}/>
              </Box>
            </Box>

            {/* Email field (disabled when editing) */}
            <Box sx={{ mb: 3 }}>
              <Controller name="email" control={control} render={({ field }) => (
                <TextField {...field} label="Email Address" type="email" fullWidth error={Boolean(errors.email)}
                  helperText={errors.email?.message} disabled={isLoading || isEditing} />
              )}/>
            </Box>

            {/* Phone field */}
            <Box sx={{ mb: 3 }}>
              <Controller name="phone" control={control} render={({ field }) => (
                <TextField {...field} label="Phone Number" fullWidth error={Boolean(errors.phone)}
                  helperText={errors.phone?.message} disabled={isLoading} placeholder="+1 (555) 123-4567" />
              )}/>
            </Box>
          </Box>

          {/* Account Settings Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom color="primary">
              Account Settings
            </Typography>
            
            {/* Role and Plan selection */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Controller name="role" control={control} render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.role)}>
                    <InputLabel>Role</InputLabel>
                    <Select {...field} label="Role" disabled={isLoading}>
                      <MenuItem value="user"><Chip label="User" size="small" variant="outlined" /></MenuItem>
                      <MenuItem value="admin"><Chip label="Admin" size="small" color="primary" /></MenuItem>
                      <MenuItem value="moderator"><Chip label="Moderator" size="small" color="secondary" /></MenuItem>
                    </Select>
                    {errors.role && <Typography variant="caption" color="error">{errors.role.message}</Typography>}
                  </FormControl>
                )}/>
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Controller name="plan" control={control} render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.plan)}>
                    <InputLabel>Subscription Plan</InputLabel>
                    <Select {...field} label="Subscription Plan" disabled={isLoading}>
                      <MenuItem value="free"><Chip label="Free" size="small" color="default" variant="outlined" /></MenuItem>
                      <MenuItem value="basic"><Chip label="Basic" size="small" color="info" /></MenuItem>
                      <MenuItem value="premium"><Chip label="Premium" size="small" color="warning" /></MenuItem>
                      <MenuItem value="enterprise"><Chip label="Enterprise" size="small" color="primary" /></MenuItem>
                    </Select>
                    {errors.plan && <Typography variant="caption" color="error">{errors.plan.message}</Typography>}
                  </FormControl>
                )}/>
              </Box>
            </Box>
          </Box>

          {/* Preview section for new users */}
          {!isEditing && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1, bgcolor: 'action.hover' }}>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">Preview</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>{userInitials}</Avatar>
                  <Box>
                    <Typography fontWeight={500}>{watchedValues.firstName} {watchedValues.lastName}</Typography>
                    <Typography variant="body2" color="text.secondary">{watchedValues.email}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      {/* Form Actions */}
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button startIcon={<CancelIcon />} onClick={handleCancel} disabled={isLoading} size="large">
          Cancel
        </Button>
        <LoadingButton type="submit" form="user-form" startIcon={<SaveIcon />} loading={isLoading}
          loadingPosition="start" variant="contained" disabled={!isDirty && isEditing} size="large">
          {isEditing ? 'Update User' : 'Create User'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};