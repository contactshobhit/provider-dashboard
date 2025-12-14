// src/mocks/handlers.js
import { http, HttpResponse } from 'msw';
import { mockPADetails } from './mock-api';
import supportTicketMessagesRaw from './supportTicketMessages.json';

const supportTicketMessages = supportTicketMessagesRaw.messages;

export const handlers = [
    // Support ticket messages handler
    http.get('/api/support/tickets/messages/:ticketId', ({ params }) => {
      const { ticketId } = params;
      const messages = supportTicketMessages.filter(m => m.ticketId === ticketId);
      return HttpResponse.json({ status: 'success', messages });
    }),
  http.get('/api/pa/details/:paId', ({ params }) => {
    const { paId } = params;
    const record = mockPADetails.find((item) => item.paId === paId);
    if (record) {
      return HttpResponse.json(record, { status: 200 });
    } else {
      return HttpResponse.json({ error: 'PA record not found' }, { status: 404 });
    }
  })
];

// You can add more handlers for other endpoints as needed.
