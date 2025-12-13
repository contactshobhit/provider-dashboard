// Simulated API utilities for Provider Dashboard

export async function fetchDashboardSummary() {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 400));
  const response = await fetch('/src/mocks/dashboardSummary.json');
  if (!response.ok) throw new Error('Failed to fetch dashboard summary');
  return response.json();
}

export async function fetchRecentActivity() {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 400));
  const response = await fetch('/src/mocks/recentActivity.json');
  if (!response.ok) throw new Error('Failed to fetch recent activity');
  return response.json();
}
