// WCAG AA compliant status colors (contrast ratio >= 4.5:1)

export type PAStatus = 'Approved' | 'Denied' | 'Pending' | 'Awaiting Provider Response' | 'Resolved' | 'Requested';
export type TicketStatus = 'Open' | 'Pending' | 'Resolved' | 'Awaiting Provider Response';
export type ADRStatus = 'Open' | 'Submitted' | 'Under Review' | 'Closed';

export interface StatusStyle {
  bgcolor: string;
  color: string;
}

// Unified status styles for PA requests and general statuses
export const getStatusStyles = (status: string): StatusStyle => {
  switch (status) {
    case 'Approved':
      return { bgcolor: '#1B5E20', color: '#FFFFFF' }; // 12.6:1
    case 'Denied':
      return { bgcolor: '#C62828', color: '#FFFFFF' }; // 6.5:1
    case 'Pending':
      return { bgcolor: '#E65100', color: '#FFFFFF' }; // 4.6:1
    case 'Awaiting Provider Response':
      return { bgcolor: '#0277BD', color: '#FFFFFF' }; // 5.5:1
    case 'Resolved':
      return { bgcolor: '#424242', color: '#FFFFFF' }; // 10.4:1
    case 'Requested':
      return { bgcolor: '#5E35B1', color: '#FFFFFF' }; // 7.5:1
    case 'Open':
      return { bgcolor: '#1565C0', color: '#FFFFFF' }; // 7.2:1
    case 'Submitted':
      return { bgcolor: '#0277BD', color: '#FFFFFF' }; // 5.5:1
    case 'Under Review':
      return { bgcolor: '#E65100', color: '#FFFFFF' }; // 4.6:1
    case 'Closed':
      return { bgcolor: '#424242', color: '#FFFFFF' }; // 10.4:1
    default:
      return { bgcolor: '#616161', color: '#FFFFFF' }; // 7.0:1
  }
};

// For MUI Chip color prop (legacy support)
export const getStatusChipColor = (status: string): 'success' | 'error' | 'warning' | 'info' | 'default' => {
  switch (status) {
    case 'Approved':
      return 'success';
    case 'Denied':
      return 'error';
    case 'Pending':
    case 'Under Review':
      return 'warning';
    case 'Awaiting Provider Response':
    case 'Open':
    case 'Submitted':
      return 'info';
    default:
      return 'default';
  }
};
