'use client';

import React, { useEffect, useRef, useImperativeHandle, useState } from 'react';
import ReactDOM from 'react-dom';
import type { SkyraTechDynamicForm } from './skyra-tech-dynamic-form';
import type { DynamicFormProps, DynamicFormHandle, FormValues, FieldDef } from './types';

export function DynamicForm<TValues extends FormValues = FormValues>(
  props: DynamicFormProps<TValues> & { children?: React.ReactNode; submitLabel?: string }
) {
  const {
    fields,
    fieldsets,
    initialValues,
    values,
    onChange,
    onValuesChange,
    onSubmit,
    validationMode = 'onSubmit',
    validate,
    errors,
    serverErrors,
    serverError,
    features,
    onDirtyChange,
    className = '',
    id,
    formRef,
    submitLabel = 'Save Changes',
    cancelLabel,
    onCancel,
    showDangerZone,
    dangerZoneTitle,
    dangerZoneLabel,
    dangerZoneDesc,
    onDangerAction,
  } = props;

  const wcRef = useRef<SkyraTechDynamicForm>(null);
  
  // Track custom render fields
  const customFields: FieldDef<TValues>[] = [];
  const allFields = fieldsets ? fieldsets.flatMap(fs => fs.fields) : (fields || []);
  for (const field of allFields) {
    if (field.type === 'custom' && field.render) {
      customFields.push(field);
    }
  }

  // Imperative handle
  useImperativeHandle(formRef, () => {
    if (!wcRef.current) return {} as DynamicFormHandle<TValues>;
    const wc = wcRef.current;
    return {
      getValue: (name) => wc.getValue(name),
      getValues: () => wc.getValues() as TValues,
      setValue: (name, val) => wc.setValue(name, val),
      setValues: (newVals) => wc.setValues(newVals),
      reset: (newVals) => wc.reset(newVals),
      resetField: (name) => {
        const val = wc.initialValues[name];
        wc.setValue(name, val);
      },
      validate: () => wc.validate(),
      submit: () => wc.submit(),
      getFormState: () => ({ values: wc.getValues() as TValues, timestamp: Date.now() }),
      restoreFormState: (state) => wc.setValues(state.values),
      get isDirty() { return wcRef.current?.isDirty || false; },
      get dirtyFields() { 
        if (!wcRef.current) return {};
        const fields: Record<string, boolean> = {};
        const current = wcRef.current.getValues();
        const initial = wcRef.current.initialValues || {};
        
        // Only checking top level for now, based on original behavior.
        // Nested tracking requires walking the object tree.
        for (const k of Object.keys(current)) {
           if (JSON.stringify(current[k]) !== JSON.stringify(initial[k])) {
             fields[k] = true;
           }
        }
        for (const k of Object.keys(initial)) {
           if (JSON.stringify(current[k]) !== JSON.stringify(initial[k])) {
             fields[k] = true;
           }
        }
        return fields; 
      },
      get isValid() { return Object.keys(wcRef.current?.errors || {}).length === 0; },
      get isSubmitting() { return wcRef.current?.isSubmitting || false; },
      get isSubmitted() { return wcRef.current?.isSubmitted || false; },
    };
  }, [wcRef]);

  // Sync props to WC
  useEffect(() => {
    import('./skyra-tech-dynamic-form').catch(console.error);
    const el = wcRef.current;
    if (!el) return;
    
    if (fields) el.fields = fields as any;
    if (fieldsets) el.fieldsets = fieldsets as any;
    if (initialValues) el.initialValues = initialValues;
    if (features) el.features = features;
    if (validationMode) el.validationMode = validationMode;
    if (validate) el.customValidator = validate as any;
    if (onSubmit) el.onSubmitCallback = onSubmit as any;
  }, [fields, fieldsets, initialValues, features, validationMode, validate, onSubmit]);

  // Controlled values
  useEffect(() => {
    const el = wcRef.current;
    if (!el || !values) return;
    el.values = values;
  }, [values]);

  // Controlled server errors
  useEffect(() => {
    const el = wcRef.current;
    if (!el) return;
    const combined = { ...serverErrors };
    if (serverError) combined._form = serverError;
    el.serverErrors = combined;
  }, [serverErrors, serverError]);

  const [internalValues, setInternalValues] = useState<TValues>((values || initialValues || {}) as TValues);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Event Listeners
  useEffect(() => {
    const el = wcRef.current;
    if (!el) return;

    const handleChange = (e: Event) => {
      const custom = e as CustomEvent;
      setInternalValues(custom.detail.values as TValues);
      
      if (custom.detail.name && onChange) {
        onChange(custom.detail.name, custom.detail.value);
      }
      if (onValuesChange) {
        onValuesChange(custom.detail.values as TValues);
      }
      if (onDirtyChange) {
        onDirtyChange(el.isDirty);
      }
    };

    el.addEventListener('skyra-change', handleChange);
    return () => el.removeEventListener('skyra-change', handleChange);
  }, [onChange, onValuesChange, onDirtyChange]);

  return (
    <skyra-tech-dynamic-form
      ref={wcRef as any}
      id={id}
      class={className}
    >
      {onCancel && (
        <button slot="actions" type="button" onClick={onCancel} style={{ padding: '0.5rem 1rem', background: 'transparent', color: 'var(--skyra-text)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)', cursor: 'pointer', marginRight: '0.5rem' }}>
          {cancelLabel || 'Cancel'}
        </button>
      )}
      {submitLabel && (
        <button slot="actions" type="submit" onClick={() => wcRef.current?.submit()} style={{ padding: '0.5rem 1rem', background: 'var(--skyra-primary)', color: 'white', border: 'none', borderRadius: 'var(--skyra-radius-md)', cursor: 'pointer' }}>
          {submitLabel}
        </button>
      )}
      
      {showDangerZone && (
        <div style={{ padding: '1rem', border: '1px solid var(--skyra-danger)', borderRadius: 'var(--skyra-radius-md)', marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, color: 'var(--skyra-danger)', fontSize: '1.125rem', fontWeight: 600 }}>{dangerZoneTitle || 'Danger Zone'}</h3>
              {dangerZoneDesc && <p style={{ margin: '0.25rem 0 0', color: 'var(--skyra-text-secondary)', fontSize: '0.875rem' }}>{dangerZoneDesc}</p>}
            </div>
            <button type="button" onClick={onDangerAction} style={{ background: 'var(--skyra-danger)', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: 'var(--skyra-radius-md)', cursor: 'pointer', fontWeight: 500 }}>
              {dangerZoneLabel || 'Delete'}
            </button>
          </div>
        </div>
      )}
      
      {/* Portals for Custom Render fields */}
      {props.children && (
        <div slot="actions" style={{ display: 'contents' }}>
          {props.children}
        </div>
      )}
      
      {/* Portals for Custom Render fields */}
      {mounted && customFields.map((f, i) => {
        const slotName = `custom-${f.name ?? f.key}`.replace(/\./g, '-');
        
        const getIn = (obj: any, path: string) => {
          return path.split('.').reduce((acc, part) => acc && acc[part], obj);
        };
        const val = getIn(internalValues, f.name ?? f.key ?? '');
        
        return (
          <div key={i} slot={slotName} style={{ width: '100%' }}>
            {f.render!({
              field: f,
              value: val,
              onChange: (v) => wcRef.current?.setValue(f.name ?? f.key ?? '', v),
              onBlur: () => {},
              allValues: internalValues
            })}
          </div>
        );
      })}
    </skyra-tech-dynamic-form>
  );
}

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'skyra-tech-dynamic-form': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
          class?: string;
        };
      }
    }
  }
}
