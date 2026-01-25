/**
 * Activity Log Component
 * Clean, simple implementation
 */

'use client';

import { useState, memo, useCallback, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
  Button,
  ButtonGroup,
  CircularProgress,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import { designTokens } from '@/shared/styles/tokens';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useDashboardActivity } from '@/features/dashboard';

interface ActivityLogProps {
  refreshKey?: number;
}

const ITEMS_PER_PAGE = 10;

// Helper function to format timestamps relative to now
const formatTimestamp = (timestamp: string): string => {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return activityTime.toLocaleDateString();
};

const ActivityLog = memo(function ActivityLog({ 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  refreshKey: _refreshKey 
}: ActivityLogProps) {
  const [offset, setOffset] = useState(0);
  const { data, isLoading, error } = useDashboardActivity();

  const activities = useMemo(() => data?.activities || [], [data?.activities]);
  const totalItems = useMemo(() => data?.total || 0, [data?.total]);
  const totalPages = useMemo(() => Math.ceil(totalItems / ITEMS_PER_PAGE), [totalItems]);
  const currentPage = useMemo(() => Math.floor(offset / ITEMS_PER_PAGE) + 1, [offset]);

  const handlePrevious = useCallback(() => {
    setOffset((prev) => Math.max(0, prev - ITEMS_PER_PAGE));
  }, []);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) {
      setOffset((prev) => prev + ITEMS_PER_PAGE);
    }
  }, [currentPage, totalPages]);

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Loading activity...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <WarningIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
            <Typography variant="h6" color="error.main" gutterBottom>
              Unable to Load Activity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Failed to load activity
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <WarningIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Activity Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No activity found
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: designTokens.spacing.itemGap }}>
          <Typography variant="h6">Recent Activity</Typography>
          <ButtonGroup size="small">
            <Button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              startIcon={<ChevronLeftIcon />}
            >
              Prev
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentPage >= totalPages}
              endIcon={<ChevronRightIcon />}
            >
              Next
            </Button>
          </ButtonGroup>
        </Stack>

        <List>
          {activities.map((activity, index) => (
            <Box key={activity.id}>
              <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                  {activity.actorDisplayName?.[0]?.toUpperCase() || activity.title?.[0]?.toUpperCase() || activity.category?.[0]?.toUpperCase() || 'A'}
                </Avatar>
                <ListItemText
                  primary={activity.title}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        {activity.description}
                      </Typography>
                      {activity.actorDisplayName && (
                        <>
                          <br />
                          <Typography component="span" variant="caption" color="text.secondary">
                            {activity.actorDisplayName}
                            {activity.actorRole && ` • ${activity.actorRole}`}
                          </Typography>
                        </>
                      )}
                      <br />
                      <Typography component="span" variant="caption" color="text.secondary">
                        {formatTimestamp(activity.createdAtUtc)}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < activities.length - 1 && <Divider variant="inset" component="li" />}
            </Box>
          ))}
        </List>
      </CardContent>
    </Card>
  );
});

ActivityLog.displayName = 'ActivityLog';

export default ActivityLog;
