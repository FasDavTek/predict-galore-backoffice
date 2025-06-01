import React, { useState } from "react";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Pagination,
  Button,
  TextField,
  Skeleton,
  Chip,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  SportsSoccer as FootballIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import PredictionActions from "./PredictionActions";
import { useCallback } from "react";
import Image from "next/image";

const PredictionsTable = ({
  predictions = [],
  loading = false,
  pagination = {},
  filters = {},
  onFilterChange = () => {},
  onPageChange = () => {},
  onPredictionSelect = () => {},
  onNewPredictionClick = () => {},
  teams = [],
}) => {
  const [exportLoading, setExportLoading] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    status: null,
    team: null,
  });

  // Handle search input changes
  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  // Handle status filter changes
  const handleStatusFilterChange = (status) => {
    const newFilters = { ...filters, status: status === 'all' ? null : status };
    onFilterChange(newFilters);
    setActiveFilters(prev => ({ ...prev, status }));
    handleFilterMenuClose();
  };

  // Handle team filter changes
  const handleTeamFilterChange = (teamId) => {
    const newFilters = { ...filters, teamId: teamId === 'all' ? null : teamId };
    onFilterChange(newFilters);
    setActiveFilters(prev => ({ ...prev, team: teamId }));
    handleFilterMenuClose();
  };

  // Clear all filters
  const handleClearFilters = () => {
    onFilterChange({ ...filters, status: null, teamId: null });
    setActiveFilters({ status: null, team: null });
    handleFilterMenuClose();
  };

  // Filter menu handlers
  const handleFilterMenuOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
  };

  // Export to CSV functionality
  const handleExportCSV = useCallback(() => {
    setExportLoading(true);
    
    // Prepare CSV content
    const headers = ['Match', 'League', 'Prediction', 'Status', 'Team'];
    const csvRows = predictions.map(prediction => [
      `"${prediction.title}"`,
      `"${teams.find(t => t.id === prediction.teamId)?.name || 'N/A'}"`,
      `"${prediction.description}"`,
      `"${prediction.status}"`,
      `"${teams.find(t => t.id === prediction.teamId)?.name || 'N/A'}"`
    ].join(','));

    // Create CSV string
    const csvContent = [
      headers.join(','),
      ...csvRows
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `predictions_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setExportLoading(false);
  }, [predictions, teams]);

  // Render loading skeleton placeholders
  const renderLoadingSkeletons = () => {
    return Array(pagination.limit)
      .fill(0)
      .map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell><Skeleton variant="text" /></TableCell>
          <TableCell><Skeleton variant="text" /></TableCell>
          <TableCell><Skeleton variant="text" /></TableCell>
          <TableCell><Skeleton variant="text" /></TableCell>
          <TableCell><Skeleton variant="text" /></TableCell>
        </TableRow>
      ));
  };

  // Render empty state message
  const renderEmptyState = () => (
    <TableRow>
    <TableCell colSpan={5}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py={8}
      >
        {loading ? (
          <>
            <CircularProgress size={40} />
            <Typography variant="body1" mt={2}>
              Loading predictions...
            </Typography>
          </>
        ) : (
          <>
            <Image src='/empty.png' alt="No Predictions" width={80} height={80} />
            <Typography variant="h6" fontWeight="medium" mt={3}>
              No Predictions Created Yet
            </Typography>
            <Typography variant="body2" color="textSecondary" mt={1}>
              Start making expert predictions to keep users engaged
            </Typography>
          </>
        )}
      </Box>
    </TableCell>
  </TableRow>
  );

  return (
    <Box>
      {/* Search and action toolbar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
         <Box sx={{ display: "flex", gap: 2 }}>

        <TextField
          placeholder="Search predictions..."
          size="small"
          value={filters.search || ''}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />

        {/* filter button */}
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={handleFilterMenuOpen}
          >
            Filters
            {activeFilters.status || activeFilters.team ? (
              <Chip
                label="Active"
                size="small"
                color="primary"
                sx={{ ml: 1 }}
              />
            ) : null}
          </Button>
          </Box>
        
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={onNewPredictionClick}
          >
            New Prediction
          </Button>

        

          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportCSV}
            disabled={exportLoading || predictions.length === 0}
          >
            {exportLoading ? "Exporting..." : "Export CSV"}
          </Button>
        </Box>

        {/* Filter menu */}
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterMenuClose}
        >
          <MenuItem dense>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={activeFilters.status || 'all'}
                label="Status"
                onChange={(e) => handleStatusFilterChange(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="won">Won</MenuItem>
                <MenuItem value="lost">Lost</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </MenuItem>
          
          <MenuItem dense>
            <FormControl fullWidth size="small">
              <InputLabel>Team</InputLabel>
              <Select
                value={activeFilters.team || 'all'}
                label="Team"
                onChange={(e) => handleTeamFilterChange(e.target.value)}
              >
                <MenuItem value="all">All Teams</MenuItem>
                {teams.map(team => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </MenuItem>
          
          {(activeFilters.status || activeFilters.team) && (
            <MenuItem onClick={handleClearFilters}>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
                <CloseIcon fontSize="small" sx={{ mr: 1 }} />
                Clear Filters
              </Box>
            </MenuItem>
          )}
        </Menu>
      </Box>

      {/* Main predictions table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Match</TableCell>
              <TableCell>League</TableCell>
              <TableCell>Prediction</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Conditional rendering based on loading state */}
            {loading ? renderLoadingSkeletons() : 
             predictions.length === 0 ? renderEmptyState() :
             predictions.map((prediction) => (
              <TableRow key={prediction.id} hover>
                <TableCell>
                  <Typography fontWeight={500}>
                    {prediction.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FootballIcon fontSize="small" />
                    <Typography>
                      {teams.find(t => t.id === prediction.teamId)?.name || 'N/A'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography>{prediction.description}</Typography>
                </TableCell>
                <TableCell>
                  {/* Status chip with color coding */}
                  <Chip 
                    label={prediction.status} 
                    color={
                      prediction.status === 'won' ? 'success' : 
                      prediction.status === 'lost' ? 'error' : 'warning'
                    }
                  />
                </TableCell>
                <TableCell>
                  <PredictionActions
                    prediction={prediction}
                    onViewDetails={() => onPredictionSelect(prediction.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination controls */}
      {pagination.total > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={Math.ceil(pagination.total / pagination.limit)}
            page={pagination.page}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default PredictionsTable;