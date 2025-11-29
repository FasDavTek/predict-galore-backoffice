// features/components/PredictionForm/steps/SubmissionPreviewStep.tsx
import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
} from '@mui/material';

import {
    Analytics as AnalyticsIcon,
    TrendingUp as TrendingUpIcon,
    Preview as PreviewIcon,
    SportsSoccer as SportsSoccerIcon

} from '@mui/icons-material'

import { Fixture } from '../../../types/prediction.types';

interface SubmissionPreviewStepProps {
  fixture: Fixture | null;
  isPremium: boolean;
  analysis: string;
  accuracy: number;
  picks: Array<{ market: string; selectionKey: string; confidence: number }>;
  fixtureFromDate: Date | null;
}

export const SubmissionPreviewStep: React.FC<SubmissionPreviewStepProps> = ({
  fixture,
  isPremium,
  analysis,
  accuracy,
  picks,
  fixtureFromDate,
}) => {
  return (
    <Box>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}
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
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <SportsSoccerIcon fontSize="small" />
            Match Details
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography>
              <strong>Fixture:</strong> {fixture?.label || 'N/A'}
            </Typography>
            <Typography>
              <strong>Kickoff:</strong>{' '}
              {fixture?.kickoffUtc
                ? new Date(fixture.kickoffUtc).toLocaleString()
                : 'N/A'}
            </Typography>
            <Typography>
              <strong>Fixtures From:</strong>{' '}
              {fixtureFromDate ? fixtureFromDate.toLocaleDateString() : 'Today'}
            </Typography>
            <Typography>
              <strong>Type:</strong>
              <Chip
                label={isPremium ? 'Premium' : 'Free'}
                color={isPremium ? 'primary' : 'default'}
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
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <AnalyticsIcon fontSize="small" />
            Analysis
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
            {analysis || 'No analysis provided'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
        sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 3 }}
      >
        <TrendingUpIcon fontSize="small" />
        Prediction Picks
      </Typography>

      {picks.map((pick, index) => (
        <Card key={index} sx={{ mb: 1, p: 2 }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
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