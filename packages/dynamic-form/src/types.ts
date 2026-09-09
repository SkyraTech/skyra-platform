/**
 * @skyra/dynamic-form — types.ts
 * Schema types confirmed from skyra-erp DynamicForm.tsx (READ-ONLY) and extended for platform primitives.
 */

export type FieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'url'
  | 'number'
  | 'password'
  | 'search'
  | 'select'
  | 'checkbox'
  | 'checkbox-group'
  | 'radio'
  | 'radio-group'
  | 'switch'
  | 'textarea'
  | 'date'
  | 'date-range'
  | 'time'
  | 'datetime';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  group?: string;
  disabled?: boolean;
}

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface CheckboxOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface FieldSchema {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  helper?: string;
  description?: string;
  /** Span full row width in 2-column layout */
  full?: boolean;
  /** Disable this specific field */
  disabled?: boolean;
  /** For 'select', 'radio-group', 'checkbox-group' types */
  options?: SelectOption[];
  /** Select configuration */
  mode?: 'single' | 'multiple';
  searchable?: boolean;
  selectAll?: boolean;
  maxVisibleValues?: number | 'auto';
  clearable?: boolean;
  grouping?: boolean;
  /** Number constraints */
  min?: number;
  max?: number;
  step?: number;
  /** Textarea rows */
  rows?: number;
  minRows?: number;
  maxRows?: number;
  autoResize?: boolean;
  maxLength?: number;
  /** Orientation for radio-group and checkbox-group */
  orientation?: 'vertical' | 'horizontal';
  /** Time format */
  timeFormat?: '12h' | '24h';
  /** Field dependency logic */
  dependsOn?: {
    field: string;
    value: any;
  };
}

export interface FieldsetSchema {
  title: string;
  subtitle?: string;
  fields: FieldSchema[];
}

export type FormValues = Record<string, any>;
export type FormErrors = Record<string, string>;

export interface DynamicFormProps {
  fieldsets: FieldsetSchema[];
  values: FormValues;
  errors?: FormErrors;
  onChange: (key: string, value: any) => void;
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
  className?: string;
}
