/**
 * Dashboard Service
 */

import { api } from '@/shared/api';
import { API_CONFIG } from '@/shared/api';
import type {
  DashboardSummaryResponse,
  DashboardAnalyticsResponse,
  DashboardSummary,
  DashboardAnalytics,
  DashboardActivity,
  DashboardTraffic,
  DashboardEngagement,
} from './types';

export class DashboardService {
  static async getSummary(params?: { from?: string; to?: string }): Promise<DashboardSummary> {
    const response = await api.get<DashboardSummaryResponse>(
      API_CONFIG.endpoints.dashboard.summary,
      params
    );
    // Handle both wrapped and direct response formats
    if ('data' in response && response.data) {
      return response.data;
    }
    // Type assertion with unknown first to avoid type error
    return response as unknown as DashboardSummary;
  }

  static async getAnalytics(): Promise<DashboardAnalytics> {
    const response = await api.get<DashboardAnalyticsResponse>(
      API_CONFIG.endpoints.dashboard.analytics
    );
    return response.data;
  }

  static async getActivity(): Promise<{
    activities: DashboardActivity[];
    total: number;
  }> {
    // Activity is now included in the summary response
    const summary = await this.getSummary();
    return {
      activities: summary.recentActivity?.resultItems || [],
      total: summary.recentActivity?.totalItems || 0,
    };
  }

  static async getTraffic(): Promise<{ dimension: number; items: DashboardTraffic[] }> {
    // Traffic is now included in the summary response
    const summary = await this.getSummary();
    return summary.traffic || { dimension: 0, items: [] };
  }

  static async getEngagement(): Promise<DashboardEngagement[]> {
    // Engagement is now included in the summary response
    const summary = await this.getSummary();
    return summary.engagement || [];
  }
}

