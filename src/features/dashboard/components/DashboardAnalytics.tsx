// src/features/dashboard/components/DashboardAnalytics.tsx
import React from "react";
import { Card, CardContent, Typography, Avatar, Stack, Box, Skeleton } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

type Props = {
  title?: string;
  value?: string | number;
  change?: string;
  loading?: boolean;
  bgColor?: string;
};

const DashboardAnalytics: React.FC<Props> = ({ title = "Metric", value = "-", change = "0%", loading = false, bgColor }) => {
  const isPositive = parseFloat(String(change).replace("%", "")) >= 0;

  if (loading) {
    return (
      <Card sx={{ height: "100%", boxShadow: "none" }}>
        <CardContent>
          <Skeleton width="60%" height={18} />
          <Skeleton width="40%" height={48} sx={{ mt: 1 }} />
          <Skeleton width="80%" height={18} sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "100%", backgroundColor: bgColor ?? "background.paper", "&:hover": { boxShadow: 2 } }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle2" sx={{ textTransform: "uppercase", fontWeight: 600, opacity: 0.85 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {value}
            </Typography>
          </Box>

          <Avatar sx={{ bgcolor: "transparent", color: "text.primary" }}>
            {/* You can plug in an icon here if desired */}
          </Avatar>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1} mt={2}>
          {isPositive ? (
            <ArrowUpward sx={{ color: "#16a34a" }} fontSize="small" />
          ) : (
            <ArrowDownward sx={{ color: "#dc2626" }} fontSize="small" />
          )}
          <Typography variant="body2" sx={{ color: isPositive ? "#16a34a" : "#dc2626", fontWeight: 600 }}>
            {change}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", ml: 1 }}>
            vs last month
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DashboardAnalytics;
