// Simulated API utility for support tickets
export async function fetchSupportTickets() {
  await new Promise((res) => setTimeout(res, 300));
  const response = await fetch('/src/mocks/supportTickets.json');
  if (!response.ok) throw new Error('Failed to fetch support tickets');
  return response.json();
}
