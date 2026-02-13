/**
 * Markets Validations
 * Zod schemas for market forms
 */

import { z } from 'zod';

export const selectionSchema = z.object({
  selectionKey: z.string().min(1, 'Selection key is required'),
  selectionLabel: z.string().min(1, 'Selection label is required'),
  sortOrder: z.number().min(0, 'Sort order must be positive').default(1000),
  isActive: z.boolean().default(true),
});

export const marketFormSchema = z.object({
  name: z.string().min(1, 'Market name is required'),
  displayName: z.string().min(1, 'Display name is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  sortOrder: z.number().min(0, 'Sort order must be positive').default(1000),
  isActive: z.boolean().default(true),
  selections: z.array(selectionSchema).min(1, 'At least one selection is required'),
});

export type MarketFormValues = z.infer<typeof marketFormSchema>;
export type SelectionFormValues = z.infer<typeof selectionSchema>;
