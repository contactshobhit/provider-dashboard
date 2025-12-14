// Additional Documentation Request (ADR) Types

export type ADRStatus = 'Requested' | 'Submitted' | 'Under Review';

export interface ADRRecord {
  claimId: string;
  paId: string;
  utn: string;
  documentSummary: string;
  dueDate: string;
  adrStatus: ADRStatus;
}

export interface ADRSubmissionPayload {
  claimId: string;
  documents: File[];
  notes?: string;
}
