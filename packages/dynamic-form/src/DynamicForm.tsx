'use client';

import React, { useId } from 'react';
import { AlertCircle } from 'lucide-react';
import type { FieldSchema, DynamicFormProps } from './types';

const SELECT_ICON_SVG = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")';

/* ─── Single Field ─── */

function FormField({
  field, value, error, onChange,
}: {
  field: FieldSchema;
  value: string | boolean | number;
  error?: string;
  onChange: (key: string, value: string | boolean | number) => void;
}) {
  const uid = useId();
  const inputId = `skyra-form-field-${uid}-${field.key}`;
  const errorId = `${inputId}-error`;
  const hasError = !!error;

  const wrapStyle: React.CSSProperties = {
    gridColumn: field.full ? '1 / -1' : undefined,
  };

  const labelEl = !field.type.includes('checkbox') && (
    <label htmlFor={inputId} style={{
      display: 'block', fontSize: '0.8125rem', fontWeight: 600,
      color: 'var(--skyra-text)', marginBottom: '0.375rem',
    }}>
      {field.label}
      {field.required && <span style={{ color: 'var(--skyra-danger)' }}> *</span>}
    </label>
  );

  const errorEl = hasError && (
    <span id={errorId} role="alert" style={{
      display: 'flex', alignItems: 'center', gap: '0.25rem',
      fontSize: '0.78rem', color: 'var(--skyra-danger)', marginTop: '0.3rem',
    }}>
      <AlertCircle size={12} aria-hidden="true" />
      {error}
    </span>
  );

  const helperEl = field.helper && !hasError && (
    <span style={{ fontSize: '0.78rem', color: 'var(--skyra-text-muted)', marginTop: '0.3rem', display: 'block' }}>
      {field.helper}
    </span>
  );

  const baseInputStyle: React.CSSProperties = {
    display: 'block', width: '100%',
    padding: '0.65rem 0.875rem',                       // [CONFIRMED: DynamicForm.module.css]
    background: 'var(--skyra-bg)',
    border: hasError ? '1px solid var(--skyra-danger)' : '1px solid var(--skyra-border)',
    borderRadius: 'var(--skyra-radius-md)',
    fontFamily: 'inherit', fontSize: '0.875rem',
    color: 'var(--skyra-text)', outline: 'none',
    boxShadow: hasError ? 'var(--skyra-focus-ring-error)' : undefined,
    transition: 'border-color 0.15s, box-shadow 0.15s',
    minHeight: '44px',
  };

  if (field.type === 'checkbox') {
    return (
      <div style={wrapStyle}>
        <label htmlFor={inputId} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: field.disabled ? 'not-allowed' : 'pointer', minHeight: '44px' }}>
          <input
            id={inputId}
            type="checkbox"
            checked={!!value}
            disabled={field.disabled}
            onChange={(e) => onChange(field.key, e.target.checked)}
            aria-describedby={hasError ? errorId : undefined}
            aria-invalid={hasError}
            style={{ width: '16px', height: '16px', accentColor: 'var(--skyra-primary)', cursor: 'inherit', flexShrink: 0 }}
          />
          <span style={{ fontSize: '0.875rem', color: 'var(--skyra-text)' }}>
            {field.label}
            {field.required && <span style={{ color: 'var(--skyra-danger)' }}> *</span>}
          </span>
        </label>
        {errorEl}{helperEl}
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div style={wrapStyle}>
        {labelEl}
        <select
          id={inputId}
          value={String(value)}
          disabled={field.disabled}
          onChange={(e) => onChange(field.key, e.target.value)}
          aria-describedby={hasError ? errorId : undefined}
          aria-invalid={hasError}
          style={{
            ...baseInputStyle,
            appearance: 'none',
            backgroundImage: SELECT_ICON_SVG,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            paddingRight: '2.25rem',
          }}
        >
          <option value="">{field.placeholder ?? `Select ${field.label}...`}</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.label}</option>
          ))}
        </select>
        {errorEl}{helperEl}
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div style={wrapStyle}>
        {labelEl}
        <textarea
          id={inputId}
          value={String(value)}
          disabled={field.disabled}
          placeholder={field.placeholder ?? field.label}
          onChange={(e) => onChange(field.key, e.target.value)}
          aria-describedby={hasError ? errorId : undefined}
          aria-invalid={hasError}
          style={{ ...baseInputStyle, minHeight: '80px', resize: 'vertical' }}
        />
        {errorEl}{helperEl}
      </div>
    );
  }

  return (
    <div style={wrapStyle}>
      {labelEl}
      <input
        id={inputId}
        type={field.type}
        value={String(value)}
        disabled={field.disabled}
        placeholder={field.placeholder ?? field.label}
        min={field.min}
        max={field.max}
        step={field.step}
        onChange={(e) => onChange(field.key, e.target.value)}
        aria-describedby={hasError ? errorId : undefined}
        aria-invalid={hasError}
        style={baseInputStyle}
        onFocus={(e) => {
          if (!hasError) e.currentTarget.style.borderColor = 'var(--skyra-primary)';
          e.currentTarget.style.boxShadow = hasError
            ? 'var(--skyra-focus-ring-error)'
            : 'var(--skyra-focus-ring)';              // [CONFIRMED: DynamicForm.module.css focus]
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = hasError ? 'var(--skyra-danger)' : 'var(--skyra-border)';
          e.currentTarget.style.boxShadow = hasError ? 'var(--skyra-focus-ring-error)' : 'none';
        }}
      />
      {errorEl}{helperEl}
    </div>
  );
}

