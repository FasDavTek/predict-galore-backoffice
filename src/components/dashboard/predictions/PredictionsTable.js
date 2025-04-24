// components/dashboard/predictions/PredictionsTable.js
import React, { useState } from 'react';
import {
  Box,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Typography,
  Pagination,
  Stack,
  Button,
  TextField,
  InputAdornment,
  Skeleton,
  Chip,
  Menu,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Download as DownloadIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  Add as AddIcon,
  SportsSoccer as FootballIcon,
  SportsBasketball as BasketballIcon,
  SportsTennis as TennisIcon
} from '@mui/icons-material';

import PredictionActions from './PredictionActions';

const PredictionsTable = ({
  predictions = [],
  loading = false,
  searchQuery = '',
  onSearchChange,
  sportFilter = 'all',
  statusFilter = 'all',
  onSportFilterChange = () => {},
  onStatusFilterChange = () => {},
  onExportCSV,
  exportLoading = false,
  onPredictionSelect,
  onNewPredictionClick,
  page = 1,
  setPage = () => {}
}) => {
  const PAGE_SIZE = 10;
  const pageCount = Math.ceil(predictions.length / PAGE_SIZE);
  const paginatedPredictions = predictions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleFilterMenuOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSelectAllRows = (event) => {
    if (event.target.checked) {
      const newSelected = paginatedPredictions.map((prediction) => prediction.id);
      setSelectedRows(newSelected);
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (event, id) => {
    if (event.target.checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const getStatusChipStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'won':
        return {
          bgcolor: '#ECFDF3',
          color: '#027A48'
        };
      case 'lost':
        return {
          bgcolor: '#FEF3F2',
          color: '#B42318'
        };
      case 'pending':
        return {
          bgcolor: '#FFFAEB',
          color: '#B54708'
        };
      default:
        return {};
    }
  };

  const getLeagueIcon = (league) => {
    // This is a simplified example - you would replace with actual league icons
    if (league.includes('Premier League') || league.includes('LaLiga') || league.includes('Serie A')) {
      return <FootballIcon sx={{ width: 24, height: 24 }} />;
    } else if (league.includes('NBA') || league.includes('EuroLeague')) {
      return <BasketballIcon sx={{ width: 24, height: 24 }} />;
    } else {
      return <TennisIcon sx={{ width: 24, height: 24 }} />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const renderLoadingSkeletons = () => {
    return Array(PAGE_SIZE).fill(0).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell><Skeleton variant="rectangular" width={20} height={20} /></TableCell>
        <TableCell><Skeleton variant="text" /></TableCell>
        <TableCell><Skeleton variant="text" /></TableCell>
        <TableCell><Skeleton variant="text" /></TableCell>
        <TableCell><Skeleton variant="text" /></TableCell>
        <TableCell><Skeleton variant="text" /></TableCell>
        <TableCell><Skeleton variant="text" /></TableCell>
      </TableRow>
    ));
  };

  const renderEmptyState = () => (
    <TableRow>
      <TableCell colSpan={7} sx={{ border: 'none' }}>
        <Box sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <Typography variant="h6" sx={{ color: '#101012', mb: 1 }}>
            {loading ? 'Loading predictions...' : 'No Predictions Found'}
          </Typography>
          <Typography sx={{ color: '#8B8D97' }}>
            {loading ? 'Please wait while we load prediction data' : 'Predictions will appear here once created.'}
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );

  return (
    <Box>
      {/* Table toolbar with search and actions */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search predictions..."
            variant="outlined"
            size="small"
            sx={{ width: 300 }}
            value={searchQuery}
            onChange={onSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleFilterMenuOpen}
          >
            Filter
          </Button>
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterMenuClose}
          >
            <MenuItem>
              <FormControl fullWidth size="small">
                <InputLabel>Sport</InputLabel>
                <Select
                  value={sportFilter}
                  label="Sport"
                  onChange={(e) => {
                    onSportFilterChange(e.target.value);
                    handleFilterMenuClose();
                  }}
                >
                  <MenuItem value="all">All Sports</MenuItem>
                  <MenuItem value="football">Football</MenuItem>
                  <MenuItem value="basketball">Basketball</MenuItem>
                  <MenuItem value="tennis">Tennis</MenuItem>
                </Select>
              </FormControl>
            </MenuItem>
            <MenuItem>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => {
                    onStatusFilterChange(e.target.value);
                    handleFilterMenuClose();
                  }}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="won">Won</MenuItem>
                  <MenuItem value="lost">Lost</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </MenuItem>
          </Menu>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onNewPredictionClick}
            sx={{ 
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            New Prediction
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={onExportCSV}
            disabled={exportLoading || predictions.length === 0}
          >
            {exportLoading ? 'Exporting...' : 'Export CSV'}
          </Button>
        </Box>
      </Box>

      {/* Main table content */}
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedRows.length > 0 && selectedRows.length < paginatedPredictions.length
                  }
                  checked={paginatedPredictions.length > 0 && selectedRows.length === paginatedPredictions.length}
                  onChange={handleSelectAllRows}
                  disabled={predictions.length === 0}
                />
              </TableCell>
              <TableCell>Match</TableCell>
              <TableCell>League</TableCell>
              <TableCell>Prediction</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? renderLoadingSkeletons() : 
             predictions.length > 0 ? paginatedPredictions.map((prediction) => (
                <TableRow 
                  key={prediction.id} 
                  hover 
                  sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRows.includes(prediction.id)}
                      onChange={(event) => handleSelectRow(event, prediction.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={500}>
                      {prediction.match}
                    </Typography>
                    {prediction.score && (
                      <Typography variant="body2">
                        <strong>{prediction.score.home}</strong> - <strong>{prediction.score.away}</strong>
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24 }}>
                        {getLeagueIcon(prediction.league)}
                      </Avatar>
                      <Typography>{prediction.league}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize={14}>
                      {prediction.prediction}
                      {prediction.predictedScore && (
                        <span> ({prediction.predictedScore.home}-{prediction.predictedScore.away})</span>
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={prediction.status} 
                      size="small"
                      sx={getStatusChipStyles(prediction.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography>{formatDate(prediction.date)}</Typography>
                    <Typography variant="body2">{formatTime(prediction.date)}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <PredictionActions 
                      prediction={prediction} 
                      onViewDetails={() => onPredictionSelect(prediction)}
                    />
                  </TableCell>
                </TableRow>
              )) : renderEmptyState()}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination controls */}
      {predictions.length > 0 && (
        <Box sx={{ 
          mt: 3, 
          p: 2, 
          bgcolor: 'background.paper', 
          borderRadius: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Typography variant="body2" color="text.secondary">
            Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, predictions.length)} of {predictions.length} predictions
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="outlined"
              startIcon={<NavigateBeforeIcon />}
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Previous
            </Button>
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, newPage) => setPage(newPage)}
              color="primary"
              shape="rounded"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            />
            <Button
              variant="outlined"
              endIcon={<NavigateNextIcon />}
              disabled={page === pageCount}
              onClick={() => setPage(p => p + 1)}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Next
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default PredictionsTable;