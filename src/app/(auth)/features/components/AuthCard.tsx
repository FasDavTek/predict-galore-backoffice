'use client';

import React, { memo } from 'react';
import { Box, Typography, Card, CardContent, CardProps } from '@mui/material';

interface AuthCardProps extends CardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const AuthCard = memo<AuthCardProps>(({ title, subtitle, children, ...props }) => {
  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: 456,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        ...props.sx,
      }}
      {...props}
    >
      <CardContent sx={{ padding: 3.5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 1, color: 'text.primary' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {children}
      </CardContent>
    </Card>
  );
});

AuthCard.displayName = 'AuthCard';
