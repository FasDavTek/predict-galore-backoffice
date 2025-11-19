import {
  useCreatePredictionMutation,
  useUpdatePredictionMutation,
} from '../api/predictionApi';
import { Prediction, PredictionFormData } from '../types/prediction.types';

// Define a type for RTK Query errors
interface RTKQueryError {
  data?: {
    message?: string;
  };
  status?: number;
}

interface UsePredictionFormProps {
  prediction?: Prediction | null;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const usePredictionForm = ({ prediction, onSuccess, onError }: UsePredictionFormProps) => {
  const [createPrediction, { isLoading: isCreating }] = useCreatePredictionMutation();
  const [updatePrediction, { isLoading: isUpdating }] = useUpdatePredictionMutation();

  const isLoading = isCreating || isUpdating;

  const handleSubmit = async (formData: PredictionFormData): Promise<boolean> => {
    try {
      if (prediction?.id) {
        await updatePrediction({
          predictionId: prediction.id,
          predictionData: formData,
        }).unwrap();
      } else {
        await createPrediction(formData).unwrap();
      }

      onSuccess?.();
      return true;
    } catch (error: unknown) {
      let errorMessage = 'Failed to save prediction';
      
      if (typeof error === 'object' && error !== null) {
        const rtkError = error as RTKQueryError;
        if (rtkError.data?.message) {
          errorMessage = rtkError.data.message;
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      onError?.(errorMessage);
      return false;
    }
  };

  return {
    handleSubmit,
    isLoading,
  };
};