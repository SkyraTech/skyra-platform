'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  DynamicFormProps,
  FormValues,
  FormErrors,
  FormTouched,
  FormDraftState,
  DynamicFormHandle,
  FieldDef,
} from '../types';
import { getIn, setIn, isDeepEqual, cloneDeep } from '../utils/nested';
import { evaluateCondition } from '../utils/conditions';

export interface UseDynamicFormStateOptions<TValues extends FormValues = FormValues>
  extends DynamicFormProps<TValues> {
  allFields: FieldDef<TValues>[];
}

const DEFAULT_FEATURES = {
  validation: true,
  conditionalFields: true,
  dependencies: true,
  repeatableGroups: true,
  nestedFields: true,
  dirtyTracking: true,
  draftState: true,
  submissionState: true,
  validationSummary: true,
  serverErrors: true,
  unsavedChanges: true,
};

export function useDynamicFormState<TValues extends FormValues = FormValues>(
  options: UseDynamicFormStateOptions<TValues>
) {
  const {
    fields,
    allFields,
    initialValues,
    values: controlledValues,
    onValuesChange,
    onChange,
    onSubmit,
    validationMode = 'onSubmit',
    validate: formValidate,
    errors: controlledErrors,
    onErrorsChange,
    serverErrors = {},
    serverError,
    features = DEFAULT_FEATURES,
    onDirtyChange,
    isLoading = false,
    isSubmitting: controlledSubmitting,
  } = options;

  const mergedFeatures = useMemo(() => ({ ...DEFAULT_FEATURES, ...features }), [features]);

  // Compute initial baseline values
  const defaultInitialValues = useMemo(() => {
    let base: Record<string, unknown> = {};
    for (const field of allFields) {
      const key = field.name ?? field.key ?? '';
      if (!key) continue;
      if (field.defaultValue !== undefined) {
        base = setIn(base, key, field.defaultValue);
      } else if (field.type === 'repeatable') {
        base = setIn(base, key, []);
      }
    }
    return { ...base, ...initialValues } as TValues;
  }, [allFields, initialValues]);

  // Baseline ref for pristine/dirty comparisons
  const baselineValuesRef = useRef<TValues>(cloneDeep(defaultInitialValues));

  // Uncontrolled values state
  const [internalValues, setInternalValues] = useState<TValues>(defaultInitialValues);

  // Active values (controlled or internal)
  const isControlled = controlledValues !== undefined;
  const values = isControlled ? controlledValues : internalValues;

  const valuesRef = useRef<TValues>(values);
  valuesRef.current = values;

  // Touched state
  const [touched, setTouched] = useState<FormTouched>({});

  // Cleared server errors tracking
  const [clearedServerErrors, setClearedServerErrors] = useState<Record<string, boolean>>({});
  const prevServerErrorsRef = useRef(serverErrors);
  useEffect(() => {
    if (!isDeepEqual(serverErrors, prevServerErrorsRef.current)) {
      prevServerErrorsRef.current = serverErrors;
      setClearedServerErrors({});
    }
  }, [serverErrors]);

  const activeServerErrors = useMemo(() => {
    if (!mergedFeatures.serverErrors || !serverErrors) return {};
    const res: FormErrors = {};
    for (const [k, v] of Object.entries(serverErrors)) {
      if (!clearedServerErrors[k] && v) {
        res[k] = v;
      }
    }
    return res;
  }, [serverErrors, clearedServerErrors, mergedFeatures.serverErrors]);

  // Internal validation errors
  const [internalErrors, setInternalErrors] = useState<FormErrors>({});
  const activeErrors = useMemo(() => {
    return {
      ...(controlledErrors ?? internalErrors),
      ...activeServerErrors,
    };
  }, [controlledErrors, internalErrors, activeServerErrors]);

  // Submission state
  const [internalSubmitting, setInternalSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isSubmitting = controlledSubmitting !== undefined ? controlledSubmitting : (isLoading || internalSubmitting);

  // Dirty fields map
  const dirtyFields = useMemo(() => {
    if (!mergedFeatures.dirtyTracking) return {};
    const dirtyMap: Record<string, boolean> = {};
    for (const field of allFields) {
      const key = field.name ?? field.key ?? '';
      if (!key) continue;
      const currentVal = getIn(values, key);
      const baselineVal = getIn(baselineValuesRef.current, key);
      if (!isDeepEqual(currentVal, baselineVal)) {
        dirtyMap[key] = true;
      }
    }
    return dirtyMap;
  }, [values, allFields, mergedFeatures.dirtyTracking]);

  // Dirty tracking (calculated only if dirtyTracking feature is enabled)
  const isDirty = useMemo(() => {
    if (!mergedFeatures.dirtyTracking) return false;
    return Object.keys(dirtyFields).length > 0 || !isDeepEqual(values, baselineValuesRef.current);
  }, [dirtyFields, values, mergedFeatures.dirtyTracking]);

  // Notify onDirtyChange
  useEffect(() => {
    if (mergedFeatures.dirtyTracking && mergedFeatures.unsavedChanges) {
      onDirtyChange?.(isDirty);
    }
  }, [isDirty, mergedFeatures.dirtyTracking, mergedFeatures.unsavedChanges, onDirtyChange]);

  // Helper to update errors
  const updateErrors = useCallback((newErrors: FormErrors) => {
    setInternalErrors(newErrors);
    onErrorsChange?.(newErrors);
  }, [onErrorsChange]);

  // Validation function
  const runValidation = useCallback(
    async (currentValues: TValues, targetField?: string): Promise<FormErrors> => {
      if (!mergedFeatures.validation) return {};

      const errorMap: FormErrors = {};

      // 1. Field-level validation
      for (const field of allFields) {
        const key = field.name ?? field.key ?? '';
        if (!key) continue;
        if (targetField && key !== targetField && !targetField.startsWith(`${key}.`)) {
          continue;
        }

        // Skip validation for hidden or conditionally hidden fields
        if (field.hidden) continue;
        if (mergedFeatures.conditionalFields) {
          if (field.visibleWhen && !evaluateCondition(field.visibleWhen, currentValues)) {
            continue;
          }
          if (field.dependsOn && !field.visibleWhen) {
            const parentVal = getIn(currentValues, field.dependsOn.field);
            if (parentVal !== field.dependsOn.value) {
              continue;
            }
          }
        }

        const val = getIn(currentValues, key);

        // Required check
        if (field.required) {
          const isEmpty =
            val === undefined ||
            val === null ||
            (typeof val === 'string' && val.trim() === '') ||
            (Array.isArray(val) && val.length === 0);

          if (isEmpty) {
            errorMap[key] = `${field.label} is required`;
            continue;
          }
        }

        // Custom field validator
        if (field.validate) {
          try {
            const err = await field.validate(val, currentValues);
            if (err) {
              errorMap[key] = err;
            }
          } catch (e: unknown) {
            errorMap[key] = e instanceof Error ? e.message : 'Validation error';
          }
        }
      }

      // 2. Form-level / cross-field validation
      if (formValidate && (!targetField || Object.keys(errorMap).length === 0)) {
        try {
          const formErrors = await formValidate(currentValues);
          Object.assign(errorMap, formErrors);
        } catch (e: unknown) {
          errorMap._form = e instanceof Error ? e.message : 'Validation failed';
        }
      }

      return errorMap;
    },
    [allFields, formValidate, mergedFeatures.validation]
  );

  // Field change handler
  const setFieldValue = useCallback(
    (name: string, value: unknown) => {
      let nextValues: TValues;

      if (mergedFeatures.nestedFields && name.includes('.')) {
        nextValues = setIn(values, name, value);
      } else {
        nextValues = {
          ...values,
          [name]: value,
        };
      }

      // Check dependent field onChange triggers
      if (mergedFeatures.dependencies) {
        for (const field of allFields) {
          if (field.dependsOn?.field === name && field.dependsOn.onChange) {
            const extra = field.dependsOn.onChange(value, nextValues);
            nextValues = { ...nextValues, ...extra };
          }
        }
      }

      valuesRef.current = nextValues;
      if (!isControlled) {
        setInternalValues(nextValues);
      }
      onValuesChange?.(nextValues);
      onChange?.(name, value);

      // Clear server error for this field
      setClearedServerErrors((prev) => ({ ...prev, [name]: true }));
      if (activeErrors[name]) {
        const nextErrors = { ...activeErrors };
        delete nextErrors[name];
        updateErrors(nextErrors);
      }

      // Revalidate if validationMode is onChange
      if (validationMode === 'onChange') {
        runValidation(nextValues, name).then((fieldErrors) => {
          if (fieldErrors[name]) {
            updateErrors({ ...activeErrors, [name]: fieldErrors[name]! });
          } else if (activeErrors[name]) {
            const nextErrors = { ...activeErrors };
            delete nextErrors[name];
            updateErrors(nextErrors);
          }
        });
      }
    },
    [
      values,
      isControlled,
      mergedFeatures.nestedFields,
      mergedFeatures.dependencies,
      allFields,
      onValuesChange,
      onChange,
      activeErrors,
      updateErrors,
      validationMode,
      runValidation,
    ]
  );

  // Field blur handler
  const handleFieldBlur = useCallback(
    (name: string) => {
      setTouched((prev) => ({ ...prev, [name]: true }));

      if (validationMode === 'onBlur') {
        runValidation(values, name).then((fieldErrors) => {
          if (fieldErrors[name]) {
            updateErrors({ ...activeErrors, [name]: fieldErrors[name]! });
          } else if (activeErrors[name]) {
            const nextErrors = { ...activeErrors };
            delete nextErrors[name];
            updateErrors(nextErrors);
          }
        });
      }
    },
    [validationMode, runValidation, values, activeErrors, updateErrors]
  );

  // Repeatable group operations
  const addRepeatableItem = useCallback(
    (groupName: string) => {
      const currentList = (getIn(values, groupName) as Record<string, unknown>[]) || [];
      const updatedList = [...currentList, {}];
      setFieldValue(groupName, updatedList);
    },
    [values, setFieldValue]
  );

  const removeRepeatableItem = useCallback(
    (groupName: string, index: number) => {
      const currentList = (getIn(values, groupName) as Record<string, unknown>[]) || [];
      const updatedList = currentList.filter((_, i) => i !== index);
      setFieldValue(groupName, updatedList);
    },
    [values, setFieldValue]
  );

  // Reset form
  const reset = useCallback(
    (newValues?: Partial<TValues>) => {
      const resetTarget = newValues
        ? ({ ...defaultInitialValues, ...newValues } as TValues)
        : defaultInitialValues;

      baselineValuesRef.current = cloneDeep(resetTarget);

      if (!isControlled) {
        setInternalValues(resetTarget);
      }
      onValuesChange?.(resetTarget);

      setTouched({});
      updateErrors({});
      setSubmitSuccess(false);
      setSubmitError(null);
    },
    [defaultInitialValues, isControlled, onValuesChange, updateErrors]
  );

  const resetField = useCallback(
    (name: string) => {
      const initialVal = getIn(baselineValuesRef.current, name);
      setFieldValue(name, initialVal);
    },
    [setFieldValue]
  );

  // Draft serialization
  const getFormState = useCallback((): FormDraftState<TValues> => {
    return {
      values: cloneDeep(values),
      timestamp: Date.now(),
      version: '1.0',
    };
  }, [values]);

  const restoreFormState = useCallback(
    (state: FormDraftState<TValues>) => {
      if (!state || typeof state !== 'object' || !state.values) {
        return;
      }
      const restored = cloneDeep(state.values);
      valuesRef.current = restored;
      if (!isControlled) {
        setInternalValues(restored);
      }
      onValuesChange?.(restored);
    },
    [isControlled, onValuesChange]
  );

  // Submit handler
  const submit = useCallback(async () => {
    if (isSubmitting) return;

    setInternalSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const validationErrors = await runValidation(values);
      if (Object.keys(validationErrors).length > 0) {
        updateErrors(validationErrors);
        setInternalSubmitting(false);
        return;
      }

      if (onSubmit) {
        await onSubmit(values);
      }
      setSubmitSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Submission failed';
      setSubmitError(message);
    } finally {
      setInternalSubmitting(false);
    }
  }, [isSubmitting, runValidation, values, updateErrors, onSubmit]);

  // Imperative handle
  const handle: DynamicFormHandle<TValues> = useMemo(
    () => ({
      getValue: (name: string) => getIn(valuesRef.current, name),
      getValues: () => valuesRef.current,
      setValue: (name: string, val: unknown) => setFieldValue(name, val),
      setValues: (newVals: Partial<TValues>) => {
        const merged = { ...valuesRef.current, ...newVals };
        valuesRef.current = merged;
        if (!isControlled) setInternalValues(merged);
        onValuesChange?.(merged);
      },
      reset,
      resetField,
      validate: async () => {
        const errs = await runValidation(values);
        updateErrors(errs);
        return Object.keys(errs).length === 0;
      },
      submit,
      getFormState,
      restoreFormState,
      isDirty,
      dirtyFields,
      isValid: Object.keys(activeErrors).length === 0,
      isSubmitting,
      isSubmitted: submitSuccess,
    }),
    [
      values,
      setFieldValue,
      isControlled,
      onValuesChange,
      reset,
      resetField,
      runValidation,
      updateErrors,
      submit,
      getFormState,
      restoreFormState,
      isDirty,
      dirtyFields,
      activeErrors,
      isSubmitting,
      submitSuccess,
    ]
  );

  return {
    values,
    errors: activeErrors,
    touched,
    isDirty,
    dirtyFields,
    isSubmitting,
    submitSuccess,
    submitError: submitError || serverError,
    mergedFeatures,
    setFieldValue,
    handleFieldBlur,
    addRepeatableItem,
    removeRepeatableItem,
    reset,
    submit,
    handle,
  };
}
