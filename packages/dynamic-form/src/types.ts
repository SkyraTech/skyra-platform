/**
 * @skyra/dynamic-form — types.ts
 * Schema types confirmed from skyra-erp DynamicForm.tsx (READ-ONLY).
 */

export type FieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'url'
  | 'number'
  | 'password'
  | 'select'
  | 'checkbox'
  | 'textarea';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FieldSchema {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  helper?: string;
  /** For 'select' type: the available options */
  options?: SelectOption[];
  /** Span full row width in 2-column layout */
  full?: boolean;
  /** Minimum value for 'number' type */
  min?: number;
  /** Maximum value for 'number' type */
  max?: number;
  /** Step for 'number' type */
  step?: number;
  /** Disable this specific field */
  disabled?: boolean;
}

export interface FieldsetSchema {
  title: string;
  subtitle?: string;
  /** If true, the fieldset danger zone UI is rendered */
  fields: FieldSchema[];
}

export type FormValues = Record<string, string | boolean | number>;
export type FormErrors = Record<string, string>;

export interface DynamicFormProps {
  fieldsets: FieldsetSchema[];
  values: FormValues;
  errors?: FormErrors;
  onChange: (key: string, value: string | boolean | number) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  /** Show a danger zone section at the bottom of the form */
  showDangerZone?: boolean;
  dangerZoneTitle?: string;
  dangerZoneLabel?: string;
  dangerZoneDesc?: string;
  onDangerAction?: () => void;
}
