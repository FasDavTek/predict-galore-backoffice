// features/components/TestPredictionForm.tsx
import React, { useState } from 'react';
import { Box, Button, Typography, Snackbar, Alert } from '@mui/material';
import { createLogger } from '@/shared/api';
import { useCreatePrediction } from '@/features/predictions';

const logger = createLogger('PredictionForm:Test');

// Define proper types for the payload
interface TestPick {
  market: string;
  selectionKey: string;
  selectionLabel: string;
  confidence: number;
  odds: number;
  tip: string;
  recentForm: string;
  homeScore: number;
  awayScore: number;
  tipGoals: number;
  playerId: number;
  playerName: string;
  teamId: number;
  teamName: string;
  subType: string;
}

interface TestPayload {
  fixtureId: number;
  title: string;
  analysis: string;
  accuracy: number;
  expertAnalysis: string;
  audience: 'FREE' | 'PREMIUM';
  includeTeamForm: boolean;
  includeTeamComparison: boolean;
  includeTopScorers: boolean;
  isPremium: boolean;
  isScheduled: boolean;
  scheduledTime: string;
  picks: TestPick[];
}

interface TestConfig {
  name: string;
  payload: TestPayload;
}

// Define error type
interface ApiError {
  status?: number;
  data?: {
    message?: string;
  };
  error?: string;
}

// Type guard to check if error is ApiError
const isApiError = (error: unknown): error is ApiError => {
  return error !== null && typeof error === 'object';
};

export const TestPredictionForm: React.FC = () => {
  const createPredictionMutation = useCreatePrediction();
  const isLoading = createPredictionMutation.isPending;
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Update the test payloads to match what the API expects
  const testPayloads: TestConfig[] = [
    {
      name: 'Minimal Test',
      payload: {
        fixtureId: 23094,
        title: 'Test Prediction - Minimal',
        analysis: 'Test analysis',
        accuracy: 50,
        expertAnalysis: 'Test expert analysis',
        audience: 'FREE',
        includeTeamForm: false,
        includeTeamComparison: false,
        includeTopScorers: false,
        isPremium: false,
        isScheduled: false,
        scheduledTime: new Date().toISOString(),
        picks: [
          {
            market: 'FullTimeResult_1X2',
            selectionKey: 'HOME',
            selectionLabel: 'Home Win',
            confidence: 70,
            odds: 2.5, // Changed from 0 to 2.5 for testing
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
          },
        ],
      },
    },
    {
      name: 'With Realistic Values',
      payload: {
        fixtureId: 23094,
        title: 'Prediction for BC Rangers vs Warriors',
        analysis: 'Detailed analysis for the match',
        accuracy: 65,
        expertAnalysis: 'Expert insights on team form and player performance',
        audience: 'FREE',
        includeTeamForm: true,
        includeTeamComparison: true,
        includeTopScorers: false,
        isPremium: false,
        isScheduled: false,
        scheduledTime: new Date().toISOString(),
        picks: [
          {
            market: 'FullTimeResult_1X2',
            selectionKey: 'HOME',
            selectionLabel: 'BC Rangers Win',
            confidence: 75,
            odds: 1.85,
            tip: 'Home team has strong home record',
            recentForm: 'WWLDD',
            homeScore: 2,
            awayScore: 0,
            tipGoals: 2,
            playerId: 0,
            playerName: '',
            teamId: 123,
            teamName: 'BC Rangers',
            subType: '',
          },
        ],
      },
    },
  ];

  const handleTest = async (payload: TestPayload) => {
    try {
      logger.debug('Testing prediction creation', { payload });

      // Get admin user from auth or use a default
      const adminUser = 'admin'; // TODO: Get from auth context
      const result = await createPredictionMutation.mutateAsync({
        data: payload,
        adminUser,
      });

      setSnackbar({
        open: true,
        message: `✅ ${payload.title} - Success!`,
        severity: 'success',
      });

      logger.info('Prediction created successfully', { predictionId: result.id, title: payload.title });
    } catch (error) {
      logger.error('Failed to create prediction', {
        error,
        payload,
        fullError: JSON.stringify(error, null, 2),
      });

      let errorMessage = 'Unknown error';

      if (isApiError(error)) {
        errorMessage = error?.data?.message || error?.error || 'Unknown error';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      setSnackbar({
        open: true,
        message: `❌ ${payload.title} - ${errorMessage}`,
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Test Prediction Creation
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Try different payloads to identify the issue
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {testPayloads.map((test, index) => (
          <Box
            key={index}
            sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              backgroundColor: 'background.paper',
            }}
          >
            <Typography variant="h6" gutterBottom>
              {test.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
              fixtureId: {test.payload.fixtureId}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: 12 }}>
                {JSON.stringify(test.payload.picks[0], null, 2)}
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={() => handleTest(test.payload)}
              disabled={isLoading}
            >
              {isLoading ? 'Testing...' : `Test ${test.name}`}
            </Button>
          </Box>
        ))}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
