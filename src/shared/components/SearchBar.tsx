import React, { useState, useCallback, memo, useEffect } from 'react';
import { IconButton, InputBase, Tooltip, Typography, Paper } from '@mui/material';
import Stack from '@mui/material/Stack';
import { designTokens } from '../styles/tokens';
import {
  Search as SearchIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { FiMenu } from 'react-icons/fi';
import { useDebounce } from '../hooks/useDebounce';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch?: (query: string) => void;
}

const SearchBar = memo(({ searchQuery, setSearchQuery, onSearch }: SearchBarProps) => {
  const [activeMatch, setActiveMatch] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  
  // Debounce the search query
  const debouncedQuery = useDebounce(localQuery, 300);
  
  // Update parent when debounced query changes
  useEffect(() => {
    setSearchQuery(debouncedQuery);
    onSearch?.(debouncedQuery);
  }, [debouncedQuery, setSearchQuery, onSearch]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocalQuery(query);
  }, []);

  const clearSearch = useCallback(() => {
    setLocalQuery('');
    setSearchQuery('');
    setTotalMatches(0);
    setActiveMatch(0);
    onSearch?.('');
  }, [setSearchQuery, onSearch]);

  const navigateMatches = useCallback((direction: number) => {
    const newIndex = activeMatch + direction;
    if (newIndex > 0 && newIndex <= totalMatches) {
      setActiveMatch(newIndex);
    }
  }, [activeMatch, totalMatches]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(localQuery);
  }, [localQuery, onSearch]);

  return (
    <Stack direction="row" spacing={designTokens.spacing.itemGap} alignItems="center">
      {/* Mobile Menu Icon */}
      <IconButton
        sx={{
          display: { lg: 'none' },
          color: 'text.secondary',
          '&:hover': {
            backgroundColor: `${designTokens.colors.primary[500]}14`,
            color: designTokens.colors.primary[500],
          },
        }}
        className="lg:hidden"
      >
        <FiMenu />
      </IconButton>

      {/* Search Bar */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: designTokens.spacing.itemGap,
            py: 1,
            width: { xs: 240, sm: 360, md: 480 },
            borderRadius: designTokens.borderRadius.md,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.default',
            '&:hover': {
              borderColor: 'primary.main',
            },
            '&:focus-within': {
              borderColor: 'primary.main',
              borderWidth: '2px',
              boxShadow: `0 0 0 3px ${designTokens.colors.primary[100]}`,
            },
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
          <InputBase
            placeholder="Search..."
            value={localQuery}
            onChange={handleSearchChange}
            sx={{
              flex: 1,
              fontSize: 14,
              '& .MuiInputBase-input': {
                color: 'text.primary',
                '&::placeholder': {
                  color: 'text.secondary',
                  opacity: 1,
                },
              },
            }}
            inputProps={{ 'aria-label': 'search' }}
          />
          {localQuery && (
            <IconButton
              size="small"
              onClick={clearSearch}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: `${designTokens.colors.primary[500]}14`,
                },
              }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          )}
        </Paper>

        {/* Search Navigation - Only show if we have matches */}
        {totalMatches > 0 && (
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              color: 'text.secondary',
              fontSize: designTokens.typography.fontSize.sm,
            }}
          >
            <Tooltip title="Previous match">
              <IconButton
                size="small"
                onClick={() => navigateMatches(-1)}
                disabled={activeMatch <= 1}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: `${designTokens.colors.primary[500]}14`,
                  },
                  '&:disabled': {
                    color: 'text.disabled',
                  },
                }}
              >
                <ArrowDropDownIcon sx={{ transform: 'rotate(90deg)' }} />
              </IconButton>
            </Tooltip>
            <Typography variant="body2" sx={{ mx: 1, color: 'text.primary' }}>
              {activeMatch} of {totalMatches}
            </Typography>
            <Tooltip title="Next match">
              <IconButton
                size="small"
                onClick={() => navigateMatches(1)}
                disabled={activeMatch >= totalMatches}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: `${designTokens.colors.primary[500]}14`,
                  },
                  '&:disabled': {
                    color: 'text.disabled',
                  },
                }}
              >
                <ArrowDropDownIcon sx={{ transform: 'rotate(-90deg)' }} />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
