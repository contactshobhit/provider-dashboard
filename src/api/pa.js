// Simulated API utility for Prior Auth Search Page
export async function fetchPARecords() {
  await new Promise((res) => setTimeout(res, 400));
  // Simulate /api/pa/records endpoint
  const response = await fetch('/src/mocks/paRecordsApi.json');
  if (!response.ok) throw new Error('Failed to fetch PA records');
  return response.json();
}
