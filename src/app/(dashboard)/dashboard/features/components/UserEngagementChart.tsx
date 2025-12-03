import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";
import { useGetEngagementQuery } from "../api/dashboardApi";
import LoadingState from "../../../../../shared/components/LoadingState";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Define TimeRange type
export type TimeRange =
  | "default"
  | "today"
  | "thisWeek"
  | "thisMonth"
  | "lastMonth"
  | "thisYear";

interface UserEngagementChartProps {
  refreshTrigger?: number;
  globalTimeRange?: TimeRange;
}

// Define data types
interface MonthlyDataPoint {
  month: string; // e.g., "Jan 2024"
  monthYear: string; // e.g., "2024-01" for sorting
  freeUsers: number;
  premiumUsers: number;
  allUsers: number;
}

interface ApiResponseSegment {
  segment: number;
  points: Array<{
    date?: string;
    createdAt?: string;
    activeUsers?: number;
  }>;
}

interface ApiResponse {
  data?: ApiResponseSegment[];
  engagement?: ApiResponseSegment[];
}

interface Totals {
  all: number;
  free: number;
  premium: number;
  dataPoints: number;
}

interface TooltipEntry {
  color: string;
  name: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

// Format to show month and year
const formatMonthYear = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

// Get month-year key for grouping (e.g., "2024-01")
const getMonthYearKey = (dateStr: string) => {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

// ========== REUSABLE COMPONENTS ==========

const EmptyChartState: React.FC = () => (
  <Box
    sx={{
      height: 400,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    }}
  >
    <WarningIcon sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
    <Typography variant="h6" color="text.secondary" gutterBottom>
      No Engagement Data Available
    </Typography>
    <Typography variant="body2" color="text.secondary">
      User engagement data will appear here once users start making predictions
    </Typography>
  </Box>
);

const ErrorChartState: React.FC = () => (
  <Box
    sx={{
      height: 400,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      backgroundColor: "#FEF2F2",
    }}
  >
    <WarningIcon sx={{ fontSize: 48, color: "error.main", mb: 2 }} />
    <Typography variant="h6" color="error.main" gutterBottom>
      Unable to Load Engagement Data
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Please try refreshing the page or check your connection
    </Typography>
  </Box>
);

// Custom Tooltip Component with proper typing
const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: "#111",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 1,
          p: 1.5,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ color: "#fff", mb: 1, fontWeight: 600 }}
        >
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Box
            key={`item-${index}`}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "#fff",
              mb: 0.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: entry.color,
                }}
              />
              <Typography variant="body2" sx={{ opacity: 0.95 }}>
                {entry.name}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 700, ml: 2 }}>
              {entry.value.toLocaleString()}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }
  return null;
};

// Statistics Summary Component
const StatisticsSummary: React.FC<{ totals: Totals }> = ({ totals }) => (
  <Box
    sx={{
      mt: 3,
      p: 2,
      backgroundColor: "grey.50",
      borderRadius: 1,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 2,
    }}
  >
    <Box textAlign="center">
      <Typography variant="h6" color="primary.main" fontWeight={600}>
        {totals.all.toLocaleString()}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Total Active Users
      </Typography>
    </Box>

    <Box textAlign="center">
      <Typography variant="h6" color="success.main" fontWeight={600}>
        {totals.free.toLocaleString()}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Free Users (sum)
      </Typography>
    </Box>

    <Box textAlign="center">
      <Typography variant="h6" color="error.main" fontWeight={600}>
        {totals.premium.toLocaleString()}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Premium Users (sum)
      </Typography>
    </Box>
  </Box>
);

// Chart Header Component with Select for filter
const ChartHeader: React.FC<{
  localTimeRange: TimeRange;
  filter: "all" | "free" | "premium";
  onRangeChange: (event: SelectChangeEvent<TimeRange>) => void;
  onFilterChange: (
    event: SelectChangeEvent<"all" | "free" | "premium">
  ) => void;
}> = ({ filter, onFilterChange }) => (
  <Box
    display="flex"
    justifyContent="space-between"
    alignItems="flex-start"
    mb={2}
  >
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        User Engagement
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Track user activity over time
      </Typography>
    </Box>

    <Box display="flex" gap={2} alignItems="center">
      {/* user filter */}
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Users</InputLabel>
        <Select value={filter} label="Users" onChange={onFilterChange}>
          <MenuItem value="all">All Users</MenuItem>
          <MenuItem value="free">Free Users</MenuItem>
          <MenuItem value="premium">Premium Users</MenuItem>
        </Select>
      </FormControl>
    </Box>
  </Box>
);

