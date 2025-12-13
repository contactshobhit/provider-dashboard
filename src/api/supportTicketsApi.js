// Simulate POST /api/support/tickets/new
export async function createSupportTicket(ticket) {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 600));
  // Generate a new ticket ID
  const id = `TKT-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`;
  return {
    success: true,
    ticket: {
      ...ticket,
      id,
      status: 'Pending',
      lastUpdate: new Date().toLocaleString(),
      messages: [
        {
          sender: 'Provider',
          text: ticket.description,
          time: new Date().toLocaleString(),
        }
      ],
    },
  };
}
