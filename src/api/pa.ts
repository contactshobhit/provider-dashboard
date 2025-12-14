import { PARecordsResponse, PADetail } from '../types';
import { apiGet } from './client';

export async function fetchPARecords(): Promise<PARecordsResponse> {
  return apiGet<PARecordsResponse>('/api/pa/records');
}

export async function fetchPADetail(paId: string): Promise<PADetail> {
  return apiGet<PADetail>(`/api/pa/details/${paId}`);
}
