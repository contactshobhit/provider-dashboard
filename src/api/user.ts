import { UserProfileResponse } from '../types';

// API utility for user profile
export async function fetchUserProfile(): Promise<UserProfileResponse> {
  const response = await fetch('/api/user/profile');
  if (!response.ok) throw new Error('Failed to fetch user profile');
  return response.json();
}
