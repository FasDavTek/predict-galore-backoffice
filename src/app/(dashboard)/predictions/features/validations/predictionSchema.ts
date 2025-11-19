import { z } from 'zod';

export const predictionFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  type: z.enum(['classification', 'regression', 'clustering', 'time_series']),
  modelId: z.string().min(1, 'Model is required'),
  inputData: z.string().min(1, 'Input data is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  datasetSize: z.number().min(1, 'Dataset size must be at least 1').max(1000000, 'Dataset size is too large'),
});

export type PredictionFormSchema = z.infer<typeof predictionFormSchema>;