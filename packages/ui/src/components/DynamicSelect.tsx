'use client';

import React, { useEffect, useRef } from 'react';
import '@skyra-tech-platform/dynamic-select';

export type DynamicSelectMode = 'single' | 'multiple';

export interface DynamicSelectSearchConfig {
  enabled?: boolean;
  placeholder?: string;
  minCharacters?: number;
}

export interface DefaultSelectOption {
  value: string;
  label: string;
  description?: string;
  group?: string;
  disabled?: boolean;
}

export interface DynamicSelectProps<T = DefaultSelectOption> {
  options: T[];
  value?: T | T[] | string | string[] | null;
  onChange: (value: T | T[] | null) => void;
  mode?: DynamicSelectMode;
  searchable?: boolean;
  search?: DynamicSelectSearchConfig;
  clearable?: boolean;
  selectAll?: boolean;
  maxVisibleValues?: number | 'auto';
  maxSelections?: number;
  grouping?: boolean;
  loading?: boolean;
  disabled?: boolean;
  allowCreate?: boolean;
  virtualized?: boolean;
  dropdownWidth?: 'match' | 'auto' | number;
  maxMenuHeight?: number;
  placeholder?: string;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  id?: string;
  name?: string;
  optionLabel?: (option: T) => string;
  optionValue?: (option: T) => string;
  optionGroup?: (option: T) => string;
  optionDescription?: (option: T) => string | undefined;
  optionDisabled?: (option: T) => boolean;
  onSearch?: (query: string) => void;
  onCreateOption?: (query: string) => void;
  className?: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'skyra-tech-dynamic-select': any;
    }
  }
}

export function DynamicSelect<T = DefaultSelectOption>({
  options = [],
  value,
  onChange,
  mode = 'single',
  searchable = false,
  search,
  clearable = false,
  selectAll = false,
  maxVisibleValues = 'auto',
  maxSelections,
  grouping = false,
  loading = false,
  disabled = false,
  allowCreate = false,
  dropdownWidth = 'match',
  maxMenuHeight = 280,
  placeholder = 'Select option...',
  label,
  description,
  error,
  required = false,
  id,
  name,
  optionLabel,
  optionValue,
  optionGroup,
  optionDescription,
  optionDisabled,
  onSearch,
  onCreateOption,
  className = '',
}: DynamicSelectProps<T>) {
  const internalRef = useRef<any>(null);

  // Sync complex object properties directly to DOM node
  useEffect(() => {
    const el = internalRef.current;
    if (!el) return;
    el.options = options;
    el.value = value;
    
    if (optionLabel) el.optionLabel = optionLabel;
    if (optionValue) el.optionValue = optionValue;
    if (optionGroup) el.optionGroup = optionGroup;
    if (optionDescription) el.optionDescription = optionDescription;
    if (optionDisabled) el.optionDisabled = optionDisabled;
  }, [
    options, value, optionLabel, optionValue, optionGroup, optionDescription, optionDisabled
  ]);

  // Handle custom events from Web Component
  useEffect(() => {
    const el = internalRef.current;
    if (!el) return;

    const handleChange = (e: any) => {
      if (onChange) onChange(e.detail.value);
    };

    const handleSearch = (e: any) => {
      if (onSearch) onSearch(e.detail.query);
    };
    
    const handleCreate = (e: any) => {
      if (onCreateOption) onCreateOption(e.detail.query);
    };

    el.addEventListener('skyra-change', handleChange);
    el.addEventListener('skyra-search', handleSearch);
    el.addEventListener('skyra-create', handleCreate);

    return () => {
      el.removeEventListener('skyra-change', handleChange);
      el.removeEventListener('skyra-search', handleSearch);
      el.removeEventListener('skyra-create', handleCreate);
    };
  }, [onChange, onSearch, onCreateOption]);

  return (
    <skyra-tech-dynamic-select
      ref={internalRef}
      class={className || undefined}
      id={id}
      name={name}
      mode={mode}
      searchable={searchable || search?.enabled ? true : undefined}
      clearable={clearable ? true : undefined}
      select-all={selectAll ? true : undefined}
      max-visible-values={maxVisibleValues}
      max-selections={maxSelections}
      grouping={grouping ? true : undefined}
      loading={loading ? true : undefined}
      disabled={disabled ? true : undefined}
      allow-create={allowCreate ? true : undefined}
      dropdown-width={dropdownWidth}
      max-menu-height={maxMenuHeight}
      placeholder={placeholder}
      label={label}
      description={description}
      error={error}
      required={required ? true : undefined}
    />
  );
}
