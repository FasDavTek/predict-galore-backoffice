import {
  useCreatePredictionMutation,
  useUpdatePredictionMutation,
} from '../api/predictionApi';
import { Prediction, PredictionFormData, CreatePredictionPayload } from '../types/prediction.types';

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

  // Helper function to transform PredictionFormData to CreatePredictionPayload
  const transformFormDataToPayload = (formData: PredictionFormData): CreatePredictionPayload => {
    // You'll need to adjust this transformation based on your actual form structure
    // and what data is available in your form vs what the API expects
    return {
      fixtureId: 0, // You need to get this from somewhere - maybe from form state or props
      title: formData.name, // Assuming name maps to title
      analysis: formData.description || '', // Assuming description maps to analysis
      accuracy: 0, // You need to calculate or get this from form data
      audience: 'FREE' as const, // Default or from form data
      picks: [], // You need to get this from form data
    };
  };

  const handleSubmit = async (formData: PredictionFormData): Promise<boolean> => {
    try {
      if (prediction?.id) {
        await updatePrediction({
          predictionId: prediction.id,
          predictionData: formData,
        }).unwrap();
      } else {
        // Transform the form data to match the API payload
        const createPayload = transformFormDataToPayload(formData);
        await createPrediction(createPayload).unwrap();
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