// src/app/(dashboard)/users/features/components/UserAnalytics.tsx
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
import { UsersAnalytics as UsersAnalyticsType } from "../types/user.types";

// ==================== TYPES ====================

interface AnalyticsCardConfig {
  title: string;
  bgColor: string;
  textColor: string;
  iconColor: string;
  format: (value: number | undefined) => string;
}

interface AnalyticsCardProps {
  title: string;
  value: string;
  change?: string;
  loading?: boolean;
  config: AnalyticsCardConfig;
  icon: React.ReactElement;
}

interface UserAnalyticsProps {
  refreshTrigger?: number;
}

// ==================== CONSTANTS ====================

const BORDER_COLOR_MAP: Record<string, string> = {
  "#F0F9FF": "#0EA5E920",
  "#ECFDF5": "#10B98120",
  "#FFFBEB": "#F59E0B20",
  "#EFF6FF": "#3B82F620",
};

const ANALYTICS_CONFIGS: Record<string, AnalyticsCardConfig> = {
  totalUsers: {
    title: "Total Users",
    bgColor: "#F0F9FF",
    textColor: "#0369A1",
    iconColor: "#0EA5E9",
    format: (value: number | undefined) => value?.toLocaleString() || "N/A",
  },
  activeUsers: {
    title: "Active Users",
    bgColor: "#ECFDF5",
    textColor: "#065F46",
    iconColor: "#10B981",
    format: (value: number | undefined) => value?.toLocaleString() || "N/A",
  },
  newUsers: {
    title: "New Users",
    bgColor: "#FFFBEB",
    textColor: "#92400E",
    iconColor: "#F59E0B",
    format: (value: number | undefined) => value?.toLocaleString() || "N/A",
  },
  premiumUsers: {
    title: "Premium Users",
    bgColor: "#EFF6FF",
    textColor: "#1E40AF",
    iconColor: "#3B82F6",
    format: (value: number | undefined) => value?.toLocaleString() || "N/A",
  },
};

const ANALYTICS_ICONS: Record<string, React.ReactElement> = {
  totalUsers: <UsersIcon />,
  activeUsers: <UserIcon />,
  newUsers: <NewUserIcon />,
  premiumUsers: <PremiumIcon />,
};

const FIELD_MAPPING: Record<string, keyof UsersAnalyticsType> = {
  totalUsers: "totalUsers",
  activeUsers: "activeUsers",
  newUsers: "newUsers",
  premiumUsers: "premiumUsers",
};

const CHANGE_FIELD_MAPPING: Record<string, keyof UsersAnalyticsType> = {
  totalUsers: "totalChange",
  activeUsers: "activeChange",
  newUsers: "newChange",
  premiumUsers: "premiumChange",
};

const ALL_CARDS = ["totalUsers", "activeUsers", "newUsers", "premiumUsers"];

// ==================== UTILITY FUNCTIONS ====================

const getBorderColor = (bgColor: string, iconColor: string): string => {
  return BORDER_COLOR_MAP[bgColor] || `${iconColor}20`;
};

// ==================== SUB-COMPONENTS ====================

const AnalyticsCardSkeleton: React.FC = () => (
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

const ChangeIndicator: React.FC<{ change: string }> = ({ change }) => {
  const isPositive = parseFloat(change) >= 0;

  return (
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
          fontSize: "0.75rem",
          fontWeight: 500,
          opacity: 0.8,
        }}
      >
        vs last period
      </Typography>
    </Box>
  );
};

