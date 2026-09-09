'use client';

import React from 'react';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import {
  Button,
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
import type { FieldSchema, DynamicFormProps } from './types';

/* ─── Single Field Orchestrator ─── */

function FormField({
  field,
  value,
  error,
  onChange,
}: {
  field: FieldSchema;
  value: any;
  error?: string;
  onChange: (key: string, value: any) => void;
}) {
  const wrapStyle: React.CSSProperties = {
    gridColumn: field.full ? '1 / -1' : undefined,
  };

  const handleFieldChange = (newVal: any) => {
    onChange(field.key, newVal);
  };

  switch (field.type) {
    case 'select':
      return (
        <div style={wrapStyle}>
          <DynamicSelect
            label={field.label}
            placeholder={field.placeholder ?? `Select ${field.label}...`}
            options={field.options ?? []}
            value={value}
            mode={field.mode ?? 'single'}
            searchable={field.searchable}
            selectAll={field.selectAll}
            maxVisibleValues={field.maxVisibleValues ?? 'auto'}
            clearable={field.clearable ?? true}
            grouping={field.grouping}
            disabled={field.disabled}
            required={field.required}
            description={field.description ?? field.helper}
            error={error}
            onChange={handleFieldChange}
          />
        </div>
      );

    case 'checkbox':
      return (
        <div style={wrapStyle}>
          <Checkbox
            label={field.label}
            description={field.description ?? field.helper}
            checked={Boolean(value)}
            disabled={field.disabled}
            required={field.required}
            error={error}
            onChange={(e) => handleFieldChange(e.target.checked)}
          />
        </div>
      );

    case 'checkbox-group':
      return (
        <div style={wrapStyle}>
          <CheckboxGroup
            label={field.label}
            description={field.description ?? field.helper}
            options={field.options ?? []}
            value={Array.isArray(value) ? value : []}
            orientation={field.orientation ?? 'vertical'}
            disabled={field.disabled}
            required={field.required}
            error={error}
            onChange={handleFieldChange}
          />
        </div>
      );

    case 'radio-group':
    case 'radio':
      return (
        <div style={wrapStyle}>
          <RadioGroup
            label={field.label}
            description={field.description ?? field.helper}
            options={field.options ?? []}
            value={String(value ?? '')}
            orientation={field.orientation ?? 'vertical'}
            disabled={field.disabled}
            required={field.required}
            error={error}
            onChange={handleFieldChange}
          />
        </div>
      );

    case 'switch':
      return (
        <div style={wrapStyle}>
          <Switch
            label={field.label}
            description={field.description ?? field.helper}
            checked={Boolean(value)}
            disabled={field.disabled}
            required={field.required}
            error={error}
            onChange={handleFieldChange}
          />
        </div>
      );

    case 'textarea':
      return (
        <div style={wrapStyle}>
          <Textarea
            label={field.label}
            placeholder={field.placeholder}
            value={value ?? ''}
            disabled={field.disabled}
            required={field.required}
            rows={field.rows ?? 3}
            minRows={field.minRows}
            maxRows={field.maxRows}
            autoResize={field.autoResize}
            maxLength={field.maxLength}
            showCount={!!field.maxLength}
            description={field.description ?? field.helper}
            error={error}
            onChange={(e) => handleFieldChange(e.target.value)}
          />
        </div>
      );

    case 'search':
      return (
        <div style={wrapStyle}>
          <SearchInput
            label={field.label}
            placeholder={field.placeholder ?? 'Search...'}
            value={value ?? ''}
            disabled={field.disabled}
            required={field.required}
            helper={field.description ?? field.helper}
            error={error}
            onChange={(e) => handleFieldChange(e.target.value)}
          />
        </div>
      );

    case 'password':
      return (
        <div style={wrapStyle}>
          <PasswordInput
            label={field.label}
            placeholder={field.placeholder}
            value={value ?? ''}
            disabled={field.disabled}
            required={field.required}
            helper={field.description ?? field.helper}
            error={error}
            onChange={(e) => handleFieldChange(e.target.value)}
          />
        </div>
      );

    case 'number':
      return (
        <div style={wrapStyle}>
          <NumberInput
            label={field.label}
            placeholder={field.placeholder}
            value={value}
            min={field.min}
            max={field.max}
            step={field.step}
            disabled={field.disabled}
            required={field.required}
            helper={field.description ?? field.helper}
            error={error}
            onChange={handleFieldChange}
          />
        </div>
      );

    case 'date':
      return (
        <div style={wrapStyle}>
          <DateField
            label={field.label}
            placeholder={field.placeholder}
            value={value}
            disabled={field.disabled}
            required={field.required}
            description={field.description ?? field.helper}
            error={error}
            onChange={handleFieldChange}
          />
        </div>
      );

    case 'date-range':
      return (
        <div style={wrapStyle}>
          <DateRangeField
            label={field.label}
            value={typeof value === 'object' && value !== null ? value : { startDate: null, endDate: null }}
            disabled={field.disabled}
            required={field.required}
            description={field.description ?? field.helper}
            error={error}
            onChange={handleFieldChange}
          />
        </div>
      );

    case 'time':
      return (
        <div style={wrapStyle}>
          <TimeField
            label={field.label}
            value={String(value ?? '')}
            format={field.timeFormat ?? '12h'}
            disabled={field.disabled}
            required={field.required}
            description={field.description ?? field.helper}
            error={error}
            onChange={handleFieldChange}
          />
        </div>
      );

    case 'datetime':
      return (
        <div style={wrapStyle}>
          <DateTimeField
            label={field.label}
            value={typeof value === 'object' && value !== null ? value : { date: null, time: '' }}
            timeFormat={field.timeFormat ?? '12h'}
            disabled={field.disabled}
            required={field.required}
            description={field.description ?? field.helper}
            error={error}
            onChange={handleFieldChange}
          />
        </div>
      );

    case 'text':
    case 'email':
    case 'tel':
    case 'url':
    default:
      return (
        <div style={wrapStyle}>
          <Input
            type={field.type}
            label={field.label}
            placeholder={field.placeholder}
            value={value ?? ''}
            disabled={field.disabled}
            required={field.required}
            helper={field.description ?? field.helper}
            error={error}
            onChange={(e) => handleFieldChange(e.target.value)}
          />
        </div>
      );
  }
}

/* ─── Main DynamicForm ─── */

export function DynamicForm({
  fieldsets,
  values,
  errors = {},
  onChange,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = 'Save Changes',
  cancelLabel = 'Cancel',
  showDangerZone = false,
  dangerZoneTitle = 'Danger Zone',
  dangerZoneLabel = 'Delete Resource',
  dangerZoneDesc = 'Permanently remove this resource. This action cannot be undone.',
  onDangerAction,
  className = '',
}: DynamicFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`skyra-dynamic-form ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        fontFamily: 'var(--skyra-font-body)',
        width: '100%',
      }}
    >
      {fieldsets.map((fieldset) => {
        // Filter out fields whose dependencies are not met
        const visibleFields = fieldset.fields.filter((field) => {
          if (!field.dependsOn) return true;
          const parentVal = values[field.dependsOn.field];
          return parentVal === field.dependsOn.value;
        });

        if (visibleFields.length === 0) return null;

        return (
          <div
            key={fieldset.title}
            className="skyra-fieldset-card"
            style={{
              background: 'var(--skyra-surface)',
              border: '1px solid var(--skyra-border)',
              borderRadius: 'var(--skyra-radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--skyra-shadow-sm)',
            }}
          >
            {/* Fieldset Header */}
            <div
              style={{
                padding: '1rem 1.25rem',
                borderBottom: '1px solid var(--skyra-border)',
                background: 'var(--skyra-bg)',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  fontFamily: 'var(--skyra-font-display)',
                  color: 'var(--skyra-text)',
                }}
              >
                {fieldset.title}
              </h3>
              {fieldset.subtitle && (
                <p
                  style={{
                    margin: '0.25rem 0 0',
                    fontSize: '0.8rem',
                    color: 'var(--skyra-text-muted)',
                  }}
                >
                  {fieldset.subtitle}
                </p>
              )}
            </div>

            {/* Fieldset Grid: 2 columns on desktop, 1 on mobile */}
            <div
              style={{
                padding: '1.25rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {visibleFields.map((field) => (
                <FormField
                  key={field.key}
                  field={field}
                  value={values[field.key]}
                  error={errors[field.key]}
                  onChange={onChange}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* ── Optional Danger Zone ── */}
      {showDangerZone && (
        <div
          style={{
            background: 'var(--skyra-danger-light)',
            border: '1px solid var(--skyra-danger)',
            borderRadius: 'var(--skyra-radius-xl)',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--skyra-danger)',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              <AlertTriangle size={18} />
              <span>{dangerZoneTitle}</span>
            </div>
            <p
              style={{
                margin: '0.25rem 0 0',
                fontSize: '0.82rem',
                color: 'var(--skyra-text-muted)',
              }}
            >
              {dangerZoneDesc}
            </p>
          </div>

          {onDangerAction && (
            <Button
              type="button"
              variant="destructive"
              onClick={onDangerAction}
            >
              {dangerZoneLabel}
            </Button>
          )}
        </div>
      )}

      {/* ── Form Actions ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '0.75rem',
          paddingTop: '0.5rem',
        }}
      >
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
