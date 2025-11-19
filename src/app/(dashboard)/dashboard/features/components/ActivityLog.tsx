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
} from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";
import { useGetActivityQuery } from "../api/dashboardApi";
import LoadingState from "../../../../../components/LoadingState";

type ActivityLimit = "default" | 5 | 10 | 25 | 50 | 100;

interface ActivityLogProps {
  refreshTrigger?: number;
}

export default function ActivityLog({ refreshTrigger }: ActivityLogProps) {
  const [itemLimit, setItemLimit] = useState<ActivityLimit>("default");

  const queryParams =
    itemLimit !== "default" ? { limit: itemLimit } : undefined;

  const { data, isLoading, error, refetch } = useGetActivityQuery(queryParams);

  const hasError = !!error;
  const isEmpty = !data?.data || data.data.length === 0;

  // Refetch when refreshTrigger changes
  React.useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  const handleLimitChange = (event: SelectChangeEvent<ActivityLimit>) => {
    const value = event.target.value;
    if (value === "default") {
      setItemLimit("default");
    } else {
      setItemLimit(Number(value) as ActivityLimit);
    }
  };

  const getLimitDisplayLabel = (limit: ActivityLimit): string => {
    const labels: Record<ActivityLimit, string> = {
      default: "Default",
      5: "5 items",
      10: "10 items",
      25: "25 items",
      50: "50 items",
      100: "100 items",
    };
    return labels[limit];
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
          {hasError ? (
            <ListItem alignItems="flex-start" sx={{ backgroundColor: '#FEF2F2',py: 8 }}>
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
                  <Typography variant="h6" color="error.main" gutterBottom>
                    Unable to Load Activity Data
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
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
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Recent Activity
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    Activity will appear here once users start using the
                    platform
                  </Typography>
                }
              />
            </ListItem>
          ) : (
            data?.data.map((act) => (
              <React.Fragment key={act.id}>
                <ListItem alignItems="flex-start">
                  <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                    {act.type?.[0]?.toUpperCase() || "A"}
                  </Avatar>
                  <ListItemText
                    primary={
                      <Typography component="div">{act.title}</Typography>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          component="div"
                        >
                          {act.description}
                        </Typography>
                        {act.createdAt && (
                          <Typography
                            variant="caption"
                            color="text.disabled"
                            component="div"
                          >
                            {new Date(act.createdAt).toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          )}
        </List>

        {!hasError && !isEmpty && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="caption" color="text.secondary">
              Showing {data?.data.length || 0}{" "}
              {itemLimit !== "default" &&
                `of ${getLimitDisplayLabel(itemLimit)}`}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}