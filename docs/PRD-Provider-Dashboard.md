# Product Requirements Document
## Provider Portal Dashboard

**Version:** 1.0
**Date:** December 15, 2025
**Status:** Implementation Complete
**Target Audience:** Technical Leads & Developers

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [User Personas](#2-user-personas)
3. [Business Context](#3-business-context)
4. [Feature Requirements](#4-feature-requirements)
5. [State Machines & Workflows](#5-state-machines--workflows)
6. [Data Models](#6-data-models)
7. [API Specifications](#7-api-specifications)
8. [UI/UX Requirements](#8-uiux-requirements)
9. [Technical Architecture](#9-technical-architecture)

---

## 1. Executive Summary

### 1.1 Product Overview

The Provider Portal Dashboard is a web-based application designed for healthcare providers (physicians, office staff) to manage Prior Authorization (PA) requests, Peer-to-Peer (P2P) reviews, Additional Documentation Requests (ADR), and support tickets with health insurance payers.

### 1.2 Business Objectives

- **Reduce administrative burden** on provider office staff by centralizing PA management
- **Improve transparency** into PA determination status and next steps
- **Streamline P2P scheduling** to expedite appeals for non-affirmed decisions
- **Decrease turnaround time** for PA determinations through efficient documentation submission

### 1.3 Key Terminology

| Term | Definition |
|------|------------|
| **PA (Prior Authorization)** | Pre-approval required from payer before medical service |
| **UTN (Unique Tracking Number)** | 14-digit identifier assigned at determination |
| **P2P (Peer-to-Peer)** | Phone consultation between provider and payer's Medical Director |
| **ADR (Additional Documentation Request)** | Request for supplemental clinical records |
| **Affirmed** | PA request approved |
| **Non-Affirmed** | PA request denied |
| **Partial Affirmation** | PA request partially approved (some services approved, others denied) |

---

## 2. User Personas

### 2.1 Primary Persona: Office Staff (Jane Smith)

```
Role: Medical Office Administrator
Organization: Orthopedic Surgery Practice
Experience: 5+ years in healthcare administration
```

**Goals:**
- Submit PA requests efficiently with minimal errors
- Track status of all pending PAs in one place
- Quickly identify PAs requiring action (P2P scheduling, resubmission)
- Respond to ADRs before deadlines

**Pain Points:**
- Multiple payer portals with different interfaces
- Difficulty tracking which PAs need attention
- Manual phone calls to schedule P2P reviews
- Lost or delayed determination letters

**Daily Tasks:**
1. Check dashboard for new determinations
2. Submit new PA requests for upcoming surgeries
3. Schedule P2P calls for non-affirmed PAs
4. Upload additional documentation when requested
5. Track support ticket responses

### 2.2 Secondary Persona: Physician (Dr. Smith)

```
Role: Orthopedic Surgeon
Organization: Orthopedic Surgery Practice
Experience: 15 years in practice
```

**Goals:**
- Review non-affirmed cases before P2P calls
- Understand denial reasons to provide better clinical justification
- Minimize time spent on administrative tasks

**Pain Points:**
- Limited time between patient appointments
- Need quick access to PA status before surgery scheduling
- Want to see determination rationale for appeals

---

## 3. Business Context

### 3.1 PA Lifecycle Overview

```
┌─────────────┐    ┌───────────┐    ┌──────────────┐    ┌─────────────────┐
│   Draft     │───►│ Submitted │───►│ Under Review │───►│  Determination  │
└─────────────┘    └───────────┘    └──────────────┘    └─────────────────┘
                                                                 │
                         ┌───────────────────────────────────────┼───────────────────┐
                         │                    │                  │                   │
                         ▼                    ▼                  ▼                   ▼
                   ┌──────────┐    ┌──────────────────┐   ┌─────────────┐    ┌───────────┐
                   │ Affirmed │    │ Partial Affirm.  │   │Non-Affirmed │    │ Dismissed │
                   └──────────┘    └──────────────────┘   └─────────────┘    └───────────┘
                                           │                     │
                                           └──────────┬──────────┘
                                                      ▼
                                              ┌──────────────┐
                                              │  P2P Review  │
                                              │  (Optional)  │
                                              └──────────────┘
```

### 3.2 Business Rules

#### UTN Assignment
- UTN is assigned **only** when a determination is made
- UTN format: 14 numeric digits
- UTN is required for resubmissions to link to original PA

#### P2P Eligibility
- P2P can be requested for: `Non-Affirmed` or `Partial Affirmation` status
- P2P **cannot** be requested if there's an active P2P (status = Requested or Scheduled)
- Multiple P2P requests are allowed (after previous P2P is Completed)

#### Resubmission Rules
- Resubmission requires original UTN
- Resubmission creates new PA with `parentPaId` reference
- Available for: `Non-Affirmed` or `Partial Affirmation` status

---

## 4. Feature Requirements

### 4.1 Dashboard (Home)

**Purpose:** Provide at-a-glance summary of items requiring attention

#### Summary Cards

| Card | Data Source | Click Action |
|------|-------------|--------------|
| Under Review | Count of PAs with status `Under Review` | Navigate to PA Search filtered |
| Recent Determinations | Count of Affirmed + Non-Affirmed in last 7 days | Navigate to PA Search |
| Open Support Tickets | Count of tickets not `Resolved` | Navigate to Support Tickets |
| P2P Scheduled | Count of P2P calls with status `Scheduled` | Navigate to PA Search with P2P filter |
| P2P Requested | Count of P2P calls with status `Requested` | Navigate to PA Search with P2P filter |

#### Recent Activity Feed
- Shows last 15 activity items across all modules
- Activity types: PA status changes, P2P updates, ADR submissions, Support tickets
- Clickable rows navigate to relevant detail view

### 4.2 PA Search & Status

**Purpose:** Search, filter, and manage all PA requests

#### Search & Filter Controls

| Filter | Type | Options |
|--------|------|---------|
| Search | Text | PA ID, Patient Name |
| Status | Dropdown | All, Draft, Submitted, Under Review, Affirmed, Non-Affirmed, Partial Affirmation, Dismissed |
| P2P Activity | Dropdown | All, P2P Requested, P2P Scheduled, P2P Completed, No P2P Activity |
| Request Start Date | Date Picker | Filters on `requestDate` |
| Request End Date | Date Picker | Filters on `requestDate` |

#### Grid Columns

| Column | Description | Notes |
|--------|-------------|-------|
| PA ID | Clickable link to detail view | Shows parent PA link if resubmission |
| UTN | 14-digit tracking number | Only displayed after determination |
| Patient Name | Abbreviated (e.g., "John D.") | Privacy consideration |
| Service Type | Procedure description | |
| Request Date | Date PA was submitted | MM/DD/YYYY format |
| Current Status | Status chip with color coding | |
| P2P Activity | P2P status chip with icon | Only shown if P2P exists |
| Determination Date | Date determination was made | "-" if not yet determined |
| Records | Count of submitted documents | |
| Actions | Context menu | Options based on status |

#### Context Menu Actions by Status

| Status | Available Actions |
|--------|-------------------|
| Draft | Continue Draft |
| Submitted | Upload Additional Documents, View Supporting Records |
| Under Review | Upload Additional Documents, View Supporting Records |
| Affirmed | View Determination Letter, View Supporting Records |
| Non-Affirmed | View Determination Letter, Request P2P*, Resubmit PA, View Supporting Records |
| Partial Affirmation | View Determination Letter, Request P2P*, Resubmit PA, View Supporting Records |
| Dismissed | View Determination Letter, View Supporting Records |

*P2P request only available if no active P2P (Requested/Scheduled)

### 4.3 PA Detail View

**Purpose:** Display comprehensive PA information and enable actions

#### Sections

1. **PA Overview**
   - PA ID, UTN (if determined), Status chip
   - Determination date (if applicable)
   - Requesting provider name

2. **Patient Information**
   - Name, DOB, Gender
   - Member ID, Address, Phone, Email
   - Diagnosis codes

3. **Service Details**
   - Procedure codes
   - Date of service
   - Location of service
   - Clinical justification

4. **P2P Activity** (conditional)
   - Displayed for: Non-Affirmed, Partial Affirmation, Affirmed (with P2P history)
   - Shows all P2P calls with status, dates, outcome
   - Call-to-action button for requesting new P2P

5. **Resubmission Information** (conditional)
   - Displayed if PA is a resubmission
   - Link to parent PA

6. **Documentation**
   - List of uploaded files with download links
   - Upload date for each file

7. **PA History / Audit Trail**
   - Chronological list of all status changes
   - Event date, description, internal notes

#### Action Buttons (Conditional)

| Button | Condition |
|--------|-----------|
| Request Peer-to-Peer | Status is Non-Affirmed or Partial Affirmation AND no active P2P |
| Request Another P2P | Same as above but has completed P2P |
| Upload More Documents | Status is Submitted or Under Review AND has missing documents |
| Submit Resubmission | Status is Non-Affirmed or Partial Affirmation |
| Continue Draft | Status is Draft |

### 4.4 PA Submission Form

**Purpose:** Multi-step wizard for submitting new PA requests

#### Step 1: Patient & Service Details

**Section A: Submission Details**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Submission Type | Dropdown | Yes | Initial, Resubmission |
| Location of Service | Dropdown | Yes | Office, Outpatient, Inpatient, Home, Other |
| Previous UTN | Text (14 digits) | If Resubmission | Auto-populated from URL params |
| Submitted Date | Date | Yes | **Auto-populated, read-only** (current date) |
| Anticipated Date of Service | Date | No | |

**Section B: Procedure Codes (up to 4)**

| Field | Required |
|-------|----------|
| Procedure Code | Yes (first row) |
| Modifier | No |
| Units | Yes (first row) |
| Diagnosis Code | No |

#### Step 2: Provider & Facility Info

**Section A: Facility Information**

| Field | Required |
|-------|----------|
| Facility Name | Yes |
| Facility NPI | Yes |
| Facility CCN | No |
| Address Line 1 | Yes |
| Address Line 2 | No |
| City | Yes |
| State | Yes |
| ZIP | Yes |

**Section B: Physician/Requester**

| Field | Required |
|-------|----------|
| Physician Name | Yes |
| Physician NPI/PTAN | Yes |
| Requester Name | Yes |
| Requester Phone | Yes |
| Requester Email | Yes |

#### Step 3: Diagnosis & Justification

| Field | Required |
|-------|----------|
| Diagnosis Codes | Auto-populated from Step 1 |
| Clinical Justification | Yes (multiline text) |

#### Step 4: File Uploads

- Drag-and-drop or click to upload
- Accepted formats: PDF, JPG, PNG, DOC, DOCX
- Max file size: 10MB per file
- Progress indicator for each file
- Required: At least 1 file

#### Step 5: Review & Submit

- Summary of all entered information
- Edit buttons to return to specific steps
- Submit button (disabled until all required fields complete)

### 4.5 P2P Scheduling

**Purpose:** Request Peer-to-Peer review call with Medical Director

#### Form Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Associated PA ID | Dropdown | Yes | Only shows Non-Affirmed or Partial Affirmation PAs |
| Physician Name | Text | Read-only | Auto-filled from profile |
| Contact Phone | Text | Yes | Pre-filled, editable |
| Contact Email | Text | Yes | Pre-filled, editable |
| Preferred Date 1 | Date | Yes | |
| Time Slot 1 | Dropdown | Yes | 30-minute intervals (9:00-11:30, 13:00-16:30) |
| Preferred Date 2 | Date | No | |
| Time Slot 2 | Dropdown | No | Must differ from Slot 1 if same date |
| Preferred Date 3 | Date | No | |
| Time Slot 3 | Dropdown | No | |
| Reason for Request | Multiline text | Yes | |

#### Time Slot Options
```
09:00, 09:30, 10:00, 10:30, 11:00, 11:30
13:00, 13:30, 14:00, 14:30, 15:00, 15:30, 16:00, 16:30
```

### 4.6 ADR Management

**Purpose:** View and respond to Additional Documentation Requests

#### Grid Columns

| Column | Description |
|--------|-------------|
| Claim ID | Unique identifier |
| Patient Name | |
| Request Date | Date ADR was created |
| Due Date | Deadline for response |
| Status | Requested, Submitted, Under Review, Completed |
| Actions | Upload Documents |

### 4.7 Support Tickets

**Purpose:** Submit and track support inquiries

#### Categories
- General Inquiry
- Technical Issue
- Benefit Question

#### Ticket Statuses
- Open
- In Progress
- Awaiting Provider Response
- Resolved

---

## 5. State Machines & Workflows

### 5.1 PA Status State Machine

```
                    ┌─────────────────────────────────────────────┐
                    │                                             │
                    ▼                                             │
┌───────┐      ┌───────────┐      ┌──────────────┐               │
│ Draft │─────►│ Submitted │─────►│ Under Review │───────────────┤
└───────┘      └───────────┘      └──────────────┘               │
                                         │                       │
         ┌───────────────────────────────┼───────────────────────┤
         │              │                │                       │
         ▼              ▼                ▼                       ▼
   ┌──────────┐  ┌─────────────┐  ┌──────────────────┐    ┌───────────┐
   │ Affirmed │  │Non-Affirmed │  │Partial Affirmation│   │ Dismissed │
   └──────────┘  └─────────────┘  └──────────────────┘    └───────────┘
```

**Valid Transitions:**

| From | To | Trigger |
|------|-----|---------|
| Draft | Submitted | User submits form |
| Submitted | Under Review | Payer begins review |
| Under Review | Affirmed | Payer approves |
| Under Review | Non-Affirmed | Payer denies |
| Under Review | Partial Affirmation | Payer partially approves |
| Under Review | Dismissed | Duplicate/invalid request |

### 5.2 P2P Status State Machine

```
┌───────────┐      ┌───────────┐      ┌───────────┐
│ Requested │─────►│ Scheduled │─────►│ Completed │
└───────────┘      └───────────┘      └───────────┘
```

**P2P is independent of PA status.** A PA can remain "Non-Affirmed" even after P2P completion if the outcome is "Upheld."

**P2P Outcomes:**
- `Affirmed` - Original decision overturned, PA approved
- `Upheld` - Original decision maintained

### 5.3 P2P Request Workflow

```
1. User views Non-Affirmed or Partial Affirmation PA
2. System checks: Is there an active P2P? (status = Requested or Scheduled)
   ├── YES: Hide "Request P2P" button
   └── NO: Show "Request P2P" button (or "Request Another P2P" if has completed P2P)
3. User fills P2P scheduling form
4. System creates P2P record with status = "Requested"
5. Payer schedules call → status = "Scheduled" (with date/time/MD info)
6. Call occurs → status = "Completed" (with outcome and notes)
7. If outcome = "Affirmed":
   - PA status may be updated to "Affirmed"
   - Revised determination letter issued
```

---

## 6. Data Models

### 6.1 PA Record (Search Grid)

```typescript
interface PARecord {
  id: string;                    // e.g., "PA-001234"
  patientName: string;           // e.g., "John D."
  requestDate: string;           // ISO date
  serviceType: string;           // e.g., "Spinal Fusion"
  status: PAStatus;
  determinationDate?: string;    // ISO date, only if determined
  submittedRecords: number;
  utn?: string;                  // 14 digits, only if determined
  parentPaId?: string;           // If this is a resubmission
  p2pCalls?: P2PCall[];
}

type PAStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Affirmed'
  | 'Non-Affirmed'
  | 'Partial Affirmation'
  | 'Dismissed';
```

### 6.2 PA Detail

```typescript
interface PADetail {
  paId: string;
  utn?: string;
  currentStatus: PAStatus;
  determinationDate?: string;
  requestingProvider: string;
  parentPaId?: string;
  patientInfo: {
    name: string;
    dob: string;
    gender: string;
    memberId: string;
    address: string;
    phone: string;
    email: string;
    diagnosisCodes: string[];
  };
  serviceDetails: {
    codes: string[];
    dateOfService: string;
    location: string;
  };
  clinicalJustification: string;
  submittedFiles: {
    fileName: string;
    fileUrl: string;
    uploadDate: string;
  }[];
  paHistory: {
    eventDate: string;
    eventDescription: string;
    internalNotes: string;
    statusChange: string;
  }[];
  p2pCalls?: P2PCall[];
  missingDocuments?: boolean;
}
```

### 6.3 P2P Call

```typescript
interface P2PCall {
  id: string;                      // e.g., "P2P-001"
  status: P2PStatus;
  requestedDate: string;           // When provider requested P2P
  scheduledDate?: string;          // When call is scheduled
  scheduledTime?: string;          // e.g., "10:00 AM"
  contactNumber?: string;          // Number to call
  medicalDirectorName?: string;    // Payer's MD
  completedDate?: string;
  outcome?: P2POutcome;
  notes?: string;
}

type P2PStatus = 'Requested' | 'Scheduled' | 'Completed';
type P2POutcome = 'Affirmed' | 'Upheld';
```

### 6.4 Dashboard Summary

```typescript
interface DashboardSummary {
  underReviewCount: number;
  recentDeterminationsCount: number;
  openTicketsCount: number;
  p2pScheduledCount: number;
  p2pRequestedCount: number;
  affirmedLast7Days: number;
  nonAffirmedLast7Days: number;
}
```

---

## 7. API Specifications

### 7.1 Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pa/records` | List PA records with pagination |
| GET | `/api/pa/details/:paId` | Get PA detail by ID |
| POST | `/api/pa/submit` | Submit new PA request |
| POST | `/api/pa/p2p/request` | Request P2P review |
| GET | `/api/dashboard/summary` | Get dashboard counts |
| GET | `/api/dashboard/recent-activity` | Get recent activity feed |
| GET | `/api/adr/records` | List ADR records |
| POST | `/api/adr/upload/:claimId` | Upload ADR documents |
| GET | `/api/support/tickets` | List support tickets |
| POST | `/api/support/tickets` | Create support ticket |
| GET | `/api/user/profile` | Get current user profile |

### 7.2 Response Format

```typescript
interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
```

### 7.3 Pagination

```typescript
interface PaginatedResponse<T> {
  status: 'success';
  data: {
    totalRecords: number;
    pageSize: number;
    currentPage: number;
    records: T[];
  };
}
```

---

## 8. UI/UX Requirements

### 8.1 Status Color Coding

All status indicators must meet **WCAG AA contrast requirements** (4.5:1 ratio).

| Status | Background | Text Color | Use Case |
|--------|------------|------------|----------|
| Draft | `#E0E0E0` | `#424242` | PA not yet submitted |
| Submitted | `#E3F2FD` | `#0D47A1` | PA sent to payer |
| Under Review | `#FFF8E1` | `#E65100` | Payer reviewing |
| Affirmed | `#E8F5E9` | `#1B5E20` | Approved |
| Non-Affirmed | `#FFEBEE` | `#B71C1C` | Denied |
| Partial Affirmation | `#FFF3E0` | `#E65100` | Partially approved |
| Dismissed | `#ECEFF1` | `#37474F` | Invalid/duplicate |
| Requested (P2P) | `#EDE7F6` | `#4527A0` | P2P pending scheduling |
| Scheduled (P2P) | `#E3F2FD` | `#1565C0` | P2P date confirmed |
| Completed (P2P) | `#E8F5E9` | `#2E7D32` | P2P finished |

### 8.2 Date Format

- Display format: `MM/DD/YYYY` (US format)
- API format: `YYYY-MM-DD` (ISO 8601)

### 8.3 Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| xs | 0-599px | Single column, stacked cards |
| sm | 600-899px | 2 columns for cards |
| md | 900-1199px | 3 columns for cards |
| lg | 1200px+ | Full desktop layout |

### 8.4 Navigation Structure

```
├── Dashboard (/)
├── Prior Auth
│   ├── PA Search (/pa/search)
│   ├── PA Detail (/pa/details/:paId)
│   ├── New PA (/pa/new)
│   └── P2P Request (/pa/p2p/:paId)
├── ADR Management (/adr/management)
└── Support Tickets (/support/tickets)
```

---

## 9. Technical Architecture

### 9.1 Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend Framework | React 18 with TypeScript |
| UI Components | Material UI (MUI) v6 |
| State Management | React hooks (useState, useEffect) |
| Routing | React Router v6 |
| Data Grid | MUI X DataGrid |
| Date Handling | date-fns with MUI X Date Pickers |
| API Mocking | Mock Service Worker (MSW) |
| Build Tool | Vite |

### 9.2 Project Structure

```
src/
├── api/                    # API client functions
│   └── pa.ts
├── components/
│   ├── layout/            # Shared layout components
│   │   └── PageLayout.tsx
│   ├── pa/                # PA-specific components
│   │   ├── SubmissionDetailsSection.tsx
│   │   ├── BeneficiaryInfoSection.tsx
│   │   └── ...
│   ├── DashboardLayout.tsx
│   ├── PADetailView.tsx
│   ├── PriorAuthSearchPage.tsx
│   ├── PriorAuthSubmissionPage.tsx
│   ├── PeerToPeerRequestPage.tsx
│   └── ...
├── mocks/                  # Mock API data
│   ├── mock-api.ts
│   ├── paRecordsApi.json
│   └── ...
├── types/                  # TypeScript interfaces
│   ├── pa.ts
│   └── dashboard.ts
├── utils/
│   ├── statusStyles.ts    # Status color mappings
│   └── dateFormat.ts      # Date formatting utilities
└── App.tsx
```

### 9.3 Key Implementation Notes

1. **P2P Independence**: P2P status is tracked separately from PA status. A PA can have multiple P2P calls over its lifetime.

2. **UTN Assignment**: UTN is only present in the data model after determination. UI should handle null/undefined UTN gracefully.

3. **Conditional Rendering**: Many UI elements are conditional based on PA status:
   - P2P section: Only for Non-Affirmed, Partial Affirmation, or Affirmed with P2P history
   - Action buttons: Based on status and P2P state
   - UTN column: Only shown if status is a determination status

4. **Form Auto-population**:
   - Submitted Date: Always current date, read-only
   - Resubmission: Pre-fill submission type and UTN from URL params
   - Provider info: Pre-fill from user profile

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| Affirmed | PA request approved by payer |
| ADR | Additional Documentation Request |
| CCN | CMS Certification Number |
| Determination | Final decision on PA request |
| Medical Director | Payer's physician who reviews clinical cases |
| Non-Affirmed | PA request denied by payer |
| NPI | National Provider Identifier |
| P2P | Peer-to-Peer review (phone call with Medical Director) |
| PA | Prior Authorization |
| Partial Affirmation | PA request partially approved |
| PTAN | Provider Transaction Access Number |
| Resubmission | New PA referencing a previous denied PA |
| Upheld | P2P outcome where original denial is maintained |
| UTN | Unique Tracking Number (14 digits) |

---

## Appendix B: Status Reference Quick Guide

### PA Statuses and Allowed Actions

| Status | Can Request P2P? | Can Resubmit? | Has UTN? | Has Determination Letter? |
|--------|------------------|---------------|----------|---------------------------|
| Draft | No | No | No | No |
| Submitted | No | No | No | No |
| Under Review | No | No | No | No |
| Affirmed | No | No | Yes | Yes |
| Non-Affirmed | Yes* | Yes | Yes | Yes |
| Partial Affirmation | Yes* | Yes | Yes | Yes |
| Dismissed | No | No | Yes | Yes |

*Only if no active P2P (status = Requested or Scheduled)

### P2P Statuses

| Status | Description | Next Status |
|--------|-------------|-------------|
| Requested | Provider submitted P2P request | Scheduled |
| Scheduled | Payer confirmed date/time | Completed |
| Completed | Call finished | (Terminal) |

---

*Document generated: December 15, 2025*
