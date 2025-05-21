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
import { Edit } from "@mui/icons-material";
import PercentIcon from "@mui/icons-material/Percent";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import AskHuddle from "@/components/common/AskHuddle";

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

const NewPredictionForm = ({ teams = [], onBack, onSubmit }) => {
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
    confidence: 50, // Keep this as number only
    includeTeamForm: true,
    includeTeamComparison: true,
    homeScore: "",
    awayScore: "",
    goalScorerType: "",
    selectedPlayer: null,
    goalScorerConfirmed: false,
    goalTip: "",
    tags: [],
    scheduledDate: null,
  });

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());

  const playerOptions = [
    { id: 1, name: "Bukayo Saka" },
    { id: 2, name: "Gabriel Martinelli" },
    // ... other players
  ];

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

  const handleSchedule = () => {
    setOpenScheduleDialog(true);
  };

  const confirmSchedule = () => {
    setFormData((prev) => ({ ...prev, scheduledDate: selectedDateTime }));
    setOpenScheduleDialog(false);
    onSubmit({ ...formData, scheduledDate: selectedDateTime });
  };

  const [editableFields, setEditableFields] = useState({
    sport: false,
    league: false,
    match: false,
    predictedOutcome: false,
    score: false,
    comment: false,
    expertAnalysis: false,
    confidence: false,
  });

  const toggleFieldEdit = (field) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const handleFormatClick = (format) => {
    const textarea = document.getElementById("expert-analysis");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.expertAnalysis.substring(start, end);

    let formattedText = "";
    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`;
        setIsBold(!isBold);
        break;
      case "italic":
        formattedText = `_${selectedText}_`;
        setIsItalic(!isItalic);
        break;
      case "underline":
        formattedText = `<u>${selectedText}</u>`;
        setIsUnderline(!isUnderline);
        break;
      default:
        formattedText = selectedText;
    }

    const newText =
      formData.expertAnalysis.substring(0, start) +
      formattedText +
      formData.expertAnalysis.substring(end);

    setFormData((prev) => ({
      ...prev,
      expertAnalysis: newText,
    }));

    // Restore cursor position
    setTimeout(() => {
      textarea.selectionStart = start;
      textarea.selectionEnd = start + formattedText.length;
      textarea.focus();
    }, 0);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Match Selection
        return (
          <Paper sx={{ p: 3, mb: 3, width: "50%" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {/* Match detail selection */}
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 6, mb: 4 }}
              >
                {/* Sport Selection */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography
                    variant="body1"
                    component="label"
                    htmlFor="sport-select"
                    sx={{
                      color: "text.primary",
                      fontWeight: "medium",
                    }}
                  >
                    Sport *
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      id="sport-select"
                      value={formData.sport}
                      onChange={handleSportChange}
                      displayEmpty
                      renderValue={
                        formData.sport !== ""
                          ? undefined
                          : () => "Select a sport"
                      }
                      IconComponent={ChevronRight}
                      sx={{
                        "& .MuiSelect-select": {
                          color:
                            formData.sport === ""
                              ? "text.disabled"
                              : "text.primary",
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select a sport
                      </MenuItem>
                      {sports.map((sport) => (
                        <MenuItem key={sport.value} value={sport.value}>
                          {sport.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* League Selection */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography
                    variant="body1"
                    component="label"
                    htmlFor="league-select"
                    sx={{
                      color: "text.primary",
                      fontWeight: "medium",
                    }}
                  >
                    League *
                  </Typography>
                  <FormControl fullWidth disabled={!formData.sport}>
                    <Select
                      id="league-select"
                      value={formData.league}
                      onChange={handleLeagueChange}
                      displayEmpty
                      renderValue={
                        formData.league !== ""
                          ? undefined
                          : () => "Select a league"
                      }
                      IconComponent={ChevronRight}
                      sx={{
                        "& .MuiSelect-select": {
                          color:
                            formData.league === ""
                              ? "text.disabled"
                              : "text.primary",
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select a league
                      </MenuItem>
                      {formData.sport &&
                        leaguesBySport[formData.sport].map((league) => (
                          <MenuItem key={league} value={league}>
                            {league}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* Match Selection */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography
                    variant="body1"
                    component="label"
                    htmlFor="match-autocomplete"
                    sx={{
                      color: "text.primary",
                      fontWeight: "medium",
                    }}
                  >
                    Match *
                  </Typography>
                  <Autocomplete
                    id="match-autocomplete"
                    options={
                      formData.league && matchesByLeague[formData.league]
                        ? matchesByLeague[formData.league]
                        : []
                    }
                    disabled={!formData.league}
                    getOptionLabel={(option) =>
                      `${option.home} vs ${option.away}`
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Search for a match"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: <ChevronRight />,
                        }}
                        sx={{
                          "& .MuiInputBase-input": {
                            color: !formData.match
                              ? "text.disabled"
                              : "text.primary",
                          },
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        {...props}
                        sx={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        {/* for each */}
                        <Box
                          sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          {/* home and away */}
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: 3,
                            }}
                          >
                            {/* Home */}
                            <Box
                              sx={{
                                display: "flex",
                                // alignItems: "center",
                                flex: 1,
                              }}
                            >
                              <Avatar
                                src={`/logos/${option.home
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}.png`}
                                sx={{ width: 24, height: 24, mr: 1 }}
                                alt={option.home}
                              >
                                {option.home.charAt(0)}
                              </Avatar>
                              <Typography>{option.home}</Typography>
                            </Box>

                            {/* vs */}
                            <Typography variant="body2" color="text.secondary">
                              vs
                            </Typography>

                            {/* away */}
                            <Box
                              sx={{
                                display: "flex",
                                // alignItems: "center",
                                flex: 1,
                              }}
                            >
                              <Avatar
                                src={`/logos/${option.away
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}.png`}
                                sx={{ width: 24, height: 24, mr: 1 }}
                                alt={option.away}
                              >
                                {option.away.charAt(0)}
                              </Avatar>
                              <Typography>{option.away}</Typography>
                            </Box>
                          </Box>

                          {/* stage and date */}
                          <Box
                            sx={{
                              width: "100%",
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                              gap: 3,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              {option.stage}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                              {new Date(option.date).toLocaleString()} •{" "}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    )}
                    noOptionsText="No matches available for this league"
                    value={formData.match}
                    onChange={(e, newValue) => handleMatchChange(newValue)}
                  />
                </Box>
              </Box>

              {/* Predicted Outcome */}
              <Paper sx={{ p: 3, mb: 4 }}>
                <Typography
                  variant="h3"
                  sx={{
                    color: "text.primary",
                    fontWeight: "medium",
                    mb: 3,
                  }}
                >
                  Predicted Outcome
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {/* Match Winner */}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Typography
                      variant="body1"
                      component="label"
                      htmlFor="outcome-select"
                      sx={{
                        color: "text.primary",
                        fontWeight: "medium",
                      }}
                    >
                      Match Winner
                    </Typography>

                    {/* predicted winner */}
                    <FormControl fullWidth>
                      <Select
                        id="outcome-select"
                        value={formData.predictedOutcome}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            predictedOutcome: e.target.value,
                          }))
                        }
                        displayEmpty
                        renderValue={
                          formData.predictedOutcome !== ""
                            ? undefined
                            : () => "Select predicted winner"
                        }
                        sx={{
                          "& .MuiSelect-select": {
                            color:
                              formData.predictedOutcome === ""
                                ? "text.disabled"
                                : "text.primary",
                          },
                        }}
                      >
                        <MenuItem value="" disabled>
                          Select predicted winner
                        </MenuItem>
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
                  </Box>

                  {/* Score Prediction */}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Typography
                      variant="body1"
                      component="label"
                      sx={{
                        color: "text.primary",
                        fontWeight: "medium",
                      }}
                    >
                      Predicted Score
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <TextField
                        value={score.home}
                        onChange={(e) => handleScoreChange(e, "home")}
                        type="number"
                        placeholder="0"
                        InputProps={{ inputProps: { min: 0 } }}
                        sx={{ flex: 1 }}
                      />
                      <Typography>vs</Typography>
                      <TextField
                        value={score.away}
                        onChange={(e) => handleScoreChange(e, "away")}
                        type="number"
                        placeholder="0"
                        InputProps={{ inputProps: { min: 0 } }}
                        sx={{ flex: 1 }}
                      />
                    </Box>
                  </Box>

                  {/* Comment */}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Typography
                      variant="body1"
                      component="label"
                      htmlFor="comment-field"
                      sx={{
                        color: "text.primary",
                        fontWeight: "medium",
                      }}
                    >
                      Comment
                    </Typography>
                    <TextField
                      id="comment-field"
                      value={formData.comment}
                      onChange={handleCommentChange}
                      placeholder="Add a brief comment about your prediction"
                      helperText={`${charCount.comment}/100 characters`}
                      inputProps={{ maxLength: 100 }}
                    />
                  </Box>
                </Box>
              </Paper>

              {/* Confidence Percentage */}
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 4 }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    color: "text.primary",
                    fontWeight: "medium",
                  }}
                >
                  Confidence Percenatge *
                </Typography>
                <TextField
                  type="number"
                  value={formData.confidence}
                  onChange={(e) => {
                    // Ensure value is between 0 and 100
                    const value = Math.min(
                      100,
                      Math.max(0, parseInt(e.target.value) || 0)
                    );
                    setFormData((prev) => ({
                      ...prev,
                      confidence: value,
                    }));
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PercentIcon />
                      </InputAdornment>
                    ),
                    inputProps: {
                      min: 0,
                      max: 100,
                    },
                  }}
                />
              </Box>

              {/* Expert Analysis */}
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 4 }}
              >
                <Typography
                  variant="body1"
                  component="label"
                  htmlFor="expert-analysis"
                  sx={{
                    color: "text.primary",
                    fontWeight: "medium",
                  }}
                >
                  Expert Analysis *
                </Typography>
                <Box
                  sx={{
                    border: "1px solid rgba(0, 0, 0, 0.23)",
                    borderRadius: "4px",
                    padding: "8px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      borderBottom: "1px solid #f1f1f1",
                      paddingBottom: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleFormatClick("bold")}
                      color={isBold ? "primary" : "default"}
                    >
                      <FormatBold fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleFormatClick("italic")}
                      color={isItalic ? "primary" : "default"}
                    >
                      <FormatItalic fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleFormatClick("underline")}
                      color={isUnderline ? "primary" : "default"}
                    >
                      <FormatUnderlined fontSize="small" />
                    </IconButton>
                  </Box>
                  <TextareaAutosize
                    id="expert-analysis"
                    minRows={6}
                    style={{
                      width: "100%",
                      padding: "8px",
                      fontFamily: "inherit",
                      fontSize: "inherit",
                      border: "none",
                      resize: "vertical",
                      outline: "none",
                    }}
                    value={formData.expertAnalysis}
                    onChange={handleAnalysisChange}
                    placeholder="Provide detailed analysis including key factors influencing your prediction..."
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 1,
                  }}
                >
                  <Typography variant="caption">
                    {`${formData.expertAnalysis.length}/3000 characters`}
                  </Typography>
                </Box>
              </Box>

              {/* Additional Analysis Options */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "text.primary",
                    fontWeight: "medium",
                  }}
                >
                  Additional Analysis Options
                </Typography>

                <FormGroup>
                  {/* Team Form */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      py: 1,
                    }}
                  >
                    <Typography>Include Team Form</Typography>
                    <Switch
                      checked={formData.includeTeamForm}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          includeTeamForm: e.target.checked,
                        }))
                      }
                    />
                  </Box>

                  {/* Team comparison */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      py: 1,
                    }}
                  >
                    <Typography>Include Team Comparison</Typography>
                    <Switch
                      checked={formData.includeTeamComparison}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          includeTeamComparison: e.target.checked,
                        }))
                      }
                    />
                  </Box>

                  {/* Top scorers */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      py: 1,
                    }}
                  >
                    <Typography>Include Top Scorers</Typography>
                    <Switch
                      checked={formData.includeTopScorers}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          includeTopScorers: e.target.checked,
                        }))
                      }
                    />
                  </Box>
                </FormGroup>
              </Box>
            </Box>
          </Paper>
        );

      case 1: // Prediction Details
        return (
          <Paper sx={{ p: 3, mb: 3, width: "50%" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Typography
                variant="h3"
                sx={{ color: "text.primary", fontWeight: "medium", mb: 3 }}
              >
                Predictions
              </Typography>

              {/* Prediction Type Selector */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography
                  variant="body1"
                  component="label"
                  htmlFor="prediction-type"
                  sx={{
                    color: "text.primary",
                    fontWeight: "medium",
                  }}
                >
                  Prediction Type *
                </Typography>
                <FormControl fullWidth>
                  <Select
                    id="prediction-type"
                    value={formData.predictionType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        predictionType: e.target.value,
                      })
                    }
                    displayEmpty
                    renderValue={
                      formData.predictionType !== ""
                        ? undefined
                        : () => "Select prediction type"
                    }
                    sx={{
                      "& .MuiSelect-select": {
                        color:
                          formData.predictionType === ""
                            ? "text.disabled"
                            : "text.primary",
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select prediction type
                    </MenuItem>
                    <MenuItem value="correct-score">Correct Score</MenuItem>
                    <MenuItem value="goal-scorer">Goal Scorer</MenuItem>
                    <MenuItem value="1x2">1x2</MenuItem>
                    <MenuItem value="over-under">Over/Under</MenuItem>
                    <MenuItem value="handicap">Handicap</MenuItem>
                    <MenuItem value="double-chance">Double Chance</MenuItem>
                    <MenuItem value="draw-no-bet">Draw no Bet</MenuItem>
                    <MenuItem value="both-teams-score">
                      Both Teams to Score
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Conditional Fields Based on Prediction Type */}
              {formData.predictionType === "correct-score" && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2,
                    width: "100%",
                  }}
                >
                  <TextField
                    label="Home Score"
                    type="number"
                    inputProps={{ min: 0 }}
                    value={formData.homeScore}
                    onChange={(e) =>
                      setFormData({ ...formData, homeScore: e.target.value })
                    }
                    sx={{ flex: 1 }}
                  />

                  <Typography variant="h5" sx={{ mx: 1 }}>
                    -
                  </Typography>

                  <TextField
                    label="Away Score"
                    type="number"
                    inputProps={{ min: 0 }}
                    value={formData.awayScore}
                    onChange={(e) =>
                      setFormData({ ...formData, awayScore: e.target.value })
                    }
                    sx={{ flex: 1 }}
                  />
                </Box>
              )}

              {formData.predictionType === "goal-scorer" && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Goal Scorers
                  </Typography>

                  {/* Goal scorer type */}
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Goal Scorer Type</InputLabel>
                    <Select
                      value={formData.goalScorerType}
                      label="Goal Scorer Type"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          goalScorerType: e.target.value,
                        })
                      }
                    >
                      <MenuItem value="anytime">Anytime Goalscorer</MenuItem>
                      <MenuItem value="first">First Goalscorer</MenuItem>
                      <MenuItem value="last">Last Goalscorer</MenuItem>
                    </Select>
                  </FormControl>

                  {/* select player */}
                  <Autocomplete
                    multiple
                    options={playerOptions}
                    getOptionLabel={(option) => option.name}
                    value={formData.selectedPlayers || []}
                    onChange={(event, newValue) => {
                      setFormData({ ...formData, selectedPlayers: newValue });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Players"
                        placeholder="Search players..."
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          key={option.id}
                          label={option.name}
                          {...getTagProps({ index })}
                          onDelete={() => {
                            const newPlayers = formData.selectedPlayers.filter(
                              (player) => player.id !== option.id
                            );
                            setFormData({
                              ...formData,
                              selectedPlayers: newPlayers,
                            });
                          }}
                        />
                      ))
                    }
                    sx={{ mb: 2 }}
                  />
                </Box>
              )}

              {/* Tip Section */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Tip (goals)
                </Typography>
                <TextField
                  select
                  value={formData.goalTip}
                  onChange={(e) =>
                    setFormData({ ...formData, goalTip: e.target.value })
                  }
                  fullWidth
                >
                  <MenuItem value="0">0</MenuItem>
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3+">3+</MenuItem>
                </TextField>
              </Box>

              {/* Confidence Section */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Confidence (%)
                </Typography>
                <TextField
                  type="number"
                  value={formData.confidence}
                  onChange={(e) => {
                    const value = Math.min(
                      100,
                      Math.max(0, parseInt(e.target.value) || 0)
                    );
                    setFormData({ ...formData, confidence: value });
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                    inputProps: {
                      min: 0,
                      max: 100,
                    },
                  }}
                  fullWidth
                />
              </Box>

              {/* Recent Form Section */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Recent Form
                </Typography>
                <TextField
                  multiline
                  rows={4}
                  value={formData.recentForm}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setFormData({ ...formData, recentForm: e.target.value });
                    }
                  }}
                  helperText={`${
                    formData.recentForm?.length || 0
                  }/500 characters`}
                  fullWidth
                />
              </Box>
            </Box>
          </Paper>
        );

      case 2: // Preview
        return (
          <Paper sx={{ p: 3, mb: 3, width: "50%" }}>
            <Typography variant="h6" gutterBottom>
              Preview Your Prediction
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* Match Information Card */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Match Information
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                      pt: 2,
                    }}
                  >
                    {/* Sport */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Typography sx={{ minWidth: 120 }}>
                        <strong>Sport:</strong>
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {editableFields.sport ? (
                          <FormControl size="small" sx={{ minWidth: 200 }}>
                            <Select
                              value={formData.sport}
                              onChange={(e) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  sport: e.target.value,
                                }));
                              }}
                            >
                              {sports.map((sport) => (
                                <MenuItem key={sport.value} value={sport.value}>
                                  {sport.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        ) : (
                          <Typography
                            sx={{ minWidth: 200, textAlign: "right" }}
                          >
                            {sports.find((s) => s.value === formData.sport)
                              ?.label || "Not selected"}
                          </Typography>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => toggleFieldEdit("sport")}
                          sx={{ ml: 1 }}
                        >
                          {editableFields.sport ? (
                            <CheckIcon fontSize="small" />
                          ) : (
                            <Edit fontSize="small" />
                          )}
                        </IconButton>
                      </Box>
                    </Box>

                    {/* League */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Typography sx={{ minWidth: 120 }}>
                        <strong>League:</strong>
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {editableFields.league ? (
                          <FormControl size="small" sx={{ minWidth: 200 }}>
                            <Select
                              value={formData.league}
                              onChange={(e) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  league: e.target.value,
                                }));
                              }}
                              disabled={!formData.sport}
                            >
                              {formData.sport &&
                                leaguesBySport[formData.sport].map((league) => (
                                  <MenuItem key={league} value={league}>
                                    {league}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        ) : (
                          <Typography
                            sx={{ minWidth: 200, textAlign: "right" }}
                          >
                            {formData.league || "Not selected"}
                          </Typography>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => toggleFieldEdit("league")}
                          sx={{ ml: 1 }}
                        >
                          {editableFields.league ? (
                            <CheckIcon fontSize="small" />
                          ) : (
                            <Edit fontSize="small" />
                          )}
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Match */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Typography sx={{ minWidth: 120 }}>
                        <strong>Match:</strong>
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {editableFields.match ? (
                          <Autocomplete
                            options={
                              formData.league &&
                              matchesByLeague[formData.league]
                                ? matchesByLeague[formData.league]
                                : []
                            }
                            getOptionLabel={(option) =>
                              `${option.home} vs ${option.away}`
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                sx={{ minWidth: 200 }}
                              />
                            )}
                            value={formData.match}
                            onChange={(e, newValue) => {
                              handleMatchChange(newValue);
                            }}
                          />
                        ) : (
                          <Typography
                            sx={{ minWidth: 200, textAlign: "right" }}
                          >
                            {formData.match
                              ? `${formData.match.home} vs ${formData.match.away}`
                              : "Not selected"}
                          </Typography>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => toggleFieldEdit("match")}
                          sx={{ ml: 1 }}
                        >
                          {editableFields.match ? (
                            <CheckIcon fontSize="small" />
                          ) : (
                            <Edit fontSize="small" />
                          )}
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Date */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Typography sx={{ minWidth: 120 }}>
                        <strong>Date:</strong>
                      </Typography>
                      <Typography sx={{ minWidth: 200, textAlign: "right" }}>
                        {formData.match
                          ? new Date(formData.match.date).toLocaleString()
                          : "Not available"}
                      </Typography>
                    </Box>

                    {/* Stage */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Typography sx={{ minWidth: 120 }}>
                        <strong>Stage:</strong>
                      </Typography>
                      <Typography sx={{ minWidth: 200, textAlign: "right" }}>
                        {formData.match?.stage || "Not available"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Prediction Summary Card */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Prediction Summary
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                      pt: 2,
                    }}
                  >
                    {/* Predicted Winner */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Typography sx={{ minWidth: 120 }}>
                        <strong>Winner:</strong>
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {editableFields.predictedOutcome ? (
                          <FormControl size="small" sx={{ minWidth: 200 }}>
                            <Select
                              value={formData.predictedOutcome}
                              onChange={(e) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  predictedOutcome: e.target.value,
                                }));
                              }}
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
                        ) : (
                          <Typography
                            sx={{ minWidth: 200, textAlign: "right" }}
                          >
                            {formData.predictedOutcome || "Not selected"}
                          </Typography>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => toggleFieldEdit("predictedOutcome")}
                          sx={{ ml: 1 }}
                        >
                          {editableFields.predictedOutcome ? (
                            <CheckIcon fontSize="small" />
                          ) : (
                            <Edit fontSize="small" />
                          )}
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Predicted Score */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Typography sx={{ minWidth: 120 }}>
                        <strong>Score:</strong>
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {editableFields.score ? (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <TextField
                              value={score.home}
                              onChange={(e) => handleScoreChange(e, "home")}
                              type="number"
                              size="small"
                              sx={{ width: 60 }}
                              InputProps={{ inputProps: { min: 0 } }}
                            />
                            <Typography>vs</Typography>
                            <TextField
                              value={score.away}
                              onChange={(e) => handleScoreChange(e, "away")}
                              type="number"
                              size="small"
                              sx={{ width: 60 }}
                              InputProps={{ inputProps: { min: 0 } }}
                            />
                          </Box>
                        ) : (
                          <Typography
                            sx={{ minWidth: 200, textAlign: "right" }}
                          >
                            {score.home !== "" && score.away !== ""
                              ? `${score.home} - ${score.away}`
                              : "Not specified"}
                          </Typography>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => toggleFieldEdit("score")}
                          sx={{ ml: 1 }}
                        >
                          {editableFields.score ? (
                            <CheckIcon fontSize="small" />
                          ) : (
                            <Edit fontSize="small" />
                          )}
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Confidence Level */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Typography sx={{ minWidth: 120 }}>
                        <strong>Confidence:</strong>
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {editableFields.confidence ? (
                          <TextField
                            type="number"
                            value={formData.confidence}
                            onChange={(e) => {
                              const value = Math.min(
                                100,
                                Math.max(0, parseInt(e.target.value) || 0)
                              );
                              setFormData((prev) => ({
                                ...prev,
                                confidence: value,
                              }));
                            }}
                            InputProps={{
                              inputProps: { min: 0, max: 100 },
                              endAdornment: (
                                <InputAdornment position="end">
                                  %
                                </InputAdornment>
                              ),
                            }}
                            size="small"
                            sx={{ width: 100 }}
                          />
                        ) : (
                          <Typography
                            sx={{ minWidth: 200, textAlign: "right" }}
                          >
                            {typeof formData.confidence === "number"
                              ? `${formData.confidence}%`
                              : "Not specified"}
                          </Typography>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => toggleFieldEdit("confidence")}
                          sx={{ ml: 1 }}
                        >
                          {editableFields.confidence ? (
                            <CheckIcon fontSize="small" />
                          ) : (
                            <Edit fontSize="small" />
                          )}
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Comment */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 2,
                      }}
                    >
                      <Typography sx={{ minWidth: 120, mt: 0.5 }}>
                        <strong>Comment:</strong>
                      </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {editableFields.comment ? (
                          <TextField
                            value={formData.comment}
                            onChange={handleCommentChange}
                            fullWidth
                            size="small"
                            multiline
                            rows={2}
                            sx={{ minWidth: 200, }}
                          />
                        ) : (
                          <Typography
                            sx={{
                              fontStyle: formData.comment
                                ? "italic"
                                : "inherit",
                              textAlign: "right",
                            }}
                          >
                            {formData.comment || "No comment added"}
                          </Typography>
                        )}
                        <Box
                          sx={{ display: "flex", justifyContent: "flex-end" }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => toggleFieldEdit("comment")}
                          >
                            {editableFields.comment ? (
                              <CheckIcon fontSize="small" />
                            ) : (
                              <Edit fontSize="small" />
                            )}
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Analysis Preview Card */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Analysis Preview
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => {
                        if (editableFields.expertAnalysis) {
                          toggleFieldEdit("expertAnalysis");
                        } else {
                          toggleFieldEdit("expertAnalysis");
                        }
                      }}
                    >
                      {editableFields.expertAnalysis ? (
                        <CheckIcon fontSize="small" />
                      ) : (
                        <Edit fontSize="small" />
                      )}
                    </IconButton>
                  </Box>

                  <Box sx={{ pt: 2 }}>
                    {editableFields.expertAnalysis ? (
                      <TextareaAutosize
                        minRows={6}
                        style={{
                          width: "100%",
                          padding: "8px",
                          fontFamily: "inherit",
                          fontSize: "inherit",
                          border: "1px solid rgba(0, 0, 0, 0.23)",
                          borderRadius: "4px",
                          resize: "vertical",
                        }}
                        value={formData.expertAnalysis}
                        onChange={handleAnalysisChange}
                      />
                    ) : (
                      <Typography sx={{ whiteSpace: "pre-line" }}>
                        {formData.expertAnalysis || "No analysis provided"}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Selected Options Card */}
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Selected Options
                  </Typography>

                  <Box sx={{ pt: 2 }}>
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
                </Box>
              </CardContent>
            </Card>
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
        <Box sx={{ mb: 6 }}>
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
        <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h3"
            component="label"
            sx={{
              color: "text.primary",
              fontWeight: "medium",
            }}
          >
            New Prediction
          </Typography>
        </Box>

        {/* Form content */}
         <Box sx={{ position: 'relative' }}>
        {renderStepContent(activeStep)}

        {/* AskHuddle chat */}
          {/* <AskHuddle /> */}
       
        </Box>

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

        {/* post Confirmation Dialog */}
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
                value={formData.audience || "all"}
                label="Audience"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    audience: e.target.value,
                  }))
                }
              >
                <MenuItem value="all">All users</MenuItem>
                <MenuItem value="free">Free users</MenuItem>
                <MenuItem value="premium">Premium users</MenuItem>
              </Select>
            </FormControl>
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
