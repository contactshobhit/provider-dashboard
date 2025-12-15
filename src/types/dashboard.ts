// Dashboard Types

import { P2POutcome } from './pa';

export interface DashboardSummary {
  underReviewCount: number;
  recentDeterminationsCount: number;
  affirmedIn7Days: number;
  nonAffirmedIn7Days: number;
  openTicketsCount: number;
  p2pScheduledCount: number;
  p2pRequestedCount: number;
  p2pCompletedCount: number;
}

export interface P2PActivityDetails {
  scheduledDate?: string;
  scheduledTime?: string;
  medicalDirectorName?: string;
  outcome?: P2POutcome;
  completedDate?: string;
}

export interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  paId?: string;
  claimId?: string;
  p2pDetails?: P2PActivityDetails;
}
