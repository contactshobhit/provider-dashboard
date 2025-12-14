// src/mocks/browser.js
// This file sets up and starts the MSW worker for browser environments.

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Configure the Service Worker with the request handlers
export const worker = setupWorker(...handlers);

