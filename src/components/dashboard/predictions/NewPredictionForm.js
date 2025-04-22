// components/dashboard/predictions/NewPredictionForm.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
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
  IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Check as CheckIcon,
  Schedule as ScheduleIcon,
  Lock as LockIcon,
  Public as PublicIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import {
  SportsSoccer as SportsSoccerIcon,
  SportsBasketball as SportsBasketballIcon,
  SportsTennis as SportsTennisIcon,
  SportsBaseball as SportsBaseballIcon,
  SportsFootball as SportsFootballIcon
} from '@mui/icons-material';

// Define the steps for the prediction form
const steps = ['Sport & League', 'Match Selection', 'Prediction Details', 'Expert Analysis', 'Preview'];

// Available sports with icons
const sports = [
  { value: 'football', label: 'Football', icon: <SportsSoccerIcon /> },
  { value: 'american_football', label: 'American Football', icon: <SportsFootballIcon /> },
  { value: 'tennis', label: 'Tennis', icon: <SportsTennisIcon /> },
  { value: 'basketball', label: 'Basketball', icon: <SportsBasketballIcon /> },
  { value: 'baseball', label: 'Baseball', icon: <SportsBaseballIcon /> },
];

// Football leagues for selection
const footballLeagues = [
  'English Premier League',
  'Champions League',
  'LaLiga',
  'Serie A',
  'Ligue 1',
  'Bundesliga'
];

// Types of predictions users can make
const predictionTypes = [
  'Match Winner',
  'Correct Score',
  'Goal Scorer',
  '1X2',
  'Over/Under',
  'Handicap',
  'Double Chance',
  'Draw no Bet',
  'Both Teams to Score'
];

// Options for who can view the prediction
const audienceOptions = [
  { value: 'public', label: 'Public', icon: <PublicIcon />, description: 'Visible to everyone' },
  { value: 'subscribers', label: 'Subscribers Only', icon: <GroupIcon />, description: 'Visible to your subscribers' },
  { value: 'private', label: 'Private', icon: <LockIcon />, description: 'Only visible to you' }
];

