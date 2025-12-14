import { DashboardSummaryResponse, RecentActivityResponse } from '../types';

// API utilities for Provider Dashboard

export async function fetchDashboardSummary(): Promise<DashboardSummaryResponse> {
  const response = await fetch('/api/dashboard/summary');
  if (!response.ok) throw new Error('Failed to fetch dashboard summary');
  return response.json();
}

export async function fetchRecentActivity(): Promise<RecentActivityResponse> {
  const response = await fetch('/api/dashboard/activity');
  if (!response.ok) throw new Error('Failed to fetch recent activity');
  return response.json();
}
