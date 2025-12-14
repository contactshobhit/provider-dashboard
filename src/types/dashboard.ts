// Dashboard Types

export interface DashboardSummary {
  pendingPAsCount: number;
  recentDeterminationsCount: number;
  approvedIn7Days: number;
  deniedIn7Days: number;
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
