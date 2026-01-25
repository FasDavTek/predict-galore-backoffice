/**
 * Traffic Component
 * Clean, simple implementation
 */

'use client';

import { useState, memo, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import { designTokens } from '@/shared/styles/tokens';
import { useDashboardTraffic } from '@/features/dashboard';
import {
  TableLoadingState,
  TableErrorState,
  TableEmptyState,
} from '@/shared/components/TableStates';

interface TrafficProps {
  refreshKey?: number;
}

type TrafficDimension = 0 | 1 | 2;

const Traffic = memo(function Traffic({ 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  refreshKey: _refreshKey 
}: TrafficProps) {
  const [dimension, setDimension] = useState<TrafficDimension>(0);
  const { data: trafficItems, isLoading, error } = useDashboardTraffic();
  
  const handleDimensionChange = useCallback((event: SelectChangeEvent<TrafficDimension>) => {
    setDimension(event.target.value as TrafficDimension);
  }, []);

  // Handle real API structure: trafficItems contains { dimension, items }
  const items = trafficItems?.items || [];

  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: designTokens.spacing.itemGap }}>
          <Typography variant="h6">Traffic Analytics</Typography>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>View</InputLabel>
            <Select
              value={dimension}
              label="View"
              onChange={handleDimensionChange}
            >
              <MenuItem value={0}>Daily Stats</MenuItem>
              <MenuItem value={1}>Weekly Trends</MenuItem>
              <MenuItem value={2}>Monthly Overview</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="right">Unique Visitors</TableCell>
                <TableCell align="right">Page Views</TableCell>
                <TableCell align="right">Total Sessions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
                    <TableLoadingState message="Loading traffic data..." />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableErrorState colSpan={4} message="Failed to load traffic data. Please try again." onRetry={() => {}} />
              ) : !items || items.length === 0 ? (
                <TableEmptyState colSpan={4} message="No traffic data available" title="No Traffic Data" />
              ) : (
                items.map((item, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{item.date}</TableCell>
                    <TableCell align="right">{item.visitors}</TableCell>
                    <TableCell align="right">{item.pageViews}</TableCell>
                    <TableCell align="right">{item.sessions}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
});

Traffic.displayName = 'Traffic';

export default Traffic;
