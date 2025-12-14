// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';
import { mockPADetails } from './mock-api';
import supportTicketMessagesRaw from './supportTicketMessages.json';
import supportTicketsRaw from './supportTickets.json';
import adrRecordsRaw from './adrRecordsApi.json';
import dashboardSummaryRaw from './dashboardSummary.json';
import recentActivityRaw from './recentActivity.json';
import paRecordsRaw from './paRecordsApi.json';
import userProfileRaw from './userProfile.json';

interface SupportMessage {
  ticketId: string;
  sender: string;
  text: string;
  time: string;
}

interface SupportTicketMessagesJson {
  messages: SupportMessage[];
}

const supportTicketMessages = (supportTicketMessagesRaw as SupportTicketMessagesJson).messages;

export const handlers = [
  // Dashboard handlers
  http.get('/api/dashboard/summary', () => {
    return HttpResponse.json(dashboardSummaryRaw);
  }),

  http.get('/api/dashboard/activity', () => {
    return HttpResponse.json(recentActivityRaw);
  }),

  // User profile handler
  http.get('/api/user/profile', () => {
    return HttpResponse.json(userProfileRaw);
  }),

  // PA Records handler
  http.get('/api/pa/records', () => {
    return HttpResponse.json(paRecordsRaw);
  }),

  // PA Details handler
  http.get('/api/pa/details/:paId', ({ params }) => {
    const { paId } = params;
    const record = mockPADetails.find((item) => item.paId === paId);
    if (record) {
      return HttpResponse.json(record, { status: 200 });
    } else {
      return HttpResponse.json({ error: 'PA record not found' }, { status: 404 });
    }
  }),

  // ADR Records handler
  http.get('/api/adr/records', () => {
    return HttpResponse.json(adrRecordsRaw);
  }),

  // Support tickets list handler
  http.get('/api/support/tickets', () => {
    return HttpResponse.json(supportTicketsRaw);
  }),

  // Support ticket messages handler
  http.get('/api/support/tickets/messages/:ticketId', ({ params }) => {
    const { ticketId } = params;
    const messages = supportTicketMessages.filter((m) => m.ticketId === ticketId);
    return HttpResponse.json({ status: 'success', messages });
  }),
];
