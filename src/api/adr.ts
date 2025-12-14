import { ADRRecordsResponse } from '../types';

// Simulated API utility for ADR Management Page
export async function fetchADRRecords(): Promise<ADRRecordsResponse> {
  await new Promise((res) => setTimeout(res, 400));
  // Simulate /api/adr/records endpoint
  const response = await fetch('/src/mocks/adrRecordsApi.json');
  if (!response.ok) throw new Error('Failed to fetch ADR records');
  return response.json();
}
