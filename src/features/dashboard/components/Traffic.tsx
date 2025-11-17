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
  SelectChangeEvent
} from "@mui/material";
import { useGetTrafficQuery } from "../api/dashboardApi";
import EmptyState from "../../../components/EmptyState";
import ErrorState from "../../../components/ErrorState";
import LoadingState from "../../../components/LoadingState";

// Define available filter options
type TrafficFilter = 'default' | 'byLocation' | 'bySport' | 'byPrediction';

export default function Traffic() {
  // Filter state managed directly in component - default means no filter
  const [trafficFilter, setTrafficFilter] = useState<TrafficFilter>('default');
  
  // Only pass filter to API if it's not 'default'
  const queryParams = trafficFilter !== 'default' ? { filter: trafficFilter } : undefined;
  
  const { data, isLoading, error, refetch } = useGetTrafficQuery(queryParams);
  const rows = data?.data ?? [];

  // Handle filter change
  const handleFilterChange = (event: SelectChangeEvent<TrafficFilter>) => {
    setTrafficFilter(event.target.value as TrafficFilter);
  };

  // Handle error state
  if (error) {
    return (
       <Box sx={{ mb: 3 }}>
          <ErrorState
            variant="api"
            title="Failed to Load Traffic Data"
            message="We couldn't load the traffic overview. This might be due to a temporary server issue."
            retryAction={{ 
              label: "Retry Traffic Data", 
              onClick: refetch 
            }}
            height={300}
          />
   </Box>
    );
  }

  // Handle loading state
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
                value={trafficFilter}
                label="View By"
                onChange={handleFilterChange}
              >
                <MenuItem value="default">Default View</MenuItem>
                <MenuItem value="byLocation">By Location</MenuItem>
                <MenuItem value="bySport">By Sport</MenuItem>
                <MenuItem value="byPrediction">By Prediction</MenuItem>
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

  // Handle empty state
  if (rows.length === 0) {
    return (
     <Box sx={{ mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={600}>
              Traffic Overview
            </Typography>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>View By</InputLabel>
              <Select
                value={trafficFilter}
                label="View By"
                onChange={handleFilterChange}
              >
                <MenuItem value="default">Default View</MenuItem>
                <MenuItem value="byLocation">By Location</MenuItem>
                <MenuItem value="bySport">By Sport</MenuItem>
                <MenuItem value="byPrediction">By Prediction</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <EmptyState
            variant="data"
            title="No Traffic Data"
            description="There's no traffic data available for the selected view. Data will appear once users start visiting your platform."
            primaryAction={{
              label: "Try Different View",
              onClick: () => setTrafficFilter('byLocation'),
            }}
            secondaryAction={{
              label: "Refresh Data",
              onClick: refetch,
            }}
            height={250}
          />
    </Box>
    );
  }

  // Get display label for current filter
  const getFilterDisplayLabel = (filter: TrafficFilter): string => {
    const labels: Record<TrafficFilter, string> = {
      default: 'Default View',
      byLocation: 'By Location',
      bySport: 'By Sport',
      byPrediction: 'By Prediction'
    };
    return labels[filter];
  };

  // Get table headers based on current filter
  const getTableHeaders = () => {
    switch (trafficFilter) {
      case 'bySport':
        return (
          <TableRow>
            <TableCell>Sport</TableCell>
            <TableCell align="right">Percentage</TableCell>
            <TableCell align="right">No. of users</TableCell>
          </TableRow>
        );
      case 'byPrediction':
        return (
          <TableRow>
            <TableCell>Prediction Type</TableCell>
            <TableCell align="right">Percentage</TableCell>
            <TableCell align="right">No. of users</TableCell>
          </TableRow>
        );
      case 'default':
      case 'byLocation':
      default:
        return (
          <TableRow>
            <TableCell>Country</TableCell>
            <TableCell align="right">Percentage</TableCell>
            <TableCell align="right">No. of users</TableCell>
          </TableRow>
        );
    }
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={600}>
            Traffic Overview
          </Typography>

          {/* Filter directly in component */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>View By</InputLabel>
            <Select
              value={trafficFilter}
              label="View By"
              onChange={handleFilterChange}
            >
              <MenuItem value="default">Default View</MenuItem>
              <MenuItem value="byLocation">By Location</MenuItem>
              <MenuItem value="bySport">By Sport</MenuItem>
              <MenuItem value="byPrediction">By Prediction</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{ boxShadow: "none" }}>
          <Table size="small">
            <TableHead>
              {getTableHeaders()}
            </TableHead>

            <TableBody>
              {rows.map((r, idx) => (
                <TableRow key={r.name ?? idx}>
                  <TableCell>{r.name}</TableCell>
                  <TableCell align="right">{r.percentage}</TableCell>
                  <TableCell align="right">{r.users}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Show current filter info */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {getFilterDisplayLabel(trafficFilter)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}