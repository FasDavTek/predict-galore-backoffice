// features/components/PredictionForm/PredictionForm.tsx
import React, { useCallback, useMemo, useState } from "react";
import {
  useForm,
  FormProvider,
  useFieldArray,
  SubmitHandler,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Material-UI imports
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
  Tooltip,
} from "@mui/material";
import {
  Home as HomeIcon,
  Check as CheckIcon,
  NavigateBefore as NavigateBeforeIcon,
  ChevronRight as ChevronRightIcon,
  SmartToy as AIIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";

// Date picker imports
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// Types and schemas
import {
  sportsPredictionFormSchema,
  SportsPredictionFormValues,
} from "../validations/predictionSchema";
import {
  useCreatePredictionMutation,
  useGetSportsQuery,
  useGetLeaguesQuery,
  useGetUpcomingFixturesQuery,
  useGetPredictionTypesQuery,
} from "../api/predictionApi";
import { League, Fixture } from "../types/prediction.types";

// Step Components
import { MatchSelectionStep } from "./PredictionForm/steps/MatchSelectionStep";
import { PredictionAnalysisStep } from "./PredictionForm/steps/PredictionAnalysisStep";
import { SubmissionPreviewStep } from "./PredictionForm/steps/SubmissionPreviewStep";

// AI Component
import { AskHuddle } from "./AskHuddle";

// Utilities
import { formatDateForAPI } from "../utils/dateUtils";

// Constants
const STEPS = [
  "Match Selection",
  "Prediction Analysis",
  "Review & Submit",
] as const;

interface PredictionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error";
}

/**
 * Main Prediction Form Component
 * Handles multi-step prediction creation with form validation and API integration
 */
export const PredictionForm: React.FC<PredictionFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });
  const [isAskHuddleOpen, setIsAskHuddleOpen] = useState<boolean>(false);
  const [fixtureFromDate, setFixtureFromDate] = useState<Date | null>(
    new Date()
  );

  // API Mutations
  const [createPrediction, { isLoading: isCreating }] =
    useCreatePredictionMutation();

  // Form setup
  const formMethods = useForm<SportsPredictionFormValues>({
    resolver: zodResolver(sportsPredictionFormSchema),
    defaultValues: {
      sportId: "",
      leagueId: "",
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
    reset,
    formState: { errors },
  } = formMethods;

  const { fields, append, remove } = useFieldArray({
    control: formMethods.control,
    name: "picks",
  });

  // Form watchers
  const [sportId, leagueId, fixtureId, isPremium, analysis, accuracy, picks] =
    useWatch({
      control,
      name: [
        "sportId",
        "leagueId",
        "fixtureId",
        "isPremium",
        "analysis",
        "accuracy",
        "picks",
      ],
    });

  // API Queries
  const { data: sportsData, isLoading: isSportsLoading } = useGetSportsQuery(
    {}
  );
  const { data: leaguesData, isLoading: isLeaguesLoading } = useGetLeaguesQuery(
    { sportId: Number(sportId) },
    { skip: !sportId }
  );

  const formattedFromDate = useMemo(
    () => formatDateForAPI(fixtureFromDate || new Date()),
    [fixtureFromDate]
  );

  const { data: fixturesData, isLoading: isFixturesLoading } =
    useGetUpcomingFixturesQuery(
      {
        leagueId: Number(leagueId),
        from: formattedFromDate,
      },
      { skip: !leagueId }
    );

  const { data: predictionTypesData } = useGetPredictionTypesQuery();

  // Memoized data transformations
  const sports = useMemo(() => sportsData?.data || [], [sportsData?.data]);
  const leagues = useMemo(() => leaguesData?.data || [], [leaguesData?.data]);
  const fixtures = useMemo(
    () => fixturesData?.data || [],
    [fixturesData?.data]
  );
  const predictionTypes = useMemo(
    () => predictionTypesData?.data || [],
    [predictionTypesData?.data]
  );

  const filteredLeagues = useMemo(
    () =>
      leagues.filter((league: League) => String(league.sportId) === sportId),
    [leagues, sportId]
  );

  const selectedFixture = useMemo(
    () =>
      fixtures.find((fixture: Fixture) => String(fixture.id) === fixtureId) ||
      null,
    [fixtures, fixtureId]
  );

  // Event handlers
  const handleSportChange = useCallback(
    (selectedSportId: string) => {
      setValue("sportId", selectedSportId);
      setValue("leagueId", "");
      setValue("fixtureId", "");
    },
    [setValue]
  );

  const handleLeagueChange = useCallback(
    (selectedLeagueId: string) => {
      setValue("leagueId", selectedLeagueId);
      setValue("fixtureId", "");
    },
    [setValue]
  );

  const handleFixtureChange = useCallback(
    (selectedFixtureId: string) => {
      setValue("fixtureId", selectedFixtureId);
    },
    [setValue]
  );

  const handleDateChange = useCallback(
    (newDate: Date | null) => {
      setFixtureFromDate(newDate);
      setValue("fixtureId", "");
    },
    [setValue]
  );

  const handleAddPick = useCallback(() => {
    append({ market: "", selectionKey: "", confidence: 70 });
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
      const currentPicks = formMethods.getValues("picks");
      const updatedPicks = [...currentPicks];
      updatedPicks[index] = { ...updatedPicks[index], [field]: value };
      setValue("picks", updatedPicks);
    },
    [formMethods, setValue]
  );
  // Navigation handlers
  const handleBack = () => {
    setActiveStep((prev) => Math.max(0, prev - 1));
  };

  const handleNext = async () => {
    const stepFields = {
      0: ["sportId", "leagueId", "fixtureId"],
      1: ["analysis", "accuracy", "picks"],
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

  // Form submission
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
        reset();
        setActiveStep(0);
        setFixtureFromDate(new Date());
      }, 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to create prediction",
        severity: "error",
      });
      console.log(error);
    }
  };

  const handleConfirmSubmit = handleSubmit(onSubmit);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleOpenAskHuddle = () => setIsAskHuddleOpen(true);
  const handleCloseAskHuddle = () => setIsAskHuddleOpen(false);

  // Validation helpers
  const isStepValid = (step: number): boolean => {
    const stepValidations = {
      0: !!sportId && !!leagueId && !!fixtureId,
      1:
        !!analysis &&
        picks.every(
          (pick) => pick.market && pick.selectionKey && pick.confidence > 0
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
          predictionTypes={predictionTypes}
          picks={fields}
          onAddPick={handleAddPick}
          onRemovePick={handleRemovePick}
          onPickChange={handlePickChange}
          errors={errors}
          formValues={{ analysis, accuracy }}
          methods={formMethods}
          onOpenAskHuddle={handleOpenAskHuddle}
        />
      ),
      2: (
        <SubmissionPreviewStep
          fixture={selectedFixture}
          isPremium={isPremium}
          analysis={analysis}
          accuracy={accuracy}
          picks={picks}
          fixtureFromDate={fixtureFromDate}
        />
      ),
    };

    return stepComponents[step as keyof typeof stepComponents] || null;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormProvider {...formMethods}>
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
            {/* Header Section */}
            <HeaderSection />

            {/* Progress Stepper */}
            <ProgressStepper
              activeStep={activeStep}
              steps={STEPS}
              isStepValid={isStepValid(activeStep)}
            />

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

            {/* AI Assistance Button */}
            {activeStep === 1 && (
              <AIAssistanceButton onClick={handleOpenAskHuddle} />
            )}

            {/* Navigation Buttons */}
            <NavigationButtons
              activeStep={activeStep}
              totalSteps={STEPS.length}
              onBack={handleBack}
              onNext={handleNext}
              onCancel={onCancel}
              isCreating={isCreating}
              isStepValid={isStepValid(activeStep)}
            />
          </Box>

          {/* AI Assistance Drawer */}
          <AskHuddle
            open={isAskHuddleOpen}
            onClose={handleCloseAskHuddle}
            // disableBackdropClick={true}
            //   disableEscapeKeyDown={true}
          />

          {/* Notification Snackbar */}
          <NotificationSnackbar
            snackbar={snackbar}
            onClose={handleCloseSnackbar}
          />
        </Box>
      </FormProvider>
    </LocalizationProvider>
  );
};

