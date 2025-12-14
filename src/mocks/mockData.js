// src/mocks/mockData.js
// Mock data for PA Detail View (example)

export const mockPADetails = [
  // PA-001234
  {
    paId: 'PA-001234',
    utn: '98765432101234',
    currentStatus: 'Approved',
    determinationDate: '2025-11-22',
    requestingProvider: 'Dr. Sarah Jones',
    patientInfo: {
      name: 'John D.', dob: '1980-01-01', gender: 'Male', memberId: 'M1001', address: '123 Main St', phone: '555-100-2000', email: 'john.d@email.com'
    },
    serviceDetails: { codes: ['MRI-001'], dateOfService: '2025-11-20', location: 'Springfield Hospital' },
    clinicalJustification: 'MRI required for diagnosis.',
    submittedFiles: [ { fileName: 'MRI_Report.pdf', fileUrl: '/api/download/file/201', uploadDate: '2025-11-21' } ],
    paHistory: [
      { eventDate: '2025-11-20 09:00 AM', eventDescription: 'PA Request Submitted by Provider.', internalNotes: '', statusChange: 'Pending' },
      { eventDate: '2025-11-22 10:00 AM', eventDescription: 'Determination Made.', internalNotes: '', statusChange: 'Approved' }
    ]
  },
  // PA-001235
  {
    paId: 'PA-001235',
    utn: '',
    currentStatus: 'Pending',
    determinationDate: '',
    requestingProvider: 'Dr. Alex Kim',
    patientInfo: { name: 'Sarah K.', dob: '1978-02-14', gender: 'Female', memberId: 'M1002', address: '456 Oak St', phone: '555-200-3000', email: 'sarah.k@email.com' },
    serviceDetails: { codes: ['CHEMO-101'], dateOfService: '2025-11-21', location: 'Cancer Center' },
    clinicalJustification: 'Chemotherapy for cancer treatment.',
    submittedFiles: [ { fileName: 'Chemo_Consent.pdf', fileUrl: '/api/download/file/202', uploadDate: '2025-11-21' } ],
    paHistory: [ { eventDate: '2025-11-21 08:30 AM', eventDescription: 'PA Request Submitted by Provider.', internalNotes: '', statusChange: 'Pending' } ]
  },
  // PA-001237 (third object)
  {
    paId: 'PA-001237',
    utn: '',
    currentStatus: 'Draft',
    determinationDate: '',
    requestingProvider: 'Dr. Morgan K.',
    patientInfo: { name: 'Morgan K.', dob: '1990-07-22', gender: 'Non-binary', memberId: 'M1004', address: '321 Birch St', phone: '555-400-5000', email: 'morgan.k@email.com' },
    serviceDetails: { codes: ['SURG-301'], dateOfService: '2025-11-23', location: 'Surgical Center' },
    clinicalJustification: 'Surgery scheduled for next week.',
    submittedFiles: [ { fileName: 'Surgery_Consent.pdf', fileUrl: '/api/download/file/204', uploadDate: '2025-11-23' } ],
    paHistory: [ { eventDate: '2025-11-23 10:00 AM', eventDescription: 'Draft created.', internalNotes: '', statusChange: 'Draft' } ]
  }
];
