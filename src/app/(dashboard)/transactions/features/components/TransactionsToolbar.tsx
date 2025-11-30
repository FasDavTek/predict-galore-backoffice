import React from "react";
import {
  Box,
  Button,
  Chip,
  Stack,
  Tooltip,
  useTheme,
  alpha,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

interface TransactionsToolbarProps {
  selectedCount: number;
  onAddTransaction?: () => void;
  onExportTransactions?: () => void;
  onRefresh?: () => void;
  isExporting?: boolean;
  isLoading?: boolean;
  showFilters?: boolean;
  onToggleFilters?: () => void;
  filtersActive?: boolean;
}

export const TransactionsToolbar: React.FC<TransactionsToolbarProps> = ({
  selectedCount,
  onAddTransaction,
  onExportTransactions,
  onRefresh,
  isExporting = false,
  isLoading = false,
  showFilters = false,
  onToggleFilters,
  filtersActive = false,
}) => {
  const theme = useTheme();

  const handleExport = async () => {
    if (onExportTransactions) {
      try {
        await onExportTransactions();
      } catch (error) {
        console.error("Export failed:", error);
      }
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
      >
        {/* Selected count */}
        {selectedCount > 0 && (
          <Typography variant="body2" color="text.secondary">
            {selectedCount} transaction{selectedCount !== 1 ? 's' : ''} selected
          </Typography>
        )}

        {/* Right section - Action buttons */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
        >
          {/* Refresh button */}
          <Tooltip title="Refresh transactions">
            <Button
              startIcon={<RefreshIcon />}
              onClick={onRefresh}
              variant="outlined"
              size="medium"
              disabled={isLoading}
              sx={{ borderRadius: 2, minWidth: "auto", px: 2 }}
            >
              Refresh
            </Button>
          </Tooltip>

          {/* Filter toggle */}
          {showFilters && onToggleFilters && (
            <Tooltip title={filtersActive ? "Hide filters" : "Show filters"}>
              <Button
                startIcon={<FilterIcon />}
                onClick={onToggleFilters}
                variant={filtersActive ? "contained" : "outlined"}
                color={filtersActive ? "primary" : "inherit"}
                size="medium"
                sx={{ borderRadius: 2, minWidth: "auto", px: 2 }}
              >
                Filters
                {filtersActive && (
                  <Chip
                    label="On"
                    size="small"
                    color="primary"
                    sx={{ ml: 1, height: 20 }}
                  />
                )}
              </Button>
            </Tooltip>
          )}

          {/* Export transactions */}
          <Tooltip title="Export transactions data to CSV">
            <LoadingButton
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              loading={isExporting}
              loadingPosition="start"
              variant="outlined"
              size="medium"
              sx={{ borderRadius: 2, minWidth: "auto", px: 2 }}
            >
              {isExporting ? "Exporting..." : "Export"}
            </LoadingButton>
          </Tooltip>

          {/* Add transaction button */}
          {onAddTransaction && (
            <Button
              startIcon={<AddIcon />}
              onClick={onAddTransaction}
              variant="contained"
              size="medium"
              sx={{
                borderRadius: 2,
                minWidth: "auto",
                px: 3,
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                "&:hover": {
                  boxShadow: `0 6px 20px ${alpha(
                    theme.palette.primary.main,
                    0.4
                  )}`,
                  transform: "translateY(-1px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Add Transaction
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};