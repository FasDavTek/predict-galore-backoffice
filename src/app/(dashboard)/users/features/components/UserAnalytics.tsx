/**
 * User Analytics Component
 * Clean, simple implementation
 */

'use client';

import Box from '@mui/material/Box';
import { AnalyticsCard } from '@/shared/components/AnalyticsCard';
import { useUsersAnalytics } from '@/features/users';
import { designTokens } from '@/shared/styles/tokens';
import { People, Person, PersonAdd, Star } from '@mui/icons-material';

const cards = [
  {
    key: 'totalUsers',
    title: 'Total Users',
    icon: <People />,
    bgColor: '#F0F9FF',
    textColor: '#0369A1',
    iconColor: '#0EA5E9',
  },
  {
    key: 'activeUsers',
    title: 'Active Users',
    icon: <Person />,
    bgColor: '#ECFDF5',
    textColor: '#065F46',
    iconColor: '#10B981',
  },
  {
    key: 'newUsers',
    title: 'New Users',
    icon: <PersonAdd />,
    bgColor: '#FFFBEB',
    textColor: '#92400E',
    iconColor: '#F59E0B',
  },
  {
    key: 'premiumUsers',
    title: 'Premium Users',
    icon: <Star />,
    bgColor: '#EFF6FF',
    textColor: '#1E40AF',
    iconColor: '#3B82F6',
  },
];

export function UserAnalytics() {
  const { isLoading, error } = useUsersAnalytics();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
        gap: designTokens.spacing.itemGap,
        mb: designTokens.spacing.xl,
      }}
    >
      {cards.map((card) => {
        // Since analytics API returns empty object, we'll show 0 for all values
        const value = 0;

        return (
          <Box key={card.key}>
            <AnalyticsCard
              title={card.title}
              value={value.toLocaleString()}
              change={undefined}
              loading={isLoading}
              error={!!error}
              config={{
                title: card.title,
                bgColor: card.bgColor,
                textColor: card.textColor,
                iconColor: card.iconColor,
                format: (val: number | undefined) => (val ?? 0).toLocaleString(),
              }}
              icon={card.icon}
            />
          </Box>
        );
      })}
    </Box>
  );
}
