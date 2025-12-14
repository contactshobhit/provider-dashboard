import { CreateTicketRequest, CreateTicketResponse, SupportTicket } from '../types';

// Simulate POST /api/support/tickets/new
export async function createSupportTicket(
  ticket: CreateTicketRequest
): Promise<CreateTicketResponse> {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 600));
  // Generate a new ticket ID
  const id = `TKT-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`;

  const newTicket: SupportTicket = {
    id,
    subject: ticket.subject,
    status: 'Pending',
    priority: 'Medium',
    patientName: 'N/A',
    lastUpdate: new Date().toLocaleString(),
    messages: [
      {
        sender: 'Provider',
        text: ticket.description,
        time: new Date().toLocaleString(),
      },
    ],
  };

  return {
    success: true,
    ticket: newTicket,
  };
}
