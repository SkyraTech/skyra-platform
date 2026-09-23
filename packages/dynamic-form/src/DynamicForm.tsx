'use client';

import React, { useImperativeHandle, useMemo } from 'react';
import { AlertCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@skyra/ui';
import {
  DynamicFormProps,
  FormValues,
  FieldDef,
  FieldsetDef,
  DynamicFormHandle,
} from './types';
import { FormField } from './components/FormField';
import { RepeatableGroup } from './components/RepeatableGroup';
import { ValidationSummary } from './components/ValidationSummary';
import { useDynamicFormState } from './hooks/useDynamicFormState';
import { evaluateCondition } from './utils/conditions';
import { getIn } from './utils/nested';

export function DynamicForm<TValues extends FormValues = FormValues>(
  props: DynamicFormProps<TValues>
) {
  const {
    fields,
    fieldsets,
    submitLabel = 'Save Changes',
    cancelLabel = 'Cancel',
    onCancel,
    showDangerZone = false,
    dangerZoneTitle = 'Danger Zone',
    dangerZoneLabel = 'Delete Resource',
    dangerZoneDesc = 'Permanently remove this resource. This action cannot be undone.',
    onDangerAction,
    className = '',
    id,
    formRef,
  } = props;

  // Normalize fields vs fieldsets into structured fieldsets
  const normalizedFieldsets: FieldsetDef<TValues>[] = useMemo(() => {
    if (fieldsets && fieldsets.length > 0) {
      return fieldsets;
    }
    if (fields && fields.length > 0) {
      return [
        {
          id: 'default',
          title: '',
          fields,
        },
      ];
    }
    return [];
  }, [fieldsets, fields]);

  // Flatten all fields for validation and initial values extraction
  const allFields: FieldDef<TValues>[] = useMemo(() => {
    const list: FieldDef<TValues>[] = [];
    for (const fs of normalizedFieldsets) {
      list.push(...fs.fields);
    }
    return list;
  }, [normalizedFieldsets]);

  // Form state orchestrator
  const formState = useDynamicFormState<TValues>({
    ...props,
    allFields,
  });

  const {
    values,
    errors,
    isSubmitting,
    submitError,
    mergedFeatures,
    setFieldValue,
    handleFieldBlur,
    addRepeatableItem,
    removeRepeatableItem,
    submit,
    handle,
  } = formState;

  // Expose imperative handle if ref supplied
  useImperativeHandle(formRef, () => handle, [handle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  // Build field label dictionary for ValidationSummary
  const fieldLabels: Record<string, string> = useMemo(() => {
    const labels: Record<string, string> = {};
    for (const f of allFields) {
      const key = f.name ?? f.key;
      if (key) labels[key] = f.label;
    }
    return labels;
  }, [allFields]);

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      noValidate
      className={`skyra-dynamic-form ${className}`.trim()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        fontFamily: 'var(--skyra-font-body)',
        width: '100%',
      }}
    >
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .skyra-dynamic-form *,
          .skyra-dynamic-form button,
          .skyra-dynamic-form input {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>

      {/* ── Validation Summary Banner (Opt-in) ── */}
      {mergedFeatures.validationSummary && Object.keys(errors).length > 0 && (
        <ValidationSummary errors={errors} labels={fieldLabels} />
      )}

      {/* ── Form-Level Error / Submit Error Banner ── */}
      {(errors._form || submitError) && (
        <div
          role="alert"
          style={{
            background: 'var(--skyra-danger-light, rgba(239, 68, 68, 0.08))',
            border: '1px solid var(--skyra-danger)',
            borderRadius: 'var(--skyra-radius-md)',
            padding: '0.85rem 1.25rem',
            color: 'var(--skyra-danger)',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 500,
          }}
        >
          <AlertCircle size={16} aria-hidden="true" />
          <span>{errors._form || submitError}</span>
        </div>
      )}

      {/* ── Fieldsets Rendering ── */}
      {normalizedFieldsets.map((fieldset, fsIndex) => {
        // Evaluate conditional visibility for each field in the set
        const visibleFields = fieldset.fields.filter((field) => {
          if (!mergedFeatures.conditionalFields) return true;

          // Legacy dependsOn compatibility
          if (field.dependsOn && field.dependsOn.value !== undefined && !field.visibleWhen) {
            const parentVal = getIn(values, field.dependsOn.field);
            return parentVal === field.dependsOn.value;
          }

          // Declarative visibleWhen
          if (field.visibleWhen) {
            return evaluateCondition(field.visibleWhen, values);
          }

          return true;
        });

        if (visibleFields.length === 0) return null;

        const isFramedCard = Boolean(fieldset.title || fieldset.subtitle);

        return (
          <fieldset
            key={fieldset.id ?? fieldset.title ?? `fieldset-${fsIndex}`}
            className="skyra-fieldset-card"
            style={{
              margin: 0,
              padding: 0,
              border: isFramedCard ? '1px solid var(--skyra-border)' : 'none',
              borderRadius: isFramedCard ? 'var(--skyra-radius-xl)' : '0',
              background: isFramedCard ? 'var(--skyra-surface)' : 'transparent',
              overflow: 'hidden',
              boxShadow: isFramedCard ? 'var(--skyra-shadow-sm)' : 'none',
            }}
          >
            {/* Fieldset Header */}
            {isFramedCard ? (
              <legend
                style={{
                  display: 'block',
                  float: 'left',
                  width: '100%',
                  margin: 0,
                  padding: '1rem 1.25rem',
                  borderBottom: '1px solid var(--skyra-border)',
                  background: 'var(--skyra-bg)',
                  boxSizing: 'border-box',
                }}
              >
                <span
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    fontFamily: 'var(--skyra-font-display)',
                    color: 'var(--skyra-text)',
                    display: 'block',
                  }}
                >
                  {fieldset.title}
                </span>
                {fieldset.subtitle && (
                  <span
                    style={{
                      marginTop: '0.25rem',
                      fontSize: '0.8rem',
                      color: 'var(--skyra-text-muted)',
                      display: 'block',
                      fontWeight: 400,
                    }}
                  >
                    {fieldset.subtitle}
                  </span>
                )}
              </legend>
            ) : (
              <legend
                style={{
                  position: 'absolute',
                  width: '1px',
                  height: '1px',
                  margin: '-1px',
                  padding: 0,
                  overflow: 'hidden',
                  clip: 'rect(0, 0, 0, 0)',
                  whiteSpace: 'nowrap',
                  borderWidth: 0,
                }}
              >
                {fieldset.title || 'Form fields'}
              </legend>
            )}

            {/* Fieldset Grid: 2 columns on desktop, 1 on mobile */}
            <div
              style={{
                padding: isFramedCard ? '1.25rem' : '0',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.25rem',
                clear: 'both',
              }}
            >
              {visibleFields.map((field) => {
                const fieldKey = field.name ?? field.key ?? '';

                // Handle repeatable field group
                const repConfig = field.repeatable || (field as any).repeatableConfig;
                if (field.type === 'repeatable' && repConfig && mergedFeatures.repeatableGroups) {
                  const items = (getIn(values, fieldKey) as Record<string, unknown>[]) || [];
                  return (
                    <RepeatableGroup
                      key={fieldKey}
                      groupName={fieldKey}
                      label={field.label}
                      config={repConfig}
                      items={items}
                      errors={errors}
                      disabled={isSubmitting || field.disabled}
                      onItemChange={(gName, idx, subKey, val) => {
                        const updated = [...items];
                        updated[idx] = { ...updated[idx], [subKey]: val };
                        setFieldValue(gName, updated);
                      }}
                      onAddItem={addRepeatableItem}
                      onRemoveItem={removeRepeatableItem}
                      allValues={values}
                    />
                  );
                }

                return (
                  <FormField
                    key={fieldKey}
                    field={field}
                    value={getIn(values, fieldKey)}
                    error={errors[fieldKey]}
                    disabled={isSubmitting}
                    onChange={setFieldValue}
                    onBlur={handleFieldBlur}
                    allValues={values}
                  />
                );
              })}
            </div>
          </fieldset>
        );
      })}

      {/* ── Optional Danger Zone (Backward Compatibility) ── */}
      {showDangerZone && (
        <div
          style={{
            background: 'var(--skyra-danger-light, rgba(239, 68, 68, 0.08))',
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
              <AlertTriangle size={18} aria-hidden="true" />
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
          flexWrap: 'wrap',
        }}
      >
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {cancelLabel}
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
