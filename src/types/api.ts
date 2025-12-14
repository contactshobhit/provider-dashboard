// API Response Types

export interface ApiResponse<T> {
  status?: 'success' | 'error';
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedData<T> {
  records: T[];
  totalRecords?: number;
  pageSize?: number;
  currentPage?: number;
}

export interface PARecordsResponse {
  data: {
    records: import('./pa').PARecord[];
  };
}

export interface ADRRecordsResponse {
  data: {
    records: import('./adr').ADRRecord[];
  };
}

export interface DashboardSummaryResponse {
  data: import('./dashboard').DashboardSummary;
}

export interface RecentActivityResponse {
  data: import('./dashboard').RecentActivity[];
}

export interface SupportTicketsResponse {
  tickets: import('./support').SupportTicket[];
}

export interface UserProfile {
  id?: string;
  title: string;
  lastName: string;
  firstName?: string;
  name?: string;
  email?: string;
  role?: string;
  organization?: string;
}

export interface UserProfileResponse {
  data: UserProfile;
}
