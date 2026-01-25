import React, { memo, useMemo } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { PasswordStrengthProps } from '@/features/auth';

export const PasswordStrengthIndicator = memo<PasswordStrengthProps>(({ password }) => {
  const strength = useMemo(() => {
    let value = 0;
    if (password.length > 0) value += 20;
    if (password.length >= 8) value += 20;
    if (/[A-Z]/.test(password)) value += 20;
    if (/[a-z]/.test(password)) value += 20;
    if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) value += 20;
    return Math.min(value, 100);
  }, [password]);

  const strengthText = useMemo(() => {
    if (password.length === 0) return '';
    if (strength < 40) return 'Weak';
    if (strength < 80) return 'Medium';
    return 'Strong';
  }, [password.length, strength]);

  const color = useMemo(() => {
    if (password.length === 0) return 'grey';
    if (strength < 40) return 'error.main';
    if (strength < 80) return 'warning.main';
    return 'success.main';
  }, [password.length, strength]);

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="caption">Password strength</Typography>
        <Typography variant="caption" sx={{ color }}>
          {strengthText}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={strength}
        sx={{
          height: 6,
          borderRadius: 3,
          backgroundColor: 'grey.200',
          '& .MuiLinearProgress-bar': { backgroundColor: color },
        }}
      />
    </Box>
  );
});

PasswordStrengthIndicator.displayName = 'PasswordStrengthIndicator';
