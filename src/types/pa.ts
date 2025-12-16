// Prior Authorization Types

/**
 * PA Status Definitions and Workflow
 *
 * Status Descriptions:
 * - Draft: PA request started but not yet submitted
 * - Submitted: PA submitted, awaiting processing
 * - Under Review: PA being reviewed by medical staff
 * - Affirmed: PA approved - service is authorized (determination letter issued)
 * - Non-Affirmed: PA denied - service not authorized (determination letter issued)
 * - Partial Affirmation: PA partially approved - some services authorized (determination letter issued)
 * - Dismissed: PA dismissed for administrative reasons (beneficiary not eligible, invalid NPI, etc.)
 *
 * Valid Status Transitions:
 * - Draft → Submitted (on submission)
 * - Submitted → Under Review (on processing start)
 * - Under Review → Affirmed | Non-Affirmed | Partial Affirmation | Dismissed (on determination)
 * - Non-Affirmed → Affirmed (after successful P2P call and MD review)
 * - Partial Affirmation → Affirmed (after successful P2P call and MD review)
 *
 * Notes:
 * - UTN is assigned only at determination time
 * - Determination letter is issued for Affirmed, Non-Affirmed, and Partial Affirmation
 * - P2P calls and Resubmissions are activities, not statuses
 * - Resubmissions create new PA requests linked via parentPaId
 */
export type PAStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Affirmed'
  | 'Non-Affirmed'
  | 'Partial Affirmation'
  | 'Dismissed';

/**
 * P2P (Peer-to-Peer) Call Activity
 *
 * P2P calls are activities that can happen on Non-Affirmed or Partial Affirmation cases.
 * Multiple P2P calls can be requested on a single PA.
 *
 * Status Flow: Requested → Scheduled → Completed
 * Outcomes: Affirmed (overturns decision) | Upheld (maintains decision)
 */
export type P2PStatus = 'Requested' | 'Scheduled' | 'Completed';
export type P2POutcome = 'Affirmed' | 'Upheld';

export interface P2PCall {
  id: string;
  status: P2PStatus;
  requestedDate: string;
  scheduledDate?: string;
  scheduledTime?: string;
  contactNumber?: string;
  medicalDirectorName?: string;
  completedDate?: string;
  outcome?: P2POutcome;
  notes?: string;
}

export type SubmissionType = 'initial' | 'resubmission' | '';

// Medicare Part Type - determines which fields are shown
export type MedicarePartType = 'A' | 'B' | '';

// Part B: Location of Service options
export type LocationOfService =
  | 'office'
  | 'outpatient'
  | 'inpatient'
  | 'home'
  | 'other'
  | '';

// Part A: Place of Service options
export type PlaceOfService =
  | 'on-campus-opd'
  | 'off-campus-opd'
  | '';

// Part A: Type of Bill options
export type TypeOfBill =
  | '131' // Hospital Outpatient - Admit through discharge
  | '132' // Hospital Outpatient - Interim first claim
  | '133' // Hospital Outpatient - Interim continuing
  | '134' // Hospital Outpatient - Interim last claim
  | '';

// PA Submission Form Values
export interface PASubmissionFormValues {
  // Medicare Part Selection
  medicarePartType: MedicarePartType;

  // Section A: Submission Details
  submissionType: SubmissionType;
  previousUTN: string;
  submittedDate: string;
  anticipatedDateOfService: string;

  // Part B specific
  locationOfService: LocationOfService;

  // Part A specific
  placeOfService: PlaceOfService;
  typeOfBill: TypeOfBill;

  // Section B: Beneficiary Info
  beneficiaryLastName: string;
  beneficiaryFirstName: string;
  medicareId: string;
  beneficiaryDob: string;

  // Section C: Procedure Codes (arrays)
  procedureCodes: string[];
  modifiers: string[];
  units: string[];
  diagnosisCodes: string[];

  // Section D: Physician Info (Part A: Attending, Part B: Ordering/Referring)
  physicianName: string;
  physicianNpi: string;
  physicianPtan: string;
  physicianAddress: string;
  physicianCity: string;
  physicianState: string;
  physicianZip: string;

  // Section E: Requester Info
  requesterName: string;
  requesterPhone: string;
  requesterEmail: string;
  requesterFax: string;

  // Section F: Facility/Provider
  facilityName: string;
  facilityNpi: string;
  facilityCcn: string;
  facilityAddress1: string;
  facilityAddress2: string;
  facilityCity: string;
  facilityState: string;
  facilityZip: string;

  // Step 3: Diagnosis & Justification
  diagnosisJustification?: string;
}

// PA Record from list/search pages
export interface PARecord {
  id: string;
  patientName: string;
  requestDate: string;
  serviceType: string;
  status: PAStatus;
  determinationDate?: string;
  submittedRecords: number;
  utn?: string; // UTN assigned only at determination
  parentPaId?: string; // If this is a resubmission, link to parent PA
  p2pCalls?: P2PCall[]; // P2P activity on this PA
}

// PA Detail View
export interface PAServiceDetails {
  dateOfService: string;
  location: string;
  codes: string[];
  diagnosisCodes: string[];
}

export interface PAPatientInfo {
  name: string;
  dob: string;
  gender: string;
  memberId: string;
  address: string;
  email: string;
  phone: string;
  diagnosisCodes: string[];
}

export interface PASubmittedFile {
  fileName: string;
  fileUrl: string;
  uploadDate: string;
}

export interface PAHistoryEvent {
  eventDate: string;
  eventDescription: string;
  internalNotes: string;
  statusChange: string;
}

export interface PADetail {
  paId: string;
  utn?: string; // UTN assigned only at determination
  currentStatus: PAStatus;
  serviceDetails: PAServiceDetails;
  requestingProvider: string;
  patientInfo: PAPatientInfo;
  clinicalJustification: string;
  submittedFiles: PASubmittedFile[];
  paHistory: PAHistoryEvent[];
  missingDocuments?: boolean;
  parentPaId?: string; // If this is a resubmission, link to parent PA
  p2pCalls?: P2PCall[]; // P2P activity on this PA
}

// PA List for dropdowns
export interface PAListItem {
  id: string;
  status: PAStatus;
}
