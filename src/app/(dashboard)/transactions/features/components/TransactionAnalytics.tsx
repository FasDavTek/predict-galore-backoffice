/**
 * Transaction Analytics Component
 * Clean, simple implementation
 */

'use client';

import Box from '@mui/material/Box';
import { AnalyticsCard } from '@/shared/components/AnalyticsCard';
import { useTransactionsAnalytics } from '@/features/transactions';
import { designTokens } from '@/shared/styles/tokens';
import { Payment, CheckCircle, Cancel, TrendingUp } from '@mui/icons-material';

const cards = [
  {
    key: 'totalCount',
    title: 'Total Transactions',
    icon: <Payment />,
    bgColor: '#F0F9FF',
    textColor: '#0369A1',
    iconColor: '#0EA5E9',
  },
  {
    key: 'totalRevenue',
    title: 'Total Revenue',
    icon: <TrendingUp />,
    bgColor: '#ECFDF5',
    textColor: '#065F46',
    iconColor: '#10B981',
    format: (val: number | undefined) => `₦${(val ?? 0).toLocaleString()}`,
  },
  {
    key: 'successCount',
    title: 'Successful',
    icon: <CheckCircle />,
    bgColor: '#ECFDF5',
    textColor: '#065F46',
    iconColor: '#10B981',
  },
  {
    key: 'pendingCount',
    title: 'Pending',
    icon: <Cancel />,
    bgColor: '#FFFBEB',
    textColor: '#92400E',
    iconColor: '#F59E0B',
  },
];

export function TransactionAnalytics() {
  const { data, isLoading, error } = useTransactionsAnalytics();
  const analytics = data;

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
        const value = analytics?.[card.key as keyof typeof analytics] as number | undefined;

        return (
          <Box key={card.key}>
            <AnalyticsCard
              title={card.title}
              value={card.format ? card.format(value || 0) : (value ?? 0).toLocaleString()}
              change={undefined}
              loading={isLoading}
              error={!!error}
              config={{
                title: card.title,
                bgColor: card.bgColor,
                textColor: card.textColor,
                iconColor: card.iconColor,
                format: card.format || ((val: number | undefined) => (val ?? 0).toLocaleString()),
              }}
              icon={card.icon}
            />
          </Box>
        );
      })}
    </Box>
  );
}
