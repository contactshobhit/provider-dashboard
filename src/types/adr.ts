// Additional Documentation Request (ADR) Types

export type ADRStatus = 'Requested' | 'Submitted' | 'Under Review' | 'Approved' | 'Denied' | 'Partially Approved';

export interface ADRRecord {
  claimId: string;
  memberId: string;
  patientName: string;
  dateOfService: string;
  documentSummary: string;
  dueDate: string;
  adrStatus: ADRStatus;
  submittedDocuments?: string[]; // List of submitted document names
}

export interface ADRSubmissionPayload {
  claimId: string;
  documents: File[];
  notes?: string;
}
