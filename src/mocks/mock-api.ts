// mock-api.ts
// Mock API for PA Detail View

import { PADetail, PAStatus } from '../types';

interface MockPADetail extends Omit<PADetail, 'serviceDetails'> {
  determinationDate?: string;
  serviceDetails: {
    codes: string[];
    dateOfService: string;
    location: string;
    diagnosisCodes?: string[];
  };
}

export const mockPADetails: MockPADetail[] = [
  // PA-001234
  {
    paId: 'PA-001234',
    utn: '98765432101234',
    currentStatus: 'Approved' as PAStatus,
    determinationDate: '2025-11-22',
    requestingProvider: 'Dr. Sarah Jones',
    patientInfo: {
      name: 'John D.',
      dob: '1980-01-01',
      gender: 'Male',
      memberId: 'M1001',
      address: '123 Main St',
      phone: '555-100-2000',
      email: 'john.d@email.com',
      diagnosisCodes: [],
    },
    serviceDetails: { codes: ['MRI-001'], dateOfService: '2025-11-20', location: 'Springfield Hospital' },
    clinicalJustification: 'MRI required for diagnosis.',
    submittedFiles: [{ fileName: 'MRI_Report.pdf', fileUrl: '/api/download/file/201', uploadDate: '2025-11-21' }],
    paHistory: [
      {
        eventDate: '2025-11-20 09:00 AM',
        eventDescription: 'PA Request Submitted by Provider.',
        internalNotes: '',
        statusChange: 'Pending',
      },
      {
        eventDate: '2025-11-22 10:00 AM',
        eventDescription: 'Determination Made.',
        internalNotes: '',
        statusChange: 'Approved',
      },
    ],
  },
  // PA-001235
  {
    paId: 'PA-001235',
    utn: '',
    currentStatus: 'Pending' as PAStatus,
    determinationDate: '',
    requestingProvider: 'Dr. Alex Kim',
    patientInfo: {
      name: 'Sarah K.',
      dob: '1978-02-14',
      gender: 'Female',
      memberId: 'M1002',
      address: '456 Oak St',
      phone: '555-200-3000',
      email: 'sarah.k@email.com',
      diagnosisCodes: [],
    },
    serviceDetails: { codes: ['CHEMO-101'], dateOfService: '2025-11-21', location: 'Cancer Center' },
    clinicalJustification: 'Chemotherapy for cancer treatment.',
    submittedFiles: [{ fileName: 'Chemo_Consent.pdf', fileUrl: '/api/download/file/202', uploadDate: '2025-11-21' }],
    paHistory: [
      {
        eventDate: '2025-11-21 08:30 AM',
        eventDescription: 'PA Request Submitted by Provider.',
        internalNotes: '',
        statusChange: 'Pending',
      },
    ],
    missingDocuments: true,
  },
  // PA-001236
  {
    paId: 'PA-001236',
    utn: '12345678901234',
    currentStatus: 'Denied' as PAStatus,
    determinationDate: '2025-11-18',
    requestingProvider: 'Dr. Robert M.',
    patientInfo: {
      name: 'Robert M.',
      dob: '1965-03-10',
      gender: 'Male',
      memberId: 'M1003',
      address: '789 Pine St',
      phone: '555-300-4000',
      email: 'robert.m@email.com',
      diagnosisCodes: [],
    },
    serviceDetails: { codes: ['PT-201'], dateOfService: '2025-11-15', location: 'Rehab Center' },
    clinicalJustification: 'Physical therapy for injury recovery.',
    submittedFiles: [{ fileName: 'PT_Notes.pdf', fileUrl: '/api/download/file/203', uploadDate: '2025-11-16' }],
    paHistory: [
      {
        eventDate: '2025-11-15 09:00 AM',
        eventDescription: 'PA Request Submitted by Provider.',
        internalNotes: '',
        statusChange: 'Pending',
      },
      {
        eventDate: '2025-11-18 11:00 AM',
        eventDescription: 'Determination Made.',
        internalNotes: 'Denied due to missing info.',
        statusChange: 'Denied',
      },
    ],
    p2pExpired: true,
  },
  // PA-001237
  {
    paId: 'PA-001237',
    utn: '',
    currentStatus: 'Draft' as PAStatus,
    determinationDate: '',
    requestingProvider: 'Dr. Morgan K.',
    patientInfo: {
      name: 'Morgan K.',
      dob: '1990-07-22',
      gender: 'Non-binary',
      memberId: 'M1004',
      address: '321 Birch St',
      phone: '555-400-5000',
      email: 'morgan.k@email.com',
      diagnosisCodes: [],
    },
    serviceDetails: { codes: ['SURG-301'], dateOfService: '2025-11-23', location: 'Surgical Center' },
    clinicalJustification: 'Surgery scheduled for next week.',
    submittedFiles: [{ fileName: 'Surgery_Consent.pdf', fileUrl: '/api/download/file/204', uploadDate: '2025-11-23' }],
    paHistory: [
      { eventDate: '2025-11-23 10:00 AM', eventDescription: 'Draft created.', internalNotes: '', statusChange: 'Draft' },
    ],
  },
];
