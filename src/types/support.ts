// Support Ticket Types

export type TicketStatus =
  | 'Awaiting Provider Response'
  | 'Open'
  | 'Pending'
  | 'Resolved';

export type TicketPriority = 'Low' | 'Medium' | 'High';

export type TicketCategory =
  | 'Login/Access'
  | 'PA Inquiry (General)'
  | 'PA Determination Question'
  | 'Claim Inquiry'
  | 'Other';

export interface SupportMessage {
  sender: 'Provider' | 'Support Staff' | string;
  text: string;
  time: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  lastUpdate: string;
  status: TicketStatus;
  priority: TicketPriority;
  patientName: string;
  type?: string;
  messages?: SupportMessage[];
}

export interface CreateTicketRequest {
  category: TicketCategory;
  subject: string;
  paId?: string;
  description: string;
  attachments?: File[];
}

export interface CreateTicketResponse {
  success: boolean;
  ticket: SupportTicket;
}
