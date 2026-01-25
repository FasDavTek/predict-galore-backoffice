/**
 * Predictions Validations
 * Zod schemas for prediction forms
 */

import { z } from 'zod';

export const sportsPredictionFormSchema = z.object({
  sportId: z.string().min(1, 'Sport is required'),
  leagueId: z.string().min(1, 'League is required'),
  fixtureId: z.string().min(1, 'Fixture is required'),
  isPremium: z.boolean(),
  analysis: z.string().min(10, 'Analysis must be at least 10 characters'),
  accuracy: z.number().min(0).max(100),
  picks: z
    .array(
      z.object({
        market: z.string().min(1, 'Market is required'),
        selectionKey: z.string().min(1, 'Selection is required'),
        selectionLabel: z.string().min(1, 'Selection label is required'),
        confidence: z.number().min(0).max(100),
      })
    )
    .min(1, 'At least one pick is required'),
});

export type SportsPredictionFormValues = z.infer<typeof sportsPredictionFormSchema>;

