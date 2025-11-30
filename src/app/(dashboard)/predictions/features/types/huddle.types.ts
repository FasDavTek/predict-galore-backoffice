// features/types/huddle.types.ts
export interface HuddleMessage {
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface HuddleAskPayload {
  prompt: string;
  sport: string;
  league: string;
  teams: string[];
  toolsAllowed: boolean;
  lookbackGames: number;
  asOfUtc: string;
}

export interface HuddleResponse {
  answer: string;
  sources?: string[];
  confidence?: number;
}

export interface HuddleApiResponse {
  data: HuddleResponse;
  message?: string;
  success: boolean;
}