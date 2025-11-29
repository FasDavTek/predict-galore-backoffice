import React from "react";
import { Box, Card, CardContent, Typography, Skeleton } from "@mui/material";
import {
  TrendingUp as ArrowUpIcon,
  TrendingDown as ArrowDownIcon,
  People as UsersIcon,
  Person as UserIcon,
  PersonAdd as NewUserIcon,
  Star as PremiumIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { useGetUsersAnalyticsQuery } from "../api/userApi";

// Define types for AnalyticsCard props
interface AnalyticsCardConfig {
  title: string;
  bgColor: string;
  textColor: string;
  iconColor: string;
  icon: React.ReactElement;
  format: (value: number | undefined) => string;
}

interface AnalyticsCardProps {
  title: string;
  value: string;
  change?: string;
  loading?: boolean;
  config: AnalyticsCardConfig;
}

interface UserAnalyticsProps {
  refreshTrigger?: number;
}

// Individual analytics card component
const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  change = "0%",
  loading = false,
  config,
}) => {
  const isPositive = parseFloat(change) >= 0;

  if (loading) {
    return (
      <Card sx={{ border: "none", boxShadow: "none", height: "140px" }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="80%" height={32} sx={{ my: 1 }} />
              <Skeleton variant="text" width="40%" height={20} />
            </Box>
            <Skeleton variant="circular" width={40} height={40} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        border: "none",
        backgroundColor: config.bgColor,
        boxShadow: "none",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                color: config.textColor,
                fontSize: "0.875rem",
                fontWeight: 500,
                mb: 1,
                opacity: 0.9,
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                color: config.textColor,
                mb: 2,
                fontWeight: 600,
                fontSize: { xs: "1rem", md: "1rem" },
              }}
            >
              {value}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {isPositive ? (
                <ArrowUpIcon
                  sx={{
                    color: "#3C9705",
                    width: 16,
                    height: 16,
                  }}
                />
              ) : (
                <ArrowDownIcon
                  sx={{
                    color: "#D92D20",
                    width: 16,
                    height: 16,
                  }}
                />
              )}
              <Typography
                sx={{
                  color: isPositive ? "#3C9705" : "#D92D20",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                {change}%
              </Typography>
              <Typography
                sx={{
                  color: config.textColor,
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  opacity: 0.8,
                }}
              >
                vs last period
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              bgcolor: `${config.iconColor}20`,
              width: 40,
              height: 40,
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              ml: 2,
            }}
          >
            <Box sx={{ color: config.iconColor, fontSize: "1.25rem" }}>
              {config.icon}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// ErrorAnalyticsCard
const ErrorAnalyticsCard: React.FC<{ onRetry?: () => void }> = ({
  onRetry,
}) => {
  return (
    <Card
      sx={{
        border: "none",
        backgroundColor: "#FEF2F2",
        boxShadow: "none",
        height: "140px",
      }}
    >
      <CardContent
        sx={{
          p: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <WarningIcon sx={{ color: "#DC2626", fontSize: 32, mb: 1 }} />
        <Typography variant="h6" color="#DC2626" gutterBottom>
          Error: Unable to load analytics data
        </Typography>
        {onRetry && (
          <Typography
            variant="body2"
            color="#DC2626"
            sx={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={onRetry}
          >
            Click to retry
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export const UserAnalytics: React.FC<UserAnalyticsProps> = ({
  refreshTrigger = 0,
}) => {
  // Fetch analytics data from API with same configuration as PredictionAnalytics
  const {
    data: analyticsResponse,
    isLoading,
    error,
    refetch,
  } = useGetUsersAnalyticsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Refetch when refreshTrigger changes - same as PredictionAnalytics
  React.useEffect(() => {
    refetch();
  }, [refreshTrigger, refetch]);

  const analytics = analyticsResponse?.data;

  // Define analytics data type with index signature
  interface AnalyticsData {
    totalUsers?: number;
    activeUsers?: number;
    newUsers?: number;
    premiumUsers?: number;
    totalChange?: number;
    activeChange?: number;
    newChange?: number;
    premiumChange?: number;
    [key: string]: number | undefined;
  }

  // Card configuration for different user analytics metrics
  const analyticsConfig: Record<string, AnalyticsCardConfig> = {
    totalUsers: {
      title: "Total Users",
      bgColor: "#F0F9FF",
      textColor: "#0369A1",
      iconColor: "#0EA5E9",
      icon: <UsersIcon />,
      format: (value: number | undefined) => value?.toLocaleString() || "N/A",
    },
    activeUsers: {
      title: "Active Users",
      bgColor: "#ECFDF5",
      textColor: "#065F46",
      iconColor: "#10B981",
      icon: <UserIcon />,
      format: (value: number | undefined) => value?.toLocaleString() || "N/A",
    },
    newUsers: {
      title: "New Users",
      bgColor: "#FFFBEB",
      textColor: "#92400E",
      iconColor: "#F59E0B",
      icon: <NewUserIcon />,
      format: (value: number | undefined) => value?.toLocaleString() || "N/A",
    },
    premiumUsers: {
      title: "Premium Users",
      bgColor: "#EFF6FF",
      textColor: "#1E40AF",
      iconColor: "#3B82F6",
      icon: <PremiumIcon />,
      format: (value: number | undefined) => value?.toLocaleString() || "N/A",
    },
  };

  const hasError = !!error;
  const isLoadingData = isLoading;

  // If there's an error, show a single error card with retry option - same as PredictionAnalytics
  if (hasError) {
    return (
      <Box sx={{ mb: 4 }}>
        <ErrorAnalyticsCard onRetry={refetch} />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 2,
          "& > *": {
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 16px)",
              md: "1 1 calc(50% - 16px)",
            },
            minWidth: {
              xs: "100%",
              sm: "200px",
              md: "220px",
            },
          },
        }}
      >
        {Object.entries(analyticsConfig).map(([key, config]) => {
          const analyticsData = analytics as AnalyticsData;
          const changeKey = `${key.replace("Users", "")}Change`;
          const changeValue = analyticsData?.[changeKey]?.toString() || "0";
          const value = analyticsData?.[key];

          return (
            <Box key={key}>
              <AnalyticsCard
                title={config.title}
                value={config.format(value)}
                change={changeValue}
                loading={isLoadingData}
                config={config}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
