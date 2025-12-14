// Prior Authorization Types

export type PAStatus =
  | 'Approved'
  | 'Denied'
  | 'Pending'
  | 'Draft'
  | 'Expired'
  | 'Resolved'
  | 'Partial Denial';

export type SubmissionType = 'initial' | 'resubmission' | '';

export type LocationOfService =
  | 'office'
  | 'outpatient'
  | 'inpatient'
  | 'home'
  | 'other'
  | '';

// PA Submission Form Values
export interface PASubmissionFormValues {
  // Section A: Submission Details
  submissionType: SubmissionType;
  locationOfService: LocationOfService;
  previousUTN: string;
  submittedDate: string;
  anticipatedDateOfService: string;

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

  // Section D: Physician & Requester
  physicianName: string;
  physicianNpiPtan: string;
  requesterName: string;
  requesterPhone: string;
  requesterEmail: string;

  // Section E: Facility/Provider
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
  determinationDate: string;
  submittedRecords: number;
  peerToPeerRequested?: boolean;
  utn: string;
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
  utn: string;
  currentStatus: PAStatus;
  serviceDetails: PAServiceDetails;
  requestingProvider: string;
  patientInfo: PAPatientInfo;
  clinicalJustification: string;
  submittedFiles: PASubmittedFile[];
  paHistory: PAHistoryEvent[];
  missingDocuments?: boolean;
  p2pExpired?: boolean;
}

// PA List for dropdowns
export interface PAListItem {
  id: string;
  status: PAStatus;
}
