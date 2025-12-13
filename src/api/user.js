// Simulated API utility for user profile
export async function fetchUserProfile() {
  await new Promise((res) => setTimeout(res, 200));
  const response = await fetch('/src/mocks/userProfile.json');
  if (!response.ok) throw new Error('Failed to fetch user profile');
  return response.json();
}
