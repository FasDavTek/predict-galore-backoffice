import { ReactElement } from 'react';

export interface AnalyticsCardProps {
  title: string;
  value: string;
  change: number;
  icon: ReactElement;
  color: string;
  isLoading?: boolean;
}

export interface UserAnalyticsProps {
  dateRange?: {
    from: Date;
    to: Date;
  };
}