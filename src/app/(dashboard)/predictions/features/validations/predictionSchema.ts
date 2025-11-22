// features/schemas/prediction.schema.ts
import { z } from "zod";

// Original schema for machine learning predictions
export const mlPredictionFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  type: z.enum(["classification", "regression", "clustering", "time_series"]),
  modelId: z.string().min(1, "Model is required"),
  inputData: z.string().min(1, "Input data is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  datasetSize: z
    .number()
    .min(1, "Dataset size must be at least 1")
    .max(1000000, "Dataset size is too large"),
});

// New schema for sports predictions - FIXED VERSION
export const sportsPredictionFormSchema = z.object({
  sportId: z.string().min(1, "Sport is required"),
  leagueId: z.string(), // Made optional since we have leagueWithFixturesId
  leagueWithFixturesId: z.string(), // Made optional since we have leagueId
  fixtureId: z.string().min(1, "Fixture is required"),
  isPremium: z.boolean(),
  analysis: z.string().min(1, "Analysis is required").max(3000, "Analysis too long"),
  accuracy: z.number().min(0).max(100),
  picks: z.array(
    z.object({
      market: z.string().min(1, "Market type is required"),
      selectionKey: z.string().min(1, "Selection is required"),
      confidence: z.number().min(0).max(100),
    })
  ).min(1, "At least one pick is required"),
}).refine(
  (data) => !!data.leagueId || !!data.leagueWithFixturesId, 
  {
    message: "Either League or League with Fixtures must be selected",
    path: ["leagueId"] // This will show the error on the leagueId field
  }
);

// Combined schema that can handle both types
export const predictionFormSchema = z.discriminatedUnion("predictionType", [
  z.object({
    predictionType: z.literal("ml"),
    ...mlPredictionFormSchema.shape,
  }),
  z.object({
    predictionType: z.literal("sports"),
    ...sportsPredictionFormSchema.shape,
  }),
]);

// Individual type exports
export type MLPredictionFormValues = z.infer<typeof mlPredictionFormSchema>;
export type SportsPredictionFormValues = z.infer<typeof sportsPredictionFormSchema>;
export type PredictionFormValues = z.infer<typeof predictionFormSchema>;

// Helper type guards
export const isMLPrediction = (
  values: PredictionFormValues
): values is Extract<PredictionFormValues, { predictionType: "ml" }> => {
  return values.predictionType === "ml";
};

export const isSportsPrediction = (
  values: PredictionFormValues
): values is Extract<PredictionFormValues, { predictionType: "sports" }> => {
  return values.predictionType === "sports";
};