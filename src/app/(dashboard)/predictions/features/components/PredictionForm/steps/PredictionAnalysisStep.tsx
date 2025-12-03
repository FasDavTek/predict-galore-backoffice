// features/components/PredictionForm/steps/PredictionAnalysisStep.tsx
import React from "react";
import {
  Box,
  Typography,
  Button,
  FormControl,
  TextField,
  Chip,
  Card,
  CardContent,
  Autocomplete,
} from "@mui/material";

import {
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  ErrorOutline as ErrorIcon,
} from "@mui/icons-material";

import { PredictionTypeOption, Pick } from "../../../types/prediction.types";
import { FieldErrors, UseFormReturn } from "react-hook-form";
import { SportsPredictionFormValues } from "../../../validations/predictionSchema";

interface PredictionAnalysisStepProps {
  predictionTypes: PredictionTypeOption[];
  picks: Array<Pick & { id: string }>;
  onAddPick: () => void;
  onRemovePick: (index: number) => void;
  onPickChange: (index: number, field: string, value: string | number) => void;
  errors: FieldErrors<SportsPredictionFormValues>;
  formValues: {
    analysis: string;
    accuracy: number;
  };
  methods: UseFormReturn<SportsPredictionFormValues>;
  onOpenAskHuddle: () => void;
}

// Common market options for sports predictions
const MARKET_OPTIONS = [
  { id: 1, name: "Match Winner", category: "main" },
  { id: 2, name: "Over/Under", category: "goals" },
  { id: 3, name: "Both Teams to Score", category: "goals" },
  { id: 4, name: "Double Chance", category: "main" },
  { id: 5, name: "Correct Score", category: "score" },
  { id: 6, name: "Half Time/Full Time", category: "time" },
  { id: 7, name: "Draw No Bet", category: "main" },
  { id: 8, name: "Asian Handicap", category: "handicap" },
  { id: 9, name: "Total Goals", category: "goals" },
  { id: 10, name: "First Team to Score", category: "goals" },
  { id: 11, name: "Last Team to Score", category: "goals" },
  { id: 12, name: "Win to Nil", category: "main" },
  { id: 13, name: "Score Both Halves", category: "time" },
  { id: 14, name: "Total Corners", category: "corners" },
  { id: 15, name: "Total Cards", category: "cards" },
  { id: 16, name: "Player to Score", category: "players" },
  { id: 17, name: "Anytime Goalscorer", category: "players" },
  { id: 18, name: "First Goalscorer", category: "players" },
];

// Selection options mapped to markets
const getSelectionOptions = (market: string) => {
  const marketLower = market.toLowerCase();

  if (marketLower.includes("winner") || marketLower.includes("match winner")) {
    return [
      "Home Win",
      "Away Win",
      "Draw",
      "Home/Draw",
      "Away/Draw",
      "Home/Away",
    ];
  }

  if (
    marketLower.includes("over/under") ||
    marketLower.includes("total goals")
  ) {
    return [
      "Over 0.5",
      "Under 0.5",
      "Over 1.5",
      "Under 1.5",
      "Over 2.5",
      "Under 2.5",
      "Over 3.5",
      "Under 3.5",
      "Over 4.5",
      "Under 4.5",
    ];
  }

  if (marketLower.includes("both teams to score")) {
    return ["Yes", "No"];
  }

  if (marketLower.includes("double chance")) {
    return ["Home Win or Draw", "Away Win or Draw", "Home Win or Away Win"];
  }

  if (marketLower.includes("correct score")) {
    return [
      "1-0",
      "2-0",
      "2-1",
      "3-0",
      "3-1",
      "3-2",
      "0-0",
      "1-1",
      "2-2",
      "3-3",
      "0-1",
      "0-2",
      "1-2",
      "0-3",
      "1-3",
      "2-3",
    ];
  }

  if (marketLower.includes("half time/full time")) {
    return [
      "Home/Home",
      "Home/Draw",
      "Home/Away",
      "Draw/Home",
      "Draw/Draw",
      "Draw/Away",
      "Away/Home",
      "Away/Draw",
      "Away/Away",
    ];
  }

  if (marketLower.includes("asian handicap")) {
    return [
      "Home -0.5",
      "Away -0.5",
      "Home -1.0",
      "Away -1.0",
      "Home -1.5",
      "Away -1.5",
      "Home +0.5",
      "Away +0.5",
      "Home +1.0",
      "Away +1.0",
    ];
  }

  if (
    marketLower.includes("first team to score") ||
    marketLower.includes("last team to score")
  ) {
    return ["Home Team", "Away Team", "No Goal"];
  }

  if (marketLower.includes("total corners")) {
    return [
      "Over 4.5",
      "Under 4.5",
      "Over 5.5",
      "Under 5.5",
      "Over 6.5",
      "Under 6.5",
      "Over 7.5",
      "Under 7.5",
      "Over 8.5",
      "Under 8.5",
    ];
  }

  if (marketLower.includes("total cards")) {
    return [
      "Over 1.5",
      "Under 1.5",
      "Over 2.5",
      "Under 2.5",
      "Over 3.5",
      "Under 3.5",
      "Over 4.5",
      "Under 4.5",
    ];
  }

  if (
    marketLower.includes("player to score") ||
    marketLower.includes("goalscorer")
  ) {
    return [
      "Player 1 (Home)",
      "Player 2 (Home)",
      "Player 3 (Home)",
      "Player 1 (Away)",
      "Player 2 (Away)",
      "Player 3 (Away)",
      "No Goalscorer",
    ];
  }

  // Default options for other markets
  return ["Home", "Away", "Draw", "Yes", "No", "Over", "Under"];
};

