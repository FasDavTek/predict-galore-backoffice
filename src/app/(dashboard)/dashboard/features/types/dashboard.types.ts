// /app/(dashboard)/dashboard/features/types/dashboard.types.ts

/* ---------------------- Core Data Types ---------------------- */

export type AnalyticsCard = {
  id?: string | number;
  title: string;
  value: string | number;
  change?: string;
  icon?: string;
  bgColor?: string;
};

export type EngagementPoint = {
  label: string;
  value: number;
};

export type TrafficRow = {
  name: string;
  percentage: string;
  users: string;
  countryCode?: string;
};

export type ActivityItem = {
  id?: string | number;
  type: string;
  title: string;
  description: string;
  createdAt?: string;
};

// New types for the additional endpoints
export type SummaryData = {
  totalUsers: number;
  totalPayments: number;
  totalRevenue: number;
  activeUsers: number;
  conversionRate: number;
  recentActivities: ActivityItem[];
};

export type UserCardsData = {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  userGrowth: number;
  returningUsers: number;
};

export type PaymentCardsData = {
  totalRevenue: number;
  successfulPayments: number;
  failedPayments: number;
  averageOrderValue: number;
  paymentGrowth: number;
};

export type EngagementData = {
  engagementRate: number;
  averageSessionDuration: number;
  pagesPerSession: number;
  bounceRate: number;
  timeSeries?: EngagementPoint[];
};

export type TrafficData = {
  items: TrafficRow[];
  totalVisitors: number;
  dimension: string;
};

export type ActivityResponseData = {
  data: ActivityItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type RecentActivityData = {
  data: ActivityItem[];
};

/* ---------------------- API Response Wrappers ---------------------- */

export type SummaryResponse = {
  success: boolean;
  message: string;
  errors: string | null;
  data: SummaryData;
};

export type UserCardsResponse = {
  success: boolean;
  message: string;
  errors: string | null;
  data: UserCardsData;
};

export type PaymentCardsResponse = {
  success: boolean;
  message: string;
  errors: string | null;
  data: PaymentCardsData;
};

export type EngagementResponse = {
  success: boolean;
  message: string;
  errors: string | null;
  data: EngagementData;
};

export type TrafficResponse = {
  success: boolean;
  message: string;
  errors: string | null;
  data: TrafficData;
};

export type ActivityResponse = {
  success: boolean;
  message: string;
  errors: string | null;
  data: ActivityResponseData;
};

export type RecentActivityResponse = {
  success: boolean;
  message: string;
  errors: string | null;
  data: RecentActivityData;
};

export type AnalyticsResponse = {
  success: boolean;
  message: string;
  errors: string | null;
  data: AnalyticsCard[];
};

/* ---------------------- Parameter Types ---------------------- */

export type SummaryParams = {
  from?: string;
  to?: string;
  trafficDimension?: number;
  activityPage?: number;
  activityPageSize?: number;
};

export type UserCardsParams = {
  from?: string;
  to?: string;
};

export type PaymentCardsParams = {
  from?: string;
  to?: string;
};

export type EngagementParams = {
  from?: string;
  to?: string;
  segment?: number;
};

export type TrafficParams = {
  from?: string;
  to?: string;
  dimension?: number;
  top?: number;
};

export type ActivityParams = {
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
  category?: string;
  actorId?: string;
  search?: string;
};

export type RecentActivityParams = {
  from?: string;
  to?: string;
  take?: number;
};