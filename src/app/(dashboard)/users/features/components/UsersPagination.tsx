import React from 'react';
import {
  Box,
  Pagination,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  useTheme,
  useMediaQuery,
  IconButton,
  PaginationItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  KeyboardArrowLeft as PreviousIcon,
  KeyboardArrowRight as NextIcon,
} from '@mui/icons-material';
import { UsersPaginationProps } from '../types/pagination.types';

export const UsersPagination: React.FC<UsersPaginationProps> = ({
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Mobile detection

  const { page, limit, total, totalPages } = pagination;

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    onPageChange(newPage);
  };

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    const newSize = event.target.value;
    onPageSizeChange?.(newSize);
    onPageChange(1); // Reset to page 1 when page size changes
  };

  // Calculate display range for "Showing X-Y of Z users"
  const getDisplayRange = () => {
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);
    return { start, end };
  };

  const { start, end } = getDisplayRange();

  if (total === 0) return null; // Hide pagination if no users

  return (
    <Box sx={{ py: 3 }}>
      <Stack direction={isMobile ? 'column' : 'row'} spacing={isMobile ? 2 : 0}
        justifyContent="space-between" alignItems={isMobile ? 'stretch' : 'center'}>
        
        {/* Results count display */}
        <Box>
          <Typography variant="body2" color="text.secondary">
            Showing <Typography component="span" variant="body2" fontWeight="bold" color="text.primary">
              {start}-{end}
            </Typography> of{' '}
            <Typography component="span" variant="body2" fontWeight="bold" color="text.primary">
              {total.toLocaleString()}
            </Typography> users
          </Typography>
        </Box>

        <Stack direction={isMobile ? 'column' : 'row'} spacing={2}
          alignItems={isMobile ? 'stretch' : 'center'}>
          
          {/* Page size selector */}
          {onPageSizeChange && (
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Rows per page</InputLabel>
              <Select 
                value={limit} 
                label="Rows per page" 
                onChange={handlePageSizeChange}
              >
                {pageSizeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option} per page
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Pagination with custom mobile rendering */}
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? "small" : "medium"}
            showFirstButton
            showLastButton
            siblingCount={isMobile ? 0 : 1} // Fewer page buttons on mobile
            boundaryCount={isMobile ? 1 : 2}
            renderItem={(item) => {
              // Hide page numbers on mobile for cleaner UI
              if (isMobile && item.type === 'page') return null;
              
              // Custom previous/next buttons with icons
              if (item.type === 'previous' || item.type === 'next') {
                return (
                  <IconButton 
                    onClick={item.onClick} 
                    disabled={item.disabled}
                    sx={{ borderRadius: 1, '&.Mui-disabled': { opacity: 0.5 } }}
                  >
                    {item.type === 'previous' ? <PreviousIcon /> : <NextIcon />}
                  </IconButton>
                );
              }
              
              // Default page buttons
              return <PaginationItem {...item} component="button" />;
            }}
            sx={{
              '& .MuiPaginationItem-root': { fontWeight: 600, borderRadius: 2 },
              '& .MuiPaginationItem-page.Mui-selected': {
                backgroundColor: 'primary.main', 
                color: 'white',
                '&:hover': { backgroundColor: 'primary.dark' },
              },
            }}
          />
        </Stack>
      </Stack>

      {/* Mobile-only page indicator */}
      {isMobile && (
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Page {page} of {totalPages}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// Simplified version without custom icons
export const SimpleUsersPagination: React.FC<UsersPaginationProps> = ({
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { page, limit, total, totalPages } = pagination;

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    onPageChange(newPage);
  };

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    const newSize = event.target.value;
    onPageSizeChange?.(newSize);
    onPageChange(1);
  };

  const getDisplayRange = () => {
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);
    return { start, end };
  };

  const { start, end } = getDisplayRange();

  if (total === 0) return null;

  return (
    <Box sx={{ py: 3 }}>
      <Stack direction={isMobile ? 'column' : 'row'} spacing={isMobile ? 2 : 0}
        justifyContent="space-between" alignItems={isMobile ? 'stretch' : 'center'}>
        
        <Box>
          <Typography variant="body2" color="text.secondary">
            Showing <Typography component="span" fontWeight="bold" color="text.primary">
              {start}-{end}
            </Typography> of{' '}
            <Typography component="span" fontWeight="bold" color="text.primary">
              {total.toLocaleString()}
            </Typography> users
          </Typography>
        </Box>

        <Stack direction={isMobile ? 'column' : 'row'} spacing={2}
          alignItems={isMobile ? 'stretch' : 'center'}>
          
          {onPageSizeChange && (
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Rows per page</InputLabel>
              <Select 
                value={limit} 
                label="Rows per page" 
                onChange={handlePageSizeChange}
              >
                {pageSizeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option} per page
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Standard pagination without customizations */}
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? "small" : "medium"}
            showFirstButton
            showLastButton
            siblingCount={isMobile ? 0 : 1}
            boundaryCount={isMobile ? 1 : 2}
            sx={{
              '& .MuiPaginationItem-root': { fontWeight: 600, borderRadius: 2 },
              '& .MuiPaginationItem-page.Mui-selected': {
                backgroundColor: 'primary.main', 
                color: 'white',
                '&:hover': { backgroundColor: 'primary.dark' },
              },
            }}
          />
        </Stack>
      </Stack>

      {isMobile && (
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Page {page} of {totalPages}
          </Typography>
        </Box>
      )}
    </Box>
  );
};