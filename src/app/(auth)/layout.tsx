'use client';

import React from 'react';
import Image from 'next/image';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { Description, People, AccountBalanceWallet } from '@mui/icons-material';
import { AuthFeature } from '@/features/auth/types/authTypes';

const features: AuthFeature[] = [
  {
    icon: <Description sx={{ width: 32, height: 32, color: 'grey.50' }} />,
    title: 'Share Predictions & Insights',
    description: 'Create, edit, and remove match predictions for different leagues and sports.',
  },
  {
    icon: <People sx={{ width: 32, height: 32, color: 'grey.50' }} />,
    title: 'Track Analytics & User Engagement',
    description: 'Compare consultation fees upfront to access quality care that fits your budget.',
  },
  {
    icon: <AccountBalanceWallet sx={{ width: 32, height: 32, color: 'grey.50' }} />,
    title: 'Manage Subscriptions & Access Control',
    description: 'Control subscription tiers, pricing, and access limits',
  },
];

const fallbackQuote = {
  text: 'In football, the worst blindness is only seeing the ball.',
  author: 'Nelson Rodrigues',
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        overflow: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', lg: '40%' },
          minHeight: '100vh',
          height: 'auto',
          bgcolor: '#162E08',
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <Image
          src="/predict-galore-logo.png"
          alt="Predict galore logo"
          width={208}
          height={40}
          priority
          style={{
            filter: "drop-shadow(0 25px 25px rgba(0, 0, 0, 0.15))",
          }}
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
          {features.map((feature, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box sx={{ mt: 0.5 }}>{feature.icon}</Box>
              <Box>
                <Typography variant="h6" sx={{ color: 'grey.50', fontWeight: 600, mb: 0.5 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey.50', lineHeight: 1.5 }}>
                  {feature.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Card
          sx={{
            bgcolor: '#ED1C24',
            borderRadius: 2,
            minHeight: 200,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <CardContent sx={{ padding: 3, textAlign: 'center' }}>
            <Box
              component="img"
              src="/opening-quote.svg"
              alt="Quote mark"
              sx={{ width: 18, height: 14, mb: 2 }}
            />
            <Typography
              variant="h5"
              sx={{
                fontFamily: 'Ultra',
                color: 'white',
                lineHeight: 1.4,
                mb: 2,
                fontStyle: 'italic',
              }}
            >
              {`"${fallbackQuote.text}"`}
            </Typography>
            <Box
              component="img"
              src="/closing-quote.svg"
              alt="Quote mark"
              sx={{ width: 18, height: 14, mb: 1 }}
            />
            <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
              {fallbackQuote.author}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box
        sx={{
          width: { xs: '0%', lg: '60%' },
          minHeight: '100vh',
          height: 'auto',
          display: { xs: 'none', lg: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          padding: 4,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}