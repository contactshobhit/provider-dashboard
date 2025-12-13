// Simulate POST /api/adr/submit/[Claim-ID]
export async function submitADRDocuments(claimId, payload) {
  await new Promise(res => setTimeout(res, 600));
  return {
    success: true,
    claimId,
    status: 'Submitted',
  };
}
