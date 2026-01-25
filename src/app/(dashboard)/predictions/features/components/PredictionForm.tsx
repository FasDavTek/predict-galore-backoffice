// features/components/PredictionForm/PredictionForm.tsx
import React, { useCallback, useMemo, useState } from 'react';
import { useForm, FormProvider, useFieldArray, SubmitHandler, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Box,
  Typography,
  Button,
  Breadcrumbs,
  Link,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Paper,
  Snackbar,
  Alert,
  Chip,
  Stack,
} from '@mui/material';
import {
  Home as HomeIcon,
  Check as CheckIcon,
  NavigateBefore as NavigateBeforeIcon,
  ChevronRight as ChevronRightIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import {
  sportsPredictionFormSchema,
  SportsPredictionFormValues,
} from '@/features/predictions';
import {
  useCreatePrediction,
  useSports,
  useLeagues,
  useUpcomingFixtures,
} from '@/features/predictions';
import { League, Fixture } from '@/features/predictions';
import { formatDateForAPI } from '@/features/predictions';
import { designTokens } from '@/shared/styles/tokens';
import { useAuth } from '@/features/auth';

import { MatchSelectionStep } from './PredictionForm/steps/MatchSelectionStep';
import { PredictionAnalysisStep } from './PredictionForm/steps/PredictionAnalysisStep';
import { SubmissionPreviewStep } from './PredictionForm/steps/SubmissionPreviewStep';
import { AskHuddle } from './AskHuddle';
import Image from 'next/image';
// import { TestPredictionForm } from './PredictionForm/TestPredictionForm';

const STEPS = ['Match Selection', 'Prediction Analysis', 'Review & Submit'] as const;

interface PredictionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const PredictionForm: React.FC<PredictionFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [fixtureFromDate, setFixtureFromDate] = useState<Date | null>(new Date());
  const [askHuddleOpen, setAskHuddleOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const createPredictionMutation = useCreatePrediction();
  const isCreating = createPredictionMutation.isPending;

  const formMethods = useForm<SportsPredictionFormValues>({
    resolver: zodResolver(sportsPredictionFormSchema),
    defaultValues: {
      sportId: '',
      leagueId: '',
      fixtureId: '',
      isPremium: false,
      analysis: '',
      accuracy: 50,
      picks: [{ market: '', selectionKey: '', selectionLabel: '', confidence: 70 }],
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    setValue,
    trigger,
    control,
    reset,
    formState: { errors },
  } = formMethods;

  const { fields, append, remove } = useFieldArray({
    control: formMethods.control,
    name: 'picks',
  });

  const [sportId, leagueId, fixtureId, isPremium, analysis, accuracy, picks] = useWatch({
    control,
    name: ['sportId', 'leagueId', 'fixtureId', 'isPremium', 'analysis', 'accuracy', 'picks'],
  });

  const { data: sportsData, isLoading: isSportsLoading } = useSports({});
  const { data: leaguesData, isLoading: isLeaguesLoading } = useLeagues(
    sportId && sportId.trim() !== '' ? { sportId: Number(sportId) } : undefined
  );

  const formattedFromDate = useMemo(
    () => formatDateForAPI(fixtureFromDate || new Date()),
    [fixtureFromDate]
  );

  const { data: fixturesData, isLoading: isFixturesLoading } = useUpcomingFixtures(
    leagueId
      ? {
          leagueId: Number(leagueId),
          fromDate: formattedFromDate,
        }
      : undefined
  );

  const sports = useMemo(() => sportsData || [], [sportsData]);
  const leagues = useMemo(() => leaguesData || [], [leaguesData]);
  const fixtures = useMemo(() => fixturesData || [], [fixturesData]);

  const filteredLeagues = useMemo(
    () => leagues.filter((league: League) => String(league.sportId) === sportId),
    [leagues, sportId]
  );

  const selectedFixture = useMemo(
    () => fixtures.find((fixture: Fixture) => String(fixture.id) === fixtureId) || null,
    [fixtures, fixtureId]
  );

  const handleSportChange = useCallback(
    (selectedSportId: string) => {
      setValue('sportId', selectedSportId);
      setValue('leagueId', '');
      setValue('fixtureId', '');
    },
    [setValue]
  );

  const handleLeagueChange = useCallback(
    (selectedLeagueId: string) => {
      setValue('leagueId', selectedLeagueId);
      setValue('fixtureId', '');
    },
    [setValue]
  );

  const handleFixtureChange = useCallback(
    (selectedFixtureId: string) => {
      setValue('fixtureId', selectedFixtureId);
    },
    [setValue]
  );

  const handleDateChange = useCallback(
    (newDate: Date | null) => {
      setFixtureFromDate(newDate);
      setValue('fixtureId', '');
    },
    [setValue]
  );

  const handleAddPick = useCallback(() => {
    append({
      market: '',
      selectionKey: '',
      selectionLabel: '',
      confidence: 70,
    });
  }, [append]);

  const handleRemovePick = useCallback(
    (index: number) => {
      if (fields.length > 1) {
        remove(index);
      }
    },
    [fields.length, remove]
  );

  const handlePickChange = useCallback(
    (index: number, field: string, value: string | number) => {
      const currentPicks = formMethods.getValues('picks');
      const updatedPicks = [...currentPicks];
      updatedPicks[index] = { ...updatedPicks[index], [field]: value };

      // Auto-fill selectionLabel if it's empty and we're setting selectionKey
      if (field === 'selectionKey' && !updatedPicks[index].selectionLabel) {
        updatedPicks[index].selectionLabel = String(value);
      }

      setValue('picks', updatedPicks);
    },
    [formMethods, setValue]
  );

  const handleBack = () => {
    setActiveStep((prev) => Math.max(0, prev - 1));
  };

  const handleNext = async () => {
    const stepFields = {
      0: ['sportId', 'leagueId', 'fixtureId'],
      1: ['analysis', 'accuracy', 'picks'],
    } as const;

    const currentStepFields = stepFields[activeStep as keyof typeof stepFields];

    if (currentStepFields) {
      const isValid = await trigger(currentStepFields);
      if (!isValid) return;
    }

    if (activeStep === STEPS.length - 1) {
      await handleConfirmSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const onSubmit: SubmitHandler<SportsPredictionFormValues> = async (data) => {
    try {
      if (!data.fixtureId || data.fixtureId === '') {
        throw new Error('Please select a valid fixture');
      }

      const foundFixture = fixtures.find(
        (fixture: Fixture) => String(fixture.id) === data.fixtureId
      );

      if (!foundFixture) {
        throw new Error('Selected fixture not found. Please refresh and try again.');
      }

      // Prepare picks with EXACT values matching the API spec
      const transformedPicks = data.picks.map((pick) => ({
        market: pick.market, // This should be the market name like "FullTimeResult_1X2"
        selectionKey: pick.selectionKey, // This should be the selection key like "HOME"
        selectionLabel: pick.selectionLabel || pick.selectionKey,
        confidence: pick.confidence,
        odds: 0,
        tip: '',
        recentForm: '',
        homeScore: 0,
        awayScore: 0,
        tipGoals: 0,
        playerId: 0,
        playerName: '',
        teamId: 0,
        teamName: '',
        subType: '',
      }));

      // Validate that user is available
      if (!user || !user.id) {
        throw new Error('User authentication required. Please log in again.');
      }

      // Prepare submission data matching API spec exactly
      const submissionData = {
        fixtureId: Number(data.fixtureId),
        title: `Prediction for ${foundFixture.home} vs ${foundFixture.away}`,
        analysis: data.analysis,
        accuracy: data.accuracy,
        expertAnalysis: data.analysis, // Use analysis as expertAnalysis
        audience: data.isPremium ? ('PREMIUM' as const) : ('FREE' as const),
        includeTeamForm: false,
        includeTeamComparison: false,
        includeTopScorers: false,
        isPremium: data.isPremium,
        isScheduled: false,
        scheduledTime: new Date().toISOString(),
        picks: transformedPicks,
      };

      // Make the API call with adminUser as query parameter
      await createPredictionMutation.mutateAsync({
        data: submissionData,
        adminUser: user.id,
      });

      setSnackbar({
        open: true,
        message: 'Prediction created successfully!',
        severity: 'success',
      });

      setTimeout(() => {
        onSuccess?.();
        reset();
        setActiveStep(0);
        setFixtureFromDate(new Date());
      }, 1500);
    } catch (error) {
      let errorMessage = 'Failed to create prediction';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object') {
        const err = error as { status?: number; data?: { message?: string } };

        if (err.data?.message) {
          errorMessage = err.data.message;
        }

        if (err.status) {
          errorMessage = `Error ${err.status}: ${errorMessage}`;
        }
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    }
  };

  const handleConfirmSubmit = async () => {
    await handleSubmit(onSubmit)();
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const isStepValid = (step: number): boolean => {
    const stepValidations = {
      0: !!sportId && !!leagueId && !!fixtureId,
      1:
        !!analysis &&
        picks.every(
          (pick) => pick.market && pick.selectionKey && pick.selectionLabel && pick.confidence > 0
        ),
      2: true,
    };

    return stepValidations[step as keyof typeof stepValidations] ?? true;
  };

  const renderStepContent = (step: number) => {
    const stepComponents = {
      0: (
        <MatchSelectionStep
          sports={sports}
          leagues={filteredLeagues}
          fixtures={fixtures}
          isLoading={{
            sports: isSportsLoading,
            leagues: isLeaguesLoading,
            fixtures: isFixturesLoading,
          }}
          onSportChange={handleSportChange}
          onLeagueChange={handleLeagueChange}
          onFixtureChange={handleFixtureChange}
          onDateChange={handleDateChange}
          fixtureFromDate={fixtureFromDate}
          errors={errors}
          formValues={{ sportId, leagueId, fixtureId, isPremium }}
          methods={formMethods}
        />
      ),
      1: (
        <PredictionAnalysisStep
          picks={fields}
          onAddPick={handleAddPick}
          onRemovePick={handleRemovePick}
          onPickChange={handlePickChange}
          errors={errors}
          formValues={{ analysis, accuracy }}
          methods={formMethods}
        />
      ),
      2: (
        <SubmissionPreviewStep
          fixture={selectedFixture}
          isPremium={isPremium}
          analysis={analysis}
          accuracy={accuracy}
          picks={picks}
        />
      ),
    };

    return stepComponents[step as keyof typeof stepComponents] || null;
  };

  const handleAskHuddleOpen = useCallback(() => {
    setAskHuddleOpen(true);
  }, []);

  const handleAskHuddleClose = useCallback(() => {
    setAskHuddleOpen(false);
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormProvider {...formMethods}>
        <Box
          sx={{
            maxWidth: 1200,
            margin: '0 auto',
            bgcolor: 'background.paper',
            boxShadow: 3,
            position: 'relative',
          }}
        >
          {/* Ask Huddle Button - Fixed on the right side, top of form */}
          <Box
            sx={{
              position: 'fixed',
              right: 0,
              top: 120, // Align with top of form content
              zIndex: 1000,
              cursor: 'pointer',
              '@media (max-width: 1200px)': {
                display: 'none', // Hide on smaller screens
              },
            }}
            onClick={handleAskHuddleOpen}
          >
            {!imageError ? (
              <Image
                src="/ask-huddle-button.png"
                alt="Ask Huddle"
                width={80}
                height={200}
                style={{
                  objectFit: 'contain',
                  display: 'block',
                }}
                onError={() => setImageError(true)}
              />
            ) : (
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #6bc330 0%, #4ca020 100%)',
                  color: 'white',
                  padding: '20px 10px',
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  fontWeight: 600,
                  fontSize: '14px',
                  borderRadius: 0,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                Ask Huddle
              </Box>
            )}
          </Box>

          <Box sx={{ p: designTokens.spacing.xl }}>
            {/* Header */}
            <Box sx={{ mb: designTokens.spacing.xl }}>
              <Breadcrumbs sx={{ mb: designTokens.spacing.itemGap }}>
                <Link
                  color="inherit"
                  href="/predictions"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
                  Predictions
                </Link>
                <Typography color="text.primary" sx={{ fontWeight: 500 }}>
                  Create New Prediction
                </Typography>
              </Breadcrumbs>
            </Box>

            {/* Stepper */}
            <Paper
              sx={{
                p: designTokens.spacing.sectionGap,
                mb: designTokens.spacing.xl,
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stepper activeStep={activeStep} sx={{ mb: designTokens.spacing.itemGap }}>
                {STEPS.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Step {activeStep + 1} of {STEPS.length}
                </Typography>
                {isStepValid(activeStep) && (
                  <Chip
                    label="Step Complete"
                    color="success"
                    size="small"
                    variant="outlined"
                    icon={<CheckIcon />}
                  />
                )}
              </Stack>
            </Paper>

            {/* Step Content */}
            <Paper
              sx={{
                p: designTokens.spacing.xl,
                mb: designTokens.spacing.sectionGap,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              {renderStepContent(activeStep)}
              {/* <TestPredictionForm /> */}
            </Paper>

            {/* Navigation */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 4,
              }}
            >
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
                size="large"
                startIcon={<NavigateBeforeIcon />}
              >
                Back
              </Button>

              <Box sx={{ display: 'flex', gap: 2 }}>
                {onCancel && (
                  <Button onClick={onCancel} variant="text" size="large">
                    Cancel
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!isStepValid(activeStep) || isCreating}
                  size="large"
                  endIcon={
                    isCreating ? (
                      <CircularProgress size={20} />
                    ) : activeStep === STEPS.length - 1 ? (
                      <TrendingUpIcon />
                    ) : (
                      <ChevronRightIcon />
                    )
                  }
                >
                  {activeStep === STEPS.length - 1
                    ? isCreating
                      ? 'Creating...'
                      : 'Create Prediction'
                    : 'Next'}
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Snackbar */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={10000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              sx={{ width: '100%', maxWidth: 600 }}
              variant="filled"
            >
              <Typography variant="subtitle2" fontWeight={600}>
                {snackbar.severity === 'success' ? 'Success!' : 'Error'}
              </Typography>
              <Typography variant="body2">{snackbar.message}</Typography>
            </Alert>
          </Snackbar>
        </Box>

        {/* Ask Huddle Drawer */}
        <AskHuddle open={askHuddleOpen} onClose={handleAskHuddleClose} />
      </FormProvider>
    </LocalizationProvider>
  );
};

export default PredictionForm;
