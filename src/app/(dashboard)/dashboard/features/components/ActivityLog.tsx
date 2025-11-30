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
  SelectChangeEvent,
  Button,
  ButtonGroup,
} from "@mui/material";
import { 
  Warning as WarningIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { useGetActivityQuery } from "../api/dashboardApi";
import LoadingState from "../../../../../shared/components/LoadingState";

type ActivityLimit = "default" | 5 | 10 | 25 | 50 | 100 | "all";

interface ActivityLogProps {
  refreshTrigger?: number;
}

// Types for the actual API response structure
interface ActivityApiItem {
  id: number;
  createdAtUtc: string;
  title: string;
  description: string;
  actorDisplayName: string;
  actorRole: string | null;
  category: string;
}

interface ActivityApiResponse {
  totalItems: number;
  success: boolean;
  currentPage: number;
  pageSize: number;
  resultItems: ActivityApiItem[];
  totalPages: number;
  message: string | null;
}

export default function ActivityLog({ refreshTrigger }: ActivityLogProps) {
  const [itemLimit, setItemLimit] = useState<ActivityLimit>(5); // Default to 5 items
  const [currentPage, setCurrentPage] = useState(1);

  // Convert limit to pageSize and page parameters for the API
  const queryParams = {
    pageSize: itemLimit === "all" ? 1000 : (itemLimit === "default" ? 5 : itemLimit),
    page: currentPage
  };

  const { data, isLoading, error, refetch } = useGetActivityQuery(queryParams);

  // Type assertion to handle the actual API response structure
  const activityData = data?.data as unknown as ActivityApiResponse;
  
  const hasError = !!error;
  const isEmpty = !activityData?.resultItems || activityData.resultItems.length === 0;

  // Refetch when refreshTrigger changes or when pagination changes
  React.useEffect(() => {
    refetch();
  }, [refreshTrigger, currentPage, itemLimit, refetch]);

  const handleLimitChange = (event: SelectChangeEvent<ActivityLimit>) => {
    const value = event.target.value;
    
    if (value === "default") {
      setItemLimit("default");
    } else if (value === "all") {
      setItemLimit("all");
    } else {
      setItemLimit(Number(value) as ActivityLimit);
    }
    
    // Reset to first page when changing limit
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // const handleShowAll = () => {
  //   setItemLimit("all");
  //   setCurrentPage(1);
  // };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get avatar color based on category
  const getAvatarColor = (category: string): string => {
    const colors: Record<string, string> = {
      'Audit': '#1976d2',
      'User': '#2e7d32',
      'System': '#ed6c02',
      'Payment': '#9c27b0',
      'Security': '#d32f2f'
    };
    return colors[category] || '#757575';
  };

  // Calculate pagination information
  const totalPages = activityData?.totalPages || 1;
  const totalItems = activityData?.totalItems || 0;
  const currentItems = activityData?.resultItems?.length || 0;
  const isShowAll = itemLimit === "all";
  const showPagination = !isShowAll && totalPages > 1;

  // Calculate start and end index for display
  const getDisplayRange = () => {
    if (isShowAll) {
      return `1-${currentItems} of ${totalItems}`;
    }
    
    const pageSize = itemLimit === "default" ? 5 : itemLimit;
    const startIndex = ((currentPage - 1) * pageSize) + 1;
    const endIndex = Math.min(startIndex + currentItems - 1, totalItems);
    
    return `${startIndex}-${endIndex} of ${totalItems}`;
  };

  if (isLoading) {
    return (
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
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
                <MenuItem value={5}>5 items</MenuItem>
                <MenuItem value={10}>10 items</MenuItem>
                <MenuItem value={25}>25 items</MenuItem>
                <MenuItem value={50}>50 items</MenuItem>
                <MenuItem value={100}>100 items</MenuItem>
                <MenuItem value="all">Show All</MenuItem>
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

  return (
    <Card>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" fontWeight={600}>
            Activity Log
          </Typography>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Show</InputLabel>
            <Select value={itemLimit} label="Show" onChange={handleLimitChange}>
              <MenuItem value={5}>5 items</MenuItem>
              <MenuItem value={10}>10 items</MenuItem>
              <MenuItem value={25}>25 items</MenuItem>
              <MenuItem value={50}>50 items</MenuItem>
              <MenuItem value={100}>100 items</MenuItem>
              <MenuItem value="all">Show All</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <List>
          {hasError ? (
            <ListItem alignItems="flex-start" sx={{ backgroundColor: '#FEF2F2', py: 8 }}>
              <Avatar
                sx={{
                  mr: 2,
                  bgcolor: 'error.main'
                }}
              >
                <WarningIcon />
              </Avatar>
              <ListItemText
                primary={
                  <Typography variant="h6" color="error.main" gutterBottom component="div">
                    Unable to Load Activity Data
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary" component="div">
                    There was an error loading the activity data
                  </Typography>
                }
              />
            </ListItem>
          ) : isEmpty ? (
            <ListItem alignItems="flex-start" sx={{ py: 8 }}>
              <Avatar sx={{ mr: 2, bgcolor: "grey.400" }}>
                <WarningIcon />
              </Avatar>
              <ListItemText
                primary={
                  <Typography variant="h6" color="text.secondary" gutterBottom component="div">
                    No Recent Activity
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary" component="div">
                    Activity will appear here once users start using the platform
                  </Typography>
                }
              />
            </ListItem>
          ) : (
            activityData?.resultItems.map((activity: ActivityApiItem) => (
              <React.Fragment key={activity.id}>
                <ListItem alignItems="flex-start">
                  <Avatar 
                    sx={{ 
                      mr: 2, 
                      bgcolor: getAvatarColor(activity.category),
                      fontSize: '0.875rem'
                    }}
                  >
                    {activity.category?.[0]?.toUpperCase() || "A"}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    {/* Primary content */}
                    <Box sx={{ mb: 1 }}>
                      <Typography component="div" variant="subtitle1" fontWeight={500}>
                        {activity.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" component="div">
                        by {activity.actorDisplayName}
                        {activity.category && ` • ${activity.category}`}
                      </Typography>
                    </Box>
                    
                    {/* Secondary content */}
                    <Box sx={{ mt: 0.5 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        component="div"
                        sx={{ mb: 0.5 }}
                      >
                        {activity.description}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.disabled"
                        component="div"
                      >
                        {formatDate(activity.createdAtUtc)}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          )}
        </List>

        {!hasError && !isEmpty && activityData && (
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
            {/* Pagination Info */}
            <Typography variant="caption" color="text.secondary">
              {getDisplayRange()}
              {!isShowAll && ` • Page ${currentPage} of ${totalPages}`}
            </Typography>

            {/* Pagination Controls */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Show All Button - only show when not already showing all */}
              {/* {!isShowAll && totalItems > (itemLimit === "default" ? 5 : itemLimit) && (
                <Button
                  size="small"
                  variant="text"
                  onClick={handleShowAll}
                  sx={{ mr: 1 }}
                >
                  Show All
                </Button>
              )} */}

              {/* Pagination Buttons - only show when not showing all and multiple pages exist */}
              {showPagination && (
                <ButtonGroup size="small" variant="outlined">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    startIcon={<ChevronLeftIcon />}
                  >
                    Prev
                  </Button>
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    endIcon={<ChevronRightIcon />}
                  >
                    Next
                  </Button>
                </ButtonGroup>
              )}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}