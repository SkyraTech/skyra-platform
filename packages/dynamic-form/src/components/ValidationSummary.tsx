import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface ValidationSummaryProps {
  errors: Record<string, string>;
  labels?: Record<string, string>;
  title?: string;
  onFocusField?: (fieldKey: string) => void;
  className?: string;
}

export function ValidationSummary({
  errors,
  labels = {},
  title,
  onFocusField,
  className = '',
}: ValidationSummaryProps) {
  const errorEntries = Object.entries(errors).filter(([, message]) => Boolean(message));
  if (errorEntries.length === 0) return null;

  const defaultTitle = `Please fix ${errorEntries.length} error${errorEntries.length !== 1 ? 's' : ''}`;
  const headerTitle = title ?? defaultTitle;

  const handleFieldClick = (fieldKey: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onFocusField) {
      onFocusField(fieldKey);
    } else {
      const el = document.getElementById(fieldKey) || document.querySelector(`[name="${fieldKey}"]`);
      if (el instanceof HTMLElement) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`skyra-validation-summary ${className}`.trim()}
      style={{
        background: 'var(--skyra-danger-light, rgba(239, 68, 68, 0.08))',
        border: '1px solid var(--skyra-danger)',
        borderRadius: 'var(--skyra-radius-lg, 8px)',
        padding: '1rem 1.25rem',
        marginBottom: '1.25rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--skyra-danger)',
          fontWeight: 600,
          fontSize: '0.925rem',
          marginBottom: '0.5rem',
        }}
      >
        <AlertCircle size={18} aria-hidden="true" />
        <span>{headerTitle}</span>
      </div>

      <ul
        style={{
          margin: 0,
          paddingLeft: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
        }}
      >
        {errorEntries.map(([key, message]) => {
          const fieldLabel = labels[key] || key;
          return (
            <li key={key} style={{ fontSize: '0.85rem', color: 'var(--skyra-danger)' }}>
              <a
                href={`#${key}`}
                onClick={(e) => handleFieldClick(key, e)}
                style={{
                  color: 'inherit',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                {fieldLabel}
              </a>
              : {message}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
