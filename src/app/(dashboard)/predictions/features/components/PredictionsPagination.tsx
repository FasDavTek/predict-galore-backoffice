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
  SelectChangeEvent,
} from '@mui/material';
import { PredictionsPagination as PaginationMeta } from '../types/prediction.types';

interface PredictionsPaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export const PredictionsPagination: React.FC<PredictionsPaginationProps> = ({
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
            Showing <Typography component="span" variant="body2" fontWeight="bold" color="text.primary">
              {start}-{end}
            </Typography> of{' '}
            <Typography component="span" variant="body2" fontWeight="bold" color="text.primary">
              {total.toLocaleString()}
            </Typography> predictions
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
                  <MenuItem key={option} value={option}>{option} per page</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

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
                backgroundColor: 'primary.main', color: 'white',
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