// Sub-components for better organization
const HeaderSection: React.FC = () => (
  <Box sx={{ mb: 4 }}>
    <Breadcrumbs sx={{ mb: 2 }}>
      <Link
        color="inherit"
        href="/predictions"
        sx={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          "&:hover": { textDecoration: "underline" },
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
);

interface ProgressStepperProps {
  activeStep: number;
  steps: readonly string[];
  isStepValid: boolean;
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({
  activeStep,
  steps,
  isStepValid,
}) => (
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
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
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
        Step {activeStep + 1} of {steps.length}
      </Typography>
      {isStepValid && (
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
);

interface NavigationButtonsProps {
  activeStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onCancel?: () => void;
  isCreating: boolean;
  isStepValid: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  activeStep,
  totalSteps,
  onBack,
  onNext,
  onCancel,
  isCreating,
  isStepValid,
}) => (
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
      onClick={onBack}
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
        onClick={onNext}
        disabled={!isStepValid || isCreating}
        size="large"
        endIcon={
          isCreating ? (
            <CircularProgress size={20} />
          ) : activeStep === totalSteps - 1 ? (
            <TrendingUpIcon />
          ) : (
            <ChevronRightIcon />
          )
        }
        sx={{
          minWidth: 140,
          background:
            activeStep === totalSteps - 1
              ? "linear-gradient(45deg, #2E7D32 30%, #4CAF50 90%)"
              : undefined,
        }}
      >
        {activeStep === totalSteps - 1
          ? isCreating
            ? "Creating..."
            : "Create Prediction"
          : "Next"}
      </Button>
    </Box>
  </Box>
);

interface AIAssistanceButtonProps {
  onClick: () => void;
}

const AIAssistanceButton: React.FC<AIAssistanceButtonProps> = ({ onClick }) => (
  <Tooltip title="Get AI assistance with analysis" placement="left" arrow>
    <Button
      onClick={onClick}
      variant="contained"
      startIcon={<AIIcon />}
      sx={{
        position: "fixed",
        right: 24,
        bottom: 24,
        zIndex: 1200,
        borderRadius: 3,
        background: "linear-gradient(45deg, #6bc330 30%, #4ca020 90%)",
        boxShadow: "0 4px 20px 0 rgba(107, 195, 48, 0.3)",
        "&:hover": {
          background: "linear-gradient(45deg, #5cb130 30%, #3d9010 90%)",
          boxShadow: "0 6px 25px 0 rgba(107, 195, 48, 0.4)",
        },
      }}
    >
      Ask Huddle AI
    </Button>
  </Tooltip>
);

interface NotificationSnackbarProps {
  snackbar: SnackbarState;
  onClose: () => void;
}

const NotificationSnackbar: React.FC<NotificationSnackbarProps> = ({
  snackbar,
  onClose,
}) => (
  <Snackbar
    open={snackbar.open}
    autoHideDuration={6000}
    onClose={onClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
  >
    <Alert
      onClose={onClose}
      severity={snackbar.severity}
      sx={{ width: "100%" }}
    >
      {snackbar.message}
    </Alert>
  </Snackbar>
);

export default PredictionForm;
