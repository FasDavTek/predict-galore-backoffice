// features/components/PredictionForm/steps/MatchSelectionStep.tsx
import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  TextField,
  Card,
  CardContent,
  FormGroup,
  FormControlLabel,
  Switch,
  Chip,
  CircularProgress,
} from '@mui/material';

import {
    SportsSoccer as SportsSoccerIcon,
    CalendarTodayOutlined as CalendarIcon,

} from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Autocomplete } from '@mui/material';

import { Sport, League, Fixture } from '../../../types/prediction.types';
import { FieldErrors, UseFormReturn } from 'react-hook-form';
import { SportsPredictionFormValues } from '../../../validations/predictionSchema';

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
        sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}
      >
        <SportsSoccerIcon color="primary" />
        Select Match
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Sport Selection */}
        <FormControl fullWidth error={!!errors.sportId}>
          <Autocomplete
            options={sports}
            getOptionLabel={(option: Sport) => option.name}
            value={sports.find((sport) => String(sport.id) === sportId) || null}
            onChange={(_, newValue) => {
              onSportChange(newValue ? String(newValue.id) : '');
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Sport *"
                error={!!errors.sportId}
                helperText={errors.sportId?.message || 'Select the sport for this prediction'}
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
            value={leagues.find((league) => String(league.id) === leagueId) || null}
            onChange={(_, newValue) => {
              onLeagueChange(newValue ? String(newValue.id) : '');
            }}
            disabled={!sportId || isLoading.leagues}
            renderInput={(params) => (
              <TextField
                {...params}
                label="League *"
                error={!!errors.leagueId}
                helperText={errors.leagueId?.message || 'Select the league'}
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
            noOptionsText={isLoading.leagues ? 'Loading...' : 'No leagues available'}
          />
        </FormControl>

        {/* Date Selection */}
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarIcon fontSize="small" />
            Fixtures From Date
          </Typography>
          <DatePicker
            value={fixtureFromDate}
            onChange={onDateChange}
            slotProps={{
              textField: {
                fullWidth: true,
                helperText: 'Select the start date for upcoming fixtures (default: today)',
                placeholder: 'Select date for upcoming fixtures',
              },
            }}
          />
        </Box>

        {/* Fixture Selection */}
        <FormControl fullWidth error={!!errors.fixtureId}>
          <Autocomplete
            options={fixtures}
            getOptionLabel={(option: Fixture) => {
              if (!option) return '';
              return `${option.label} - ${new Date(option.kickoffUtc).toLocaleDateString()}`;
            }}
            value={fixtures.find((fixture: Fixture) => String(fixture.id) === fixtureId) || null}
            onChange={(_, newValue) => {
              onFixtureChange(newValue ? String(newValue.id) : '');
            }}
            disabled={!leagueId || isLoading.fixtures}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Fixture *"
                error={!!errors.fixtureId}
                helperText={
                  isLoading.fixtures
                    ? 'Loading fixtures...'
                    : errors.fixtureId?.message ||
                      (fixtures.length === 0 && leagueId
                        ? `No upcoming fixtures found from ${fixtureFromDate ? fixtureFromDate.toLocaleDateString() : 'today'}`
                        : 'Select the specific match')
                }
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoading.fixtures && <CircularProgress size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            noOptionsText={isLoading.fixtures ? 'Loading...' : 'No fixtures available'}
          />
        </FormControl>
      </Box>

      {/* Selected Match Preview */}
      {fixtureId && (
        <Card
          sx={{
            mt: 3,
            border: '1px solid',
            borderColor: 'primary.light',
            bgcolor: 'primary.50',
          }}
        >
          <CardContent>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <SportsSoccerIcon fontSize="small" />
              Selected Match
            </Typography>
            {isLoading.fixtures ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                <Typography>Loading match details...</Typography>
              </Box>
            ) : fixtures.find((f) => String(f.id) === fixtureId) ? (
              <Box>
                <Typography variant="h6" color="primary.main">
                  {fixtures.find((f) => String(f.id) === fixtureId)?.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(
                    fixtures.find((f) => String(f.id) === fixtureId)!.kickoffUtc
                  ).toLocaleString()}
                </Typography>
              </Box>
            ) : (
              <Typography color="error">Selected fixture not found</Typography>
            )}
          </CardContent>
        </Card>
      )}

      {/* Premium Toggle */}
      <FormGroup sx={{ mt: 3 }}>
        <Card variant="outlined">
          <CardContent>
            <FormControlLabel
              control={
                <Switch
                  checked={isPremium}
                  onChange={(e) => setValue('isPremium', e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle1">Premium Prediction</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {isPremium
                      ? 'This prediction will be available to premium users only'
                      : 'This prediction will be available to all users'}
                  </Typography>
                </Box>
              }
            />
            {isPremium && (
              <Chip
                label="Premium Content"
                color="primary"
                variant="filled"
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </CardContent>
        </Card>
      </FormGroup>
    </Box>
  );
};