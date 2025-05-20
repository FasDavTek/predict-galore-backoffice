import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  Chip,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { Home as HomeIcon, Edit as EditIcon } from "@mui/icons-material";

const PredictionDetail = ({ 
  prediction, 
  onBack, 
  onUpdate,
  onDelete 
}) => {
  // Early return if no prediction data
  if (!prediction) return null;

  return (
    <Box>
      {/* Breadcrumb navigation */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          color="inherit"
          onClick={onBack}
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Predictions
        </Link>
        <Typography color="text.primary">Prediction Details</Typography>
      </Breadcrumbs>

      {/* Main prediction card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          {/* Header with title and status */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5">{prediction.title}</Typography>
            <Chip 
              label={prediction.status} 
              color={
                prediction.status === 'won' ? 'success' : 
                prediction.status === 'lost' ? 'error' : 'warning'
              }
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Prediction description */}
          <Typography variant="body1" paragraph>
            {prediction.description}
          </Typography>

          {/* Metadata section */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Team: {prediction.team?.name || 'N/A'}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Created: {new Date(prediction.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => onUpdate(prediction)}
        >
          Edit Prediction
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => onDelete(prediction.id)}
        >
          Delete Prediction
        </Button>
      </Box>
    </Box>
  );
};

export default PredictionDetail;