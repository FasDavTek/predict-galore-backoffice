// features/components/PredictionForm/steps/PredictionAnalysisStep.tsx
import React from 'react';
import {
  Box,
  Typography,
  Button,
  FormControl,
  TextField,
  Chip,
} from '@mui/material';

import {
    Analytics as AnalyticsIcon,
    TrendingUp as TrendingUpIcon

} from '@mui/icons-material'


import { PredictionTypeOption, Pick } from '../../../types/prediction.types';
import { FieldErrors, UseFormReturn } from 'react-hook-form';
import { SportsPredictionFormValues } from '../../../validations/predictionSchema';

import { PredictionMarket } from '../PredictionMarket';

interface PredictionAnalysisStepProps {
  predictionTypes: PredictionTypeOption[];
  picks: Array<Pick & { id: string }>;
  onAddPick: () => void;
  onRemovePick: (index: number) => void;
  onPickChange: (index: number, field: string, value: string | number) => void;
  errors: FieldErrors<SportsPredictionFormValues>;
  formValues: {
    analysis: string;
    accuracy: number;
  };
  methods: UseFormReturn<SportsPredictionFormValues>;
  onOpenAskHuddle: () => void;
}

export const PredictionAnalysisStep: React.FC<PredictionAnalysisStepProps> = ({
  predictionTypes,
  picks,
  onAddPick,
  onRemovePick,
  onPickChange,
  errors,
  formValues,
  methods,
}) => {
  const { setValue, register } = methods;
  const { analysis, accuracy } = formValues;

  return (
    <Box>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}
      >
        <AnalyticsIcon color="primary" />
        Prediction Analysis
      </Typography>

      {/* Analysis Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Match Analysis
          </Typography>
        </Box>
        
        <FormControl fullWidth error={!!errors.analysis}>
          <TextField
            {...register('analysis')}
            label="Detailed Analysis *"
            multiline
            rows={6}
            value={analysis}
            onChange={(e) => setValue('analysis', e.target.value)}
            error={!!errors.analysis}
            helperText={
              errors.analysis?.message ||
              'Provide detailed analysis and reasoning for your prediction'
            }
            placeholder="Analyze team form, key players, injuries, historical data, and other relevant factors..."
          />
        </FormControl>
      </Box>

      {/* Accuracy Slider */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Prediction Confidence
        </Typography>
        <FormControl fullWidth>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TrendingUpIcon color="action" />
            <Box sx={{ flexGrow: 1 }}>
              <Typography gutterBottom>Accuracy: {accuracy}%</Typography>
              <input
                type="range"
                min="0"
                max="100"
                value={accuracy}
                onChange={(e) => setValue('accuracy', Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </Box>
            <Chip 
              label={`${accuracy}%`} 
              color={
                accuracy >= 80 ? 'success' : 
                accuracy >= 60 ? 'warning' : 'error'
              }
              variant="filled"
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            {accuracy >= 80 ? 'High confidence prediction' :
             accuracy >= 60 ? 'Moderate confidence prediction' :
             'Low confidence prediction'}
          </Typography>
        </FormControl>
      </Box>

      {/* Prediction Picks */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Market Picks
          </Typography>
          <Button onClick={onAddPick} variant="outlined" size="small">
            Add Pick
          </Button>
        </Box>

        {picks.map((pick, index) => (
          <PredictionMarket
            key={pick.id}
            index={index}
            pick={pick}
            predictionTypes={predictionTypes}
            onRemove={onRemovePick}
            onChange={onPickChange}
            errors={errors}
            canRemove={picks.length > 1}
          />
        ))}

        {errors.picks && (
          <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
            {errors.picks.message}
          </Typography>
        )}
      </Box>
    </Box>
  );
};