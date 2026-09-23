/**
 * @skyra/dynamic-form — types.ts
 * Strict enterprise schema types for DynamicForm.
 */

import React from 'react';

export type FieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'url'
  | 'number'
  | 'password'
  | 'search'
  | 'select'
  | 'multi-select'
  | 'checkbox'
  | 'checkbox-group'
  | 'radio'
  | 'radio-group'
  | 'switch'
  | 'textarea'
  | 'date'
  | 'date-range'
  | 'time'
  | 'datetime'
  | 'file'
  | 'custom'
  | 'repeatable';

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

/**
 * Conditional visibility operators
 */
export type ConditionOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'isEmpty'
  | 'isNotEmpty'
  | 'greaterThan'
  | 'lessThan'
  | 'in'
  | 'notIn';

export interface FieldCondition<TValues = Record<string, unknown>> {
  field?: string;
  operator?: ConditionOperator;
  value?: unknown;
  equals?: unknown;
  notEquals?: unknown;
  contains?: unknown;
  notContains?: unknown;
  isEmpty?: boolean;
  isNotEmpty?: boolean;
  greaterThan?: number;
  lessThan?: number;
  in?: unknown[];
  notIn?: unknown[];
  and?: FieldCondition<TValues>[];
  or?: FieldCondition<TValues>[];
}

export type ConditionPredicate<TValues = Record<string, unknown>> = (values: TValues) => boolean;

export interface FieldDependency<TValues = Record<string, unknown>> {
  field: string;
  value?: unknown;
  onChange?: (newValue: unknown, currentValues: TValues) => Partial<TValues>;
}

export interface RepeatableGroupConfig<TValues = Record<string, unknown>> {
  fields: FieldDef<TValues>[];
  min?: number;
  max?: number;
  addButtonText?: string;
  removeButtonText?: string;
  itemTitle?: (index: number, item: unknown) => string;
}

export interface FieldRenderProps<TValues = Record<string, unknown>> {
  field: FieldDef<TValues>;
  value: unknown;
  error?: string;
  disabled?: boolean;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  allValues: TValues;
}

export interface FieldDef<TValues = Record<string, unknown>> {
  /** Field identifier in values object (or dot path for nested fields) */
  name?: string;
  /** Backward-compatible alias for name */
  key?: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  helper?: string;
  helpText?: string;
  description?: string;
  /** Span full row width in 2-column layout */
  full?: boolean;
  /** Disable this specific field */
  disabled?: boolean;
  /** Read-only mode */
  readOnly?: boolean;
  /** Explicitly hidden */
  hidden?: boolean;
  /** Default value if not provided in initialValues */
  defaultValue?: unknown;
  /** Options for select, radio-group, checkbox-group */
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
  /** File input attributes */
  accept?: string;
  multiple?: boolean;
  maxFileSize?: number;
  /** Declarative conditional visibility */
  visibleWhen?: FieldCondition<TValues> | ConditionPredicate<TValues>;
  /** Field dependency logic (legacy & advanced) */
  dependsOn?: FieldDependency<TValues>;
  /** Repeatable group definition */
  repeatable?: RepeatableGroupConfig<TValues>;
  repeatableConfig?: RepeatableGroupConfig<TValues>;
  /** Custom validation function */
  validate?: (value: unknown, allValues: TValues) => string | undefined | Promise<string | undefined>;
  /** Custom render override */
  render?: (props: FieldRenderProps<TValues>) => React.ReactNode;
  className?: string;
}

// Backward-compatible alias
export type FieldSchema = FieldDef;

export interface FieldsetDef<TValues = Record<string, unknown>> {
  id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  fields: FieldDef<TValues>[];
}

// Backward-compatible alias
export type FieldsetSchema = FieldsetDef;

export interface DynamicFormFeatures {
  validation?: boolean;
  conditionalFields?: boolean;
  dependencies?: boolean;
  repeatableGroups?: boolean;
  nestedFields?: boolean;
  dirtyTracking?: boolean;
  draftState?: boolean;
  submissionState?: boolean;
  validationSummary?: boolean;
  serverErrors?: boolean;
  unsavedChanges?: boolean;
}

export type ValidationMode = 'onChange' | 'onBlur' | 'onSubmit';

export type FormValues = Record<string, unknown>;
export type FormErrors = Record<string, string>;
export type FormTouched = Record<string, boolean>;

export interface FormDraftState<TValues = FormValues> {
  values: TValues;
  timestamp: number;
  version?: string;
}

export interface DynamicFormHandle<TValues = FormValues> {
  getValue: (name: string) => unknown;
  getValues: () => TValues;
  setValue: (name: string, value: unknown) => void;
  setValues: (values: Partial<TValues>) => void;
  reset: (newValues?: Partial<TValues>) => void;
  resetField: (name: string) => void;
  validate: () => Promise<boolean>;
  submit: () => void;
  getFormState: () => FormDraftState<TValues>;
  restoreFormState: (state: FormDraftState<TValues>) => void;
  isDirty: boolean;
  dirtyFields: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

export interface DynamicFormProps<TValues extends FormValues = FormValues> {
  /** Flat list of fields OR structured fieldsets */
  fields?: FieldDef<TValues>[];
  fieldsets?: FieldsetDef<TValues>[];

  /** Initial values for uncontrolled mode */
  initialValues?: Partial<TValues>;

  /** Controlled form values */
  values?: TValues;
  /** Controlled values change callback */
  onValuesChange?: (values: TValues) => void;
  /** Backward-compatible single field change handler */
  onChange?: (key: string, value: unknown) => void;

  /** Submission callback */
  onSubmit: (values: TValues) => void | Promise<void>;
  /** Optional cancel callback */
  onCancel?: () => void;

  /** Loading & submission states */
  isLoading?: boolean;
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;

  /** Validation configuration */
  validationMode?: ValidationMode;
  validate?: (values: TValues) => FormErrors | Promise<FormErrors>;
  errors?: FormErrors;
  onErrorsChange?: (errors: FormErrors) => void;

  /** Server error mappings */
  serverErrors?: FormErrors;
  serverError?: string;

  /** Modular feature toggles */
  features?: DynamicFormFeatures;

  /** Unsaved changes notification callback */
  onDirtyChange?: (isDirty: boolean) => void;

  /** Imperative form action ref */
  formRef?: React.Ref<DynamicFormHandle<TValues>>;

  /** Danger zone section */
  showDangerZone?: boolean;
  dangerZoneTitle?: string;
  dangerZoneLabel?: string;
  dangerZoneDesc?: string;
  onDangerAction?: () => void;

  className?: string;
  id?: string;
}
