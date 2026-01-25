/**
 * Dashboard API Hooks
 */

import { useQuery } from '@tanstack/react-query';
import { DashboardService } from './service';
import type { DashboardActivity } from '../model/types';

export function useDashboardSummary(params?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: ['dashboard-summary', params],
    queryFn: async () => {
      return await DashboardService.getSummary(params);
    },
  });
}

export function useDashboardAnalytics() {
  return useQuery({
    queryKey: ['dashboard-analytics'],
    queryFn: async () => {
      return await DashboardService.getAnalytics();
    },
  });
}

export function useDashboardActivity() {
  return useQuery({
    queryKey: ['dashboard-activity'],
    queryFn: async (): Promise<{ activities: DashboardActivity[]; total: number }> => {
      return await DashboardService.getActivity();
    },
  });
}

export function useDashboardTraffic() {
  return useQuery({
    queryKey: ['dashboard-traffic'],
    queryFn: async () => {
      return await DashboardService.getTraffic();
    },
  });
}

export function useDashboardEngagement() {
  return useQuery({
    queryKey: ['dashboard-engagement'],
    queryFn: async () => {
      return await DashboardService.getEngagement();
    },
  });
}

