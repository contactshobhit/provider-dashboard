import { PARecordsResponse } from '../types';

// API utility for Prior Auth Search Page
export async function fetchPARecords(): Promise<PARecordsResponse> {
  const response = await fetch('/api/pa/records');
  if (!response.ok) throw new Error('Failed to fetch PA records');
  return response.json();
}
