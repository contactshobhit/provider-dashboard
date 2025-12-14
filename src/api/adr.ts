import { ADRRecordsResponse } from '../types';

// API utility for ADR Management Page
export async function fetchADRRecords(): Promise<ADRRecordsResponse> {
  const response = await fetch('/api/adr/records');
  if (!response.ok) throw new Error('Failed to fetch ADR records');
  return response.json();
}
