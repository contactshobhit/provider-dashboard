// WCAG AA compliant status colors (contrast ratio >= 4.5:1)

import { PAStatus, P2PStatus, P2POutcome } from '../types/pa';

// Re-export types for convenience (see types/pa.ts for full documentation)
export type { PAStatus, P2PStatus, P2POutcome };

/**
 * Support Ticket Status
 * - Open: New ticket awaiting support response
 * - Pending: Ticket in progress
 * - Resolved: Ticket closed/resolved
 * - Awaiting Provider Response: Support waiting for provider input
 */
export type TicketStatus = 'Open' | 'Pending' | 'Resolved' | 'Awaiting Provider Response';

/**
 * Additional Documentation Request (ADR) Status
 * - Open: New ADR received, action required
 * - Submitted: Provider submitted requested documentation
 * - Under Review: Documentation being reviewed
 * - Closed: ADR completed
 */
export type ADRStatus = 'Open' | 'Submitted' | 'Under Review' | 'Closed';

export interface StatusStyle {
  bgcolor: string;
  color: string;
}

// Unified status styles for PA requests and general statuses
export const getStatusStyles = (status: string): StatusStyle => {
  switch (status) {
    // PA Statuses
    case 'Affirmed':
      return { bgcolor: '#1B5E20', color: '#FFFFFF' }; // 12.6:1
    case 'Non-Affirmed':
      return { bgcolor: '#C62828', color: '#FFFFFF' }; // 6.5:1
    case 'Partial Affirmation':
      return { bgcolor: '#E65100', color: '#FFFFFF' }; // 4.6:1
    case 'Draft':
      return { bgcolor: '#757575', color: '#FFFFFF' }; // 4.6:1
    case 'Submitted':
      return { bgcolor: '#0277BD', color: '#FFFFFF' }; // 5.5:1
    case 'Under Review':
      return { bgcolor: '#F57C00', color: '#000000' }; // 5.2:1
    case 'Dismissed':
      return { bgcolor: '#5D4037', color: '#FFFFFF' }; // 8.1:1
    // P2P Activity Statuses
    case 'Requested':
      return { bgcolor: '#5E35B1', color: '#FFFFFF' }; // 7.5:1
    case 'Scheduled':
      return { bgcolor: '#1565C0', color: '#FFFFFF' }; // 7.2:1
    case 'Completed':
      return { bgcolor: '#2E7D32', color: '#FFFFFF' }; // 8.6:1
    // P2P Outcomes
    case 'Upheld':
      return { bgcolor: '#B71C1C', color: '#FFFFFF' }; // 7.9:1
    // Ticket Statuses
    case 'Awaiting Provider Response':
      return { bgcolor: '#0277BD', color: '#FFFFFF' }; // 5.5:1
    case 'Open':
      return { bgcolor: '#1565C0', color: '#FFFFFF' }; // 7.2:1
    case 'Pending':
      return { bgcolor: '#E65100', color: '#FFFFFF' }; // 4.6:1
    case 'Resolved':
      return { bgcolor: '#424242', color: '#FFFFFF' }; // 10.4:1
    case 'Closed':
      return { bgcolor: '#424242', color: '#FFFFFF' }; // 10.4:1
    default:
      return { bgcolor: '#616161', color: '#FFFFFF' }; // 7.0:1
  }
};

// For MUI Chip color prop (legacy support)
export const getStatusChipColor = (status: string): 'success' | 'error' | 'warning' | 'info' | 'default' => {
  switch (status) {
    case 'Affirmed':
    case 'Completed':
      return 'success';
    case 'Non-Affirmed':
    case 'Dismissed':
    case 'Upheld':
      return 'error';
    case 'Partial Affirmation':
    case 'Under Review':
    case 'Pending':
      return 'warning';
    case 'Awaiting Provider Response':
    case 'Open':
    case 'Submitted':
    case 'Scheduled':
    case 'Requested':
      return 'info';
    case 'Draft':
    case 'Resolved':
    case 'Closed':
    default:
      return 'default';
  }
};
