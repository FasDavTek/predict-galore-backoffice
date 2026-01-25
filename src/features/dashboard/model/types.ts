/**
 * Dashboard Domain Types
 */

export interface DashboardSummary {
  range: {
    from: string;
    to: string;
  };
  users: {
    totalUsers: {
      currentValue: number;
      previousValue: number;
      percentageChange: number;
      trend: number;
    };
    freeUsers: {
      currentValue: number;
      previousValue: number;
      percentageChange: number;
      trend: number;
    };
    premiumUsers: {
      currentValue: number;
      previousValue: number;
      percentageChange: number;
      trend: number;
    };
  };
  payments: {
    totalPayments: {
      currentValue: number;
      previousValue: number;
      percentageChange: number;
      trend: number;
    };
    totalAmountCurrent: number;
    totalAmountPrevious: number;
    amountPercentageChange: number;
    amountTrend: number;
  };
  engagement: Array<{
    segment: number;
    points: Array<{
      date: string;
      activeUsers: number;
    }>;
  }>;
  traffic: {
    dimension: number;
    items: DashboardTraffic[];
  };
  recentActivity: {
    totalItems: number;
    success: boolean;
    currentPage: number;
    pageSize: number;
    resultItems: DashboardActivity[];
    totalPages: number;
    message: string | null;
  };
}

export interface DashboardAnalytics {
  users: {
    total: number;
    active: number;
    new: number;
    change: number;
  };
  revenue: {
    total: number;
    monthly: number;
    change: number;
  };
  predictions: {
    total: number;
    completed: number;
    change: number;
  };
}

export interface DashboardActivity {
  id: number;
  createdAtUtc: string;
  title: string;
  description: string;
  actorDisplayName: string;
  actorRole: string | null;
  category: string;
}

export interface DashboardTraffic {
  date: string;
  visitors: number;
  pageViews: number;
  sessions: number;
}

export interface DashboardEngagement {
  segment: number;
  points: Array<{
    date: string;
    activeUsers: number;
  }>;
}

