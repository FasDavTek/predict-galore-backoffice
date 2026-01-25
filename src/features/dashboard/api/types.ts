/**
 * Dashboard API Types
 */

import type {
  DashboardSummary,
  DashboardAnalytics,
  DashboardActivity,
  DashboardTraffic,
  DashboardEngagement,
} from '../model/types';

export interface DashboardSummaryResponse {
  success: boolean;
  message?: string;
  errors?: null | unknown;
  data: DashboardSummary;
}

export interface DashboardAnalyticsResponse {
  success: boolean;
  data: DashboardAnalytics;
}

export interface DashboardActivityResponse {
  success: boolean;
  data: {
    activities: DashboardActivity[];
    total: number;
  };
}

export interface DashboardTrafficResponse {
  success: boolean;
  data: DashboardTraffic[];
}

export interface DashboardEngagementResponse {
  success: boolean;
  data: DashboardEngagement[];
}

// Re-export domain types
export type {
  DashboardSummary,
  DashboardAnalytics,
  DashboardActivity,
  DashboardTraffic,
  DashboardEngagement,
};

