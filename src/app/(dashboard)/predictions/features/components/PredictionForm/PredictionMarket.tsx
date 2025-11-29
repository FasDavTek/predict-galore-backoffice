// features/components/PredictionForm/PredictionMarket.tsx
import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  FormControl,
  TextField,
} from '@mui/material';
import { Autocomplete } from '@mui/material';

import { PredictionTypeOption, Pick } from '../../types/prediction.types';
import { FieldErrors } from 'react-hook-form';
import { SportsPredictionFormValues } from '../../validations/predictionSchema';

interface PredictionMarketProps {
  index: number;
  pick: Pick;
  predictionTypes: PredictionTypeOption[];
  onRemove: (index: number) => void;
  onChange: (index: number, field: string, value: string | number) => void;
  errors: FieldErrors<SportsPredictionFormValues>;
  canRemove: boolean;
}

export const PredictionMarket: React.FC<PredictionMarketProps> = ({
  index,
  pick,
  predictionTypes,
  onRemove,
  onChange,
  errors,
  canRemove,
}) => {
  return (
    <Card sx={{ mb: 2, p: 2, border: errors.picks?.[index] ? '1px solid #f44336' : '1px solid #e0e0e0' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="subtitle1">
            Pick #{index + 1}
          </Typography>
          {canRemove && (
            <Button
              onClick={() => onRemove(index)}
              color="error"
              size="small"
              variant="outlined"
            >
              Remove
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Market Selection */}
          <FormControl fullWidth error={!!errors.picks?.[index]?.market}>
            <Autocomplete
              options={predictionTypes}
              getOptionLabel={(option: PredictionTypeOption | string) => 
                typeof option === 'string' ? option : option.name
              }
              value={predictionTypes.find(pt => pt.name === pick.market) || pick.market || null}
              onChange={(_, newValue) => {
                const marketValue = typeof newValue === 'string' ? newValue : newValue?.name || '';
                onChange(index, 'market', marketValue);
              }}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Market *"
                  error={!!errors.picks?.[index]?.market}
                  helperText={errors.picks?.[index]?.market?.message}
                  placeholder="e.g., Match Winner, Over/Under, Both Teams to Score"
                />
              )}
            />
          </FormControl>

          {/* Selection Key */}
          <FormControl fullWidth error={!!errors.picks?.[index]?.selectionKey}>
            <TextField
              label="Selection *"
              value={pick.selectionKey}
              onChange={(e) => onChange(index, 'selectionKey', e.target.value)}
              error={!!errors.picks?.[index]?.selectionKey}
              helperText={errors.picks?.[index]?.selectionKey?.message}
              placeholder="e.g., Home Win, Over 2.5, Yes"
            />
          </FormControl>
        </Box>

        {/* Confidence Slider */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" gutterBottom>
            Confidence: {pick.confidence}%
          </Typography>
          <input
            type="range"
            min="0"
            max="100"
            value={pick.confidence}
            onChange={(e) => onChange(index, 'confidence', Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">
              Low
            </Typography>
            <Typography variant="caption" color="text.secondary">
              High
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};