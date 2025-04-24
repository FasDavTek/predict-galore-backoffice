// components/dashboard/predictions/NewPredictionForm.js
import React, { useState } from "react";
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
  Divider,
  Chip,
  Paper,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  Switch,
  FormGroup,
  Checkbox,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Avatar,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  TextareaAutosize,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Check as CheckIcon,
  Schedule as ScheduleIcon,
  Lock as LockIcon,
  Public as PublicIcon,
  Group as GroupIcon,
  Home as HomeIcon,
  ChevronRight,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Link as LinkIcon,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
} from "@mui/icons-material";
import {
  SportsSoccer as SportsSoccerIcon,
  SportsBasketball as SportsBasketballIcon,
  SportsTennis as SportsTennisIcon,
} from "@mui/icons-material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// Define the steps for the prediction form
const steps = ["Match Selection", "Prediction Details", "Preview"];

// Available sports
const sports = [
  { value: "football", label: "Football" },
  { value: "basketball", label: "Basketball" },
  { value: "tennis", label: "Tennis" },
];

// Leagues by sport
const leaguesBySport = {
  football: [
    "English Premier League",
    "Champions League",
    "LaLiga",
    "Serie A",
    "Ligue 1",
    "Bundesliga",
  ],
  basketball: ["NBA", "EuroLeague", "CBA", "ACB", "BBL"],
  tennis: ["ATP Tour", "WTA Tour", "Grand Slams", "Davis Cup", "Fed Cup"],
};

// Matches by league
// Initialize matchesByLeague with all leagues
const matchesByLeague = {
  // Football leagues
  "English Premier League": [
    {
      id: 1,
      home: "Arsenal",
      away: "Chelsea",
      date: "2023-05-15 15:00",
      stage: "Premier League",
    },
    {
      id: 2,
      home: "Manchester United",
      away: "Liverpool",
      date: "2023-05-16 17:30",
      stage: "Premier League",
    },
  ],
  "Champions League": [],
  LaLiga: [],
  "Serie A": [],
  "Ligue 1": [],
  Bundesliga: [],

  // Basketball leagues
  NBA: [
    {
      id: 1,
      home: "LA Lakers",
      away: "Boston Celtics",
      date: "2023-05-15 20:00",
      stage: "Regular Season",
    },
    {
      id: 2,
      home: "Golden State Warriors",
      away: "Chicago Bulls",
      date: "2023-05-16 19:00",
      stage: "Regular Season",
    },
  ],
  EuroLeague: [],
  CBA: [],
  ACB: [],
  BBL: [],

  // Tennis leagues
  "ATP Tour": [
    {
      id: 1,
      home: "Novak Djokovic",
      away: "Rafael Nadal",
      date: "2023-05-15 14:00",
      stage: "Quarter Final",
    },
    {
      id: 2,
      home: "Roger Federer",
      away: "Andy Murray",
      date: "2023-05-16 16:00",
      stage: "Semi Final",
    },
  ],
  "WTA Tour": [],
  "Grand Slams": [],
  "Davis Cup": [],
  "Fed Cup": [],
};

// Confidence levels
const confidenceLevels = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

// Common prediction tags
const commonTags = [
  "Underdog",
  "Favorite",
  "Derby",
  "Rivalry",
  "High Scoring",
  "Defensive",
  "Home Advantage",
  "Away Form",
];

