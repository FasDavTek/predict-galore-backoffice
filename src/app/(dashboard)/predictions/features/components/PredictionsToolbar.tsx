import React from "react";
import {
  Box,
  Button,
  Chip,
  Stack,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Add as AddIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

interface PredictionsToolbarProps {
  selectedCount: number;
  onAddPrediction: () => void;
  onExportPredictions: () => void;
  onRefresh: () => void;
  isExporting?: boolean;
  isLoading?: boolean;
  showFilters?: boolean;
  onToggleFilters?: () => void;
  filtersActive?: boolean;
}

export const PredictionsToolbar: React.FC<PredictionsToolbarProps> = ({
  selectedCount,
  onAddPrediction,
  onExportPredictions,
  isExporting = false,
  showFilters = false,
  onToggleFilters,
  filtersActive = false,
}) => {
  const theme = useTheme();

  const handleExport = async () => {
    if (onExportPredictions) {
      try {
        await onExportPredictions();
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
        {/* Selected count display */}
        {selectedCount > 0 && (
          <Box>
            <Chip
              label={`${selectedCount} selected`}
              color="primary"
              variant="outlined"
            />
          </Box>
        )}

        {/* Action buttons */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
        >
         

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

          {/* Export predictions */}
          <Tooltip title="Export predictions data to CSV">
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

          {/* Add prediction button */}
          <Button
            startIcon={<AddIcon />}
            onClick={onAddPrediction}
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
            New Prediction
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};