// Fetch messages for a support ticket from the MSW mock API
export async function fetchSupportTicketMessages(ticketId) {
  const response = await fetch(`/api/support/tickets/messages/${ticketId}`);
  if (!response.ok) throw new Error('Failed to fetch ticket messages');
  const data = await response.json();
  return data.messages || [];
}