const IconContainer: React.FC<{
  iconColor: string;
  icon: React.ReactElement;
}> = ({ iconColor, icon }) => (
  <Box
    sx={{
      bgcolor: `${iconColor}20`,
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
    <Box sx={{ color: iconColor, fontSize: "1.25rem" }}>{icon}</Box>
  </Box>
);

const AnalyticsCardContent: React.FC<{
  title: string;
  value: string;
  change: string;
  config: AnalyticsCardConfig;
  icon: React.ReactElement;
}> = ({ title, value, change, config, icon }) => (
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

      {change !== undefined && <ChangeIndicator change={change} />}
    </Box>

    <IconContainer iconColor={config.iconColor} icon={icon} />
  </Box>
);

// ==================== STATE COMPONENTS ====================

const ErrorAnalyticsCard: React.FC<{ onRetry?: () => void }> = ({
  onRetry,
}) => {
  return (
    <Card
      sx={{
        border: "1px solid #FECACA",
        backgroundColor: "#FEF2F2",
        boxShadow: "none",
        height: "140px",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg, #EF4444, #FECACA)",
        },
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

const EmptyAnalyticsState: React.FC = () => {
  return (
    <Card
      sx={{
        border: "1px solid #E2E8F0",
        backgroundColor: "#F8FAFC",
        boxShadow: "none",
        height: "140px",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg, #CBD5E1, #F1F5F9)",
        },
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
        <WarningIcon sx={{ color: "grey.400", fontSize: 32, mb: 1 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Analytics Data
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ opacity: 0.8 }}
        >
          Analytics data will appear here once available
        </Typography>
      </CardContent>
    </Card>
  );
};

// ==================== MAIN COMPONENTS ====================

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  change = "0%",
  loading = false,
  config,
  icon,
}) => {
  const borderColor = getBorderColor(config.bgColor, config.iconColor);

  if (loading) {
    return <AnalyticsCardSkeleton />;
  }

  return (
    <Card
      sx={{
        border: `1px solid ${borderColor}`,
        borderTop: `2px solid ${borderColor}`,
        borderLeft: `4px solid ${config.iconColor}40`,
        backgroundColor: config.bgColor,
        boxShadow: "none",
        transition: "all 0.2s ease-in-out",
        overflow: "hidden",
        position: "relative",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderColor: `${config.iconColor}60`,
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, ${config.iconColor}20, ${config.iconColor}00)`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <AnalyticsCardContent
          title={title}
          value={value}
          change={change}
          config={config}
          icon={icon}
        />
      </CardContent>
    </Card>
  );
};

// ==================== HELPER FUNCTIONS ====================

const getAnalyticsValue = (
  key: string,
  analytics?: UsersAnalyticsType
): number | undefined => {
  const apiField = FIELD_MAPPING[key];
  if (!apiField || !analytics) return undefined;
  return analytics[apiField] as number | undefined;
};

const getChangeValue = (
  key: string,
  analytics?: UsersAnalyticsType
): string => {
  const changeKey = CHANGE_FIELD_MAPPING[key];
  if (!changeKey || !analytics) return "0";

  const changeValue = analytics[changeKey];
  if (typeof changeValue === "string") {
    return changeValue;
  } else if (typeof changeValue === "number") {
    return changeValue.toString();
  }
  return "0";
};

const hasAnalyticsData = (analytics?: UsersAnalyticsType): boolean => {
  return (
    !!analytics &&
    (analytics.totalUsers !== undefined ||
      analytics.activeUsers !== undefined ||
      analytics.newUsers !== undefined ||
      analytics.premiumUsers !== undefined)
  );
};

// ==================== MAIN COMPONENT ====================

export const UserAnalytics: React.FC<UserAnalyticsProps> = ({
  refreshTrigger = 0,
}) => {
  const {
    data: analyticsResponse,
    isLoading,
    error,
    refetch,
  } = useGetUsersAnalyticsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  React.useEffect(() => {
    refetch();
  }, [refreshTrigger, refetch]);

  const analytics = analyticsResponse?.data;

  if (error) {
    return (
      <Box sx={{ mb: 4 }}>
        <ErrorAnalyticsCard onRetry={refetch} />
      </Box>
    );
  }

  if (!hasAnalyticsData(analytics) && !isLoading) {
    return (
      <Box sx={{ mb: 4 }}>
        <EmptyAnalyticsState />
      </Box>
    );
  }

  if (isLoading) {
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
          {ALL_CARDS.map((key) => (
            <AnalyticsCard
              key={key}
              title={ANALYTICS_CONFIGS[key].title}
              value=""
              change="0"
              loading={true}
              config={ANALYTICS_CONFIGS[key]}
              icon={ANALYTICS_ICONS[key]}
            />
          ))}
        </Box>
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
        {ALL_CARDS.map((key) => {
          const config = ANALYTICS_CONFIGS[key];
          const value = getAnalyticsValue(key, analytics);
          const changeValue = getChangeValue(key, analytics);

          return (
            <AnalyticsCard
              key={key}
              title={config.title}
              value={config.format(value)}
              change={changeValue}
              loading={false}
              config={config}
              icon={ANALYTICS_ICONS[key]}
            />
          );
        })}
      </Box>
    </Box>
  );
};
