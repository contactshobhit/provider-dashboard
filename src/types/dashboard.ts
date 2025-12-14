// Dashboard Types

export interface DashboardSummary {
  pendingPAsCount: number;
  recentDeterminationsCount: number;
  affirmedIn7Days: number;
  nonAffirmedIn7Days: number;
  openTicketsCount: number;
}

export interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  paId?: string;
  claimId?: string;
}
