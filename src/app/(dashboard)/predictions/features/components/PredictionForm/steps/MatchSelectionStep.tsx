// features/components/PredictionForm/steps/MatchSelectionStep.tsx
import React from "react";
import {
  Box,
  Typography,
  FormControl,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
  CircularProgress,
} from "@mui/material";

import {
  SportsSoccer as SportsSoccerIcon,
  CalendarTodayOutlined as CalendarIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Autocomplete } from "@mui/material";

import { Sport, League, Fixture } from "../../../types/prediction.types";
import { FieldErrors, UseFormReturn } from "react-hook-form";
import { SportsPredictionFormValues } from "../../../validations/predictionSchema";

interface MatchSelectionStepProps {
  sports: Sport[];
  leagues: League[];
  fixtures: Fixture[];
  isLoading: {
    sports: boolean;
    leagues: boolean;
    fixtures: boolean;
  };
  onSportChange: (sportId: string) => void;
  onLeagueChange: (leagueId: string) => void;
  onFixtureChange: (fixtureId: string) => void;
  onDateChange: (date: Date | null) => void;
  fixtureFromDate: Date | null;
  errors: FieldErrors<SportsPredictionFormValues>;
  formValues: {
    sportId: string;
    leagueId: string;
    fixtureId: string;
    isPremium: boolean;
  };
  methods: UseFormReturn<SportsPredictionFormValues>;
}

export const MatchSelectionStep: React.FC<MatchSelectionStepProps> = ({
  sports,
  leagues,
  fixtures,
  isLoading,
  onSportChange,
  onLeagueChange,
  onFixtureChange,
  onDateChange,
  fixtureFromDate,
  errors,
  formValues,
  methods,
}) => {
  const { setValue } = methods;
  const { sportId, leagueId, fixtureId, isPremium } = formValues;

  return (
    <Box>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
      >
        <SportsSoccerIcon color="primary" />
        Select Match
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Sport Selection */}
        <FormControl fullWidth error={!!errors.sportId}>
          <Autocomplete
            options={sports}
            getOptionLabel={(option: Sport) => option.name}
            value={sports.find((sport) => String(sport.id) === sportId) || null}
            onChange={(_, newValue) => {
              onSportChange(newValue ? String(newValue.id) : "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Sport *"
                error={!!errors.sportId}
                helperText={
                  errors.sportId?.message ||
                  "Select the sport for this prediction"
                }
                placeholder="Football, Basketball, etc."
              />
            )}
            loading={isLoading.sports}
          />
        </FormControl>

        {/* League Selection */}
        <FormControl fullWidth error={!!errors.leagueId}>
          <Autocomplete
            options={leagues}
            getOptionLabel={(option: League) => option.name}
            value={
              leagues.find((league) => String(league.id) === leagueId) || null
            }
            onChange={(_, newValue) => {
              onLeagueChange(newValue ? String(newValue.id) : "");
            }}
            disabled={!sportId || isLoading.leagues}
            renderInput={(params) => (
              <TextField
                {...params}
                label="League *"
                error={!!errors.leagueId}
                helperText={errors.leagueId?.message || "Select the league"}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoading.leagues && <CircularProgress size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            noOptionsText={
              isLoading.leagues ? "Loading..." : "No leagues available"
            }
          />
        </FormControl>

        {/* Fixtures Section with Date Filter */}
        <Box sx={{ width: "100%" }}>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <CalendarIcon fontSize="small" />
            Select Fixture
          </Typography>

          {/* Flexbox container for fixture and date */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            {/* Fixture Selection - Comes FIRST and WIDER */}
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                width: "100%",
              }}
            >
              <FormControl fullWidth error={!!errors.fixtureId}>
                <Autocomplete
                  options={fixtures}
                  getOptionLabel={(option: Fixture) => {
                    if (!option) return "";
                    return `${option.label} - ${new Date(
                      option.kickoffUtc
                    ).toLocaleDateString()}`;
                  }}
                  value={
                    fixtures.find(
                      (fixture: Fixture) => String(fixture.id) === fixtureId
                    ) || null
                  }
                  onChange={(_, newValue) => {
                    onFixtureChange(newValue ? String(newValue.id) : "");
                  }}
                  disabled={!leagueId || isLoading.fixtures}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Fixture *"
                      error={!!errors.fixtureId}
                      helperText={
                        isLoading.fixtures
                          ? "Loading fixtures..."
                          : errors.fixtureId?.message ||
                            (fixtures.length === 0 && leagueId
                              ? `No upcoming fixtures found from ${
                                  fixtureFromDate
                                    ? fixtureFromDate.toLocaleDateString()
                                    : "today"
                                }`
                              : "Select the specific match")
                      }
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isLoading.fixtures && (
                              <CircularProgress size={20} />
                            )}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  noOptionsText={
                    isLoading.fixtures ? "Loading..." : "No fixtures available"
                  }
                />
              </FormControl>
            </Box>

            {/* Date Picker - Comes SECOND and NARROWER */}
            <Box
              sx={{
                width: { xs: "100%", sm: "280px" },
                flexShrink: 0,
              }}
            >
              <DatePicker
                value={fixtureFromDate}
                onChange={onDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "medium",
                    helperText: "",
                    placeholder: "Select date",
                    // Match the exact TextField styling from the Fixture dropdown
                    sx: {
                      "& .MuiOutlinedInput-root": {
                        // Match the exact padding and height of the fixture dropdown
                        height: "56px", // Standard medium TextField height
                        "& .MuiOutlinedInput-input": {
                          padding: "16.5px 14px", // Match TextField padding
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(0, 0, 0, 0.23)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(0, 0, 0, 0.87)",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "primary.main",
                          borderWidth: "2px",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        // Match label positioning
                        "&.Mui-focused": {
                          color: "primary.main",
                        },
                      },
                    },
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Premium Toggle */}
      <FormGroup sx={{ mt: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={isPremium}
              onChange={(e) => setValue("isPremium", e.target.checked)}
              color="primary"
            />
          }
          label={
            <Box>
              <Typography variant="subtitle1">Premium Prediction</Typography>
              <Typography variant="body2" color="text.secondary">
                {isPremium
                  ? "This prediction will be available to premium users only"
                  : "This prediction will be available to all users"}
              </Typography>
            </Box>
          }
        />
      </FormGroup>
    </Box>
  );
};
