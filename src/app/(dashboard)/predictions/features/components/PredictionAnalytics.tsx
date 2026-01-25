/**
 * Prediction Analytics Component
 * Clean, simple implementation
 */

'use client';

import Box from '@mui/material/Box';
import { AnalyticsCard } from '@/shared/components/AnalyticsCard';
import { usePredictionsAnalytics } from '@/features/predictions';
import { designTokens } from '@/shared/styles/tokens';
import { Analytics, CheckCircle, TrendingUp, Percent } from '@mui/icons-material';

const cards = [
  {
    key: 'total',
    title: 'Total Predictions',
    icon: <Analytics />,
    bgColor: '#F0F9FF',
    textColor: '#0369A1',
    iconColor: '#0EA5E9',
  },
  {
    key: 'avgAccuracy',
    title: 'Avg Accuracy',
    icon: <Percent />,
    bgColor: '#FFFBEB',
    textColor: '#92400E',
    iconColor: '#F59E0B',
    format: (val: number | undefined) => `${(val ?? 0).toFixed(1)}%`,
  },
  {
    key: 'scheduled',
    title: 'Scheduled',
    icon: <CheckCircle />,
    bgColor: '#ECFDF5',
    textColor: '#065F46',
    iconColor: '#10B981',
  },
  {
    key: 'active',
    title: 'Active',
    icon: <TrendingUp />,
    bgColor: '#ECFDF5',
    textColor: '#065F46',
    iconColor: '#10B981',
  },
];

export function PredictionAnalytics() {
  const { data, isLoading, error } = usePredictionsAnalytics();
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
              value={card.format ? card.format(value || 0) : value?.toLocaleString() || '0'}
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
