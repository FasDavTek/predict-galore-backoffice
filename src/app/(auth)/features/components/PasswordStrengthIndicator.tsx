import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { PasswordStrengthProps } from '@/app/(auth)/features/types/authTypes';

export const PasswordStrengthIndicator: React.FC<PasswordStrengthProps> = ({ password }) => {
  const calculateStrength = (): number => {
    let strength = 0;
    if (password.length > 0) strength += 20;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 20;
    return Math.min(strength, 100);
  };

  const strength = calculateStrength();
  
  const strengthText = (): string => {
    if (password.length === 0) return '';
    if (strength < 40) return 'Weak';
    if (strength < 80) return 'Medium';
    return 'Strong';
  };

  const getColor = (): string => {
    if (password.length === 0) return 'grey';
    if (strength < 40) return 'error.main';
    if (strength < 80) return 'warning.main';
    return 'success.main';
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
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
          backgroundColor: 'grey.200',
          '& .MuiLinearProgress-bar': { backgroundColor: getColor() },
        }}
      />
    </Box>
  );
};