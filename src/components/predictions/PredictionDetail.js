// components/dashboard/predictions/PredictionDetail.js
import React, { useState } from "react";
import {
  Box,
  Link,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Avatar,
  Chip,
  Collapse,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Breadcrumbs,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { cancelPrediction } from "../../store/slices/predictionSlice";

const PredictionDetail = ({ prediction, onBack }) => {
  const dispatch = useDispatch();
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    teamForm: true,
    teamComparison: true,
    topScorers: false,
    headToHead: true,
    teamStatistics: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "won":
        return {
          bgcolor: "#ECFDF3",
          color: "#027A48",
          borderColor: "#027A48",
        };
      case "lost":
        return {
          bgcolor: "#FEF3F2",
          color: "#B42318",
          borderColor: "#B42318",
        };
      case "pending":
        return {
          bgcolor: "#FFFAEB",
          color: "#B54708",
          borderColor: "#B54708",
        };
      default:
        return {};
    }
  };

  const handleCancelConfirm = async () => {
    setActionLoading(true);
    try {
      await dispatch(cancelPrediction(prediction.id));
      onBack();
    } finally {
      setActionLoading(false);
      setOpenCancelDialog(false);
    }
  };

  if (!prediction) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mb: 2 }}>
          Back to Predictions
        </Button>
        <Typography variant="h6">Prediction data not available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "background.paper", p: 3, borderRadius: 2 }}>
      
      {/* Header with breadcrumb and action buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            color="inherit"
            onClick={onBack}
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Predictions
          </Link>
          <Typography color="text.primary">Prediction Details</Typography>
        </Breadcrumbs>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            color="error"
            onClick={() => setOpenCancelDialog(true)}
          >
            Delete Prediction
          </Button>
        </Stack>
      </Box>

      {/* Match Information Card */}
      <Card sx={{ mb: 6 }}>
        <CardContent>
          {/* Match Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 6,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
               {/* League icon would go here */}
              {/* <Avatar sx={{ width: 24, height: 24 }}>
               
              </Avatar> */}
              <Typography variant="h6">{prediction.league}</Typography>
            </Box>
            {/* <Typography variant="body2" color="text.secondary">
              {new Date(prediction.date).toLocaleDateString("en-GB")}
            </Typography> */}
          </Box>

          {/* Teams Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                src={prediction.homeTeamLogo}
                sx={{ width: 64, height: 64 }}
              />
              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                {prediction.homeTeam}
              </Typography>
            </Box>

            <Typography variant="h4" sx={{ mx: 2 }}>
              VS
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                src={prediction.awayTeamLogo}
                sx={{ width: 64, height: 64 }}
              />
              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                {prediction.awayTeam}
              </Typography>
            </Box>
          </Box>

          {/* Status Badge */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Chip
              label={prediction.status}
              sx={{
                ...getStatusStyles(prediction.status),
                borderRadius: "8px",
                px: 2,
                py: 1,
                fontSize: "0.875rem",
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Prediction Information */}
      <Card sx={{ mb: 6 }}>
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Predicted Winner */}
            <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ minWidth: 120 }}
              >
                Predicted Winner:
              </Typography>
              <Typography>{prediction.predictedWinner}</Typography>
            </Box>

            {/* Predicted Score */}
            <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ minWidth: 120 }}
              >
                Predicted Score:
              </Typography>
              <Typography>
                {prediction.predictedScore
                  ? `${prediction.predictedScore.home}-${prediction.predictedScore.away}`
                  : "N/A"}
              </Typography>
            </Box>

            {/* Actual Score */}
            <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ minWidth: 120 }}
              >
                Actual Score:
              </Typography>
              <Typography>
                {prediction.actualScore
                  ? `${prediction.actualScore.home}-${prediction.actualScore.away}`
                  : "Not available"}
              </Typography>
            </Box>

            {/* Prediction Date */}
            <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ minWidth: 120 }}
              >
                Prediction Date:
              </Typography>
              <Typography>
                {new Date(prediction.predictionDate).toLocaleDateString(
                  "en-GB"
                )}
              </Typography>
            </Box>

            {/* Last Updated */}
            <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ minWidth: 120 }}
              >
                Last Updated:
              </Typography>
              <Typography>
                {new Date(prediction.lastUpdated).toLocaleDateString("en-GB")}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Analysis Section */}
      <Card sx={{ mb: 6 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Expert Analysis
          </Typography>
          <Typography sx={{ whiteSpace: "pre-line" }}>
            {prediction.expertAnalysis || "No analysis provided"}
          </Typography>
        </CardContent>
      </Card>

      {/* Additional Information Sections */}
      <Card >  
        <CardContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

          <Typography variant="h6" gutterBottom>
            Additional Information
          </Typography>

          {/* Team Form */}
          <Card variant="outlined" sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
              }}
            >
              <Typography variant="subtitle1">Team Form</Typography>
              <IconButton
                size="small"
                onClick={() => toggleSection("teamForm")}
              >
                {expandedSections.teamForm ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </IconButton>
            </Box>
            <Collapse in={expandedSections.teamForm}>
              <CardContent>
                <Typography>
                  {prediction.teamForm || "Team form data not available"}
                </Typography>
              </CardContent>
            </Collapse>
          </Card>

          {/* Team Comparison */}
          <Card variant="outlined" sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
              }}
            >
              <Typography variant="subtitle1">Team Comparison</Typography>
              <IconButton
                size="small"
                onClick={() => toggleSection("teamComparison")}
              >
                {expandedSections.teamComparison ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </IconButton>
            </Box>
            <Collapse in={expandedSections.teamComparison}>
              <CardContent>
                <Typography>
                  {prediction.teamComparison ||
                    "Team comparison data not available"}
                </Typography>
              </CardContent>
            </Collapse>
          </Card>

          {/* Top Scorers */}
          <Card variant="outlined">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
              }}
            >
              <Typography variant="subtitle1">Top Scorers</Typography>
              <IconButton
                size="small"
                onClick={() => toggleSection("topScorers")}
              >
                {expandedSections.topScorers ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </IconButton>
            </Box>
            <Collapse in={expandedSections.topScorers}>
              <CardContent>
                <Typography>
                  {prediction.topScorers || "Top scorers data not available"}
                </Typography>
              </CardContent>
            </Collapse>
          </Card>

          </Box>
        </CardContent>
        
      </Card>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Prediction</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this prediction? This action cannot
            be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenCancelDialog(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCancelConfirm}
            color="error"
            disabled={actionLoading}
          >
            {actionLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PredictionDetail;
