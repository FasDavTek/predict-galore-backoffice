import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { createPrediction } from "@/store/slices/predictionSlice";

// Material-UI Components
import {
  Box,
  Typography,
  Button,
  Breadcrumbs,
  Link,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Card,
  CardContent,
  FormGroup,
  FormControlLabel,
  Switch,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";

import {
  Home as HomeIcon,
  Schedule as ScheduleIcon,
  SportsSoccer as SportsSoccerIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  HelpOutline as HelpOutlineIcon,
  Event as EventIcon,
  EmojiEvents as EmojiEventsIcon,
  WorkspacePremium as WorkspacePremiumIcon,
  Public as PublicIcon,
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarTodayIcon,
  Label as LabelIcon,
  TipsAndUpdates as TipsAndUpdatesIcon,
  LocalOffer as LocalOfferIcon,
  Lightbulb as LightbulbIcon,
  AttachMoney as AttachMoneyIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";

import StackedLineChartIcon from "@mui/icons-material/StackedLineChart";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { useAuth } from "@/context/AuthContext";

import AskHuddle from "../common/AskHuddle";

// Constants
const STEPS = ["Match Selection", "Prediction Details", "Preview"];

// Mock Data
const MATCHES = [
  { id: 1, home: "Team A", away: "Team B", competitionId: 1 },
  { id: 2, home: "Team C", away: "Team D", competitionId: 1 },
  { id: 3, home: "Team E", away: "Team F", competitionId: 2 },
];

const COMPETITIONS = [
  { id: 1, name: "Premier League" },
  { id: 2, name: "Champions League" },
];

const PREDICTION_TYPES = [
  { id: 1, name: "Match Winner", values: ["1", "X", "2"] },
  {
    id: 2,
    name: "Over/Under",
    values: ["Over 1.5", "Over 2.5", "Under 1.5", "Under 2.5"],
  },
  { id: 3, name: "Both Teams to Score", values: ["Yes", "No"] },
  { id: 4, name: "Double Chance", values: ["1X", "12", "X2"] },
  {
    id: 5,
    name: "Correct Score",
    values: ["1-0", "2-0", "2-1", "0-0", "1-1", "2-2"],
  },
];

// Validation Schema
const validationSchema = Yup.object().shape({
  matchId: Yup.number().required("Match is required").min(1, "Select a match"),
  isPremium: Yup.boolean().default(false),
  isScheduled: Yup.boolean().default(false),
  scheduledTime: Yup.mixed()
    .nullable()
    .test(
      "scheduled-time-validation",
      "Scheduled time must be in the future",
      function (value) {
        // Only validate if isScheduled is true and value exists
        if (this.parent.isScheduled && value) {
          return value > new Date();
        }
        return true;
      }
    ),
  competitionId: Yup.number()
    .required("Competition is required")
    .min(1, "Select a competition"),
  expertAnalysis: Yup.string()
    .required("Expert analysis is required")
    .max(3000, "Maximum 3000 characters allowed"),
  confidencePercentage: Yup.number()
    .min(0, "Minimum 0%")
    .max(100, "Maximum 100%")
    .required("Confidence percentage is required"),
  values: Yup.array()
    .of(
      Yup.object().shape({
        predictionTypeId: Yup.number()
          .required("Prediction type is required")
          .min(1, "Select type"),
        value: Yup.string().required("Value required"),
        label: Yup.string(),
        tip: Yup.string().max(200, "Maximum 200 characters allowed"),
        odds: Yup.number()
          .min(0, "Minimum odds is 0")
          .required("Odds are required"),
        confidence: Yup.number()
          .min(0, "Minimum 0%")
          .max(100, "Maximum 100%")
          .required("Confidence is required"),
      })
    )
    .min(1, "At least one prediction required"),
});

const NewPredictionForm = ({ onBack }) => {
  const dispatch = useDispatch();
  const { token } = useAuth();
  //  console.log(
  //   "Token:", token
  //  )

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error', or null
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      matchId: 0,
      isPremium: false,
      isScheduled: false,
      scheduledTime: null,
      competitionId: 0,
      expertAnalysis: "",
      confidencePercentage: 50,
      values: [
        {
          predictionTypeId: 0,
          value: "",
          label: "",
          tip: "",
          odds: 2.0,
          confidence: 70,
        },
      ],
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setLoading(true);
        setSubmissionStatus(null);
        setOpenConfirmDialog(true); // Keep dialog open to show progress

        // Prepare the submission data with all required fields
        const submissionData = {
          matchId: values.matchId,
          isPremium: values.isPremium,
          isScheduled: values.isScheduled,
          scheduledTime: values.isScheduled ? values.scheduledTime : null,
          competitionId: values.competitionId,
          expertAnalysis: values.expertAnalysis,
          confidencePercentage: values.confidencePercentage,
          values: values.values.map((value) => ({
            predictionTypeId: value.predictionTypeId,
            value: value.value,
            label: value.label || "", // Ensure empty string if label is null
            tip: value.tip || "", // Ensure empty string if tip is null
            odds: Number(value.odds),
            confidence: Number(value.confidence),
          })),
        };

        console.log("Submitting data:", submissionData); // Debug log

        await dispatch(
          createPrediction({
            data: submissionData,
            token,
          })
        ).unwrap();

        setSubmissionStatus("success");
        setSnackbar({
          open: true,
          message: "Prediction created successfully!",
          severity: "success",
        });

        setTimeout(() => {
          setOpenConfirmDialog(false);
          onBack();
        }, 1500);
      } catch (error) {
        console.error("Submission failed:", error);
        setSubmissionStatus("error");
        setSnackbar({
          open: true,
          message: error.message || "Failed to create prediction",
          severity: "error",
        });
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  // Navigation handlers
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleNext = async () => {
    // Step-specific field validation
    const stepFields = {
      0: ["matchId", "competitionId"],
      1: ["expertAnalysis", "confidencePercentage", "values"],
    };

    if (stepFields[activeStep]) {
      const errors = await formik.validateForm();
      const stepErrors = stepFields[activeStep].some((field) => {
        if (field === "values") {
          return formik.values.values.some(
            (v) => !v.predictionTypeId || !v.value || !v.odds || !v.confidence
          );
        }
        return errors[field];
      });

      if (stepErrors) {
        const firstErrorField = stepFields[activeStep].find((field) => {
          if (field === "values") {
            return formik.values.values.some(
              (v) => !v.predictionTypeId || !v.value || !v.odds || !v.confidence
            );
          }
          return errors[field];
        });

        document.querySelector(`[name="${firstErrorField}"]`)?.focus();
        return;
      }
    }

    if (activeStep === STEPS.length - 1) {
      setOpenConfirmDialog(true);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  // Helper functions
  const getPredictionValues = (typeId) => {
    return PREDICTION_TYPES.find((t) => t.id === typeId)?.values || [];
  };

  const addPredictionValue = () => {
    formik.setFieldValue("values", [
      ...formik.values.values,
      {
        predictionTypeId: 0,
        value: "",
        label: "",
        tip: "",
        odds: 2.0,
        confidence: 70,
      },
    ]);
  };

  const removePredictionValue = (index) => {
    formik.setFieldValue(
      "values",
      formik.values.values.filter((_, i) => i !== index)
    );
  };

  const handlePredictionValueChange = (index, field, value) => {
    const newValues = [...formik.values.values];
    newValues[index] = { ...newValues[index], [field]: value };
    formik.setFieldValue("values", newValues);
  };

  // Get match details by ID
  const getMatchDetails = (matchId) =>
    MATCHES.find((m) => m.id === matchId) || {};

  const getCompetitionDetails = (competitionId) =>
    COMPETITIONS.find((c) => c.id === competitionId) || {};

  const getPredictionTypeDetails = (typeId) =>
    PREDICTION_TYPES.find((t) => t.id === typeId) || {};

  // Step content rendering
  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Match selection step
        return (
          <Paper sx={{ p: 3, mb: 3, width: "100%", maxWidth: 800 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* section header */}
              <Typography variant="h6" gutterBottom>
                Match Information
              </Typography>

              {/* Competition selection */}
              <FormControl
                fullWidth
                error={
                  formik.touched.competitionId && !!formik.errors.competitionId
                }
                sx={{ mb: 4 }}
              >
                <InputLabel>Competition</InputLabel>
                <Select
                  name="competitionId"
                  value={formik.values.competitionId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Competition *"
                >
                  <MenuItem value={0} disabled>
                    Select competition
                  </MenuItem>
                  {COMPETITIONS.map((comp) => (
                    <MenuItem key={comp.id} value={comp.id}>
                      {comp.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.competitionId &&
                  formik.errors.competitionId && (
                    <Typography color="error" variant="caption">
                      {formik.errors.competitionId}
                    </Typography>
                  )}
              </FormControl>

              {/* Match selection */}
              <FormControl
                fullWidth
                error={formik.touched.matchId && !!formik.errors.matchId}
                sx={{ mb: 2 }}
              >
                <InputLabel>Match</InputLabel>
                <Select
                  name="matchId"
                  value={formik.values.matchId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Match *"
                >
                  <MenuItem value={0} disabled>
                    Select match
                  </MenuItem>
                  {MATCHES.filter(
                    (m) =>
                      formik.values.competitionId === 0 ||
                      m.competitionId === formik.values.competitionId
                  ).map((match) => (
                    <MenuItem key={match.id} value={match.id}>
                      {`${match.home} vs ${match.away}`}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.matchId && formik.errors.matchId && (
                  <Typography color="error" variant="caption">
                    {formik.errors.matchId}
                  </Typography>
                )}
              </FormControl>

              {/* Premium toggle */}
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.isPremium}
                      onChange={formik.handleChange}
                      name="isPremium"
                      color="primary"
                    />
                  }
                  label="Premium Prediction"
                  labelPlacement="start"
                />
              </FormGroup>
            </Box>
          </Paper>
        );

      case 1: // Prediction details step
        return (
          <Paper sx={{ p: 3, mb: 3, width: "100%", maxWidth: 800 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* section Header */}
              <Typography variant="h6" gutterBottom>
                Prediction Details
              </Typography>

              {/* Expert analysis and confidence percentage */}
              <Paper sx={{ p: 3, mb: 3, width: "100%", maxWidth: 800 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {/* Expert analysis */}
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Expert Analysis"
                    name="expertAnalysis"
                    value={formik.values.expertAnalysis}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.expertAnalysis &&
                      !!formik.errors.expertAnalysis
                    }
                    helperText={
                      formik.errors.expertAnalysis ||
                      `${formik.values.expertAnalysis.length}/3000 characters`
                    }
                    inputProps={{ maxLength: 3000 }}
                  />

                  {/* Confidence percentage */}
                  <TextField
                    fullWidth
                    type="number"
                    label="Confidence %"
                    name="confidencePercentage"
                    value={formik.values.confidencePercentage}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                      inputProps: { min: 0, max: 100, step: 1 },
                    }}
                    error={
                      formik.touched.confidencePercentage &&
                      !!formik.errors.confidencePercentage
                    }
                    helperText={formik.errors.confidencePercentage}
                  />
                </Box>
              </Paper>

              {/* prediction specifics */}
              <Paper sx={{ p: 3, mb: 3, width: "100%", maxWidth: 800 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {/* Prediction values */}
                  {formik.values.values.map((value, index) => (
                    <Box
                      key={index}
                      sx={{ borderBottom: "1px solid #eee", pb: 3 }}
                    >
                      {/* Header with delete button */}
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                      >
                        <Typography variant="subtitle1">
                          Prediction #{index + 1}
                        </Typography>
                        {index > 0 && (
                          <IconButton
                            onClick={() => removePredictionValue(index)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>

                      {/* Prediction type */}
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.values?.[index]?.predictionTypeId &&
                          !!formik.errors.values?.[index]?.predictionTypeId
                        }
                        sx={{ mb: 4 }}
                      >
                        <InputLabel>Prediction Type *</InputLabel>
                        <Select
                          name={`values[${index}].predictionTypeId`}
                          value={value.predictionTypeId}
                          onChange={(e) =>
                            handlePredictionValueChange(
                              index,
                              "predictionTypeId",
                              e.target.value
                            )
                          }
                          onBlur={formik.handleBlur}
                          label="Prediction Type *"
                        >
                          <MenuItem value={0} disabled>
                            Select type
                          </MenuItem>
                          {PREDICTION_TYPES.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                              {type.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {formik.errors.values?.[index]?.predictionTypeId && (
                          <Typography color="error" variant="caption">
                            {formik.errors.values[index].predictionTypeId}
                          </Typography>
                        )}
                      </FormControl>

                      {/* Prediction value */}
                      {value.predictionTypeId > 0 && (
                        <FormControl
                          fullWidth
                          error={
                            formik.touched.values?.[index]?.value &&
                            !!formik.errors.values?.[index]?.value
                          }
                          sx={{ mb: 4 }}
                        >
                          <InputLabel>Prediction Value *</InputLabel>
                          <Select
                            name={`values[${index}].value`}
                            value={value.value}
                            onChange={(e) =>
                              handlePredictionValueChange(
                                index,
                                "value",
                                e.target.value
                              )
                            }
                            onBlur={formik.handleBlur}
                            label="Prediction Value *"
                          >
                            <MenuItem value="" disabled>
                              Select value
                            </MenuItem>
                            {getPredictionValues(value.predictionTypeId).map(
                              (val) => (
                                <MenuItem key={val} value={val}>
                                  {val}
                                </MenuItem>
                              )
                            )}
                          </Select>
                          {formik.errors.values?.[index]?.value && (
                            <Typography color="error" variant="caption">
                              {formik.errors.values[index].value}
                            </Typography>
                          )}
                        </FormControl>
                      )}

                      {/* Label */}
                      <TextField
                        fullWidth
                        label="Label (Optional)"
                        name={`values[${index}].label`}
                        value={value.label}
                        onChange={(e) =>
                          handlePredictionValueChange(
                            index,
                            "label",
                            e.target.value
                          )
                        }
                        onBlur={formik.handleBlur}
                        sx={{ mb: 4 }}
                      />

                      {/* Tip */}
                      <TextField
                        fullWidth
                        label="Tip (Optional)"
                        name={`values[${index}].tip`}
                        value={value.tip}
                        onChange={(e) =>
                          handlePredictionValueChange(
                            index,
                            "tip",
                            e.target.value
                          )
                        }
                        onBlur={formik.handleBlur}
                        multiline
                        rows={2}
                        error={
                          formik.touched.values?.[index]?.tip &&
                          !!formik.errors.values?.[index]?.tip
                        }
                        helperText={
                          formik.errors.values?.[index]?.tip ||
                          `${value.tip.length}/200 characters`
                        }
                        inputProps={{ maxLength: 200 }}
                        sx={{ mb: 4 }}
                      />

                      {/* Odds and Confidence */}
                      <Box display="flex" gap={4} sx={{ mb: 2 }}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Odds *"
                          name={`values[${index}].odds`}
                          value={value.odds}
                          onChange={(e) =>
                            handlePredictionValueChange(
                              index,
                              "odds",
                              e.target.value
                            )
                          }
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.values?.[index]?.odds &&
                            !!formik.errors.values?.[index]?.odds
                          }
                          helperText={formik.errors.values?.[index]?.odds}
                          InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                        />

                        <TextField
                          fullWidth
                          type="number"
                          label="Confidence *"
                          name={`values[${index}].confidence`}
                          value={value.confidence}
                          onChange={(e) =>
                            handlePredictionValueChange(
                              index,
                              "confidence",
                              e.target.value
                            )
                          }
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.values?.[index]?.confidence &&
                            !!formik.errors.values?.[index]?.confidence
                          }
                          helperText={formik.errors.values?.[index]?.confidence}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">%</InputAdornment>
                            ),
                            inputProps: { min: 0, max: 100, step: 1 },
                          }}
                        />
                      </Box>
                    </Box>
                  ))}

                  {/* Add Prediction Button */}
                  <Button
                    variant="outlined"
                    onClick={addPredictionValue}
                    sx={{
                      alignSelf: "flex-end",
                      width: "fit-content",
                    }}
                    startIcon={<SportsSoccerIcon />}
                  >
                    Add more
                  </Button>
                </Box>
              </Paper>

              {/* Scheduling section  */}
              <Paper sx={{ p: 3, mb: 1, width: "100%", maxWidth: 800 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {/* <Typography variant="subtitle1" gutterBottom>
                  Post Scheduling 
                </Typography> */}
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formik.values.isScheduled}
                          onChange={(e) => {
                            formik.setFieldValue(
                              "isScheduled",
                              e.target.checked
                            );
                            if (!e.target.checked) {
                              formik.setFieldValue("scheduledTime", null);
                            }
                          }}
                          color="primary"
                        />
                      }
                      label="Schedule posting this prediction"
                      labelPlacement="end"
                    />
                  </FormGroup>
                  {formik.values.isScheduled && (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        label="Scheduled Time"
                        value={formik.values.scheduledTime}
                        onChange={(val) =>
                          formik.setFieldValue("scheduledTime", val)
                        }
                        minDateTime={new Date()}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            sx={{ mt: 2 }}
                            error={
                              formik.touched.scheduledTime &&
                              !!formik.errors.scheduledTime
                            }
                            helperText={formik.errors.scheduledTime}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                </Box>
              </Paper>
            </Box>
          </Paper>
        );

      case 2: // Preview step
        const selectedMatch = getMatchDetails(formik.values.matchId);
        const selectedCompetition = getCompetitionDetails(
          formik.values.competitionId
        );

        return (
          <Paper
            sx={{
              p: 3,
              mb: 3,
              width: "100%",
              maxWidth: 800,
              borderRadius: 3,
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Heading */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                }}
              >
                <SportsSoccerIcon color="primary" fontSize="large" />
                <Typography variant="h5" fontWeight="bold">
                  Prediction Preview
                </Typography>
              </Box>

              {/* Match preview */}
              <Card
                sx={{
                  borderLeft: "4px solid",
                  borderLeftColor: "primary.main",
                  borderRadius: 2,
                  mb: 4,
                }}
              >
                <CardContent>
                  {/* header */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 3,
                    }}
                  >
                    <EventIcon color="action" />
                    <Typography variant="subtitle1" fontWeight="bold">
                      Match Information
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 1,
                      mb: 4,
                    }}
                  >
                    <EmojiEventsIcon fontSize="small" color="primary" />
                    <Typography variant="body1">
                      <Box component="span" fontWeight="bold">
                        Competition:
                      </Box>{" "}
                      {selectedCompetition.name || "N/A"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 1,
                      mb: 4,
                    }}
                  >
                    <SportsSoccerIcon fontSize="small" color="primary" />
                    <Typography variant="body1">
                      <Box component="span" fontWeight="bold">
                        Match:
                      </Box>{" "}
                      {selectedMatch.home || "N/A"} vs{" "}
                      {selectedMatch.away || "N/A"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", alignItems: "center", p: 1, gap: 2 }}
                  >
                    {formik.values.isPremium ? (
                      <WorkspacePremiumIcon fontSize="small" color="primary" />
                    ) : (
                      <PublicIcon fontSize="small" color="action" />
                    )}
                    <Typography variant="body1">
                      <Box component="span" fontWeight="bold">
                        Status:
                      </Box>
                      {formik.values.isPremium
                        ? " Premium Prediction"
                        : " Free Prediction"}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Expert analysis preview */}
              <Card
                sx={{
                  borderLeft: "4px solid",
                  borderLeftColor: "secondary.main",
                  borderRadius: 2,
                  mb: 4,
                }}
              >
                <CardContent>
                  {/* Header */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 3,
                    }}
                  >
                    <AnalyticsIcon color="action" />
                    <Typography variant="subtitle1" fontWeight="bold">
                      Analysis
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 1,
                      p: 1,
                      mb: 4,
                    }}
                  >
                    <StackedLineChartIcon color="action" />
                    <Typography variant="body1" whiteSpace="pre-wrap">
                      Expert Analysis:{" "}
                      {formik.values.expertAnalysis || "No analysis provided"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      p: 1,
                    }}
                  >
                    <TrendingUpIcon fontSize="small" color="primary" />
                    <Typography variant="caption" fontWeight="bold">
                      Confidence Level: {formik.values.confidencePercentage}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Predictions specifics */}
              {formik.values.values.map((value, index) => {
                const predictionType = getPredictionTypeDetails(
                  value.predictionTypeId
                );

                return (
                  <Card
                    key={index}
                    sx={{
                      borderRadius: 2,
                      mb: 2,
                      borderLeft: "4px solid",
                      borderLeftColor: "orange",
                    }}
                  >
                    <CardContent>
                      {/* prediction index */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 4,
                        }}
                      >
                        <TipsAndUpdatesIcon fontSize="small" color="primary" />
                        <Typography variant="subtitle1" fontWeight="bold">
                          Prediction #{index + 1}
                        </Typography>
                      </Box>

                      {/* Type and Prediction */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                          p: 1,
                        }}
                      >
                        {/* prediction type */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 4,
                          }}
                        >
                          <LabelIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            <Box component="span" fontWeight="bold">
                              Type:
                            </Box>{" "}
                            {predictionType.name || "N/A"}
                          </Typography>
                        </Box>

                        {/* prediction value */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 4,
                          }}
                        >
                          <TipsAndUpdatesIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            <Box component="span" fontWeight="bold">
                              Vaue:
                            </Box>{" "}
                            {value.value || "N/A"}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Label and Tip */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                          p: 1,
                          mb: 4,
                        }}
                      >
                        {/* label */}
                        {value.label && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 4,
                            }}
                          >
                            <LocalOfferIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              <Box component="span" fontWeight="bold">
                                Label:
                              </Box>{" "}
                              {value.label}
                            </Typography>
                          </Box>
                        )}

                        {/* tip */}
                        {value.tip && (
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <LightbulbIcon fontSize="small" color="warning" />
                            <Typography variant="body2" whiteSpace="pre-wrap">
                              <Box component="span" fontWeight="bold">
                                Tip:
                              </Box>{" "}
                              {value.tip}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Odds and Confidence  */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          p: 1,
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            flex: 1,
                          }}
                        >
                          <AttachMoneyIcon fontSize="small" color="success" />
                          <Typography variant="body2">
                            <Box component="span" fontWeight="bold">
                              Odds:
                            </Box>{" "}
                            {value.odds}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            flex: 1,
                          }}
                        >
                          <AssessmentIcon fontSize="small" color="info" />
                          <Typography variant="body2">
                            <Box component="span" fontWeight="bold">
                              Confidence:
                            </Box>{" "}
                            {value.confidence}%
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}

               {/* Scheduling preview */}
              {formik.values.isScheduled && (
                <Card
                  sx={{
                    borderLeft: "4px solid",
                    borderLeftColor: "info.main",
                    borderRadius: 2,
                    mb: 4,
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <ScheduleIcon color="action" />
                      <Typography variant="subtitle1" fontWeight="bold">
                        Scheduling
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        backgroundColor: "background.default",
                        p: 2,
                        borderRadius: 2,
                      }}
                    >
                      <CalendarTodayIcon fontSize="small" color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Scheduled Post Time
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {formik.values.scheduledTime
                            ? new Date(
                                formik.values.scheduledTime
                              ).toLocaleString()
                            : "Not scheduled"}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}
              
            </Box>
          </Paper>
        );

      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box 
      component="form" 
      onSubmit={formik.handleSubmit} 
      noValidate
      sx={{
         scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
      }}
      >

        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            color="inherit"
            href="#"
            onClick={onBack}
            sx={{ display: "flex", alignItems: "center" }}
            underline="hover"
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Predictions
          </Link>
          <Typography
            color="text.primary"
            sx={{ display: "flex", alignItems: "center" }}
          >
            New Prediction
          </Typography>
        </Breadcrumbs>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Current step content */}
        {renderStepContent(activeStep)}

         {/* AskHuddle chat */}
          <AskHuddle />

        {/* Navigation buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={
              loading ||
              (activeStep === 0 &&
                (!formik.values.matchId || !formik.values.competitionId))
            }
            endIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {activeStep === STEPS.length - 1 ? "Submit" : "Next"}
          </Button>
        </Box>

  
        {/* Confirmation Dialog */}
        <Dialog
          open={openConfirmDialog}
          onClose={() => !loading && setOpenConfirmDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1.5,
              py: 2,
              px: 3,
              textAlign: "center",
            }}
          >
            {submissionStatus === "success" ? (
              <>
                <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
              </>
            ) : submissionStatus === "error" ? (
              <>
                <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
              </>
            ) : (
              <>
                <HelpOutlineIcon color="info" sx={{ fontSize: 60, mb: 2 }} />
              </>
            )}
          </DialogTitle>

          <DialogContent>
            {submissionStatus === null ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 2,
                  }}
                >
                  <Typography variant="body1" align="center">
                    Are you sure you want to post this prediction now?
                  </Typography>
                </Box>

                {formik.values.isScheduled && formik.values.scheduledTime && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      p: 2,
                      mt: 2,
                    }}
                  >
                    <Typography variant="body1" align="center">
                      This prediction will be posted on:{" "}
                      {new Date(formik.values.scheduledTime).toLocaleString()}
                    </Typography>
                  </Box>
                )}
              </>
            ) : submissionStatus === "success" ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 2,
                }}
              >
                <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h6" align="center" gutterBottom>
                  Prediction submitted successfully!
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 2,
                }}
              >
                <Typography variant="h6" align="center" gutterBottom>
                  Failed to submit prediction
                </Typography>
                <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                  {snackbar.message}
                </Typography>
              </Box>
            )}

            {loading && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 2,
                }}
              >
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="h6" align="center">
                  Processing...
                </Typography>
              </Box>
            )}
          </DialogContent>

          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              py: 2,
              px: 3,
            }}
          >
            {submissionStatus === null && (
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  onClick={() => setOpenConfirmDialog(false)}
                  disabled={loading}
                  variant="outlined"
                  sx={{ minWidth: 120 }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    const errors = await formik.validateForm();
                    if (Object.keys(errors).length > 0) {
                      setSnackbar({
                        open: true,
                        message: "Please fix all errors before submitting",
                        severity: "error",
                      });
                      return;
                    }
                    formik.handleSubmit();
                  }}
                  variant="contained"
                  disabled={loading}
                  endIcon={
                    loading && <CircularProgress size={20} color="inherit" />
                  }
                  sx={{ minWidth: 180 }}
                >
                  Yes
                </Button>
              </Box>
            )}

            {submissionStatus === "success" && (
              <Button
                onClick={() => {
                  setOpenConfirmDialog(false);
                  onBack();
                }}
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
                sx={{ minWidth: 120 }}
              >
                Done
              </Button>
            )}

            {submissionStatus === "error" && (
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  onClick={() => {
                    setOpenConfirmDialog(false);
                    formik.resetForm();
                    setActiveStep(0);
                    setSubmissionStatus(null);
                  }}
                  variant="outlined"
                  sx={{ minWidth: 120 }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setSubmissionStatus(null);
                    formik.handleSubmit();
                  }}
                  variant="contained"
                  color="primary"
                  startIcon={<SportsSoccerIcon />}
                  sx={{ minWidth: 120 }}
                >
                  Try Again
                </Button>
              </Box>
            )}
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default NewPredictionForm;
