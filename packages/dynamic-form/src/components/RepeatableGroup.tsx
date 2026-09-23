'use client';

import React, { useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@skyra/ui';
import { RepeatableGroupConfig, FieldDef, FormErrors } from '../types';
import { FormField } from './FormField';

export interface RepeatableGroupProps<TValues extends Record<string, unknown> = Record<string, unknown>> {
  groupName: string;
  label: string;
  config: RepeatableGroupConfig<TValues>;
  items: Record<string, unknown>[];
  errors: FormErrors;
  disabled?: boolean;
  onItemChange: (groupName: string, index: number, fieldName: string, value: unknown) => void;
  onItemBlur?: (groupName: string, index: number, fieldName: string) => void;
  onAddItem: (groupName: string) => void;
  onRemoveItem: (groupName: string, index: number) => void;
  allValues: TValues;
}

export function RepeatableGroup<TValues extends Record<string, unknown>>({
  groupName,
  label,
  config,
  items = [],
  errors,
  disabled = false,
  onItemChange,
  onItemBlur,
  onAddItem,
  onRemoveItem,
  allValues,
}: RepeatableGroupProps<TValues>) {
  const minItems = config.min ?? 0;
  const maxItems = config.max ?? Infinity;

  const canAdd = !disabled && items.length < maxItems;
  const canRemove = !disabled && items.length > minItems;

  // Track stable IDs for items across renders
  const itemKeysRef = useRef<string[]>([]);
  while (itemKeysRef.current.length < items.length) {
    itemKeysRef.current.push(`item_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`);
  }
  if (itemKeysRef.current.length > items.length) {
    itemKeysRef.current = itemKeysRef.current.slice(0, items.length);
  }

  return (
    <div
      className="skyra-repeatable-group"
      style={{
        gridColumn: '1 / -1',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1.25rem',
        background: 'var(--skyra-bg)',
        border: '1px solid var(--skyra-border)',
        borderRadius: 'var(--skyra-radius-lg)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--skyra-text)' }}>
            {label}
          </h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--skyra-text-muted)' }}>
            {items.length} {items.length === 1 ? 'entry' : 'entries'}{maxItems !== Infinity ? ` (Max: ${maxItems})` : ''}
          </span>
        </div>

        {canAdd && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onAddItem(groupName)}
            aria-label={config.addButtonText ?? `Add ${label}`}
          >
            <Plus size={14} style={{ marginRight: '4px' }} aria-hidden="true" />
            {config.addButtonText ?? `Add ${label}`}
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--skyra-text-muted)', fontStyle: 'italic' }}>
          No entries added yet. Click &quot;{config.addButtonText ?? `Add ${label}`}&quot; to create one.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map((item, index) => {
            const itemKey = itemKeysRef.current[index] ?? `item-${index}`;
            const title = config.itemTitle ? config.itemTitle(index, item) : `${label} #${index + 1}`;

            return (
              <div
                key={itemKey}
                style={{
                  background: 'var(--skyra-surface)',
                  border: '1px solid var(--skyra-border)',
                  borderRadius: 'var(--skyra-radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--skyra-text)' }}>
                    {title}
                  </span>
                  {canRemove && (
                    <button
                      type="button"
                      onClick={() => onRemoveItem(groupName, index)}
                      aria-label={`Remove ${title}`}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--skyra-danger)',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                      }}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                      {config.removeButtonText ?? 'Remove'}
                    </button>
                  )}
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1rem',
                  }}
                >
                  {config.fields.map((subField) => {
                    const subFieldKey = subField.name ?? subField.key ?? '';
                    const fullPath = `${groupName}.${index}.${subFieldKey}`;
                    const subValue = item[subFieldKey];
                    const subError = errors[fullPath] || errors[`${groupName}[${index}].${subFieldKey}`];

                    // Create subField definition with path
                    const fieldWithFullPath: FieldDef<TValues> = {
                      ...subField,
                      name: fullPath,
                      key: fullPath,
                    };

                    return (
                      <FormField
                        key={subFieldKey}
                        field={fieldWithFullPath}
                        value={subValue}
                        error={subError}
                        disabled={disabled}
                        onChange={(_name, val) => onItemChange(groupName, index, subFieldKey, val)}
                        onBlur={(_name) => onItemBlur?.(groupName, index, subFieldKey)}
                        allValues={allValues}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
