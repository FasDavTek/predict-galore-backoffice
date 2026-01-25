// features/components/PredictionForm/steps/MatchSelectionStep.tsx
import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
  CircularProgress,
  Avatar,
  InputAdornment,
} from '@mui/material';

import {
  SportsSoccer as SportsSoccerIcon,
  CalendarTodayOutlined as CalendarIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Autocomplete } from '@mui/material';

import { Sport, League, Fixture, startOfToday } from '@/features/predictions';
import { FieldErrors, UseFormReturn } from 'react-hook-form';
import { SportsPredictionFormValues } from '@/features/predictions';

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
                helperText={typeof errors.sportId?.message === 'string' ? errors.sportId.message : 'Select the sport for this prediction'}
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
            getOptionLabel={(option: League) => {
              if (option.country) {
                return `${option.name} - ${option.country}`;
              }
              return option.name;
            }}
            value={leagues.find((league) => String(league.id) === leagueId) || null}
            onChange={(_, newValue) => {
              onLeagueChange(newValue ? String(newValue.id) : '');
            }}
            disabled={!sportId || isLoading.leagues}
            renderOption={(props, option: League) => {
              const { key, ...rest } = props;
              return (
                <Box
                  key={key}
                  component="li"
                  {...rest}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    py: 1,
                  }}
                >
                {option.emblem ? (
                  <Avatar
                    src={option.emblem}
                    alt={option.name}
                    sx={{
                      width: 32,
                      height: 32,
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      flexShrink: 0,
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontSize: '0.75rem',
                    }}
                  >
                    {option.name.charAt(0).toUpperCase()}
                  </Avatar>
                )}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body1" noWrap>
                    {option.name}
                  </Typography>
                  {option.country && (
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {option.country}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
            }}
            renderInput={(params) => {
              const selectedLeague = leagues.find((league) => String(league.id) === leagueId);
              return (
                <TextField
                  {...params}
                  label="League *"
                  error={!!errors.leagueId}
                  helperText={typeof errors.leagueId?.message === 'string' ? errors.leagueId.message : 'Select the league'}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: selectedLeague?.emblem ? (
                      <InputAdornment position="start">
                        <Avatar
                          src={selectedLeague.emblem}
                          alt={selectedLeague.name}
                          sx={{
                            width: 24,
                            height: 24,
                            flexShrink: 0,
                          }}
                        />
                      </InputAdornment>
                    ) : undefined,
                    endAdornment: (
                      <>
                        {isLoading.leagues && <CircularProgress size={20} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              );
            }}
            noOptionsText={isLoading.leagues ? 'Loading...' : 'No leagues available'}
          />
        </FormControl>

        {/* Fixtures Section with Date Filter */}
        <Box sx={{ width: '100%' }}>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{
              display: 'flex',
              alignItems: 'center',
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
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              alignItems: 'flex-start',
              width: '100%',
            }}
          >
            {/* Fixture Selection - Comes FIRST and WIDER */}
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                width: '100%',
              }}
            >
              <FormControl fullWidth error={!!errors.fixtureId}>
                <Autocomplete
                  options={fixtures}
                  getOptionLabel={(option: Fixture) => {
                    if (!option) return '';
                    const date = new Date(option.kickoffUtc);
                    const dateStr = date.toLocaleDateString();
                    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const statusMap: Record<string, string> = {
                      'NS': 'Not Started',
                      'LIVE': 'Live',
                      'FT': 'Full Time',
                      'HT': 'Half Time',
                      '1H': 'First Half',
                      '2H': 'Second Half',
                      'PEN': 'Penalties',
                      'CANC': 'Cancelled',
                      'POST': 'Postponed',
                      'SUSP': 'Suspended',
                    };
                    const statusText = statusMap[option.status] || option.status;
                    return `${option.home} vs ${option.away} - ${dateStr} ${timeStr} - ${statusText}`;
                  }}
                  value={
                    fixtures.find((fixture: Fixture) => String(fixture.id) === fixtureId) || null
                  }
                  onChange={(_, newValue) => {
                    onFixtureChange(newValue ? String(newValue.id) : '');
                  }}
                  disabled={!leagueId || isLoading.fixtures}
                  renderOption={(props, option: Fixture) => {
                    const { key, ...rest } = props;
                    const date = new Date(option.kickoffUtc);
                    const dateStr = date.toLocaleDateString();
                    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const statusMap: Record<string, string> = {
                      'NS': 'Not Started',
                      'LIVE': 'Live',
                      'FT': 'Full Time',
                      'HT': 'Half Time',
                      '1H': 'First Half',
                      '2H': 'Second Half',
                      'PEN': 'Penalties',
                      'CANC': 'Cancelled',
                      'POST': 'Postponed',
                      'SUSP': 'Suspended',
                    };
                    const statusText = statusMap[option.status] || option.status;
                    const getStatusColor = (status: string) => {
                      switch (status) {
                        case 'NS':
                          return 'text.secondary';
                        case 'LIVE':
                          return 'error.main';
                        case 'FT':
                          return 'success.main';
                        case 'HT':
                        case '1H':
                        case '2H':
                          return 'warning.main';
                        default:
                          return 'text.secondary';
                      }
                    };

                    // Helper function to get team initials
                    const getTeamInitials = (teamName: string) => {
                      const words = teamName.split(' ');
                      if (words.length >= 2) {
                        return (words[0][0] + words[1][0]).toUpperCase();
                      }
                      return teamName.substring(0, 2).toUpperCase();
                    };

                    return (
                      <Box
                        key={key}
                        component="li"
                        {...rest}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          py: 1.5,
                          px: 1,
                          alignItems: 'flex-start',
                        }}
                      >
                        {/* First Row: (home logo) home name vs (away logo) away name */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 1,
                            width: '100%',
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              flexShrink: 0,
                              bgcolor: 'primary.main',
                              color: 'white',
                              fontSize: '0.65rem',
                              fontWeight: 600,
                            }}
                          >
                            {getTeamInitials(option.home)}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {option.home}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mx: 0.5 }}>
                            vs
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {option.away}
                          </Typography>
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              flexShrink: 0,
                              bgcolor: 'secondary.main',
                              color: 'white',
                              fontSize: '0.65rem',
                              fontWeight: 600,
                              ml: 0.5,
                            }}
                          >
                            {getTeamInitials(option.away)}
                          </Avatar>
                        </Box>

                        {/* Second Row: Date: [date] Time: [time] */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            mb: 0.5,
                            width: '100%',
                            justifyContent: 'flex-start',
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Date:
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 500 }}>
                            {dateStr}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Time:
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 500 }}>
                            {timeStr}
                          </Typography>
                        </Box>

                        {/* Third Row: Status: [status] */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            width: '100%',
                            justifyContent: 'flex-start',
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Status:
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: getStatusColor(option.status),
                              fontWeight: 600,
                            }}
                          >
                            {statusText}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  }}
                  renderInput={(params) => {
                    const selectedFixture = fixtures.find((fixture: Fixture) => String(fixture.id) === fixtureId);
                    const getTeamInitials = (teamName: string) => {
                      if (!teamName) return '';
                      const words = teamName.split(' ');
                      if (words.length >= 2) {
                        return (words[0][0] + words[1][0]).toUpperCase();
                      }
                      return teamName.substring(0, 2).toUpperCase();
                    };

                    return (
                      <TextField
                        {...params}
                        label="Fixture *"
                        error={!!errors.fixtureId}
                        helperText={
                          isLoading.fixtures
                            ? 'Loading fixtures...'
                            : (typeof errors.fixtureId?.message === 'string' ? errors.fixtureId.message : undefined) ||
                              (fixtures.length === 0 && leagueId
                                ? `No upcoming fixtures found from ${
                                    fixtureFromDate ? fixtureFromDate.toLocaleDateString() : 'today'
                                  }`
                                : 'Select the specific match')
                        }
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: selectedFixture ? (
                            <InputAdornment position="start">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar
                                  sx={{
                                    width: 24,
                                    height: 24,
                                    flexShrink: 0,
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    fontSize: '0.6rem',
                                    fontWeight: 600,
                                  }}
                                >
                                  {getTeamInitials(selectedFixture.home)}
                                </Avatar>
                                <Typography variant="caption" sx={{ color: 'text.secondary', mx: 0.5 }}>
                                  vs
                                </Typography>
                                <Avatar
                                  sx={{
                                    width: 24,
                                    height: 24,
                                    flexShrink: 0,
                                    bgcolor: 'secondary.main',
                                    color: 'white',
                                    fontSize: '0.6rem',
                                    fontWeight: 600,
                                  }}
                                >
                                  {getTeamInitials(selectedFixture.away)}
                                </Avatar>
                              </Box>
                            </InputAdornment>
                          ) : undefined,
                          endAdornment: (
                            <>
                              {isLoading.fixtures && <CircularProgress size={20} />}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    );
                  }}
                  noOptionsText={isLoading.fixtures ? 'Loading...' : 'No fixtures available'}
                />
              </FormControl>
            </Box>

            {/* Date Picker - Comes SECOND and NARROWER */}
            <Box
              sx={{
                width: { xs: '100%', sm: '280px' },
                flexShrink: 0,
              }}
            >
              <DatePicker
                value={fixtureFromDate}
                onChange={onDateChange}
                minDate={startOfToday()}
                disablePast
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'medium',
                    label: 'Fixtures from',
                    helperText: 'Today or any future date',
                    placeholder: 'Select date',
                    // Match the exact TextField styling from the Fixture dropdown
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        // Match the exact padding and height of the fixture dropdown
                        height: '56px', // Standard medium TextField height
                        '& .MuiOutlinedInput-input': {
                          padding: '16.5px 14px', // Match TextField padding
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(0, 0, 0, 0.23)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(0, 0, 0, 0.87)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        // Match label positioning
                        '&.Mui-focused': {
                          color: 'primary.main',
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
      </FormGroup>
    </Box>
  );
};
