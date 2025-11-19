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
import LoadingState from "../../../../../components/LoadingState";

type TrafficFilter = 'default' | 'byLocation' | 'bySport' | 'byPrediction';

interface TrafficProps {
  refreshTrigger?: number;
}

export default function Traffic({ refreshTrigger }: TrafficProps) {
  const [trafficFilter, setTrafficFilter] = useState<TrafficFilter>('default');
  
  const queryParams = trafficFilter !== 'default' ? { filter: trafficFilter } : undefined;
  
  const { data, isLoading, error, refetch } = useGetTrafficQuery(queryParams);
  
  const hasError = !!error;
  const isEmpty = !data?.data || data.data.length === 0;

  // Refetch when refreshTrigger changes
  React.useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  const handleFilterChange = (event: SelectChangeEvent<TrafficFilter>) => {
    setTrafficFilter(event.target.value as TrafficFilter);
  };

  const getFilterDisplayLabel = (filter: TrafficFilter): string => {
    const labels: Record<TrafficFilter, string> = {
      default: 'Default View',
      byLocation: 'By Location',
      bySport: 'By Sport',
      byPrediction: 'By Prediction'
    };
    return labels[filter];
  };

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
                data?.data.map((r, idx) => (
                  <TableRow 
                    key={r.name ?? idx}
                    sx={{ 
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <TableCell>{r.name}</TableCell>
                    <TableCell align="right">{r.percentage}</TableCell>
                    <TableCell align="right">{r.users}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {!hasError && !isEmpty && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {getFilterDisplayLabel(trafficFilter)} - Showing {data?.data.length || 0} items
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}