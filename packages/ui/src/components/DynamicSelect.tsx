'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useId,
  useMemo,
  useCallback,
  useLayoutEffect,
} from 'react';
import { ChevronDown, Search, Check, X, AlertCircle, Loader2, Plus } from 'lucide-react';

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
  /** Array of available options */
  options: T[];
  /** Selected value: single item, array of items, or null */
  value?: T | T[] | string | string[] | null;
  /** Callback fired when selection changes */
  onChange: (value: T | T[] | null) => void;
  /** Selection mode */
  mode?: DynamicSelectMode;
  /** Whether search input is enabled in dropdown */
  searchable?: boolean;
  /** Detailed search configuration */
  search?: DynamicSelectSearchConfig;
  /** Allow clearing selection */
  clearable?: boolean;
  /** Enable "Select All" toggle in multi-select mode */
  selectAll?: boolean;
  /** Visible tokens count or 'auto' dynamic width calculation */
  maxVisibleValues?: number | 'auto';
  /** Maximum number of selectable items in multi-select mode */
  maxSelections?: number;
  /** Group options by group property or optionGroup extractor */
  grouping?: boolean;
  /** Loading state indicator */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Allow creating new option when search doesn't match */
  allowCreate?: boolean;
  /** Virtualized list (future-ready config) */
  virtualized?: boolean;
  /** Width of dropdown panel */
  dropdownWidth?: 'match' | 'auto' | number;
  /** Maximum height of options list in px */
  maxMenuHeight?: number;
  /** Placeholder text */
  placeholder?: string;
  /** Field label */
  label?: string;
  /** Helper / description text below field */
  description?: string;
  /** Error message */
  error?: string;
  /** Required field marker */
  required?: boolean;
  /** Custom ID */
  id?: string;
  /** Custom extractor for option label */
  optionLabel?: (option: T) => string;
  /** Custom extractor for option value */
  optionValue?: (option: T) => string;
  /** Custom extractor for option group */
  optionGroup?: (option: T) => string;
  /** Custom extractor for option description */
  optionDescription?: (option: T) => string | undefined;
  /** Custom extractor for option disabled state */
  optionDisabled?: (option: T) => boolean;
  /** Custom option renderer */
  renderOption?: (option: T, state: { selected: boolean; focused: boolean }) => React.ReactNode;
  /** Custom selected value renderer */
  renderValue?: (option: T | T[]) => React.ReactNode;
  /** Async search callback */
  onSearch?: (query: string) => void;
  /** Callback when user creates a new option */
  onCreateOption?: (query: string) => void;
  /** Additional CSS class */
  className?: string;
}

// Helpers for default extractors
function defaultGetLabel<T>(opt: T, custom?: (o: T) => string): string {
  if (custom) return custom(opt);
  if (typeof opt === 'object' && opt !== null && 'label' in opt) {
    return String((opt as Record<string, unknown>).label);
  }
  return String(opt);
}

function defaultGetValue<T>(opt: T, custom?: (o: T) => string): string {
  if (custom) return custom(opt);
  if (typeof opt === 'object' && opt !== null && 'value' in opt) {
    return String((opt as Record<string, unknown>).value);
  }
  return String(opt);
}

function defaultGetGroup<T>(opt: T, custom?: (o: T) => string): string | undefined {
  if (custom) return custom(opt);
  if (typeof opt === 'object' && opt !== null && 'group' in opt) {
    return ((opt as Record<string, unknown>).group as string);
  }
  return undefined;
}

function defaultGetDesc<T>(opt: T, custom?: (o: T) => string | undefined): string | undefined {
  if (custom) return custom(opt);
  if (typeof opt === 'object' && opt !== null && 'description' in opt) {
    return ((opt as Record<string, unknown>).description as string);
  }
  return undefined;
}