const NewPredictionForm = ({ onBack, onSubmit }) => {
  // State for tracking which step we're on
  const [activeStep, setActiveStep] = useState(0);
  
  // State for the form data
  const [formData, setFormData] = useState({
    sport: 'football',
    league: 'English Premier League',
    match: '',
    homeTeam: '',
    awayTeam: '',
    predictionType: 'Match Winner',
    predictedOutcome: '',
    confidence: 95,
    comment: '',
    expertAnalysis: '',
    audience: 'public',
    scheduledDate: null
  });

  // State for confirmation dialog
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  // Function to move to next step
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // On last step, open confirmation dialog instead of submitting directly
      setOpenConfirmDialog(true);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  // Function to go back to previous step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Function to handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to handle audience selection
  const handleAudienceChange = (value) => {
    setFormData(prev => ({
      ...prev,
      audience: value
    }));
  };

  // Function to handle scheduling
  const handleSchedule = (date) => {
    setFormData(prev => ({
      ...prev,
      scheduledDate: date
    }));
    setOpenConfirmDialog(false);
    onSubmit(formData);
  };

  // Function to get sport icon
  const getSportIcon = (sportValue) => {
    const sport = sports.find(s => s.value === sportValue);
    return sport ? sport.icon : <SportsSoccerIcon />;
  };

  // Function to render content for each step
  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Sport & League selection
        return (
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Select Sport</Typography>
                <FormControl fullWidth>
                  <Autocomplete
                    options={sports}
                    getOptionLabel={(option) => option.label}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        {option.icon}
                        <Typography sx={{ ml: 1 }}>{option.label}</Typography>
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search sport"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                    value={sports.find(s => s.value === formData.sport) || null}
                    onChange={(e, newValue) => {
                      setFormData(prev => ({
                        ...prev,
                        sport: newValue ? newValue.value : '',
                        league: '' // Reset league when sport changes
                      }));
                    }}
                  />
                </FormControl>
              </Grid>
              
              {formData.sport && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Select League</Typography>
                  <FormControl fullWidth>
                    <Autocomplete
                      options={footballLeagues}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Search league"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                      value={formData.league || null}
                      onChange={(e, newValue) => {
                        setFormData(prev => ({
                          ...prev,
                          league: newValue || ''
                        }));
                      }}
                    />
                  </FormControl>
                </Grid>
              )}
            </Grid>
          </Box>
        );
      case 1: // Match selection
        return (
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Select Match</Typography>
                <FormControl fullWidth>
                  <Autocomplete
                    options={[
                      'Arsenal vs Chelsea',
                      'Manchester United vs Liverpool',
                      'Barcelona vs Real Madrid',
                      'Bayern Munich vs Dortmund'
                    ]}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search match"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                    value={formData.match || null}
                    onChange={(e, newValue) => {
                      if (newValue) {
                        const [home, away] = newValue.split(' vs ');
                        setFormData(prev => ({
                          ...prev,
                          match: newValue,
                          homeTeam: home,
                          awayTeam: away
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          match: '',
                          homeTeam: '',
                          awayTeam: ''
                        }));
                      }
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );
      case 2: // Prediction details
        return (
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Prediction Type</Typography>
                <FormControl fullWidth>
                  <Autocomplete
                    options={predictionTypes}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                      <TextField {...params} label="Select prediction type" />
                    )}
                    value={formData.predictionType || null}
                    onChange={(e, newValue) => {
                      setFormData(prev => ({
                        ...prev,
                        predictionType: newValue || ''
                      }));
                    }}
                  />
                </FormControl>
              </Grid>
              
              {formData.predictionType === 'Match Winner' && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Predicted Outcome</Typography>
                  <FormControl fullWidth>
                    <RadioGroup
                      name="predictedOutcome"
                      value={formData.predictedOutcome}
                      onChange={handleChange}
                    >
                      <FormControlLabel 
                        value={formData.homeTeam} 
                        control={<Radio />} 
                        label={formData.homeTeam} 
                      />
                      <FormControlLabel 
                        value="Draw" 
                        control={<Radio />} 
                        label="Draw" 
                      />
                      <FormControlLabel 
                        value={formData.awayTeam} 
                        control={<Radio />} 
                        label={formData.awayTeam} 
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              )}
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Confidence Level</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider
                    value={formData.confidence}
                    onChange={(e, newValue) => setFormData(prev => ({ ...prev, confidence: newValue }))}
                    aria-labelledby="confidence-slider"
                    valueLabelDisplay="auto"
                    sx={{ flexGrow: 1 }}
                  />
                  <Typography sx={{ minWidth: '50px' }}>{formData.confidence}%</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  placeholder="Explain your prediction (e.g., Based on Chelsea's recent losses and player injuries)"
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 3: // Expert analysis
        return (
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Expert Analysis</Typography>
                <TextField
                  fullWidth
                  name="expertAnalysis"
                  value={formData.expertAnalysis}
                  onChange={handleChange}
                  multiline
                  rows={10}
                  placeholder="Provide detailed analysis (e.g., Arsenal is coming into this match with an unbeaten run of 6 home games...)"
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 4: // Preview
        return (
          <Box sx={{ mt: 3 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Preview Your Prediction</Typography>
              <Divider sx={{ mb: 3 }} />
              
              {/* Sport, League, Match */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2">Sport:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getSportIcon(formData.sport)}
                    <Typography>
                      {sports.find(s => s.value === formData.sport)?.label || 'Not selected'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2">League:</Typography>
                  <Typography>{formData.league || 'Not selected'}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2">Match:</Typography>
                  <Typography>{formData.match || 'Not selected'}</Typography>
                </Grid>
              </Grid>
              
              {/* Prediction Details */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Predicted Outcome</Typography>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'action.hover', 
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {formData.predictedOutcome || 'Not selected'}
                  </Typography>
                  <Chip 
                    label={`${formData.confidence}%`} 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>
                {formData.comment && (
                  <Typography sx={{ mt: 1, fontStyle: 'italic' }}>
                    &quot;{formData.comment}&quot;
                  </Typography>
                )}
              </Box>
              
              {/* Expert Analysis */}
              {formData.expertAnalysis && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Expert Analysis</Typography>
                  <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
                    <Typography sx={{ whiteSpace: 'pre-line' }}>
                      {formData.expertAnalysis}
                    </Typography>
                  </Paper>
                </Box>
              )}
              
              {/* Audience Selection */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Post Prediction</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>Select who can view this prediction before posting</Typography>
                
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Audience</Typography>
                <FormControl fullWidth>
                  <RadioGroup
                    value={formData.audience}
                    onChange={(e) => handleAudienceChange(e.target.value)}
                  >
                    {audienceOptions.map((option) => (
                      <Paper key={option.value} sx={{ mb: 1, p: 1 }}>
                        <FormControlLabel
                          value={option.value}
                          control={<Radio />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                {option.icon}
                              </Avatar>
                              <Box>
                                <Typography>{option.label}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {option.description}
                                </Typography>
                              </Box>
                            </Box>
                          }
                          sx={{ width: '100%', m: 0 }}
                        />
                      </Paper>
                    ))}
                  </RadioGroup>
                </FormControl>
              </Box>
            </Paper>
          </Box>
        );
      default:
        return null;
    }
  };

  // Function to validate each step
  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return formData.sport && formData.league;
      case 1:
        return formData.match;
      case 2:
        return formData.predictedOutcome;
      case 3:
        return true; // Expert analysis is optional
      case 4:
        return true; // Preview step is always valid
      default:
        return false;
    }
  };

  return (
    <Box>
      {/* Header with back and next buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={onBack}
          sx={{ mr: 2 }}
        >
          Back to Predictions
        </Button>
        
        {activeStep < steps.length - 1 ? (
          <Button 
            variant="contained" 
            onClick={handleNext}
            disabled={!isStepValid(activeStep)}
          >
            Next
          </Button>
        ) : (
          <Button 
            variant="contained" 
            color="success"
            onClick={handleNext}
            startIcon={<AddIcon />}
          >
            Post Prediction
          </Button>
        )}
      </Box>

      {/* Stepper to show progress */}
      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Form content for current step */}
      {renderStepContent(activeStep)}

      {/* Navigation buttons at bottom */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
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
              onClick={() => handleSchedule(new Date())}
            >
              Schedule
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!isStepValid(activeStep)}
          >
            {activeStep === steps.length - 1 ? 'Post Prediction' : 'Next'}
          </Button>
        </Box>
      </Box>

      {/* Confirmation dialog before posting */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Confirm Prediction</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to post this prediction? Once posted, it will be visible to your selected audience.
          </DialogContentText>
          <List>
            <ListItem>
              <ListItemText 
                primary="Match" 
                secondary={formData.match} 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Prediction" 
                secondary={`${formData.predictedOutcome} (${formData.confidence}% confidence)`} 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Audience" 
                secondary={audienceOptions.find(a => a.value === formData.audience)?.label} 
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              setOpenConfirmDialog(false);
              onSubmit(formData);
            }} 
            variant="contained"
            color="primary"
            startIcon={<CheckIcon />}
          >
            Confirm Post
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NewPredictionForm;