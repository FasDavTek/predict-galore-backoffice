// features/components/PredictionForm/steps/PredictionAnalysisStep.tsx
import React from 'react';
import {
  Box,
  Typography,
  Button,
  FormControl,
  TextField,
  Card,
  CardContent,
  Autocomplete,
  CircularProgress,
  Slider,
} from '@mui/material';
import { Analytics as AnalyticsIcon, TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import { FieldErrors, UseFormReturn } from 'react-hook-form';
import { SportsPredictionFormValues, Market } from '@/features/predictions';
import { useMarkets, useMarketSelections } from '@/features/predictions';

interface PredictionAnalysisStepProps {
  picks: Array<{
    id: string;
    market: string;
    selectionKey: string;
    selectionLabel: string;
    confidence: number;
  }>;
  onAddPick: () => void;
  onRemovePick: (index: number) => void;
  onPickChange: (index: number, field: string, value: string | number) => void;
  errors: FieldErrors<SportsPredictionFormValues>;
  formValues: {
    analysis: string;
    accuracy: number;
  };
  methods: UseFormReturn<SportsPredictionFormValues>;
}

interface ApiSelection {
  key: string;
  label: string;
}

interface TransformedSelection {
  id: number;
  code: string;
  marketId: number;
  name: string;
  isActive: boolean;
  selectionKey: string;
  displayLabel: string;
}

export const PredictionAnalysisStep: React.FC<PredictionAnalysisStepProps> = ({
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

  // Get all markets
  const { data: marketsData, isLoading: isMarketsLoading } = useMarkets();
  const markets = marketsData || [];

  // Collect unique market IDs from picks
  const marketIds = picks.reduce<number[]>((ids, pick) => {
    const market = markets.find((m: Market) => m.name === pick.market);
    if (market && !ids.includes(market.id)) {
      ids.push(market.id);
    }
    return ids;
  }, []);

  // Fetch selections for each market (using conditional hooks)
  const selections1 = useMarketSelections({ marketId: marketIds[0] }, { enabled: !!marketIds[0] });
  const selections2 = useMarketSelections({ marketId: marketIds[1] }, { enabled: !!marketIds[1] });
  const selections3 = useMarketSelections({ marketId: marketIds[2] }, { enabled: !!marketIds[2] });
  const selections4 = useMarketSelections({ marketId: marketIds[3] }, { enabled: !!marketIds[3] });
  const selections5 = useMarketSelections({ marketId: marketIds[4] }, { enabled: !!marketIds[4] });

  const marketSelectionQueries = [selections1, selections2, selections3, selections4, selections5];

  // Helper to process API response into TransformedSelection objects
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const processSelectionsResponse = (data: unknown): TransformedSelection[] => {
    if (!data || typeof data !== 'object') return [];

    const response = data as { data?: ApiSelection[] };
    if (!response.data || !Array.isArray(response.data)) return [];

    return response.data
      .filter((item): item is ApiSelection => item.key !== undefined && item.label !== undefined && item.label.trim() !== '')
      .map((item, index) => ({
        id: index,
        code: item.key,
        marketId: 0,
        name: item.label,
        isActive: true,
        selectionKey: item.key,
        displayLabel: item.label.trim() || `Selection ${index + 1}`,
      }));
  };

  // Get selections for a specific market by ID
  const getSelectionsForMarketId = (marketId: number): TransformedSelection[] => {
    const marketIndex = marketIds.indexOf(marketId);
    if (marketIndex === -1) return [];

    const query = marketSelectionQueries[marketIndex];
    if (!query.data) return [];

    // First pass: create selections with base labels
    const selections = query.data.map((item, index: number) => {
      const baseLabel = item.label?.trim() || `Selection ${index + 1}`;
      return {
        id: index,
        code: item.key,
        marketId: marketId,
        name: item.label,
        isActive: true,
        selectionKey: item.key,
        displayLabel: baseLabel,
      };
    });

    // Second pass: ensure unique display labels
    const labelCounts: Record<string, number> = {};
    selections.forEach(selection => {
      labelCounts[selection.displayLabel] = (labelCounts[selection.displayLabel] || 0) + 1;
    });

    return selections.map(selection => ({
      ...selection,
      displayLabel: labelCounts[selection.displayLabel] > 1
        ? `${selection.displayLabel} (ID: ${selection.id})`
        : selection.displayLabel,
    }));
  };

  // Check if selections are loading for a market
  const areSelectionsLoadingForMarketId = (marketId: number): boolean => {
    const marketIndex = marketIds.indexOf(marketId);
    if (marketIndex === -1) return false;

    return marketSelectionQueries[marketIndex].isLoading || false;
  };

  const handleMarketChange = (index: number, selectedMarket: Market | null) => {
    if (selectedMarket) {
      onPickChange(index, 'market', selectedMarket.name);
      onPickChange(index, 'selectionKey', '');
      onPickChange(index, 'selectionLabel', '');
    } else {
      onPickChange(index, 'market', '');
      onPickChange(index, 'selectionKey', '');
      onPickChange(index, 'selectionLabel', '');
    }
  };

  const handleSelectionChange = (index: number, selection: TransformedSelection | null) => {
    onPickChange(index, 'selectionKey', selection?.selectionKey || '');
    onPickChange(index, 'selectionLabel', selection?.displayLabel || selection?.selectionKey || '');
  };

  const handleAccuracyChange = (_event: Event, newValue: number | number[]) => {
    const value = Array.isArray(newValue) ? newValue[0] : newValue;
    setValue('accuracy', value);
  };

  const handleConfidenceChange = (index: number, value: number) => {
    onPickChange(index, 'confidence', value);
  };

  // Get market by name
  const getMarketByName = (marketName: string): Market | undefined => {
    return markets.find((market) => market.name === marketName);
  };

  // Find selection by selectionKey
  const findSelectionByKey = (
    selections: TransformedSelection[],
    key: string
  ): TransformedSelection | null => {
    return selections.find((selection) => selection.selectionKey === key) || null;
  };

  if (isMarketsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading markets...</Typography>
      </Box>
    );
  }

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
        <Typography variant="h6" gutterBottom>
          Match Analysis
        </Typography>
        <FormControl fullWidth error={!!errors.analysis}>
          <TextField
            {...register('analysis')}
            label="Detailed Analysis *"
            multiline
            rows={4}
            value={analysis}
            onChange={(e) => setValue('analysis', e.target.value)}
            error={!!errors.analysis}
            helperText={typeof errors.analysis?.message === 'string' ? errors.analysis.message : 'Provide detailed analysis for your prediction'}
            placeholder="Analyze team form, key players, injuries..."
          />
        </FormControl>
      </Box>

      {/* Accuracy Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <TrendingUpIcon />
          Prediction Confidence
        </Typography>
        <FormControl fullWidth error={!!errors.accuracy}>
          <Box sx={{ px: 2 }}>
            <Typography gutterBottom>Accuracy: {accuracy}%</Typography>
            <Slider
              value={accuracy}
              onChange={handleAccuracyChange}
              aria-labelledby="accuracy-slider"
              min={0}
              max={100}
              marks={[
                { value: 0, label: '0%' },
                { value: 50, label: '50%' },
                { value: 100, label: '100%' },
              ]}
              sx={{ mt: 2 }}
            />
          </Box>
          {errors.accuracy && (
            <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
              {typeof errors.accuracy.message === 'string' ? errors.accuracy.message : 'Invalid accuracy value'}
            </Typography>
          )}
        </FormControl>
      </Box>

      {/* Market Picks Section */}
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h6">Market Picks</Typography>
          <Button onClick={onAddPick} variant="outlined" size="medium" disabled={picks.length >= 5}>
            Add Pick {picks.length > 0 && `(${picks.length}/5)`}
          </Button>
        </Box>

        {picks.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              p: 4,
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 1,
              bgcolor: 'action.hover',
            }}
          >
            <Typography color="text.secondary" variant="body1">
              No picks added yet. Click &quot;Add Pick&quot; to start.
            </Typography>
          </Box>
        ) : (
          picks.map((pick, index) => {
            const market = getMarketByName(pick.market);
            const selections = market ? getSelectionsForMarketId(market.id) : [];
            const isLoading = market ? areSelectionsLoadingForMarketId(market.id) : false;
            const currentSelection = findSelectionByKey(selections, pick.selectionKey);

            return (
              <Card
                key={pick.id}
                sx={{
                  mb: 3,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  boxShadow: 1,
                }}
              >
                <CardContent>
                  {/* Pick Header */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 3,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      Pick #{index + 1}
                    </Typography>
                    {picks.length > 1 && (
                      <Button
                        onClick={() => onRemovePick(index)}
                        size="small"
                        color="error"
                        variant="outlined"
                      >
                        Remove Pick
                      </Button>
                    )}
                  </Box>

                  {/* Market and Selection Fields */}
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 3,
                      flexDirection: { xs: 'column', md: 'row' },
                      mb: 3,
                    }}
                  >
                    {/* Market Selection */}
                    <FormControl fullWidth>
                      <Autocomplete
                        options={markets}
                        getOptionLabel={(option: Market) => option.displayName}
                        value={market || null}
                        onChange={(_event, newValue) => handleMarketChange(index, newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Market *"
                            placeholder="Select market..."
                            error={!!(Array.isArray(errors.picks) && errors.picks[index]?.market)}
                            helperText={Array.isArray(errors.picks) && typeof errors.picks[index]?.market?.message === 'string' ? errors.picks[index]?.market?.message : undefined}
                          />
                        )}
                        groupBy={(option) => option.category || 'General'}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                      />
                    </FormControl>

                    {/* Selection Dropdown */}
                    <FormControl fullWidth>
                      <Autocomplete
                        options={selections}
                        getOptionLabel={(option: TransformedSelection) => option.displayLabel}
                        value={currentSelection}
                        onChange={(_event, newValue) => handleSelectionChange(index, newValue)}
                        disabled={!market}
                        loading={isLoading}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Selection *"
                            placeholder={market ? 'Choose selection...' : 'Select market first'}
                            error={!!(Array.isArray(errors.picks) && errors.picks[index]?.selectionKey)}
                            helperText={Array.isArray(errors.picks) && typeof errors.picks[index]?.selectionKey?.message === 'string' ? errors.picks[index]?.selectionKey?.message : undefined}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {isLoading && <CircularProgress size={20} />}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                        isOptionEqualToValue={(option, value) =>
                          option.selectionKey === value.selectionKey
                        }
                      />
                      {market && selections.length === 0 && !isLoading && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 1, display: 'block' }}
                        >
                          No selections available for this market
                        </Typography>
                      )}
                    </FormControl>
                  </Box>

                  {/* Confidence Slider */}
                  <Box>
                    <Typography variant="body2" gutterBottom sx={{ mb: 1 }}>
                      Confidence Level: {pick.confidence}%
                    </Typography>
                    <Slider
                      value={pick.confidence}
                      onChange={(_event, newValue) =>
                        handleConfidenceChange(index, newValue as number)
                      }
                      aria-labelledby={`confidence-slider-${index}`}
                      min={0}
                      max={100}
                      marks={[
                        { value: 0, label: '0%' },
                        { value: 25, label: '25%' },
                        { value: 50, label: '50%' },
                        { value: 75, label: '75%' },
                        { value: 100, label: '100%' },
                      ]}
                      valueLabelDisplay="auto"
                      sx={{ width: '95%', mx: 'auto' }}
                    />
                  </Box>
                </CardContent>
              </Card>
            );
          })
        )}
      </Box>
    </Box>
  );
};
