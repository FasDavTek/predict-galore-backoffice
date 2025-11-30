import React, { useState } from "react";
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Select, 
  MenuItem, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  TableContainer, 
  Paper,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { 
  Warning as WarningIcon,
} from "@mui/icons-material";
import { useGetTrafficQuery } from "../api/dashboardApi";
import LoadingState from "../../../../../shared/components/LoadingState";

// Use the actual dimension values from the API (0, 1, 2)
type TrafficDimension = 0 | 1 | 2;

interface TrafficProps {
  refreshTrigger?: number;
}

// Types for the actual API response structure
interface TrafficApiItem {
  name: string;
  percentage: string;
  users: string;
  countryCode?: string;
}

interface TrafficApiResponse {
  dimension: number;
  items: TrafficApiItem[];
}


export default function Traffic({ refreshTrigger }: TrafficProps) {
  const [trafficDimension, setTrafficDimension] = useState<TrafficDimension>(0); // Default to Source (0)
  
  // Convert dimension to API parameter
  const queryParams = { dimension: trafficDimension, top: 10 };
  
  const { data, isLoading, error, refetch } = useGetTrafficQuery(queryParams);
  
  // Type assertion to handle the actual API response structure
  const trafficData = data?.data as unknown as TrafficApiResponse;
  
  const hasError = !!error;
  const isEmpty = !trafficData?.items || trafficData.items.length === 0;

  // Refetch when refreshTrigger changes
  React.useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  const handleDimensionChange = (event: SelectChangeEvent<TrafficDimension>) => {
    setTrafficDimension(Number(event.target.value) as TrafficDimension);
  };

  const getDimensionDisplayLabel = (dimension: TrafficDimension): string => {
    const labels: Record<TrafficDimension, string> = {
      0: 'By Source',
      1: 'By Medium', 
      2: 'By Campaign'
    };
    return labels[dimension];
  };

  const getTableHeaders = () => {
    switch (trafficDimension) {
      case 1: // Medium
        return (
          <TableRow>
            <TableCell>Medium</TableCell>
            <TableCell align="right">Percentage</TableCell>
            <TableCell align="right">No. of users</TableCell>
          </TableRow>
        );
      case 2: // Campaign
        return (
          <TableRow>
            <TableCell>Campaign</TableCell>
            <TableCell align="right">Percentage</TableCell>
            <TableCell align="right">No. of users</TableCell>
          </TableRow>
        );
      case 0: // Source
      default:
        return (
          <TableRow>
            <TableCell>Source</TableCell>
            <TableCell align="right">Percentage</TableCell>
            <TableCell align="right">No. of users</TableCell>
          </TableRow>
        );
    }
  };

  const getRowDisplayName = (item: TrafficApiItem, ): string => {
    // If there's a specific name for the dimension, use it
    // Otherwise fall back to the name field
    return item.name || 'Unknown';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={600}>
              Traffic Overview
            </Typography>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>View By</InputLabel>
              <Select
                value={trafficDimension}
                label="View By"
                onChange={handleDimensionChange}
              >
                <MenuItem value={0}>By Source</MenuItem>
                <MenuItem value={1}>By Medium</MenuItem>
                <MenuItem value={2}>By Campaign</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <LoadingState
            variant="text"
            message="Loading traffic data..."
            height={250}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={600}>
            Traffic Overview
          </Typography>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>View By</InputLabel>
            <Select
              value={trafficDimension}
              label="View By"
              onChange={handleDimensionChange}
            >
              <MenuItem value={0}>By Source</MenuItem>
              <MenuItem value={1}>By Medium</MenuItem>
              <MenuItem value={2}>By Campaign</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{ boxShadow: "none" }}>
          <Table size="small">
            <TableHead>
              {getTableHeaders()}
            </TableHead>

            <TableBody>
              {hasError ? (
                <TableRow sx={{
                  backgroundColor: '#FEF2F2',
                }}>
                  <TableCell colSpan={3} sx={{ textAlign: 'center', py: 6 }}>
                    <WarningIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
                    <Typography variant="h6" color="error.main" gutterBottom>
                      Unable to Load Traffic Data
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {error?.toString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : isEmpty ? (
                <TableRow>
                  <TableCell colSpan={3} sx={{ textAlign: 'center', py: 6 }}>
                    <WarningIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No Traffic Data
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Traffic data will appear here once available
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                trafficData?.items.map((item: TrafficApiItem, index: number) => (
                  <TableRow 
                    key={item.name || index}
                    sx={{ 
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <TableCell>{getRowDisplayName(item,)}</TableCell>
                    <TableCell align="right">{item.percentage}</TableCell>
                    <TableCell align="right">{item.users}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {!hasError && !isEmpty && trafficData && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {getDimensionDisplayLabel(trafficDimension)} - Showing {trafficData.items.length} items
              {trafficData.dimension !== undefined && ` (Dimension: ${trafficData.dimension})`}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}