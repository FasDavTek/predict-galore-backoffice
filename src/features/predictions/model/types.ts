/**
 * Predictions Domain Types
 */

export type PredictionStatus = 'scheduled' | 'active' | 'expired' | 'cancelled';
export type PredictionType = 'classification' | 'regression' | 'clustering' | 'time_series';
export type PredictionAccuracy = 'high' | 'medium' | 'low';
export type AudienceType = 'PREMIUM' | 'FREE' | 'All';

// Core Prediction Types - Updated to match backend API response
export interface Prediction {
  id: number;
  match: string;
  picksCount: number;
  accuracy: number;
  datePostedUtc: string;
  status: PredictionStatus;
}

export interface PredictionsFilter {
  page?: number;
  limit?: number;
  search?: string;
  status?: PredictionStatus;
  type?: PredictionType;
  accuracy?: PredictionAccuracy;
  startDate?: string;
  endDate?: string;
}

export interface PredictionsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PredictionAnalytics {
  total: number;
  avgAccuracy: number;
  scheduled: number;
  active: number;
  expired: number;
  cancelled: number;
}

// Sports Prediction Types - Updated to match API responses
export interface Sport {
  id: number;
  name: string;
  leagues: null;  // Always null from API
  dateCreated: string;
  dateUpdated: null;
  createdBy: null;
  updateBy: null;
}

export interface League {
  id: number;
  name: string;
  sportId?: number;  // May not be present in all responses
  country?: string;
  emblem?: string;  // URL to league logo/emblem
  isPopular?: boolean;
  // Additional fields may be present based on API response
}

export interface Fixture {
  id: number;
  providerFixtureId: number;
  leagueId: number;
  league: string;
  home: string;
  away: string;
  kickoffUtc: string;
  status: string;
}

export interface Market {
  id: number;
  name: string;
  displayName: string;
  category: string;
}

export interface Selection {
  key: string;
  label: string;
}

// Form Data Types
export interface Pick {
  market: string;
  selectionKey: string;
  selectionLabel: string;
  confidence: number;
  odds: number;
  tip: string;
  recentForm: string;
  homeScore: number;
  awayScore: number;
  tipGoals: number;
  playerId: number;
  playerName: string;
  teamId: number;
  teamName: string;
  subType: string;
}

export interface CreatePredictionPayload {
  fixtureId: number;
  title: string;
  analysis: string;
  accuracy: number;
  expertAnalysis: string;
  audience: AudienceType;
  includeTeamForm: boolean;
  includeTeamComparison: boolean;
  includeTopScorers: boolean;
  isPremium: boolean;
  isScheduled: boolean;
  scheduledTime: string;
  picks: Pick[];
}

export interface UpdatePredictionPayload {
  fixtureId: number;
  title: string;
  analysis: string;
  accuracy: number;
  expertAnalysis: string;
  audience: AudienceType;
  includeTeamForm: boolean;
  includeTeamComparison: boolean;
  includeTopScorers: boolean;
  isPremium: boolean;
  isScheduled: boolean;
  scheduledTime: string | null; // Can be null when not scheduled
  picks: Pick[];
  cmd: string; // Required field for PUT requests
}

// Prediction Detail - Full prediction data returned from GET /api/v1/prediction/{id}
export interface PredictionDetail extends CreatePredictionPayload {
  id: number;
  match?: string;
  picksCount?: number;
  datePostedUtc?: string;
  status?: PredictionStatus;
  // Additional fields that might be in the response
  sport?: string;
  league?: string;
  fixture?: {
    id: number;
    home: string;
    away: string;
    kickoffUtc: string;
    status: string;
    league?: string;
  };
}

