import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
  FormHelperText,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { predictionFormSchema, PredictionFormSchema } from '../validations/predictionSchema';
import { Prediction } from '../types/prediction.types';

interface PredictionFormProps {
  prediction?: Prediction | null;
  onSubmit: (data: PredictionFormSchema) => Promise<boolean>;
  onCancel: () => void;
  isLoading?: boolean;
  open?: boolean;
}

// Create a type that exactly matches the form structure we're using
type PredictionFormValues = {
  name: string;
  description: string;
  type: 'classification' | 'regression' | 'clustering' | 'time_series';
  modelId: string;
  inputData: string;
  tags: string[];
  datasetSize: number;
};

export const PredictionForm: React.FC<PredictionFormProps> = ({
  prediction,
  onSubmit,
  onCancel,
  isLoading = false,
  open = true,
}) => {
  const isEditing = Boolean(prediction?.id);

  const { control, handleSubmit, formState: { errors, isDirty }, reset } = useForm<PredictionFormValues>({
    resolver: zodResolver(predictionFormSchema),
    defaultValues: {
      name: prediction?.name || '',
      description: prediction?.description || '',
      type: prediction?.type || 'classification',
      modelId: prediction?.modelId || '',
      inputData: prediction?.inputData || '',
      tags: prediction?.tags || [],
      datasetSize: prediction?.datasetSize || 1000,
    },
  });

  const handleFormSubmit = async (data: PredictionFormValues) => {
    // Convert to the schema type - this ensures optional fields are handled correctly
    const formData: PredictionFormSchema = {
      name: data.name,
      description: data.description,
      type: data.type,
      modelId: data.modelId,
      inputData: data.inputData,
      tags: data.tags,
      datasetSize: data.datasetSize,
    };
    
    const success = await onSubmit(formData);
    if (success) reset();
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}>
      
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {isEditing ? 'P' : 'N'}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {isEditing ? 'Edit Prediction' : 'Create New Prediction'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isEditing ? `Update ${prediction?.name}'s configuration` : 'Create a new prediction job'}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Box component="form" id="prediction-form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ pt: 2 }}>
          
          {/* Basic Information Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom color="primary">
              Basic Information
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Controller name="name" control={control} render={({ field }) => (
                <TextField {...field} label="Prediction Name" fullWidth error={Boolean(errors.name)}
                  helperText={errors.name?.message} disabled={isLoading} />
              )}/>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Controller name="description" control={control} render={({ field }) => (
                <TextField {...field} label="Description" multiline rows={3} fullWidth 
                  error={Boolean(errors.description)} helperText={errors.description?.message} 
                  disabled={isLoading} />
              )}/>
            </Box>
          </Box>

          {/* Configuration Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom color="primary">
              Configuration
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Controller name="type" control={control} render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.type)}>
                    <InputLabel>Prediction Type</InputLabel>
                    <Select {...field} label="Prediction Type" disabled={isLoading}>
                      <MenuItem value="classification">
                        <Chip label="Classification" size="small" color="primary" variant="outlined" />
                      </MenuItem>
                      <MenuItem value="regression">
                        <Chip label="Regression" size="small" color="secondary" />
                      </MenuItem>
                      <MenuItem value="clustering">
                        <Chip label="Clustering" size="small" color="warning" />
                      </MenuItem>
                      <MenuItem value="time_series">
                        <Chip label="Time Series" size="small" color="info" />
                      </MenuItem>
                    </Select>
                    {errors.type && <FormHelperText error>{errors.type.message}</FormHelperText>}
                  </FormControl>
                )}/>
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Controller name="datasetSize" control={control} render={({ field }) => (
                  <TextField {...field} label="Dataset Size" type="number" fullWidth 
                    error={Boolean(errors.datasetSize)} helperText={errors.datasetSize?.message} 
                    disabled={isLoading} />
                )}/>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Controller name="modelId" control={control} render={({ field }) => (
                <FormControl fullWidth error={Boolean(errors.modelId)}>
                  <InputLabel>Model</InputLabel>
                  <Select {...field} label="Model" disabled={isLoading}>
                    <MenuItem value="model-1">Model 1</MenuItem>
                    <MenuItem value="model-2">Model 2</MenuItem>
                    <MenuItem value="model-3">Model 3</MenuItem>
                  </Select>
                  {errors.modelId && <FormHelperText error>{errors.modelId.message}</FormHelperText>}
                </FormControl>
              )}/>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Controller name="inputData" control={control} render={({ field }) => (
                <TextField {...field} label="Input Data" multiline rows={4} fullWidth 
                  error={Boolean(errors.inputData)} helperText={errors.inputData?.message} 
                  disabled={isLoading} placeholder="Paste your input data here..." />
              )}/>
            </Box>

            <Box>
              <Controller name="tags" control={control} render={({ field }) => (
                <TextField 
                  {...field} 
                  value={field.value?.join(', ') || ''}
                  label="Tags" 
                  fullWidth 
                  helperText="Comma-separated tags" 
                  disabled={isLoading} 
                  placeholder="tag1, tag2, tag3" 
                  onChange={(e) => {
                    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                    field.onChange(tags);
                  }} 
                />
              )}/>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button startIcon={<CancelIcon />} onClick={handleCancel} disabled={isLoading} size="large">
          Cancel
        </Button>
        <LoadingButton 
          type="submit" 
          form="prediction-form" 
          startIcon={<SaveIcon />} 
          loading={isLoading}
          loadingPosition="start" 
          variant="contained" 
          disabled={!isDirty && isEditing} 
          size="large"
        >
          {isEditing ? 'Update Prediction' : 'Create Prediction'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};