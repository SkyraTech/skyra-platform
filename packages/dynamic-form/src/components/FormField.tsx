'use client';

import React from 'react';
import {
  Input,
  SearchInput,
  PasswordInput,
  NumberInput,
  Textarea,
  DynamicSelect,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  Switch,
  DateField,
  DateRangeField,
  TimeField,
  DateTimeField,
} from '@skyra/ui';
import { FieldDef } from '../types';

export interface FormFieldProps<TValues = Record<string, unknown>> {
  field: FieldDef<TValues>;
  value: unknown;
  error?: string;
  disabled?: boolean;
  onChange: (name: string, value: unknown) => void;
  onBlur?: (name: string) => void;
  allValues: TValues;
}

export function FormField<TValues extends Record<string, unknown>>({
  field,
  value,
  error,
  disabled: formDisabled = false,
  onChange,
  onBlur,
  allValues,
}: FormFieldProps<TValues>) {
  const fieldKey = field.name ?? field.key ?? '';
  const isFieldDisabled = formDisabled || Boolean(field.disabled);
  const isReadOnly = Boolean(field.readOnly);

  const wrapStyle: React.CSSProperties = {
    gridColumn: field.full ? '1 / -1' : undefined,
    display: field.hidden ? 'none' : 'block',
  };

  const handleValueChange = (newVal: unknown) => {
    if (isReadOnly) return;
    onChange(fieldKey, newVal);
  };

  const handleBlur = () => {
    onBlur?.(fieldKey);
  };

  const errorId = error ? `${fieldKey}-error` : undefined;
  const helperId = (field.helper || field.helpText || field.description) ? `${fieldKey}-helper` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  // Custom rendering hook
  if (field.type === 'custom' && field.render) {
    return (
      <div style={wrapStyle} className={`skyra-field-wrap ${field.className ?? ''}`.trim()}>
        {field.render({
          field,
          value,
          error,
          disabled: isFieldDisabled,
          onChange: handleValueChange,
          onBlur: handleBlur,
          allValues,
        })}
      </div>
    );
  }

  switch (field.type) {
    case 'select':
    case 'multi-select':
      return (
        <div style={wrapStyle} onBlur={handleBlur} className={`skyra-field-wrap ${field.className ?? ''}`.trim()}>
          <DynamicSelect
            id={fieldKey}
            label={field.label}
            placeholder={field.placeholder ?? `Select ${field.label}...`}
            options={field.options ?? []}
            value={value as unknown as string}
            mode={field.mode ?? (field.type === 'multi-select' ? 'multiple' : 'single')}
            searchable={field.searchable}
            selectAll={field.selectAll}
            maxVisibleValues={field.maxVisibleValues ?? 'auto'}
            clearable={field.clearable ?? true}
            grouping={field.grouping}
            disabled={isFieldDisabled}
            required={field.required}
            description={field.description ?? field.helper ?? field.helpText}
            error={error}
            onChange={handleValueChange}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
          />
        </div>
      );

    case 'checkbox':
      return (
        <div style={wrapStyle} className={`skyra-field-wrap ${field.className ?? ''}`.trim()}>
          <Checkbox
            id={fieldKey}
            name={fieldKey}
            label={field.label}
            description={field.description ?? field.helper ?? field.helpText}
            checked={Boolean(value)}
            disabled={isFieldDisabled}
            required={field.required}
            error={error}
            onChange={(e) => handleValueChange(e.target.checked)}
            onBlur={handleBlur}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
          />
        </div>
      );

    case 'checkbox-group':
      return (
        <div style={wrapStyle} className={`skyra-field-wrap ${field.className ?? ''}`.trim()}>
          <CheckboxGroup
            label={field.label}
            description={field.description ?? field.helper ?? field.helpText}
            options={field.options ?? []}
            value={Array.isArray(value) ? value : []}
            orientation={field.orientation ?? 'vertical'}
            disabled={isFieldDisabled}
            required={field.required}
            error={error}
            onChange={handleValueChange}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
          />
        </div>
      );

    case 'radio-group':
    case 'radio':
      return (
        <div style={wrapStyle} className={`skyra-field-wrap ${field.className ?? ''}`.trim()}>
          <RadioGroup
            name={fieldKey}
            label={field.label}
            description={field.description ?? field.helper ?? field.helpText}
            options={field.options ?? []}
            value={String(value ?? '')}
            orientation={field.orientation ?? 'vertical'}
            disabled={isFieldDisabled}
            required={field.required}
            error={error}
            onChange={handleValueChange}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
          />
        </div>
      );

    case 'switch':
      return (
        <div style={wrapStyle} className={`skyra-field-wrap ${field.className ?? ''}`.trim()}>
          <Switch
            id={fieldKey}
            label={field.label}
            description={field.description ?? field.helper ?? field.helpText}
            checked={Boolean(value)}
            disabled={isFieldDisabled}
            required={field.required}
            error={error}
            onChange={handleValueChange}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
          />
        </div>
      );

    case 'textarea':
      return (
        <div style={wrapStyle} className={`skyra-field-wrap ${field.className ?? ''}`.trim()}>
          <Textarea
            id={fieldKey}
            name={fieldKey}
            label={field.label}
            placeholder={field.placeholder}
            value={String(value ?? '')}
            disabled={isFieldDisabled}
            readOnly={isReadOnly}
            required={field.required}
            rows={field.rows ?? 3}
            minRows={field.minRows}
            maxRows={field.maxRows}
            autoResize={field.autoResize}
            maxLength={field.maxLength}
            showCount={Boolean(field.maxLength)}
            description={field.description ?? field.helper ?? field.helpText}
            error={error}
            onChange={(e) => handleValueChange(e.target.value)}
            onBlur={handleBlur}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
          />
        </div>
      );

    case 'search':
      return (
        <div style={wrapStyle} className={`skyra-field-wrap ${field.className ?? ''}`.trim()}>
          <SearchInput
            id={fieldKey}
            name={fieldKey}
            label={field.label}
            placeholder={field.placeholder ?? 'Search...'}
            value={String(value ?? '')}
            disabled={isFieldDisabled}
            readOnly={isReadOnly}
            required={field.required}
            helper={field.description ?? field.helper ?? field.helpText}
            error={error}
            onChange={(e) => handleValueChange(e.target.value)}
            onBlur={handleBlur}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
          />
        </div>
      );

    case 'password':
      return (
        <div style={wrapStyle} className={`skyra-field-wrap ${field.className ?? ''}`.trim()}>
          <PasswordInput
            id={fieldKey}
            name={fieldKey}
            label={field.label}
            placeholder={field.placeholder}
            value={String(value ?? '')}
            disabled={isFieldDisabled}
            readOnly={isReadOnly}
            required={field.required}
            helper={field.description ?? field.helper ?? field.helpText}
            error={error}
            onChange={(e) => handleValueChange(e.target.value)}
            onBlur={handleBlur}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
          />
        </div>
      );

    case 'number':
      return (
        <div style={wrapStyle} className={`skyra-field-wrap ${field.className ?? ''}`.trim()}>
          <NumberInput
            id={fieldKey}
            name={fieldKey}
            label={field.label}
            placeholder={field.placeholder}
            value={value as unknown as string}
            min={field.min}
            max={field.max}
            step={field.step}
            disabled={isFieldDisabled}
            required={field.required}
            helper={field.description ?? field.helper ?? field.helpText}
            error={error}
            onChange={handleValueChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
          />
        </div>
      );

    case 'date':
      return (
        <div style={wrapStyle} onBlur={handleBlur} className={`skyra-field-wrap ${field.className ?? ''}`.trim()}>
          <DateField
            id={fieldKey}
            label={field.label}
            placeholder={field.placeholder}
            value={value as unknown as string}
            disabled={isFieldDisabled}
            required={field.required}
            description={field.description ?? field.helper ?? field.helpText}
            error={error}
            onChange={handleValueChange}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
          />
        </div>
      );

    case 'date-range':
      return (
        <div style={wrapStyle} onBlur={handleBlur} className={`skyra-field-wrap ${field.className ?? ''}`.trim()}>
          <DateRangeField
            id={fieldKey}
            label={field.label}
            value={typeof value === 'object' && value !== null ? (value as unknown as { startDate: string | null, endDate: string | null }) : { startDate: null, endDate: null }}
            disabled={isFieldDisabled}
            required={field.required}
            description={field.description ?? field.helper ?? field.helpText}
            error={error}
            onChange={handleValueChange}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
          />
        </div>
      );

    case 'time':
      return (
        <div style={wrapStyle} onBlur={handleBlur} className={`skyra-field-wrap ${field.className ?? ''}`.trim()}>
          <TimeField
            id={fieldKey}
            label={field.label}
            value={String(value ?? '')}
            format={field.timeFormat ?? '12h'}
            disabled={isFieldDisabled}
            required={field.required}
            description={field.description ?? field.helper ?? field.helpText}
            error={error}
            onChange={handleValueChange}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
          />
        </div>
      );

    case 'datetime':
      return (
        <div style={wrapStyle} onBlur={handleBlur} className={`skyra-field-wrap ${field.className ?? ''}`.trim()}>
          <DateTimeField
            label={field.label}
            value={typeof value === 'object' && value !== null ? (value as unknown as { date: string | null, time: string }) : { date: null, time: '' }}
            timeFormat={field.timeFormat ?? '12h'}
            disabled={isFieldDisabled}
            required={field.required}
            description={field.description ?? field.helper ?? field.helpText}
            error={error}
            onChange={handleValueChange}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
          />
        </div>
      );

    case 'file':
      return (
        <div style={wrapStyle} className={`skyra-field-wrap ${field.className ?? ''}`.trim()}>
          <label 
            htmlFor={fieldKey} 
            style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: 500, 
              color: 'var(--skyra-text)',
              marginBottom: '0.375rem' 
            }}
          >
            {field.label}
            {field.required && <span style={{ color: 'var(--skyra-danger)', marginLeft: '4px' }}>*</span>}
          </label>
          <input
            id={fieldKey}
            name={fieldKey}
            type="file"
            accept={field.accept}
            multiple={field.multiple}
            disabled={isFieldDisabled}
            onChange={(e) => {
              const files = e.target.files ? Array.from(e.target.files) : [];
              handleValueChange(field.multiple ? files : files[0]);
            }}
            onBlur={handleBlur}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            style={{
              display: 'block',
              width: '100%',
              padding: '0.5rem',
              fontSize: '0.85rem',
              color: 'var(--skyra-text)',
              background: 'var(--skyra-bg)',
              border: `1px solid ${error ? 'var(--skyra-danger)' : 'var(--skyra-border)'}`,
              borderRadius: 'var(--skyra-radius-md)',
              outline: 'none',
            }}
          />
          {(field.helper || field.description) && !error && (
            <p id={helperId} style={{ margin: '0.35rem 0 0', fontSize: '0.8rem', color: 'var(--skyra-text-muted)' }}>
              {field.helper || field.description}
            </p>
          )}
          {error && (
            <p id={errorId} role="alert" style={{ margin: '0.35rem 0 0', fontSize: '0.8rem', color: 'var(--skyra-danger)' }}>
              {error}
            </p>
          )}
        </div>
      );

    case 'text':
    case 'email':
    case 'tel':
    case 'url':
    default:
      return (
        <div style={wrapStyle} className={`skyra-field-wrap ${field.className ?? ''}`.trim()}>
          <Input
            id={fieldKey}
            name={fieldKey}
            type={field.type === 'email' || field.type === 'tel' || field.type === 'url' ? field.type : 'text'}
            label={field.label}
            placeholder={field.placeholder}
            value={String(value ?? '')}
            disabled={isFieldDisabled}
            readOnly={isReadOnly}
            required={field.required}
            helper={field.description ?? field.helper ?? field.helpText}
            error={error}
            onChange={(e) => handleValueChange(e.target.value)}
            onBlur={handleBlur}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
          />
        </div>
      );
  }
}
