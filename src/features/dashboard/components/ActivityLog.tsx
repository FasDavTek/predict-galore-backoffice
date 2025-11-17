import React, { useState } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from "@mui/material";
import { useGetActivityQuery } from "../api/dashboardApi";
import EmptyState from "../../../components/EmptyState";
import ErrorState from "../../../components/ErrorState";
import LoadingState from "../../../components/LoadingState";

// Define available limit options including 'default'
type ActivityLimit = 'default' | 5 | 10 | 25 | 50 | 100;

export default function ActivityLog() {
  // Filter state managed directly in component - default means no filter
  const [itemLimit, setItemLimit] = useState<ActivityLimit>('default');
  
  // Only pass limit to API if it's not 'default'
  const queryParams = itemLimit !== 'default' ? { limit: itemLimit } : undefined;
  
  const { data, isLoading, error, refetch } = useGetActivityQuery(queryParams);
  const items = data?.data ?? [];

  // Handle limit change
  const handleLimitChange = (event: SelectChangeEvent<ActivityLimit>) => {
    const value = event.target.value;
    // Convert string value to proper type
    if (value === 'default') {
      setItemLimit('default');
    } else {
      setItemLimit(Number(value) as ActivityLimit);
    }
  };

  // Handle loading state
  if (isLoading) {
    return (
<Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
     <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={600}>
              Activity Log
            </Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Show</InputLabel>
              <Select
                value={itemLimit}
                label="Show"
                onChange={handleLimitChange}
              >
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value={5}>5 items</MenuItem>
                <MenuItem value={10}>10 items</MenuItem>
                <MenuItem value={25}>25 items</MenuItem>
                <MenuItem value={50}>50 items</MenuItem>
                <MenuItem value={100}>100 items</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <LoadingState
           variant="text"
            message="Loading activities..."
            height={200}
          />
        </CardContent>
      </Card>
    );
  }

  // Handle error state
  if (error) {
    return (
       <Box sx={{ mb: 3 }}>
          <ErrorState
            variant="api"
            title="Failed to Load Activity Log"
            message="We couldn't load the activity log. This might be due to a temporary server issue."
            retryAction={{ 
              label: "Retry Activity Log", 
              onClick: refetch 
            }}
            height={300}
          />
       </Box>
    );
  }

  // Handle empty state
  if (items.length === 0) {
    return (
       <Box sx={{ mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={600}>
              Activity Log
            </Typography>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Show</InputLabel>
              <Select
                value={itemLimit}
                label="Show"
                onChange={handleLimitChange}
              >
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value={5}>5 items</MenuItem>
                <MenuItem value={10}>10 items</MenuItem>
                <MenuItem value={25}>25 items</MenuItem>
                <MenuItem value={50}>50 items</MenuItem>
                <MenuItem value={100}>100 items</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <EmptyState
            variant="data"
            title="No Recent Activity"
            description="There's no recent activity to display. Activity will appear once users start performing actions on your platform."
            primaryAction={{
              label: "Refresh Data",
              onClick: refetch,
            }}
            height={250}
          />
    </Box>
    );
  }

  // Get display label for current limit
  const getLimitDisplayLabel = (limit: ActivityLimit): string => {
    const labels: Record<ActivityLimit, string> = {
      default: 'Default',
      5: '5 items',
      10: '10 items',
      25: '25 items',
      50: '50 items',
      100: '100 items'
    };
    return labels[limit];
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={600}>
            Activity Log
          </Typography>

          {/* Filter directly in component */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Show</InputLabel>
            <Select
              value={itemLimit}
              label="Show"
              onChange={handleLimitChange}
            >
              <MenuItem value="default">Default</MenuItem>
              <MenuItem value={5}>5 items</MenuItem>
              <MenuItem value={10}>10 items</MenuItem>
              <MenuItem value={25}>25 items</MenuItem>
              <MenuItem value={50}>50 items</MenuItem>
              <MenuItem value={100}>100 items</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <List>
          {items.map((act) => (
            <React.Fragment key={act.id}>
              <ListItem alignItems="flex-start">
                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                  {act.type?.[0]?.toUpperCase() || 'A'}
                </Avatar>
                <ListItemText 
                  primary={act.title} 
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {act.description}
                      </Typography>
                      {act.createdAt && (
                        <Typography variant="caption" color="text.disabled">
                          {new Date(act.createdAt).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>
                  } 
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>

        {/* Show current items count */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Showing {items.length} {itemLimit !== 'default' && `of ${getLimitDisplayLabel(itemLimit)}`}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}