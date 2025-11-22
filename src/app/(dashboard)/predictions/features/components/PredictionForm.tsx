// features/components/PredictionForm.tsx
import React, { useCallback, useMemo, useState } from "react";
import {
  useForm,
  FormProvider,
  useFieldArray,
  FieldErrors,
  SubmitHandler,
  UseFormReturn,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  InputAdornment,
  Autocomplete,
  Chip,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Home as HomeIcon,
  Delete as DeleteIcon,
  SportsSoccer as SportsSoccerIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Preview as PreviewIcon,
  Check as CheckIcon,
  NavigateBefore as NavigateBeforeIcon,
  ChevronRight as ChevronRightIcon,
  SmartToy as AIIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

import {
  sportsPredictionFormSchema,
  SportsPredictionFormValues,
} from "../validations/predictionSchema";
import {
  useCreatePredictionMutation,
  useGetSportsQuery,
  useGetLeaguesQuery,
  useGetLeaguesWithFixturesQuery,
  useGetUpcomingFixturesQuery,
  useGetPredictionTypesQuery,
} from "../api/predictionApi";
import {
  Sport,
  League,
  Fixture,
  PredictionTypeOption,
} from "../types/prediction.types";
import AskHuddle from "./AskHuddle";

import { getFormattedFutureDate } from "../utils/dateUtils";

interface PredictionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const STEPS = ["Match Selection", "Prediction Analysis", "Review & Submit"];

export const PredictionForm: React.FC<PredictionFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const [askHuddleOpen, setAskHuddleOpen] = useState(false);

  const [createPrediction, { isLoading: isCreating }] =
    useCreatePredictionMutation();

  const methods = useForm<SportsPredictionFormValues>({
    resolver: zodResolver(sportsPredictionFormSchema),
    defaultValues: {
      sportId: "",
      leagueId: "",
      leagueWithFixturesId: "",
      fixtureId: "",
      isPremium: false,
      analysis: "",
      accuracy: 50,
      picks: [{ market: "", selectionKey: "", confidence: 70 }],
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    setValue,
    trigger,
    control,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "picks",
  });

  // Use useWatch instead of watch for React Compiler compatibility
  const sportId = useWatch({ control, name: "sportId" });
  const leagueId = useWatch({ control, name: "leagueId" });
  const leagueWithFixturesId = useWatch({
    control,
    name: "leagueWithFixturesId",
  });
  const fixtureId = useWatch({ control, name: "fixtureId" });
  const isPremium = useWatch({ control, name: "isPremium" });
  const analysis = useWatch({ control, name: "analysis" });
  const accuracy = useWatch({ control, name: "accuracy" });
  const picks = useWatch({ control, name: "picks" });

  // Determine which league ID to use for fixtures
  const effectiveLeagueId = leagueWithFixturesId || leagueId;

  // API Queries
  const { data: sportsData, isLoading: sportsLoading } = useGetSportsQuery({});
  const { data: leaguesData, isLoading: leaguesLoading } = useGetLeaguesQuery(
    { sportId: Number(sportId) },
    { skip: !sportId }
  );
  const {
    data: leaguesWithFixturesData,
    isLoading: leaguesWithFixturesLoading,
  } = useGetLeaguesWithFixturesQuery(
    { sportId: Number(sportId) },
    { skip: !sportId }
  );

  const { data: fixturesData, isLoading: fixturesLoading } =
    useGetUpcomingFixturesQuery(
      {
        leagueId: Number(effectiveLeagueId),
        from: getFormattedFutureDate(1),
      },
      { skip: !effectiveLeagueId }
    );

  const { data: predictionTypesData } = useGetPredictionTypesQuery();

  const sports = useMemo(() => sportsData?.data || [], [sportsData?.data]);
  const leagues = useMemo(() => leaguesData?.data || [], [leaguesData?.data]);
  const leaguesWithFixtures = useMemo(
    () => leaguesWithFixturesData?.data || [],
    [leaguesWithFixturesData?.data]
  );
  const fixtures = useMemo(
    () => fixturesData?.data || [],
    [fixturesData?.data]
  );
  const predictionTypes = predictionTypesData?.data || [];

  // Filtered data
  const filteredLeagues = useMemo(() => {
    if (!sportId) return [];
    return leagues.filter(
      (league: League) => String(league.sportId) === sportId
    );
  }, [leagues, sportId]);

  const filteredFixtures = useMemo(() => {
    if (!effectiveLeagueId) return [];
    return fixtures;
  }, [fixtures, effectiveLeagueId]);

  const selectedFixture = useMemo(() => {
    return (
      fixtures.find((fixture: Fixture) => String(fixture.id) === fixtureId) ||
      null
    );
  }, [fixtures, fixtureId]);

  // Handlers
  const handleSportChange = useCallback(
    (sportId: string) => {
      setValue("sportId", sportId);
      setValue("leagueId", "");
      setValue("leagueWithFixturesId", "");
      setValue("fixtureId", "");
    },
    [setValue]
  );

  const handleLeagueChange = useCallback(
    (leagueId: string) => {
      setValue("leagueId", leagueId);
      setValue("leagueWithFixturesId", "");
      setValue("fixtureId", "");
    },
    [setValue]
  );

  const handleLeagueWithFixturesChange = useCallback(
    (leagueId: string) => {
      setValue("leagueWithFixturesId", leagueId);
      setValue("leagueId", "");
      setValue("fixtureId", "");
    },
    [setValue]
  );

  const handleFixtureChange = useCallback(
    (fixtureId: string) => {
      setValue("fixtureId", fixtureId);
    },
    [setValue]
  );

  const addPick = useCallback(() => {
    append({ market: "", selectionKey: "", confidence: 70 });
  }, [append]);

  const removePick = useCallback(
    (index: number) => {
      if (fields.length > 1) {
        remove(index);
      }
    },
    [fields.length, remove]
  );

  const handlePickChange = useCallback(
    (
      index: number,
      field: keyof { market: string; selectionKey: string; confidence: number },
      value: string | number
    ) => {
      const currentPicks = methods.getValues("picks");
      const updatedPicks = [...currentPicks];
      updatedPicks[index] = { ...updatedPicks[index], [field]: value };
      setValue("picks", updatedPicks);
    },
    [methods, setValue]
  );

  // Navigation
  const handleBack = () => {
    setActiveStep((prev) => Math.max(0, prev - 1));
  };

  const handleNext = async () => {
    const stepFields = {
      0: ["sportId", "leagueId", "fixtureId"],
      1: ["analysis", "accuracy", "picks"],
    };

    const currentStepFields = stepFields[activeStep as keyof typeof stepFields];
    if (currentStepFields) {
      const isValid = await trigger(
        currentStepFields as (keyof SportsPredictionFormValues)[]
      );
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
      const submissionData = {
        fixtureId: Number(data.fixtureId),
        title: `Prediction for ${selectedFixture?.label || "Match"}`,
        analysis: data.analysis,
        accuracy: data.accuracy,
        audience: data.isPremium ? ("PREMIUM" as const) : ("FREE" as const),
        picks: data.picks,
      };

      await createPrediction(submissionData).unwrap();

      setSnackbar({
        open: true,
        message: "Prediction created successfully!",
        severity: "success",
      });

      setTimeout(() => {
        onSuccess?.();
        // Reset form
        methods.reset();
        setActiveStep(0);
      }, 1500);
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to create prediction",
        severity: "error",
      });
    }
  };

  const handleConfirmSubmit = handleSubmit(onSubmit);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleOpenAskHuddle = () => {
    setAskHuddleOpen(true);
  };

  const handleCloseAskHuddle = () => {
    setAskHuddleOpen(false);
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        return (
          !!sportId && !!fixtureId && (!!leagueId || !!leagueWithFixturesId)
        );
      case 1:
        return (
          !!analysis &&
          picks.every(
            (pick) => pick.market && pick.selectionKey && pick.confidence > 0
          )
        );
      default:
        return true;
    }
  };

  // Step content rendering
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <MatchSelectionStep
            sports={sports}
            leagues={filteredLeagues}
            leaguesWithFixtures={leaguesWithFixtures}
            fixtures={filteredFixtures}
            sportsLoading={sportsLoading}
            leaguesLoading={leaguesLoading}
            leaguesWithFixturesLoading={leaguesWithFixturesLoading}
            fixturesLoading={fixturesLoading}
            onSportChange={handleSportChange}
            onLeagueChange={handleLeagueChange}
            onLeagueWithFixturesChange={handleLeagueWithFixturesChange}
            onFixtureChange={handleFixtureChange}
            errors={errors}
            sportId={sportId}
            leagueId={leagueId}
            leagueWithFixturesId={leagueWithFixturesId}
            fixtureId={fixtureId}
            isPremium={isPremium}
            methods={methods}
          />
        );

      case 1:
        return (
          <PredictionAnalysisStep
            predictionTypes={predictionTypes}
            picks={fields}
            onAddPick={addPick}
            onRemovePick={removePick}
            onPickChange={handlePickChange}
            errors={errors}
            analysis={analysis}
            accuracy={accuracy}
            methods={methods}
            onOpenAskHuddle={handleOpenAskHuddle}
          />
        );

      case 2:
        return (
          <SubmissionPreviewStep
            fixture={selectedFixture}
            isPremium={isPremium}
            analysis={analysis}
            accuracy={accuracy}
            picks={picks}
          />
        );

      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <Box
        sx={{
          maxWidth: 1200,
          margin: "0 auto",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
          position: "relative",
        }}
      >
        <Box sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Breadcrumbs sx={{ mb: 2 }}>
              <Link
                color="inherit"
                href="/predictions"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                }}
              >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
                Predictions
              </Link>
              <Typography color="text.primary" sx={{ fontWeight: 500 }}>
                Create New Prediction
              </Typography>
            </Breadcrumbs>

            <Typography
              variant="h4"
              component="h1"
              fontWeight="600"
              gutterBottom
            >
              Create Prediction
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create a new sports prediction with detailed analysis and market
              picks
            </Typography>
          </Box>

          {/* Progress Stepper */}
          <Paper
            sx={{
              p: 3,
              mb: 4,
              background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Stepper activeStep={activeStep} sx={{ mb: 2 }}>
              {STEPS.map((label, index) => (
                <Step key={label} completed={activeStep > index}>
                  <StepLabel
                    StepIconProps={{
                      sx: {
                        "&.Mui-completed": { color: "success.main" },
                        "&.Mui-active": { color: "primary.main" },
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
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
            </Box>
          </Paper>

          {/* Step Content */}
          <Paper
            sx={{
              p: 4,
              mb: 3,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
            }}
          >
            {renderStepContent(activeStep)}
          </Paper>

          {/* Ask Huddle Floating Button - Only show on analysis step */}
          {activeStep === 1 && (
            <Tooltip
              title="Get AI assistance with analysis"
              placement="left"
              arrow
            >
              <Button
                onClick={handleOpenAskHuddle}
                variant="contained"
                startIcon={<AIIcon />}
                sx={{
                  position: "fixed",
                  right: 24,
                  bottom: 24,
                  zIndex: 1200,
                  borderRadius: 3,
                  background:
                    "linear-gradient(45deg, #6bc330 30%, #4ca020 90%)",
                  boxShadow: "0 4px 20px 0 rgba(107, 195, 48, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #5cb130 30%, #3d9010 90%)",
                    boxShadow: "0 6px 25px 0 rgba(107, 195, 48, 0.4)",
                  },
                }}
              >
                Ask Huddle AI
              </Button>
            </Tooltip>
          )}

          {/* Navigation Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
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

            <Box sx={{ display: "flex", gap: 2 }}>
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
                sx={{
                  minWidth: 140,
                  background:
                    activeStep === STEPS.length - 1
                      ? "linear-gradient(45deg, #2E7D32 30%, #4CAF50 90%)"
                      : undefined,
                }}
              >
                {activeStep === STEPS.length - 1
                  ? isCreating
                    ? "Creating..."
                    : "Create Prediction"
                  : "Next"}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Ask Huddle Side Drawer */}
        <AskHuddle open={askHuddleOpen} onClose={handleCloseAskHuddle} />

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </FormProvider>
  );
};

// Step Components
interface MatchSelectionStepProps {
  sports: Sport[];
  leagues: League[];
  leaguesWithFixtures: (League & { fixtureCount?: number })[];
  fixtures: Fixture[];
  sportsLoading: boolean;
  leaguesLoading: boolean;
  leaguesWithFixturesLoading: boolean;
  fixturesLoading: boolean;
  onSportChange: (sportId: string) => void;
  onLeagueChange: (leagueId: string) => void;
  onLeagueWithFixturesChange: (leagueId: string) => void;
  onFixtureChange: (fixtureId: string) => void;
  errors: FieldErrors<SportsPredictionFormValues>;
  sportId: string;
  leagueId: string;
  leagueWithFixturesId: string;
  fixtureId: string;
  isPremium: boolean;
  methods: UseFormReturn<SportsPredictionFormValues>;
}

const MatchSelectionStep: React.FC<MatchSelectionStepProps> = ({
  sports,
  leagues,
  leaguesWithFixtures,
  fixtures,
  sportsLoading,
  leaguesLoading,
  leaguesWithFixturesLoading,
  fixturesLoading,
  onSportChange,
  onLeagueChange,
  onLeagueWithFixturesChange,
  onFixtureChange,
  errors,
  sportId,
  leagueId,
  leagueWithFixturesId,
  fixtureId,
  isPremium,
  methods,
}) => {
  const { setValue } = methods;
  const effectiveLeagueId = leagueWithFixturesId || leagueId;

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
            loading={sportsLoading}
          />
        </FormControl>

        {/* All Leagues Selection */}
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
            disabled={!sportId || leaguesLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="All Leagues"
                error={!!errors.leagueId}
                helperText={
                  errors.leagueId?.message || "Browse all available leagues"
                }
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {leaguesLoading && <CircularProgress size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            noOptionsText={
              leaguesLoading ? "Loading..." : "No leagues available"
            }
          />
        </FormControl>

        {/* OR Divider */}
        {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Divider sx={{ flex: 1 }} />
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
          <Divider sx={{ flex: 1 }} />
        </Box> */}

        {/* Leagues With Fixtures (New Field) */}
        <FormControl fullWidth>
          <Autocomplete
            options={leaguesWithFixtures}
            getOptionLabel={(option: League & { fixtureCount?: number }) =>
              `${option.name} ${
                option.fixtureCount ? `(${option.fixtureCount} fixtures)` : ""
              }`
            }
            value={
              leaguesWithFixtures.find(
                (league) => String(league.id) === leagueWithFixturesId
              ) || null
            }
            onChange={(_, newValue) => {
              onLeagueWithFixturesChange(newValue ? String(newValue.id) : "");
            }}
            disabled={!sportId || leaguesWithFixturesLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Available Leagues With Upcoming Fixtures"
                helperText="Only shows leagues with upcoming matches"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {leaguesWithFixturesLoading && (
                        <CircularProgress size={20} />
                      )}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            noOptionsText={
              leaguesWithFixturesLoading
                ? "Checking for fixtures..."
                : "No leagues with fixtures found"
            }
          />
        </FormControl>

        {/* Fixture Selection */}
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
            disabled={!effectiveLeagueId || fixturesLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Fixture *"
                error={!!errors.fixtureId}
                helperText={
                  fixturesLoading
                    ? "Loading fixtures..."
                    : errors.fixtureId?.message ||
                      (fixtures.length === 0 && effectiveLeagueId
                        ? "No upcoming fixtures found for this league"
                        : "Select the specific match")
                }
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {fixturesLoading && <CircularProgress size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            noOptionsText={
              fixturesLoading ? "Loading..." : "No fixtures available"
            }
          />
        </FormControl>
      </Box>

      {/* League Selection Info Card */}
      {(leagueId || leagueWithFixturesId) && (
        <Card
          sx={{
            mt: 2,
            border: "1px solid",
            borderColor: "info.light",
            bgcolor: "info.50",
          }}
        >
          <CardContent>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              {leagueWithFixturesId ? (
                <>
                  <CheckIcon fontSize="small" color="success" />
                  <span>League with Confirmed Fixtures Selected</span>
                </>
              ) : (
                <>
                  <WarningIcon fontSize="small" color="warning" />
                  <span>General League Selected</span>
                </>
              )}
            </Typography>
            <Typography variant="body2">
              {leagueWithFixturesId
                ? "✓ This league has confirmed upcoming fixtures"
                : "⚠ Fixtures may not be available for this league"}
            </Typography>
            {leagueWithFixturesId &&
              leaguesWithFixtures.find(
                (l) => String(l.id) === leagueWithFixturesId
              )?.fixtureCount && (
                <Typography variant="caption" color="text.secondary">
                  {
                    leaguesWithFixtures.find(
                      (l) => String(l.id) === leagueWithFixturesId
                    )?.fixtureCount
                  }{" "}
                  upcoming fixtures available
                </Typography>
              )}
          </CardContent>
        </Card>
      )}

      {/* Selected Match Preview */}
      {fixtureId && (
        <Card
          sx={{
            mt: 3,
            border: "1px solid",
            borderColor: "primary.light",
            bgcolor: "primary.50",
          }}
        >
          <CardContent>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <SportsSoccerIcon fontSize="small" />
              Selected Match
            </Typography>
            {fixturesLoading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                  onChange={(e) => setValue("isPremium", e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle1">
                    Premium Prediction
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {isPremium
                      ? "This prediction will be available to premium users only"
                      : "This prediction will be available to all users"}
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

interface PredictionAnalysisStepProps {
  predictionTypes: PredictionTypeOption[];
  picks: Array<
    { id: string } & {
      market: string;
      selectionKey: string;
      confidence: number;
    }
  >;
  onAddPick: () => void;
  onRemovePick: (index: number) => void;
  onPickChange: (
    index: number,
    field: keyof { market: string; selectionKey: string; confidence: number },
    value: string | number
  ) => void;
  errors: FieldErrors<SportsPredictionFormValues>;
  analysis: string;
  accuracy: number;
  methods: UseFormReturn<SportsPredictionFormValues>;
  onOpenAskHuddle: () => void;
}

const PredictionAnalysisStep: React.FC<PredictionAnalysisStepProps> = ({
  predictionTypes,
  picks,
  onAddPick,
  onRemovePick,
  onPickChange,
  errors,
  analysis,
  accuracy,
  methods,
  onOpenAskHuddle,
}) => {
  const { setValue } = methods;

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

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Analysis Textarea with AI Assistance Button */}
        <Box sx={{ position: "relative" }}>
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Detailed Analysis *"
            value={analysis}
            onChange={(e) => setValue("analysis", e.target.value)}
            error={!!errors.analysis}
            helperText={
              errors.analysis?.message ||
              `Provide detailed analysis for this prediction (${analysis.length}/3000 characters)`
            }
            placeholder="Enter your detailed match analysis, including team form, key players, statistics, and reasoning behind your predictions..."
            variant="outlined"
          />
          <Button
            onClick={onOpenAskHuddle}
            variant="outlined"
            size="small"
            startIcon={<AIIcon />}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "white",
              border: "1px solid",
              borderColor: "primary.main",
              color: "primary.main",
              "&:hover": {
                background: "primary.light",
                color: "white",
              },
            }}
          >
            AI Assist
          </Button>
        </Box>

        {/* Accuracy Input */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <TextField
            fullWidth
            type="number"
            label="Confidence Accuracy *"
            value={accuracy}
            onChange={(e) => setValue("accuracy", Number(e.target.value))}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
              inputProps: { min: 0, max: 100 },
            }}
            error={!!errors.accuracy}
            helperText={
              errors.accuracy?.message ||
              "Your confidence level in this prediction (0-100%)"
            }
          />
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Prediction Picks Section */}
      <Box>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <TrendingUpIcon color="primary" />
          Prediction Picks
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Add specific market predictions with your selections and confidence
          levels
        </Typography>

        {picks.map((pick, index) => (
          <PredictionMarket
            key={pick.id}
            pick={pick}
            index={index}
            predictionTypes={predictionTypes}
            onPickChange={onPickChange}
            onRemovePick={onRemovePick}
            showDeleteButton={picks.length > 1}
          />
        ))}

        <Button
          variant="outlined"
          onClick={onAddPick}
          startIcon={<AddIcon />}
          sx={{ mt: 2 }}
        >
          Add Another Pick
        </Button>
      </Box>
    </Box>
  );
};

interface PredictionMarketProps {
  pick: { market: string; selectionKey: string; confidence: number };
  index: number;
  predictionTypes: PredictionTypeOption[];
  onPickChange: (
    index: number,
    field: keyof { market: string; selectionKey: string; confidence: number },
    value: string | number
  ) => void;
  onRemovePick: (index: number) => void;
  showDeleteButton: boolean;
}

const PredictionMarket: React.FC<PredictionMarketProps> = ({
  pick,
  index,
  predictionTypes,
  onPickChange,
  onRemovePick,
  showDeleteButton,
}) => {
  return (
    <Card sx={{ mb: 2, p: 2, border: "1px solid", borderColor: "grey.200" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            label={`Pick #${index + 1}`}
            color="primary"
            variant="outlined"
            size="small"
          />
        </Box>
        {showDeleteButton && (
          <IconButton
            onClick={() => onRemovePick(index)}
            color="error"
            size="small"
            sx={{ border: "1px solid", borderColor: "error.light" }}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Market Selection */}
        <FormControl fullWidth>
          <InputLabel>Market Type *</InputLabel>
          <Select
            value={pick.market}
            onChange={(e) => onPickChange(index, "market", e.target.value)}
            label="Market Type *"
          >
            <MenuItem value="">Select market</MenuItem>
            {predictionTypes.map((type: PredictionTypeOption) => (
              <MenuItem key={type.id} value={type.name}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Selection Input */}
        <TextField
          fullWidth
          label="Your Selection *"
          value={pick.selectionKey}
          onChange={(e) => onPickChange(index, "selectionKey", e.target.value)}
          placeholder="e.g., Home Win, Over 2.5 Goals, etc."
        />

        {/* Confidence Input */}
        <TextField
          fullWidth
          type="number"
          label="Confidence Level *"
          value={pick.confidence}
          onChange={(e) =>
            onPickChange(index, "confidence", Number(e.target.value))
          }
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
            inputProps: { min: 0, max: 100 },
          }}
          helperText="Your confidence in this specific pick"
        />
      </Box>
    </Card>
  );
};

interface SubmissionPreviewStepProps {
  fixture: Fixture | null;
  isPremium: boolean;
  analysis: string;
  accuracy: number;
  picks: Array<{ market: string; selectionKey: string; confidence: number }>;
}

const SubmissionPreviewStep: React.FC<SubmissionPreviewStepProps> = ({
  fixture,
  isPremium,
  analysis,
  accuracy,
  picks,
}) => {
  return (
    <Box>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
      >
        <PreviewIcon color="primary" />
        Review & Submit
      </Typography>

      {/* Match Details Card */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <SportsSoccerIcon fontSize="small" />
            Match Details
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography>
              <strong>Fixture:</strong> {fixture?.label || "N/A"}
            </Typography>
            <Typography>
              <strong>Kickoff:</strong>{" "}
              {fixture?.kickoffUtc
                ? new Date(fixture.kickoffUtc).toLocaleString()
                : "N/A"}
            </Typography>
            <Typography>
              <strong>Type:</strong>
              <Chip
                label={isPremium ? "Premium" : "Free"}
                color={isPremium ? "primary" : "default"}
                size="small"
                sx={{ ml: 1 }}
              />
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Analysis Card */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <AnalyticsIcon fontSize="small" />
            Analysis
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, whiteSpace: "pre-wrap" }}>
            {analysis || "No analysis provided"}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TrendingUpIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Accuracy: <strong>{accuracy}%</strong>
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Prediction Picks */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1, mt: 3 }}
      >
        <TrendingUpIcon fontSize="small" />
        Prediction Picks
      </Typography>

      {picks.map((pick, index) => (
        <Card key={index} sx={{ mb: 1, p: 2 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 1,
              }}
            >
              <Typography variant="subtitle2">Pick #{index + 1}</Typography>
              <Chip
                label={`${pick.confidence}% confidence`}
                color="primary"
                variant="outlined"
                size="small"
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography>
                <strong>Market:</strong> {pick.market}
              </Typography>
              <Typography>
                <strong>Selection:</strong> {pick.selectionKey}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default PredictionForm;