function defaultGetDisabled<T>(opt: T, custom?: (o: T) => boolean): boolean {
  if (custom) return custom(opt);
  if (typeof opt === 'object' && opt !== null && 'disabled' in opt) {
    return Boolean((opt as Record<string, unknown>).disabled);
  }
  return false;
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
  virtualized = false,
  dropdownWidth = 'match',
  maxMenuHeight = 280,
  placeholder = 'Select option...',
  label,
  description,
  error,
  required = false,
  id,
  optionLabel,
  optionValue,
  optionGroup,
  optionDescription,
  optionDisabled,
  renderOption,
  renderValue,
  onSearch,
  onCreateOption,
  className = '',
}: DynamicSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [calculatedVisibleCount, setCalculatedVisibleCount] = useState<number>(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const triggerContentRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const uid = useId();
  const selectId = id ?? `skyra-dynamic-select-${uid}`;
  const listboxId = `${selectId}-listbox`;
  const labelId = `${selectId}-label`;
  const errorId = `${selectId}-error`;
  const descId = `${selectId}-desc`;

  const isMulti = mode === 'multiple';
  const isSearchEnabled = searchable || !!search?.enabled;
  const searchPlaceholder = search?.placeholder ?? 'Search...';
  const minSearchChars = search?.minCharacters ?? 0;

  // Normalize selected items to Array of T
  const selectedItems = useMemo<T[]>(() => {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) {
      return value.map((v) => {
        if (typeof v === 'object' && v !== null) return v as T;
        const found = options.find((o) => defaultGetValue(o, optionValue) === String(v));
        return (found ?? ({ value: String(v), label: String(v) } as unknown as T));
      });
    }
    if (typeof value === 'object' && value !== null) {
      return [value as T];
    }
    const found = options.find((o) => defaultGetValue(o, optionValue) === String(value));
    return found ? [found] : [({ value: String(value), label: String(value) } as unknown as T)];
  }, [value, options, optionValue]);

  const selectedValuesSet = useMemo(() => {
    return new Set(selectedItems.map((item) => defaultGetValue(item, optionValue)));
  }, [selectedItems, optionValue]);

  // Filter options
  const filteredOptions = useMemo(() => {
    if (!searchQuery || searchQuery.trim().length < minSearchChars) {
      return options;
    }
    const q = searchQuery.toLowerCase().trim();
    return options.filter((opt) => {
      const lbl = defaultGetLabel(opt, optionLabel).toLowerCase();
      const val = defaultGetValue(opt, optionValue).toLowerCase();
      const desc = (defaultGetDesc(opt, optionDescription) || '').toLowerCase();
      return lbl.includes(q) || val.includes(q) || desc.includes(q);
    });
  }, [options, searchQuery, minSearchChars, optionLabel, optionValue, optionDescription]);

  // Grouped options if grouping is enabled
  const groupedOptions = useMemo(() => {
    if (!grouping) return null;
    const groups: { [key: string]: T[] } = {};
    filteredOptions.forEach((opt) => {
      const g = defaultGetGroup(opt, optionGroup) || 'Other';
      if (!groups[g]) groups[g] = [];
      groups[g].push(opt);
    });
    return groups;
  }, [filteredOptions, grouping, optionGroup]);

  // Flattened list for keyboard navigation
  const flatNavigableOptions = useMemo(() => {
    return filteredOptions;
  }, [filteredOptions]);

  // Dynamic visible count calculation in "auto" mode
  const updateAutoVisibleCount = useCallback(() => {
    if (maxVisibleValues !== 'auto') {
      if (typeof maxVisibleValues === 'number') {
        setCalculatedVisibleCount(maxVisibleValues);
      }
      return;
    }

    if (!triggerContentRef.current || selectedItems.length <= 1) {
      setCalculatedVisibleCount(selectedItems.length);
      return;
    }

    const containerWidth = triggerContentRef.current.clientWidth;
    if (containerWidth <= 0) return;

    // Estimate: each chip takes ~padding(16px) + text(charCount * 7.5px) + icon(18px) + gap(6px)
    // Plus reserve ~45px for "+N" badge
    const badgeWidth = 45;
    let available = containerWidth - badgeWidth;
    let count = 0;

    for (let i = 0; i < selectedItems.length; i++) {
      const item = selectedItems[i];
      if (!item) continue;
      const labelStr = defaultGetLabel(item, optionLabel);
      const estWidth = 36 + Math.min(labelStr.length * 7.5, 120);
      if (count === 0 || available - estWidth >= 0) {
        available -= estWidth;
        count++;
      } else {
        break;
      }
    }

    // If all fit comfortably in total width, don't need badge reserve
    let fullAvailable = containerWidth;
    let fullCount = 0;
    for (let i = 0; i < selectedItems.length; i++) {
      const item = selectedItems[i];
      if (!item) continue;
      const labelStr = defaultGetLabel(item, optionLabel);
      const estWidth = 36 + Math.min(labelStr.length * 7.5, 120);
      if (fullAvailable - estWidth >= 0) {
        fullAvailable -= estWidth;
        fullCount++;
      } else {
        break;
      }
    }

    if (fullCount === selectedItems.length) {
      setCalculatedVisibleCount(selectedItems.length);
    } else {
      setCalculatedVisibleCount(Math.max(1, count));
    }
  }, [maxVisibleValues, selectedItems, optionLabel]);

  useLayoutEffect(() => {
    updateAutoVisibleCount();
  }, [updateAutoVisibleCount]);

  useEffect(() => {
    const el = triggerContentRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      updateAutoVisibleCount();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateAutoVisibleCount]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle open focus
  useEffect(() => {
    if (isOpen) {
      if (isSearchEnabled) {
        setTimeout(() => searchInputRef.current?.focus(), 40);
      }
      setFocusedIndex(-1);
    } else {
      setSearchQuery('');
    }
  }, [isOpen, isSearchEnabled]);

  // Scroll focused option into view
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-skyra-option]');
      const activeEl = items[focusedIndex] as HTMLElement;
      if (activeEl && typeof activeEl.scrollIntoView === 'function') {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex]);

  // Search input change
  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setFocusedIndex(0);
    if (onSearch) {
      onSearch(q);
    }
  };

  // Option selection toggle
  const handleSelect = (option: T) => {
    const isDis = defaultGetDisabled(option, optionDisabled);
    if (isDis) return;

    const optVal = defaultGetValue(option, optionValue);

    if (isMulti) {
      const isSelected = selectedValuesSet.has(optVal);
      let newSelected: T[];

      if (isSelected) {
        newSelected = selectedItems.filter((item) => defaultGetValue(item, optionValue) !== optVal);
      } else {
        if (maxSelections && selectedItems.length >= maxSelections) {
          return; // reached limit
        }
        newSelected = [...selectedItems, option];
      }

      onChange(newSelected);
    } else {
      onChange(option);
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  // Remove individual token
  const handleRemoveToken = (e: React.MouseEvent, option: T) => {
    e.stopPropagation();
    if (disabled) return;
    const optVal = defaultGetValue(option, optionValue);
    const newSelected = selectedItems.filter((item) => defaultGetValue(item, optionValue) !== optVal);
    onChange(newSelected);
  };

  // Clear all
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange(isMulti ? [] : null);
  };

  // Select all / Deselect all toggle
  const handleToggleSelectAll = () => {
    if (!isMulti || disabled) return;

    const isSearchActive = isSearchEnabled && searchQuery.trim().length >= minSearchChars;
    const targetPool = isSearchActive ? filteredOptions : options;
    const selectableTarget = targetPool.filter((o) => !defaultGetDisabled(o, optionDisabled));
    if (selectableTarget.length === 0) return;

    const allTargetSelected = selectableTarget.every((o) =>
      selectedValuesSet.has(defaultGetValue(o, optionValue))
    );

    if (allTargetSelected) {
      // Deselect all selectable options in current target pool
      const targetValuesToRemove = new Set(
        selectableTarget.map((o) => defaultGetValue(o, optionValue))
      );
      const newSelected = selectedItems.filter(
        (item) => !targetValuesToRemove.has(defaultGetValue(item, optionValue))
      );
      onChange(newSelected);
    } else {
      // Select all unselected selectable options in current target pool
      const currentSelectedValues = new Set(
        selectedItems.map((item) => defaultGetValue(item, optionValue))
      );
      const toAdd = selectableTarget.filter(
        (o) => !currentSelectedValues.has(defaultGetValue(o, optionValue))
      );
      let newSelected = [...selectedItems, ...toAdd];
      if (maxSelections) {
        newSelected = newSelected.slice(0, maxSelections);
      }
      onChange(newSelected);
    }
  };

  // Create new option
  const handleCreateNew = () => {
    if (!allowCreate || !searchQuery.trim()) return;
    if (onCreateOption) {
      onCreateOption(searchQuery.trim());
    } else {
      // Default fallback creation
      const newOpt = { value: searchQuery.trim(), label: searchQuery.trim() } as unknown as T;
      if (isMulti) {
        onChange([...selectedItems, newOpt]);
      } else {
        onChange(newOpt);
      }
    }
    setSearchQuery('');
    setIsOpen(false);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === 'Backspace' && isMulti && selectedItems.length > 0) {
        // Remove last token on backspace when trigger is focused
        e.preventDefault();
        const newSelected = selectedItems.slice(0, selectedItems.length - 1);
        onChange(newSelected);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;

      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = prev + 1;
          return next >= flatNavigableOptions.length ? 0 : next;
        });
        break;

      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = prev - 1;
          return next < 0 ? flatNavigableOptions.length - 1 : next;
        });
        break;

      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;

      case 'End':
        e.preventDefault();
        setFocusedIndex(flatNavigableOptions.length - 1);
        break;

      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < flatNavigableOptions.length) {
          const opt = flatNavigableOptions[focusedIndex];
          if (opt) handleSelect(opt);
        } else if (allowCreate && searchQuery.trim() && filteredOptions.length === 0) {
          handleCreateNew();
        } else if (flatNavigableOptions.length === 1 && !isMulti) {
          const opt = flatNavigableOptions[0];
          if (opt) handleSelect(opt);
        }
        break;

      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  const visibleTokens = isMulti ? selectedItems.slice(0, calculatedVisibleCount) : [];
  const hiddenCount = isMulti ? Math.max(0, selectedItems.length - calculatedVisibleCount) : 0;
  const isSearchActive = isSearchEnabled && searchQuery.trim().length >= minSearchChars;
  const targetPool = isSearchActive ? filteredOptions : options;
  const selectableTarget = targetPool.filter((o) => !defaultGetDisabled(o, optionDisabled));
  const isAllTargetSelected =
    selectableTarget.length > 0 &&
    selectableTarget.every((o) => selectedValuesSet.has(defaultGetValue(o, optionValue)));
  const isSomeTargetSelected =
    !isAllTargetSelected &&
    selectableTarget.some((o) => selectedValuesSet.has(defaultGetValue(o, optionValue)));

  return (
    <div
      ref={containerRef}
      className={`skyra-dynamic-select-wrapper ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem',
        width: '100%',
        position: 'relative',
        fontFamily: 'var(--skyra-font-body)' }}
    >
      {/* ── Label ── */}
      {label && (
        <label
          id={labelId}
          htmlFor={selectId}
          style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: disabled ? 'var(--skyra-text-subtle)' : 'var(--skyra-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px' }}
        >
          {label}
          {required && <span style={{ color: 'var(--skyra-danger)' }} aria-hidden="true">*</span>}
        </label>
      )}

      {/* ── Select Trigger ── */}
      <button
        ref={triggerRef}
        id={selectId}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={error ? errorId : description ? descId : undefined}
        aria-disabled={disabled}
        aria-required={required}
        aria-invalid={!!error}
        style={{
          width: '100%',
          height: '42px',
          minHeight: '42px',
          maxHeight: '42px',
          padding: '0.45rem 0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          background: disabled ? 'var(--skyra-border)' : 'var(--skyra-bg)',
          border: error ? '1.5px solid var(--skyra-danger)' : isOpen ? '1.5px solid var(--skyra-primary)' : '1px solid var(--skyra-border)',
          borderRadius: 'var(--skyra-radius-md)',
          boxShadow: isOpen ? 'var(--skyra-shadow-glow)' : 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          
          textAlign: 'left',
          overflow: 'hidden',
          boxSizing: 'border-box' }}
      >
        {/* Trigger Content: Chips or Text */}
        <div
          ref={triggerContentRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            flex: 1,
            overflow: 'hidden',
            whiteSpace: 'nowrap' }}
        >
          {selectedItems.length === 0 ? (
            <span
              style={{
                color: 'var(--skyra-text-subtle)',
                fontSize: '0.875rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis' }}
            >
              {placeholder}
            </span>
          ) : renderValue && selectedItems.length > 0 ? (
            <span style={{ fontSize: '0.875rem', color: 'var(--skyra-text)' }}>
              {renderValue(isMulti ? selectedItems : (selectedItems[0] as T))}
            </span>
          ) : !isMulti && selectedItems.length > 0 && selectedItems[0] ? (
            <span
              style={{
                fontSize: '0.875rem',
                color: 'var(--skyra-text)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontWeight: 500 }}
            >
              {defaultGetLabel(selectedItems[0] as T, optionLabel)}
            </span>
          ) : (
            <>
              {visibleTokens.map((item) => {
                const itemVal = defaultGetValue(item, optionValue);
                const itemLbl = defaultGetLabel(item, optionLabel);
                return (
                  <span
                    key={itemVal}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '0.15rem 0.5rem',
                      background: 'var(--skyra-primary-light)',
                      color: 'var(--skyra-primary)',
                      borderRadius: 'var(--skyra-radius-sm)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      maxWidth: '150px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flexShrink: 0 }}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{itemLbl}</span>
                    {!disabled && (
                      <span
                        role="button"
                        tabIndex={0}
                        aria-label={`Remove ${itemLbl}`}
                        onClick={(e) => handleRemoveToken(e, item)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleRemoveToken(e as unknown as React.MouseEvent, item);
                          }
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          borderRadius: '50%',
                          padding: '2px' }}
                      >
                        <X size={12} />
                      </span>
                    )}
                  </span>
                );
              })}

              {/* +N Overflow Badge (Interactive) */}
              {hiddenCount > 0 && (
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`${hiddenCount} more selected options. Click to inspect.`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsOpen(true);
                    }
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.15rem 0.45rem',
                    background: 'var(--skyra-border)',
                    color: 'var(--skyra-text-muted)',
                    borderRadius: 'var(--skyra-radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    flexShrink: 0 }}
                >
                  +{hiddenCount}
                </span>
              )}
            </>
          )}
        </div>

        {/* Right Actions: Clear & Chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
          {clearable && selectedItems.length > 0 && !disabled && (
            <span
              role="button"
              tabIndex={0}
              aria-label="Clear selection"
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClear(e as unknown as React.MouseEvent);
                }
              }}
              style={{
                cursor: 'pointer',
                color: 'var(--skyra-text-subtle)',
                display: 'inline-flex',
                padding: '2px',
                borderRadius: 'var(--skyra-radius-sm)' }}
            >
              <X size={14} />
            </span>
          )}

          {loading ? (
            <Loader2
              size={16}
              className="skyra-spin"
              style={{ color: 'var(--skyra-primary)' }}
              aria-label="Loading options"
            />
          ) : (
            <ChevronDown className="skyra-motion-transition-transform"
              size={16}
              style={{
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                
                color: 'var(--skyra-text-muted)' }}
            />
          )}
        </div>
      </button>

      {/* ── Dropdown Menu ── */}
      {isOpen && (
        <div className="skyra-motion-fade-in-up"
          id={listboxId}
          role="listbox"
          aria-multiselectable={isMulti}
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            width: dropdownWidth === 'match' ? '100%' : dropdownWidth === 'auto' ? 'max-content' : `${dropdownWidth}px`,
            minWidth: '100%',
            background: 'var(--skyra-surface)',
            border: '1px solid var(--skyra-border)',
            borderRadius: 'var(--skyra-radius-md)',
            boxShadow: 'var(--skyra-shadow-lg)',
            zIndex: 200,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: `${maxMenuHeight}px` }}
        >
          {/* Search Box Header */}
          {isSearchEnabled && (
            <div
              style={{
                padding: '0.5rem 0.65rem',
                borderBottom: '1px solid var(--skyra-border)',
                background: 'var(--skyra-surface)',
                flexShrink: 0,
                position: 'sticky',
                top: 0,
                zIndex: 10 }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.6rem',
                  background: 'var(--skyra-bg)',
                  border: '1px solid var(--skyra-border)',
                  borderRadius: 'var(--skyra-radius-sm)' }}
              >
                <Search size={14} style={{ color: 'var(--skyra-text-muted)', flexShrink: 0 }} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  placeholder={searchPlaceholder}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  aria-label={searchPlaceholder}
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '0.85rem',
                    color: 'var(--skyra-text)',
                    fontFamily: 'inherit' }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => handleSearchChange('')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--skyra-text-subtle)',
                      cursor: 'pointer',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center' }}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Select All / Deselect All Control Row (in multi mode) */}
          {isMulti && selectAll && options.length > 0 && (
            <div
              role="button"
              tabIndex={0}
              onClick={handleToggleSelectAll}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleToggleSelectAll();
                }
              }}
              aria-label={isAllTargetSelected ? 'Deselect all options' : 'Select all options'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                borderBottom: '1px solid var(--skyra-border)',
                background: 'var(--skyra-bg)',
                cursor: 'pointer',
                userSelect: 'none',
                flexShrink: 0 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div className="skyra-motion-transition-all"
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: 'var(--skyra-radius-xs, 4px)',
                    border: isAllTargetSelected || isSomeTargetSelected ? '1.5px solid var(--skyra-primary)' : '1.5px solid var(--skyra-border)',
                    background: isAllTargetSelected || isSomeTargetSelected ? 'var(--skyra-primary)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0 }}
                >
                  {isAllTargetSelected ? (
                    <Check size={12} color="#ffffff" strokeWidth={3} />
                  ) : isSomeTargetSelected ? (
                    <div style={{ width: '8px', height: '2px', background: '#ffffff', borderRadius: '1px' }} />
                  ) : null}
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--skyra-text)' }}>
                  {isAllTargetSelected ? 'Deselect all' : 'Select all'}
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--skyra-text-muted)',
                  background: 'var(--skyra-surface)',
                  padding: '0.15rem 0.45rem',
                  borderRadius: 'var(--skyra-radius-sm)',
                  border: '1px solid var(--skyra-border)' }}
              >
                {selectedItems.length} / {options.length}
              </span>
            </div>
          )}

          {/* Option List */}
          <div
            ref={listRef}
            style={{
              overflowY: 'auto',
              flex: 1,
              padding: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px' }}
          >
            {loading ? (
              <div
                style={{
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  color: 'var(--skyra-text-muted)',
                  fontSize: '0.85rem' }}
              >
                <Loader2 size={16} className="skyra-spin" />
                <span>Loading options...</span>
              </div>
            ) : filteredOptions.length === 0 ? (
              <div style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                <p style={{ margin: 0, color: 'var(--skyra-text-subtle)', fontSize: '0.85rem' }}>
                  No results found
                </p>
                {allowCreate && searchQuery.trim() && (
                  <button
                    type="button"
                    onClick={handleCreateNew}
                    style={{
                      marginTop: '0.5rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '0.35rem 0.65rem',
                      background: 'var(--skyra-primary-light)',
                      color: 'var(--skyra-primary)',
                      border: '1px solid var(--skyra-primary)',
                      borderRadius: 'var(--skyra-radius-sm)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer' }}
                  >
                    <Plus size={14} />
                    <span>Create &quot;{searchQuery}&quot;</span>
                  </button>
                )}
              </div>
            ) : grouping && groupedOptions ? (
              // Grouped Options Rendering
              Object.entries(groupedOptions).map(([groupName, groupOpts]) => (
                <div key={groupName} style={{ marginBottom: '4px' }}>
                  <div
                    style={{
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'var(--skyra-text-subtle)',
                      background: 'var(--skyra-bg)',
                      borderRadius: 'var(--skyra-radius-sm)' }}
                  >
                    {groupName}
                  </div>
                  {groupOpts.map((opt) => renderOptionButton(opt))}
                </div>
              ))
            ) : (
              // Flat Options Rendering
              filteredOptions.map((opt) => renderOptionButton(opt))
            )}
          </div>

          {/* Sticky Footer for Multi-Select */}
          {isMulti && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                borderTop: '1px solid var(--skyra-border)',
                background: 'var(--skyra-bg)',
                flexShrink: 0 }}
            >
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--skyra-text-muted)' }}
              >
                {selectedItems.length} selected
              </span>
              {selectedItems.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--skyra-danger)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: '2px 4px',
                    borderRadius: 'var(--skyra-radius-xs)' }}
                >
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Error or Description ── */}
      {error ? (
        <div
          id={errorId}
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.78rem',
            color: 'var(--skyra-danger)' }}
        >
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      ) : description ? (
        <span
          id={descId}
          style={{
            fontSize: '0.78rem',
            color: 'var(--skyra-text-muted)' }}
        >
          {description}
        </span>
      ) : null}
    </div>
  );

  function renderOptionButton(opt: T) {
    const val = defaultGetValue(opt, optionValue);
    const lbl = defaultGetLabel(opt, optionLabel);
    const desc = defaultGetDesc(opt, optionDescription);
    const isDis = defaultGetDisabled(opt, optionDisabled);
    const isSelected = selectedValuesSet.has(val);
    const optIndex = flatNavigableOptions.indexOf(opt);
    const isFocused = optIndex === focusedIndex;

    return (
      <button className="skyra-motion-transition-bg-color"
        key={val}
        type="button"
        role="option"
        data-skyra-option="true"
        aria-selected={isSelected}
        aria-disabled={isDis}
        disabled={isDis}
        onClick={() => handleSelect(opt)}
        onMouseEnter={() => !isDis && setFocusedIndex(optIndex)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.625rem',
          padding: '0.55rem 0.75rem',
          borderRadius: 'var(--skyra-radius-sm)',
          background: isSelected
            ? 'var(--skyra-primary-light)'
            : isFocused
            ? 'var(--skyra-bg)'
            : 'transparent',
          color: isDis
            ? 'var(--skyra-text-subtle)'
            : isSelected
            ? 'var(--skyra-primary)'
            : 'var(--skyra-text)',
          fontSize: '0.85rem',
          cursor: isDis ? 'not-allowed' : 'pointer',
          border: 'none',
          textAlign: 'left',
          
          opacity: isDis ? 0.55 : 1 }}
      >
        {renderOption ? (
          renderOption(opt, { selected: isSelected, focused: isFocused })
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flex: 1, overflow: 'hidden' }}>
            {isMulti && (
              <div className="skyra-motion-transition-all"
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: 'var(--skyra-radius-xs, 4px)',
                  border: isSelected ? '1.5px solid var(--skyra-primary)' : '1.5px solid var(--skyra-border)',
                  background: isSelected ? 'var(--skyra-primary)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0 }}
              >
                {isSelected && <Check size={12} color="#ffffff" strokeWidth={3} />}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: '1px' }}>
              <span
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontWeight: isSelected ? 600 : 500,
                  color: isDis ? 'var(--skyra-text-subtle)' : isSelected ? 'var(--skyra-primary)' : 'var(--skyra-text)' }}
              >
                {lbl}
              </span>
              {desc && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--skyra-text-muted)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap' }}
                >
                  {desc}
                </span>
              )}
            </div>
          </div>
        )}

        {!isMulti && isSelected && (
          <Check size={16} style={{ color: 'var(--skyra-primary)', flexShrink: 0 }} />
        )}
      </button>
    );
  }
}
