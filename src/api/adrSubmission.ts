import { ADRStatus } from '../types';

export interface ADRSubmissionPayload {
  documents: File[];
  notes?: string;
}

export interface ADRSubmissionResponse {
  success: boolean;
  claimId: string;
  status: ADRStatus;
}

// Simulate POST /api/adr/submit/[Claim-ID]
export async function submitADRDocuments(
  claimId: string,
  _payload: ADRSubmissionPayload
): Promise<ADRSubmissionResponse> {
  await new Promise((res) => setTimeout(res, 600));
  return {
    success: true,
    claimId,
    status: 'Submitted',
  };
}