const NewPredictionForm = ({ onBack, onSubmit }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [score, setScore] = useState({ home: "", away: "" });
  const [charCount, setCharCount] = useState({ comment: 0, analysis: 0 });

  const [formData, setFormData] = useState({
    sport: "",
    league: "",
    match: null,
    predictedOutcome: "",
    score: { home: "", away: "" },
    comment: "",
    expertAnalysis: "",
    confidence: "medium",
    includeTeamForm: true,
    includeTeamComparison: true,
    includeTopScorers: false,
    includeHeadToHead: true,
    includeTeamStatistics: true,
    tags: [],
    scheduledDate: null,
  });

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      setOpenConfirmDialog(true);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSportChange = (e) => {
    const sport = e.target.value;
    setFormData((prev) => ({ ...prev, sport, league: "", match: null }));
  };

  const handleLeagueChange = (e) => {
    const league = e.target.value;
    setFormData((prev) => ({ ...prev, league, match: null }));
  };

  const handleMatchChange = (match) => {
    setFormData((prev) => ({ ...prev, match }));
    setSelectedMatch(match);
  };

  const handleScoreChange = (e, team) => {
    const value = e.target.value;
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      setScore((prev) => ({ ...prev, [team]: value }));
      setFormData((prev) => ({
        ...prev,
        score: { ...prev.score, [team]: value },
      }));
    }
  };

  const handleCommentChange = (e) => {
    const value = e.target.value;
    if (value.length <= 100) {
      setFormData((prev) => ({ ...prev, comment: value }));
      setCharCount((prev) => ({ ...prev, comment: value.length }));
    }
  };

  const handleAnalysisChange = (e) => {
    const value = e.target.value;
    if (value.length <= 3000) {
      setFormData((prev) => ({ ...prev, expertAnalysis: value }));
      setCharCount((prev) => ({ ...prev, analysis: value.length }));
    }
  };

  const handleTagChange = (event, value) => {
    setSelectedTags(value.slice(0, 5));
    setFormData((prev) => ({ ...prev, tags: value.slice(0, 5) }));
  };

  const handleSchedule = () => {
    setOpenScheduleDialog(true);
  };

  const confirmSchedule = () => {
    setFormData((prev) => ({ ...prev, scheduledDate: selectedDateTime }));
    setOpenScheduleDialog(false);
    onSubmit({ ...formData, scheduledDate: selectedDateTime });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Match Selection
        return (
          <Paper sx={{ p: 3, mb: 3, width: "100%" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Sport Selection */}
              <FormControl fullWidth>
                <InputLabel id="sport-label">Sport *</InputLabel>
                <Select
                  labelId="sport-label"
                  value={formData.sport}
                  onChange={handleSportChange}
                  label="Sport *"
                  IconComponent={ChevronRight}
                >
                  {sports.map((sport) => (
                    <MenuItem key={sport.value} value={sport.value}>
                      {sport.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* League Selection */}
              <FormControl fullWidth disabled={!formData.sport}>
                <InputLabel id="league-label">League *</InputLabel>
                <Select
                  labelId="league-label"
                  value={formData.league}
                  onChange={handleLeagueChange}
                  label="League *"
                  IconComponent={ChevronRight}
                >
                  {formData.sport &&
                    leaguesBySport[formData.sport].map((league) => (
                      <MenuItem key={league} value={league}>
                        {league}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              {/* Match Selection */}
              {/* Match Selection */}
              <FormControl fullWidth disabled={!formData.league}>
                <Autocomplete
                  options={
                    formData.league && matchesByLeague[formData.league]
                      ? matchesByLeague[formData.league]
                      : []
                  }
                  getOptionLabel={(option) =>
                    `${option.home} vs ${option.away}`
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Match *"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: <ChevronRight />,
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Box sx={{ width: "100%" }}>
                        <Typography>
                          {option.home} vs {option.away}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(option.date).toLocaleString()} •{" "}
                          {option.stage}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  noOptionsText="No matches available for this league"
                  value={formData.match}
                  onChange={(e, newValue) => handleMatchChange(newValue)}
                />
              </FormControl>
            </Box>
          </Paper>
        );

      case 1: // Prediction Details
        return (
          <Paper sx={{ p: 3, mb: 3, width: "100%" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Predicted Outcome Card */}
              <Card variant="outlined">
                <CardHeader title="Predicted Outcome" />
                <CardContent>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    {/* Match Winner */}
                    <FormControl fullWidth>
                      <InputLabel id="outcome-label">Match Winner *</InputLabel>
                      <Select
                        labelId="outcome-label"
                        value={formData.predictedOutcome}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            predictedOutcome: e.target.value,
                          }))
                        }
                        label="Match Winner *"
                      >
                        {selectedMatch && [
                          <MenuItem key="home" value={selectedMatch.home}>
                            {selectedMatch.home}
                          </MenuItem>,
                          <MenuItem key="away" value={selectedMatch.away}>
                            {selectedMatch.away}
                          </MenuItem>,
                          <MenuItem key="draw" value="Draw">
                            Draw
                          </MenuItem>,
                        ]}
                      </Select>
                    </FormControl>

                    {/* Score Prediction */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <TextField
                        label="Home Score"
                        value={score.home}
                        onChange={(e) => handleScoreChange(e, "home")}
                        type="number"
                        InputProps={{ inputProps: { min: 0 } }}
                        sx={{ flex: 1 }}
                      />
                      <Typography>vs</Typography>
                      <TextField
                        label="Away Score"
                        value={score.away}
                        onChange={(e) => handleScoreChange(e, "away")}
                        type="number"
                        InputProps={{ inputProps: { min: 0 } }}
                        sx={{ flex: 1 }}
                      />
                    </Box>

                    {/* Comment */}
                    <TextField
                      label="Comment"
                      value={formData.comment}
                      onChange={handleCommentChange}
                      helperText={`${charCount.comment}/100 characters`}
                      inputProps={{ maxLength: 100 }}
                    />
                  </Box>
                </CardContent>
              </Card>

              {/* Expert Analysis */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Expert Analysis *
                </Typography>
                <TextareaAutosize
                  minRows={6}
                  style={{
                    width: "100%",
                    padding: "16.5px 14px",
                    fontFamily: "inherit",
                    fontSize: "inherit",
                    border: "1px solid rgba(0, 0, 0, 0.23)",
                    borderRadius: "4px",
                    resize: "vertical",
                  }}
                  value={formData.expertAnalysis}
                  onChange={handleAnalysisChange}
                  placeholder="Provide detailed analysis..."
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 1,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton size="small">
                      <FormatBold fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <FormatItalic fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <FormatUnderlined fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <LinkIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <FormatAlignLeft fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <FormatAlignCenter fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <FormatAlignRight fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography variant="caption">{`${charCount.analysis}/3000 characters`}</Typography>
                </Box>
              </Box>

              {/* Additional Analysis Options */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Additional Analysis Options
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.includeTeamForm}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            includeTeamForm: e.target.checked,
                          }))
                        }
                      />
                    }
                    label="Include Team Form"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.includeTeamComparison}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            includeTeamComparison: e.target.checked,
                          }))
                        }
                      />
                    }
                    label="Include Team Comparison"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.includeTopScorers}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            includeTopScorers: e.target.checked,
                          }))
                        }
                      />
                    }
                    label="Include Top Scorers"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.includeHeadToHead}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            includeHeadToHead: e.target.checked,
                          }))
                        }
                      />
                    }
                    label="Include Head-to-Head"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.includeTeamStatistics}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            includeTeamStatistics: e.target.checked,
                          }))
                        }
                      />
                    }
                    label="Include Team Statistics"
                  />
                </FormGroup>
              </Box>

              {/* Prediction Tags */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Prediction Tags
                </Typography>
                <Autocomplete
                  multiple
                  options={commonTags}
                  value={selectedTags}
                  onChange={handleTagChange}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Add tags (max 5)"
                      placeholder="Type to add tags"
                    />
                  )}
                />
              </Box>

              {/* Confidence Level */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Confidence Level *
                </Typography>
                <RadioGroup
                  row
                  value={formData.confidence}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      confidence: e.target.value,
                    }))
                  }
                >
                  {confidenceLevels.map((level) => (
                    <FormControlLabel
                      key={level.value}
                      value={level.value}
                      control={<Radio />}
                      label={level.label}
                    />
                  ))}
                </RadioGroup>
              </Box>
            </Box>
          </Paper>
        );

      case 2: // Preview
        return (
          <Paper sx={{ p: 3, mb: 3, width: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Preview Your Prediction
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* Match Information */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Match Information
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography>
                  <strong>Sport:</strong>{" "}
                  {sports.find((s) => s.value === formData.sport)?.label}
                </Typography>
                <Typography>
                  <strong>League:</strong> {formData.league}
                </Typography>
                <Typography>
                  <strong>Match:</strong>{" "}
                  {formData.match
                    ? `${formData.match.home} vs ${formData.match.away}`
                    : ""}
                </Typography>
                <Typography>
                  <strong>Date:</strong>{" "}
                  {formData.match
                    ? new Date(formData.match.date).toLocaleString()
                    : ""}
                </Typography>
                <Typography>
                  <strong>Stage:</strong> {formData.match?.stage}
                </Typography>
              </Box>
            </Box>

            {/* Prediction Summary */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Prediction Summary
              </Typography>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "action.hover",
                  borderRadius: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Typography>
                  <strong>Predicted Winner:</strong> {formData.predictedOutcome}
                </Typography>
                {score.home !== "" && score.away !== "" && (
                  <Typography>
                    <strong>Predicted Score:</strong> {score.home} -{" "}
                    {score.away}
                  </Typography>
                )}
                <Typography>
                  <strong>Confidence Level:</strong>{" "}
                  {formData.confidence.charAt(0).toUpperCase() +
                    formData.confidence.slice(1)}
                </Typography>
                {formData.comment && (
                  <Typography sx={{ fontStyle: "italic" }}>
                    &quot;{formData.comment}&quot;
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Analysis Preview */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Analysis Preview
              </Typography>
              <Paper sx={{ p: 2 }}>
                <Typography sx={{ whiteSpace: "pre-line" }}>
                  {formData.expertAnalysis}
                </Typography>
              </Paper>
            </Box>

            {/* Selected Options */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Selected Options
              </Typography>
              <List dense>
                {formData.includeTeamForm && (
                  <ListItem>
                    <ListItemText primary="✓ Include Team Form" />
                  </ListItem>
                )}
                {formData.includeTeamComparison && (
                  <ListItem>
                    <ListItemText primary="✓ Include Team Comparison" />
                  </ListItem>
                )}
                {formData.includeTopScorers && (
                  <ListItem>
                    <ListItemText primary="✓ Include Top Scorers" />
                  </ListItem>
                )}
                {formData.includeHeadToHead && (
                  <ListItem>
                    <ListItemText primary="✓ Include Head-to-Head" />
                  </ListItem>
                )}
                {formData.includeTeamStatistics && (
                  <ListItem>
                    <ListItemText primary="✓ Include Team Statistics" />
                  </ListItem>
                )}
                {selectedTags.length > 0 && (
                  <ListItem>
                    <ListItemText
                      primary="Tags:"
                      secondary={selectedTags.join(", ")}
                    />
                  </ListItem>
                )}
              </List>
            </Box>
          </Paper>
        );

      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* breadcrumb*/}
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              color="inherit"
              onClick={onBack}
              sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Predictions
            </Link>
          </Breadcrumbs>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Form content */}
        {renderStepContent(activeStep)}

        {/* Navigation buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent:
              activeStep === steps.length - 1 ? "space-between" : "flex-end",
            mt: 3,
          }}
        >
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box>
            {activeStep === steps.length - 1 && (
              <Button
                variant="outlined"
                startIcon={<ScheduleIcon />}
                sx={{ mr: 2 }}
                onClick={handleSchedule}
              >
                Schedule
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={
                (activeStep === 0 &&
                  (!formData.sport || !formData.league || !formData.match)) ||
                (activeStep === 1 &&
                  (!formData.predictedOutcome ||
                    !formData.expertAnalysis ||
                    !formData.confidence))
              }
            >
              {activeStep === steps.length - 1 ? "Post Prediction" : "Next"}
            </Button>
          </Box>
        </Box>

        {/* Confirmation Dialog */}
     {/* Confirmation Dialog */}
<Dialog
  open={openConfirmDialog}
  onClose={() => setOpenConfirmDialog(false)}
>
  <DialogTitle>Confirm Prediction</DialogTitle>
  <DialogContent>
    
    <DialogContentText sx={{ mb: 1 }}>
      Select who can view this prediction before posting
    </DialogContentText>
    
    <FormControl fullWidth sx={{ mt: 1, mb: 2 }}>
      <InputLabel id="audience-select-label">Audience</InputLabel>
      <Select
        labelId="audience-select-label"
        id="audience-select"
        value={formData.audience || 'all'}
        label="Audience"
        onChange={(e) => setFormData(prev => ({
          ...prev,
          audience: e.target.value
        }))}
      >
        <MenuItem value="all">All users</MenuItem>
        <MenuItem value="free">Free users</MenuItem>
        <MenuItem value="premium">Premium users</MenuItem>
      </Select>
    </FormControl>

    {/* <List>
      <ListItem>
        <ListItemText 
          primary="Match" 
          secondary={formData.match} 
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Prediction" 
          secondary={formData.predictedOutcome} 
        />
      </ListItem>
    </List> */}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
    <Button
      onClick={() => {
        setOpenConfirmDialog(false);
        onSubmit(formData);
      }}
      variant="contained"
      startIcon={<CheckIcon />}
    >
      Confirm Post
    </Button>
  </DialogActions>
</Dialog>

        {/* Schedule Dialog */}
        <Dialog
          open={openScheduleDialog}
          onClose={() => setOpenScheduleDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Schedule Prediction</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 3 }}>
              Select when you want this prediction to be posted.
            </DialogContentText>
            <DateTimePicker
              label="Date & Time"
              value={selectedDateTime}
              onChange={setSelectedDateTime}
              minDateTime={new Date()}
              minutesStep={15}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenScheduleDialog(false)}>Cancel</Button>
            <Button
              onClick={confirmSchedule}
              variant="contained"
              startIcon={<ScheduleIcon />}
            >
              Schedule
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default NewPredictionForm;
