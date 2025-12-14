import { SupportTicketsResponse } from '../types';

// API utility for support tickets
export async function fetchSupportTickets(): Promise<SupportTicketsResponse> {
  const response = await fetch('/api/support/tickets');
  if (!response.ok) throw new Error('Failed to fetch support tickets');
  return response.json();
}
