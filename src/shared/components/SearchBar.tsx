import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Tooltip,
  Typography,
  Paper,
} from "@mui/material";
import {
  Search as SearchIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { FiMenu } from "react-icons/fi";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch?: (query: string) => void;
}

const SearchBar = ({ searchQuery, setSearchQuery, onSearch }: SearchBarProps) => {
  const [activeMatch, setActiveMatch] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setTotalMatches(0);
    setActiveMatch(0);
    onSearch?.("");
  };

  const navigateMatches = (direction: number) => {
    const newIndex = activeMatch + direction;
    if (newIndex > 0 && newIndex <= totalMatches) {
      setActiveMatch(newIndex);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      {/* Mobile Menu Icon */}
      <IconButton
        sx={{ 
          display: { lg: 'none' }, 
          color: "text.secondary",
          '&:hover': {
            backgroundColor: 'rgba(66, 166, 5, 0.08)',
            color: '#42A605',
          },
        }}
        className="lg:hidden"
      >
        <FiMenu />
      </IconButton>

      {/* Search Bar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            px: 2,
            py: 1,
            width: { xs: 240, sm: 360, md: 480 },
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.default",
            "&:hover": {
              borderColor: "primary.main",
            },
            "&:focus-within": {
              borderColor: "primary.main",
              borderWidth: "2px",
              boxShadow: "0 0 0 3px rgba(66, 166, 5, 0.1)",
            },
          }}
        >
          <SearchIcon sx={{ color: "text.secondary", mr: 1, fontSize: 20 }} />
          <InputBase
            placeholder="Search..."
            value={searchQuery}
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
            inputProps={{ "aria-label": "search" }}
          />
          {searchQuery && (
            <IconButton 
              size="small" 
              onClick={clearSearch}
              sx={{
                color: "text.secondary",
                '&:hover': {
                  color: "primary.main",
                  backgroundColor: 'rgba(66, 166, 5, 0.08)',
                },
              }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          )}
        </Paper>

        {/* Search Navigation - Only show if we have matches */}
        {totalMatches > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "text.secondary",
              fontSize: "0.875rem",
            }}
          >
            <Tooltip title="Previous match">
              <IconButton
                size="small"
                onClick={() => navigateMatches(-1)}
                disabled={activeMatch <= 1}
                sx={{
                  color: "text.secondary",
                  '&:hover': {
                    color: "primary.main",
                    backgroundColor: 'rgba(66, 166, 5, 0.08)',
                  },
                  '&:disabled': {
                    color: "text.disabled",
                  },
                }}
              >
                <ArrowDropDownIcon sx={{ transform: "rotate(90deg)" }} />
              </IconButton>
            </Tooltip>
            <Typography variant="body2" sx={{ mx: 1, color: "text.primary" }}>
              {activeMatch} of {totalMatches}
            </Typography>
            <Tooltip title="Next match">
              <IconButton
                size="small"
                onClick={() => navigateMatches(1)}
                disabled={activeMatch >= totalMatches}
                sx={{
                  color: "text.secondary",
                  '&:hover': {
                    color: "primary.main",
                    backgroundColor: 'rgba(66, 166, 5, 0.08)',
                  },
                  '&:disabled': {
                    color: "text.disabled",
                  },
                }}
              >
                <ArrowDropDownIcon sx={{ transform: "rotate(-90deg)" }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SearchBar;