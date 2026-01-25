'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { Box, Typography, Stack } from '@mui/material';
import { 
  ChatBubbleOutline, 
  PeopleOutline, 
  SettingsSuggestOutlined 
} from '@mui/icons-material';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default React.memo(function AuthLayout({ children }: AuthLayoutProps) {
  const features = useMemo(() => [
    {
      icon: <ChatBubbleOutline sx={{ color: 'white', fontSize: 24 }} />,
      title: 'Share Predictions & Insights',
      description: 'Create, edit, and remove match predictions for different leagues and sports.',
    },
    {
      icon: <PeopleOutline sx={{ color: 'white', fontSize: 24 }} />,
      title: 'Track Analytics & User Engagement',
      description: 'Compare consultation fees upfront to access quality care that fits your budget.',
    },
    {
      icon: <SettingsSuggestOutlined sx={{ color: 'white', fontSize: 24 }} />,
      title: 'Manage Subscriptions & Access Control',
      description: 'Control subscription tiers, pricing, and access limits',
    },
  ], []);

  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar Section */}
      <Box
        sx={{
          width: { xs: '0%', lg: '42%' },
          bgcolor: '#0B1A04', // Deep Forest Green
          p: '60px',
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Box sx={{ mb: 6 }}>
            <Image
              src="/predict-galore-logo.png"
              alt="Predict Galore"
              width={160}
              height={32}
              priority
            />
          </Box>

          <Stack spacing={5}>
            {features.map((feature, index) => (
              <Stack key={index} direction="row" spacing={2.5} alignItems="flex-start">
                <Box sx={{ mt: 0.5 }}>{feature.icon}</Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Box>

        {/* Red Quote Card */}
        <Box
          sx={{
            bgcolor: '#E32626',
            borderRadius: '16px',
            p: '48px 40px',
          }}
        >
          <Typography sx={{ color: 'white', fontSize: '64px', fontFamily: 'serif', lineHeight: 0.2, mb: 2 }}>
            “
          </Typography>
          <Typography
            sx={{
              color: 'white',
              fontSize: '3.4rem',
              lineHeight: 1.1,
              fontFamily: 'var(--font-ultra)', // Heavy Slab-Serif
              mb: 2,
            }}
          >
            In football, the worst blindness is only seeing the ball.
          </Typography>
          <Typography sx={{ color: 'white', fontSize: '64px', fontFamily: 'serif', lineHeight: 0.2, mb: 4 }}>
            ”
          </Typography>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 400, fontSize: '1.25rem' }}>
            -Nelson Rodrigues
          </Typography>
        </Box>
      </Box>

      {/* Auth Form Section */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#FFFFFF',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: '440px', p: 4 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
});