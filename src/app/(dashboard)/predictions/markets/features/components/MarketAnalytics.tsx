/**
 * Market Analytics Component
 */

'use client';

import { memo } from 'react';
import { Box, Grid, Paper, Typography, Stack, Skeleton } from '@mui/material';
import { designTokens } from '@/shared/styles/tokens';
import { useMarketsAnalytics } from '@/features/markets';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CategoryIcon from '@mui/icons-material/Category';
import ListIcon from '@mui/icons-material/List';

interface AnalyticsCardProps {
  title: string;
  value: number | string;
  change?: number;
  icon: React.ReactNode;
  color: string;
}

const AnalyticsCard = memo(function AnalyticsCard({ title, value, change, icon, color }: AnalyticsCardProps) {
  const changeColor = change && change > 0 ? designTokens.colors.success[600] : designTokens.colors.error[600];
  
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: `${color}14`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color,
            }}
          >
            {icon}
          </Box>
          {change !== undefined && change !== 0 && (
            <Typography variant="body2" sx={{ color: changeColor, fontWeight: 600 }}>
              {change > 0 ? '+' : ''}{change}%
            </Typography>
          )}
        </Stack>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
});

export const MarketAnalytics = memo(function MarketAnalytics() {
  const { data: analytics, isLoading } = useMarketsAnalytics();

  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!analytics) return null;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <AnalyticsCard
          title="Total Markets"
          value={analytics.totalMarkets}
          change={analytics.totalChange}
          icon={<StorefrontIcon />}
          color={designTokens.colors.primary[500]}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <AnalyticsCard
          title="Active Markets"
          value={analytics.activeMarkets}
          change={analytics.activeChange}
          icon={<CheckCircleIcon />}
          color={designTokens.colors.success[600]}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <AnalyticsCard
          title="Categories"
          value={analytics.categories}
          change={analytics.categoriesChange}
          icon={<CategoryIcon />}
          color={designTokens.colors.info[500]}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <AnalyticsCard
          title="Total Selections"
          value={analytics.totalSelections}
          change={analytics.selectionsChange}
          icon={<ListIcon />}
          color={designTokens.colors.warning[500]}
        />
      </Grid>
    </Grid>
  );
});
