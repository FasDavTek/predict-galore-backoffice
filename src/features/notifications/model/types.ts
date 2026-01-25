/**
 * Notifications Domain Types
 */

export interface Notification {
  id: number;
  userId: string;
  title: string;
  content: string;
  notificationType: string;
  isRead: boolean;
  predictionId?: number;
  fixtureId?: number;
  subscriptionId?: number;
  actionUrl?: string;
  createdAt: string;
  updatedAt: string;
}

