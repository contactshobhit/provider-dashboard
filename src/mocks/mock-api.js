// mock-api.js
// Mock API for PA Detail View

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
    paHistory: [ { eventDate: '2025-11-21 08:30 AM', eventDescription: 'PA Request Submitted by Provider.', internalNotes: '', statusChange: 'Pending' } ],
    missingDocuments: true
  },
  // PA-001236
  {
    paId: 'PA-001236',
    utn: '12345678901234',
    currentStatus: 'Denied',
    determinationDate: '2025-11-18',
    requestingProvider: 'Dr. Robert M.',
    patientInfo: { name: 'Robert M.', dob: '1965-03-10', gender: 'Male', memberId: 'M1003', address: '789 Pine St', phone: '555-300-4000', email: 'robert.m@email.com' },
    serviceDetails: { codes: ['PT-201'], dateOfService: '2025-11-15', location: 'Rehab Center' },
    clinicalJustification: 'Physical therapy for injury recovery.',
    submittedFiles: [ { fileName: 'PT_Notes.pdf', fileUrl: '/api/download/file/203', uploadDate: '2025-11-16' } ],
    paHistory: [
      { eventDate: '2025-11-15 09:00 AM', eventDescription: 'PA Request Submitted by Provider.', internalNotes: '', statusChange: 'Pending' },
      { eventDate: '2025-11-18 11:00 AM', eventDescription: 'Determination Made.', internalNotes: 'Denied due to missing info.', statusChange: 'Denied' }
    ],
    p2pExpired: true
  },
  // PA-001237
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
  },
  // PA-001238
  {
    paId: 'PA-001238',
    utn: '',
    currentStatus: 'Expired',
    determinationDate: '2025-11-30',
    requestingProvider: 'Dr. Chris P.',
    patientInfo: { name: 'Chris P.', dob: '1985-11-11', gender: 'Male', memberId: 'M1005', address: '654 Cedar St', phone: '555-500-6000', email: 'chris.p@email.com' },
    serviceDetails: { codes: ['XRAY-401'], dateOfService: '2025-11-24', location: 'Imaging Center' },
    clinicalJustification: 'X-Ray for bone fracture.',
    submittedFiles: [ { fileName: 'XRay_Image.pdf', fileUrl: '/api/download/file/205', uploadDate: '2025-11-25' } ],
    paHistory: [
      { eventDate: '2025-11-24 09:00 AM', eventDescription: 'PA Request Submitted by Provider.', internalNotes: '', statusChange: 'Pending' },
      { eventDate: '2025-11-30 09:00 AM', eventDescription: 'Expired.', internalNotes: '', statusChange: 'Expired' }
    ]
  },
  // PA-001239
  {
    paId: 'PA-001239',
    utn: '56789012345678',
    currentStatus: 'Approved',
    determinationDate: '2025-11-27',
    requestingProvider: 'Dr. Sam R.',
    patientInfo: { name: 'Sam R.', dob: '1972-04-18', gender: 'Male', memberId: 'M1006', address: '987 Spruce St', phone: '555-600-7000', email: 'sam.r@email.com' },
    serviceDetails: { codes: ['LAB-501'], dateOfService: '2025-11-25', location: 'Lab Center' },
    clinicalJustification: 'Lab test for annual checkup.',
    submittedFiles: [ { fileName: 'Lab_Report.pdf', fileUrl: '/api/download/file/206', uploadDate: '2025-11-26' } ],
    paHistory: [
      { eventDate: '2025-11-25 08:00 AM', eventDescription: 'PA Request Submitted by Provider.', internalNotes: '', statusChange: 'Pending' },
      { eventDate: '2025-11-27 10:00 AM', eventDescription: 'Determination Made.', internalNotes: '', statusChange: 'Approved' }
    ]
  },
  // PA-001240
  {
    paId: 'PA-001240',
    utn: '',
    currentStatus: 'Pending',
    determinationDate: '',
    requestingProvider: 'Dr. Jane S.',
    patientInfo: { name: 'Jane S.', dob: '1995-12-12', gender: 'Female', memberId: 'M1007', address: '111 Willow St', phone: '555-700-8000', email: 'jane.s@email.com' },
    serviceDetails: { codes: ['US-601'], dateOfService: '2025-11-26', location: 'Ultrasound Center' },
    clinicalJustification: 'Ultrasound for abdominal pain.',
    submittedFiles: [ { fileName: 'Ultrasound_Image.pdf', fileUrl: '/api/download/file/207', uploadDate: '2025-11-27' } ],
    paHistory: [ { eventDate: '2025-11-26 09:00 AM', eventDescription: 'PA Request Submitted by Provider.', internalNotes: '', statusChange: 'Pending' } ]
  },
  // PA-001241
  {
    paId: 'PA-001241',
    utn: '23456789012345',
    currentStatus: 'Denied',
    determinationDate: '2025-11-29',
    requestingProvider: 'Dr. Pat L.',
    patientInfo: { name: 'Pat L.', dob: '1988-08-08', gender: 'Female', memberId: 'M1008', address: '222 Maple St', phone: '555-800-9000', email: 'pat.l@email.com' },
    serviceDetails: { codes: ['BW-701'], dateOfService: '2025-11-27', location: 'Blood Work Lab' },
    clinicalJustification: 'Blood work for anemia.',
    submittedFiles: [ { fileName: 'BloodWork_Report.pdf', fileUrl: '/api/download/file/208', uploadDate: '2025-11-28' } ],
    paHistory: [
      { eventDate: '2025-11-27 08:00 AM', eventDescription: 'PA Request Submitted by Provider.', internalNotes: '', statusChange: 'Pending' },
      { eventDate: '2025-11-29 09:00 AM', eventDescription: 'Determination Made.', internalNotes: 'Denied due to abnormal results.', statusChange: 'Denied' }
    ]
  },
  // PA-001242
  {
    paId: 'PA-001242',
    utn: '',
    currentStatus: 'Draft',
    determinationDate: '',
    requestingProvider: 'Dr. Lee W.',
    patientInfo: { name: 'Lee W.', dob: '1970-06-30', gender: 'Male', memberId: 'M1009', address: '333 Aspen St', phone: '555-900-1000', email: 'lee.w@email.com' },
    serviceDetails: { codes: ['CT-801'], dateOfService: '2025-11-28', location: 'CT Center' },
    clinicalJustification: 'CT scan for head injury.',
    submittedFiles: [ { fileName: 'CT_Scan.pdf', fileUrl: '/api/download/file/209', uploadDate: '2025-11-29' } ],
    paHistory: [ { eventDate: '2025-11-28 09:00 AM', eventDescription: 'Draft created.', internalNotes: '', statusChange: 'Draft' } ]
  },
  // PA-001243
  {
    paId: 'PA-001243',
    utn: '',
    currentStatus: 'Expired',
    determinationDate: '2025-12-01',
    requestingProvider: 'Dr. Kim M.',
    patientInfo: { name: 'Kim M.', dob: '1982-09-09', gender: 'Female', memberId: 'M1010', address: '444 Poplar St', phone: '555-101-1100', email: 'kim.m@email.com' },
    serviceDetails: { codes: ['MRI-002'], dateOfService: '2025-11-29', location: 'MRI Center' },
    clinicalJustification: 'MRI for follow-up.',
    submittedFiles: [ { fileName: 'MRI_Followup.pdf', fileUrl: '/api/download/file/210', uploadDate: '2025-11-30' } ],
    paHistory: [
      { eventDate: '2025-11-29 09:00 AM', eventDescription: 'PA Request Submitted by Provider.', internalNotes: '', statusChange: 'Pending' },
      { eventDate: '2025-12-01 10:00 AM', eventDescription: 'Expired.', internalNotes: '', statusChange: 'Expired' }
    ]
  },
  // PA-001244
  {
    paId: 'PA-001244',
    utn: '34567890123456',
    currentStatus: 'Approved',
    determinationDate: '2025-12-02',
    requestingProvider: 'Dr. Jordan F.',
    patientInfo: { name: 'Jordan F.', dob: '1993-03-03', gender: 'Non-binary', memberId: 'M1011', address: '555 Elm St', phone: '555-111-1200', email: 'jordan.f@email.com' },
    serviceDetails: { codes: ['CT-802'], dateOfService: '2025-11-30', location: 'CT Center' },
    clinicalJustification: 'CT scan for chest pain.',
    submittedFiles: [ { fileName: 'CT_Chest.pdf', fileUrl: '/api/download/file/211', uploadDate: '2025-12-01' } ],
    paHistory: [
      { eventDate: '2025-11-30 09:00 AM', eventDescription: 'PA Request Submitted by Provider.', internalNotes: '', statusChange: 'Pending' },
      { eventDate: '2025-12-02 09:00 AM', eventDescription: 'Determination Made.', internalNotes: '', statusChange: 'Approved' }
    ]
  },
  // PA-001245
  {
    paId: 'PA-001245',
    utn: '',
    currentStatus: 'Pending',
    determinationDate: '',
    requestingProvider: 'Dr. Taylor B.',
    patientInfo: { name: 'Taylor B.', dob: '1999-10-10', gender: 'Female', memberId: 'M1012', address: '666 Willow St', phone: '555-121-1300', email: 'taylor.b@email.com' },
    serviceDetails: { codes: ['SURG-302'], dateOfService: '2025-12-01', location: 'Surgical Center' },
    clinicalJustification: 'Surgery for acute appendicitis.',
    submittedFiles: [ { fileName: 'Surgery_Consent.pdf', fileUrl: '/api/download/file/212', uploadDate: '2025-12-01' } ],
    paHistory: [ { eventDate: '2025-12-01 09:00 AM', eventDescription: 'PA Request Submitted by Provider.', internalNotes: '', statusChange: 'Pending' } ]
  },
  // PA-001246
  {
    paId: 'PA-001246',
    utn: '45678901234567',
    currentStatus: 'Denied',
    determinationDate: '2025-12-04',
    requestingProvider: 'Dr. Casey N.',
    patientInfo: { name: 'Casey N.', dob: '1987-12-12', gender: 'Male', memberId: 'M1013', address: '777 Oak St', phone: '555-131-1400', email: 'casey.n@email.com' },
    serviceDetails: { codes: ['PT-202'], dateOfService: '2025-12-02', location: 'Rehab Center' },
    clinicalJustification: 'Physical therapy for post-surgery recovery.',
    submittedFiles: [ { fileName: 'PT_Recovery.pdf', fileUrl: '/api/download/file/213', uploadDate: '2025-12-03' } ],
    paHistory: [
      { eventDate: '2025-12-02 09:00 AM', eventDescription: 'PA Request Submitted by Provider.', internalNotes: '', statusChange: 'Pending' },
      { eventDate: '2025-12-04 10:00 AM', eventDescription: 'Determination Made.', internalNotes: 'Denied due to incomplete therapy notes.', statusChange: 'Denied' }
    ]
  },
  // PA-001247
  {
    paId: 'PA-001247',
    utn: '',
    currentStatus: 'Draft',
    determinationDate: '',
    requestingProvider: 'Dr. Riley Q.',
    patientInfo: { name: 'Riley Q.', dob: '1991-05-05', gender: 'Non-binary', memberId: 'M1014', address: '888 Pine St', phone: '555-141-1500', email: 'riley.q@email.com' },
    serviceDetails: { codes: ['LAB-502'], dateOfService: '2025-12-03', location: 'Lab Center' },
    clinicalJustification: 'Lab test for hormone levels.',
    submittedFiles: [ { fileName: 'Lab_Hormone.pdf', fileUrl: '/api/download/file/214', uploadDate: '2025-12-03' } ],
    paHistory: [ { eventDate: '2025-12-03 09:00 AM', eventDescription: 'Draft created.', internalNotes: '', statusChange: 'Draft' } ]
  },
  // PA-001248
  {
    paId: 'PA-001248',
    utn: '',
    currentStatus: 'Expired',
    determinationDate: '2025-12-06',
    requestingProvider: 'Dr. Drew V.',
    patientInfo: { name: 'Drew V.', dob: '1983-03-03', gender: 'Male', memberId: 'M1015', address: '999 Cedar St', phone: '555-151-1600', email: 'drew.v@email.com' },
    serviceDetails: { codes: ['XRAY-402'], dateOfService: '2025-12-04', location: 'Imaging Center' },
    clinicalJustification: 'X-Ray for chest pain.',
    submittedFiles: [ { fileName: 'XRay_Chest.pdf', fileUrl: '/api/download/file/215', uploadDate: '2025-12-05' } ],
    paHistory: [
      { eventDate: '2025-12-04 09:00 AM', eventDescription: 'PA Request Submitted by Provider.', internalNotes: '', statusChange: 'Pending' },
      { eventDate: '2025-12-06 09:00 AM', eventDescription: 'Expired.', internalNotes: '', statusChange: 'Expired' }
    ]
  }
];

export function handleGetPADetail(req, res) {
  const { paId } = req.params;
  const record = mockPADetails.find((item) => item.paId === paId);
  if (record) {
    res.status(200).json(record);
  } else {
    res.status(404).json({ error: 'PA record not found' });
  }
}
