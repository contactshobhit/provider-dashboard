import React from 'react';
import { PASubmissionFormValues } from './pa';

// Form Error Types
export type FormErrors = {
  [K in keyof PASubmissionFormValues]?: string;
} & {
  [key: string]: string | undefined;
};

// Common Form Section Props
export interface FormSectionProps {
  values: PASubmissionFormValues;
  errors: FormErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

// Extended props for sections with array fields
export interface FormSectionWithArrayProps extends FormSectionProps {
  onArrayChange?: (field: string, idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Procedure Codes Section Props
export interface ProcedureCodesSectionProps {
  procedureCodes: string[];
  modifiers: string[];
  units: string[];
  errors: FormErrors;
  onChange: (field: string, idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd: () => void;
  onRemove: (idx: number) => void;
}

// Medical Record Upload Props
export interface MedicalRecordUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  uploadProgress: number[];
}

// Select Option Type
export interface SelectOption {
  value: string;
  label: string;
}

// File Upload State
export interface FileUploadState {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}