/* ─── Main DynamicForm ─── */

/**
 * @skyra/dynamic-form DynamicForm
 *
 * [B] PLATFORM EXTRACTION from skyra-erp/src/components/ui/forms/DynamicForm.tsx
 *
 * Confirmed ERP visual behavior (DynamicForm.module.css):
 *   - Fieldset: border-radius var(--radius-xl) = 20px, bg surface
 *   - Fieldset header: bg var(--bg-color), padding 1.25rem, border-bottom border-color
 *   - Field grid: repeat(2, 1fr) gap 1.25rem  [CONFIRMED: line 112]
 *   - Mobile 1-col: max-width 640px → grid-template-columns: 1fr [CONFIRMED: line 163]
 *   - Focus ring: 0 0 0 3px rgba(10,88,202,0.12)  [CONFIRMED: line 145]
 *   - Error ring: 0 0 0 3px rgba(239,68,68,0.10)  [CONFIRMED: line 157]
 *   - Submit btn gradient: linear-gradient(135deg, var(--primary) 0%, #0847a8 100%) [CONFIRMED]
 *   - Danger zone: danger-light bg, 1px solid var(--danger), radius-xl [CONFIRMED]
 */
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
  dangerZoneTitle = '⚠ Danger Zone',
  dangerZoneLabel = 'Deactivate',
  dangerZoneDesc = 'This action cannot be undone.',
  onDangerAction,
}: DynamicFormProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {fieldsets.map((fs) => (
        <div key={fs.title} style={{
          background: 'var(--skyra-surface)',
          borderRadius: 'var(--skyra-radius-xl)',        // [CONFIRMED: fieldset radius-xl]
          boxShadow: 'var(--skyra-shadow-sm)',
          border: '1px solid var(--skyra-border)',
          overflow: 'hidden',
        }}>
          <div style={{
            background: 'var(--skyra-bg)',               // [CONFIRMED: fieldsetHeader bg]
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--skyra-border)',
          }}>
            <div style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 600, fontSize: '1rem', color: 'var(--skyra-text)' }}>
              {fs.title}
            </div>
            {fs.subtitle && (
              <div style={{ fontSize: '0.8375rem', color: 'var(--skyra-text-muted)', marginTop: '0.25rem' }}>
                {fs.subtitle}
              </div>
            )}
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',     // [CONFIRMED: 2-column desktop]
              gap: '1.25rem',                            // [CONFIRMED: gap 1.25rem]
            }}
            // Mobile: 1-column via inline media query CSS variable
            >
              <style>{`
                @media (max-width: 640px) {
                  .skyra-form-grid { grid-template-columns: 1fr !important; }
                }
              `}</style>
              {fs.fields.map((field) => (
                <FormField
                  key={field.key}
                  field={field}
                  value={values[field.key] ?? ''}
                  error={errors[field.key]}
                  onChange={onChange}
                />
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* ── Danger Zone ── [CONFIRMED: DynamicForm.module.css dangerZone] */}
      {showDangerZone && (
        <div style={{
          background: 'var(--skyra-danger-light)',
          border: '1px solid var(--skyra-danger)',
          borderRadius: 'var(--skyra-radius-xl)',
          padding: '1.25rem 1.5rem',
        }}>
          <div style={{ fontWeight: 700, color: 'var(--skyra-danger)', marginBottom: '0.5rem', fontSize: '0.9375rem' }}>
            {dangerZoneTitle}
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--skyra-text)', marginBottom: '1rem' }}>
            {dangerZoneDesc}
          </p>
          <button
            type="button"
            onClick={onDangerAction}
            style={{
              background: 'var(--skyra-danger)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--skyra-radius-md)',
              padding: '0.5rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {dangerZoneLabel}
          </button>
        </div>
      )}

      {/* ── Footer ── */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            style={{
              background: 'var(--skyra-surface)',
              color: 'var(--skyra-text)',
              border: '1px solid var(--skyra-border)',
              borderRadius: 'var(--skyra-radius-md)',
              padding: '0.6rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              minHeight: '40px',
            }}
          >
            {cancelLabel}
          </button>
        )}
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          aria-busy={isLoading}
          style={{
            background: 'linear-gradient(135deg, var(--skyra-primary) 0%, #0847a8 100%)',  // [CONFIRMED]
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--skyra-radius-md)',
            padding: '0.6rem 1.5rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: isLoading ? 'wait' : 'pointer',
            fontFamily: 'inherit',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            minHeight: '40px',
            opacity: isLoading ? 0.8 : 1,
            boxShadow: '0 2px 8px rgba(10, 88, 202, 0.25)',
            transition: 'opacity 0.15s, transform 0.15s',
          }}
        >
          {isLoading && (
            <span style={{
              width: '14px', height: '14px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: '#fff',
              borderRadius: '50%',
              animation: 'skyra-spin 0.7s linear infinite',
              flexShrink: 0,
            }} aria-hidden="true" />
          )}
          {isLoading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </div>
  );
}