// Loading State Component
const LoadingChart: React.FC<{
  localTimeRange: TimeRange;
  onRangeChange: (event: SelectChangeEvent<TimeRange>) => void;
}> = ({ }) => (
  <Card sx={{ mb: 3, boxShadow: 2 }}>
    <CardContent>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight={600}>
          User Engagement
        </Typography>
      </Box>

      <LoadingState
        variant="text"
        message="Loading engagement analytics..."
        height={400}
      />
    </CardContent>
  </Card>
);

// ========== MAIN COMPONENT ==========

export default function UserEngagementChart({
  refreshTrigger,
  globalTimeRange = "default",
}: UserEngagementChartProps) {
  const [localTimeRange, setLocalTimeRange] =
    useState<TimeRange>(globalTimeRange);
  const [filter, setFilter] = useState<"all" | "free" | "premium">("all");

  useEffect(() => {
    setLocalTimeRange(globalTimeRange);
  }, [globalTimeRange]);

  // Query
  const { data, isLoading, error, refetch } = useGetEngagementQuery(undefined);

  useEffect(() => {
    refetch();
  }, [refreshTrigger, localTimeRange, refetch]);

  // Process data for Recharts - GROUPED BY MONTH
  const { chartData, totals } = useMemo(() => {
    if (!data)
      return {
        chartData: [],
        totals: { all: 0, free: 0, premium: 0, dataPoints: 0 },
      };

    // Type guard to check if data has the expected structure
    const isApiResponse = (obj: unknown): obj is ApiResponse => {
      return (
        typeof obj === "object" &&
        obj !== null &&
        ("data" in obj || "engagement" in obj)
      );
    };

    // Safely cast data
    const apiData = isApiResponse(data) ? data : null;
    if (!apiData)
      return {
        chartData: [],
        totals: { all: 0, free: 0, premium: 0, dataPoints: 0 },
      };

    // Determine the payload source
    const payload = Array.isArray(apiData.data)
      ? apiData.data
      : Array.isArray(apiData.engagement)
      ? apiData.engagement
      : [];

    if (!Array.isArray(payload))
      return {
        chartData: [],
        totals: { all: 0, free: 0, premium: 0, dataPoints: 0 },
      };

    // Process segments
    const segmentAll = payload.find((s) => s.segment === 0);
    const segmentFree = payload.find((s) => s.segment === 1);
    const segmentPremium = payload.find((s) => s.segment === 2);

    // Create a map to aggregate data by month
    const monthlyDataMap = new Map<string, {
      freeUsers: number;
      premiumUsers: number;
      allUsers: number;
    }>();

    // Helper function to add data to the monthly aggregation
    const addToMonthlyData = (
      segment: ApiResponseSegment | undefined,
      isFree: boolean = false,
      isPremium: boolean = false
    ) => {
      if (!segment?.points) return;

      segment.points.forEach((point: { date?: string; createdAt?: string; activeUsers?: number }) => {
        const date = point.date || point.createdAt;
        if (!date) return;

        const monthKey = getMonthYearKey(date);
        const users = point.activeUsers || 0;

        const existing = monthlyDataMap.get(monthKey) || {
          freeUsers: 0,
          premiumUsers: 0,
          allUsers: 0,
        };

        if (isFree) {
          existing.freeUsers += users;
        } else if (isPremium) {
          existing.premiumUsers += users;
        } else {
          existing.allUsers += users;
        }

        monthlyDataMap.set(monthKey, existing);
      });
    };

    // Add data from each segment
    addToMonthlyData(segmentFree, true, false);
    addToMonthlyData(segmentPremium, false, true);
    
    // For the "all" segment, we might get aggregated data or need to calculate it
    if (segmentAll) {
      addToMonthlyData(segmentAll, false, false);
    } else {
      // If no "all" segment, calculate from free + premium
      Array.from(monthlyDataMap.keys()).forEach(monthKey => {
        const data = monthlyDataMap.get(monthKey)!;
        data.allUsers = data.freeUsers + data.premiumUsers;
        monthlyDataMap.set(monthKey, data);
      });
    }

    // Convert map to array and sort by month
    const processedData: MonthlyDataPoint[] = Array.from(monthlyDataMap.entries())
      .map(([monthYear, data]) => {
        // Get first date of the month for formatting
        const [year, month] = monthYear.split('-');
        const firstDateOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1);
        
        return {
          month: formatMonthYear(firstDateOfMonth.toISOString()),
          monthYear,
          freeUsers: data.freeUsers,
          premiumUsers: data.premiumUsers,
          allUsers: data.allUsers,
        };
      })
      .sort((a, b) => a.monthYear.localeCompare(b.monthYear)); // Sort chronologically

    // Calculate totals
    const totals: Totals = {
      all: processedData.reduce((sum, item) => sum + item.allUsers, 0),
      free: processedData.reduce((sum, item) => sum + item.freeUsers, 0),
      premium: processedData.reduce((sum, item) => sum + item.premiumUsers, 0),
      dataPoints: processedData.length,
    };

    return { chartData: processedData, totals };
  }, [data]);

  // Filter data for display
  const displayData = useMemo(() => {
    if (filter === "all") {
      return chartData.map((item) => ({
        month: item.month,
        "Free Users": item.freeUsers,
        "Premium Users": item.premiumUsers,
      }));
    } else if (filter === "free") {
      return chartData.map((item) => ({
        month: item.month,
        "Free Users": item.freeUsers,
      }));
    } else {
      return chartData.map((item) => ({
        month: item.month,
        "Premium Users": item.premiumUsers,
      }));
    }
  }, [chartData, filter]);

  const handleRangeChange = (event: SelectChangeEvent<TimeRange>) => {
    setLocalTimeRange(event.target.value as TimeRange);
  };

  const handleFilterChange = (
    event: SelectChangeEvent<"all" | "free" | "premium">
  ) => {
    setFilter(event.target.value as "all" | "free" | "premium");
  };

  // Check if we have data
  const hasData =
    chartData.length > 0 &&
    chartData.some(
      (item) => item.allUsers > 0 || item.freeUsers > 0 || item.premiumUsers > 0
    );

  if (isLoading) {
    return (
      <LoadingChart
        localTimeRange={localTimeRange}
        onRangeChange={handleRangeChange}
      />
    );
  }

  return (
    <Card sx={{ mb: 3, boxShadow: 2 }}>
      <CardContent>
        <ChartHeader
          localTimeRange={localTimeRange}
          filter={filter}
          onRangeChange={handleRangeChange}
          onFilterChange={handleFilterChange}
        />

        <Box sx={{ height: 420 }}>
          {error ? (
            <ErrorChartState />
          ) : !hasData ? (
            <EmptyChartState />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={displayData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="month"
                  axisLine={{ stroke: "#e6e6e6" }}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  tickFormatter={(value) => {
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                    return value.toString();
                  }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 20 }}
                  iconType="circle"
                  iconSize={10}
                />

                {/* Show Free Users bar when filter is 'all' or 'free' */}
                {(filter === "all" || filter === "free") && (
                  <Bar
                    dataKey="Free Users"
                    fill="#2FA904"
                    barSize={filter === "all" ? 30 : 40}
                  />
                )}

                {/* Show Premium Users bar when filter is 'all' or 'premium' */}
                {(filter === "all" || filter === "premium") && (
                  <Bar
                    dataKey="Premium Users"
                    fill="#E21E1E"
                    barSize={filter === "all" ? 30 : 40}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          )}
        </Box>

        {/* Summary statistics */}
        {!error && hasData && <StatisticsSummary totals={totals} />}
      </CardContent>
    </Card>
  );
}