// Individual Prediction Market Component
const PredictionMarket: React.FC<{
  index: number;
  pick: Pick;
  predictionTypes: PredictionTypeOption[];
  onRemove: (index: number) => void;
  onChange: (index: number, field: string, value: string | number) => void;
  errors: FieldErrors<SportsPredictionFormValues>;
  canRemove: boolean;
}> = ({
  index,
  pick,
  predictionTypes,
  onRemove,
  onChange,
  errors,
  canRemove,
}) => {
  // Use provided predictionTypes or fallback to our options
  const marketOptions =
    predictionTypes.length > 0 ? predictionTypes : MARKET_OPTIONS;
  const selectionOptions = getSelectionOptions(pick.market);

  const handleMarketChange = (newMarket: string) => {
    onChange(index, "market", newMarket);
    // Reset selection when market changes to avoid invalid combinations
    onChange(index, "selectionKey", "");
  };

  return (
    <Card
      sx={{
        mb: 2,
        p: 2,
        border: errors.picks?.[index]
          ? "1px solid #f44336"
          : "1px solid #e0e0e0",
        backgroundColor: errors.picks?.[index] ? "#ffebee" : "background.paper",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight="medium">
            Pick #{index + 1}
          </Typography>
          {canRemove && (
            <Button
              onClick={() => onRemove(index)}
              color="error"
              size="small"
              variant="outlined"
              sx={{ minWidth: "auto" }}
            >
              Remove
            </Button>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* Market Selection - Autocomplete */}
          <FormControl fullWidth error={!!errors.picks?.[index]?.market}>
            <Autocomplete
              options={marketOptions}
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.name
              }
              value={marketOptions.find((m) => m.name === pick.market) || null}
              onChange={(_, newValue) => {
                const marketValue =
                  typeof newValue === "string"
                    ? newValue
                    : newValue?.name || "";
                handleMarketChange(marketValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Market *"
                  error={!!errors.picks?.[index]?.market}
                  helperText={
                    errors.picks?.[index]?.market?.message ||
                    "Select the prediction market type"
                  }
                  placeholder="Search or select market..."
                />
              )}
              groupBy={(option) => option.category || "General"}
              sx={{ minWidth: 200 }}
            />
          </FormControl>

          {/* Selection Key - Autocomplete */}
          <FormControl fullWidth error={!!errors.picks?.[index]?.selectionKey}>
            <Autocomplete
              options={selectionOptions}
              value={pick.selectionKey || null}
              onChange={(_, newValue) => {
                onChange(index, "selectionKey", newValue || "");
              }}
              disabled={!pick.market}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Selection *"
                  error={!!errors.picks?.[index]?.selectionKey}
                  helperText={
                    errors.picks?.[index]?.selectionKey?.message ||
                    (pick.market
                      ? `Select ${pick.market} option`
                      : "Select a market first")
                  }
                  placeholder={
                    pick.market
                      ? `Choose ${pick.market}...`
                      : "Select market first"
                  }
                />
              )}
              sx={{ minWidth: 200 }}
            />
          </FormControl>
        </Box>

        {/* Confidence Slider */}
        <Box sx={{ mt: 3, px: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="body2" fontWeight="medium">
              Pick Confidence
            </Typography>
            <Chip
              label={`${pick.confidence}%`}
              size="small"
              color={
                pick.confidence >= 80
                  ? "success"
                  : pick.confidence >= 60
                  ? "warning"
                  : "default"
              }
              variant="outlined"
            />
          </Box>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={pick.confidence}
            onChange={(e) =>
              onChange(index, "confidence", Number(e.target.value))
            }
            style={{
              width: "100%",
              accentColor:
                pick.confidence >= 80
                  ? "#4caf50"
                  : pick.confidence >= 60
                  ? "#ff9800"
                  : "#9e9e9e",
            }}
          />
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}
          >
            <Typography variant="caption" color="text.secondary">
              Low
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Medium
            </Typography>
            <Typography variant="caption" color="text.secondary">
              High
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export const PredictionAnalysisStep: React.FC<PredictionAnalysisStepProps> = ({
  predictionTypes,
  picks,
  onAddPick,
  onRemovePick,
  onPickChange,
  errors,
  formValues,
  methods,
}) => {
  const { setValue, register } = methods;
  const { analysis, accuracy } = formValues;

  // Helper function to render error state
  const renderErrorState = (hasError: boolean, errorMessage?: string) =>
    hasError && (
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
        <ErrorIcon color="error" sx={{ fontSize: 16 }} />
        <Typography variant="caption" color="error">
          {errorMessage}
        </Typography>
      </Box>
    );

  return (
    <Box>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
      >
        <AnalyticsIcon color="primary" />
        Prediction Analysis
      </Typography>

      {/* Analysis Section */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Match Analysis
          </Typography>
          <Chip
            label="Required"
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>

        <FormControl fullWidth error={!!errors.analysis}>
          <TextField
            {...register("analysis")}
            label="Detailed Analysis *"
            multiline
            rows={6}
            value={analysis}
            onChange={(e) => setValue("analysis", e.target.value)}
            error={!!errors.analysis}
            helperText={
              errors.analysis?.message ||
              "Provide detailed analysis and reasoning for your prediction"
            }
            placeholder="Analyze team form, key players, injuries, historical data, and other relevant factors..."
            FormHelperTextProps={{
              sx: {
                color: errors.analysis ? "error.main" : "text.secondary",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mx: 0,
              },
            }}
          />
          {renderErrorState(!!errors.analysis, errors.analysis?.message)}
        </FormControl>
      </Box>

      {/* Accuracy Slider */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Prediction Confidence
          </Typography>
          <Chip
            label="Required"
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>

        <FormControl fullWidth error={!!errors.accuracy}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TrendingUpIcon color={errors.accuracy ? "error" : "action"} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                gutterBottom
                color={errors.accuracy ? "error" : "text.primary"}
              >
                Accuracy: {accuracy}%
              </Typography>
              <input
                type="range"
                min="0"
                max="100"
                value={accuracy}
                onChange={(e) => setValue("accuracy", Number(e.target.value))}
                style={{
                  width: "100%",
                  accentColor: errors.accuracy ? "#d32f2f" : undefined,
                }}
              />
            </Box>
            <Chip
              label={`${accuracy}%`}
              color={
                errors.accuracy
                  ? "error"
                  : accuracy >= 80
                  ? "success"
                  : accuracy >= 60
                  ? "warning"
                  : "error"
              }
              variant={errors.accuracy ? "outlined" : "filled"}
            />
          </Box>
          {errors.accuracy ? (
            renderErrorState(true, errors.accuracy.message)
          ) : (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              {accuracy >= 80
                ? "High confidence prediction"
                : accuracy >= 60
                ? "Moderate confidence prediction"
                : "Low confidence prediction"}
            </Typography>
          )}
        </FormControl>
      </Box>

      {/* Prediction Picks */}
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h6" gutterBottom>
              Market Picks
            </Typography>
            <Chip
              label="Required"
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
          <Button
            onClick={onAddPick}
            variant="outlined"
            size="small"
            disabled={picks.length >= 5}
          >
            Add Pick {picks.length > 0 && `(${picks.length}/5)`}
          </Button>
        </Box>

        {picks.map((pick, index) => (
          <PredictionMarket
            key={pick.id}
            index={index}
            pick={pick}
            predictionTypes={predictionTypes}
            onRemove={onRemovePick}
            onChange={onPickChange}
            errors={errors}
            canRemove={picks.length > 1}
          />
        ))}

        {/* Global picks error */}
        {errors.picks && (
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              border: 1,
              borderColor: "error.main",
              borderRadius: 1,
              bgcolor: "error.light",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ErrorIcon color="error" />
              <Typography
                variant="body2"
                color="error.main"
                fontWeight="medium"
              >
                {errors.picks.message ||
                  "Please fix the errors in your market picks before proceeding"}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Empty state guidance */}
        {picks.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              p: 3,
              border: 2,
              borderColor: "divider",
              borderRadius: 1,
              borderStyle: "dashed",
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              No market picks added yet
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Click &quot;Add Pick&quot; to start adding your market selections
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
