'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Search, Check, X, AlertCircle } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CustomSelectProps {
  /** Available options */
  options: SelectOption[];
  /** Controlled value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  placeholder?: string;
  /** Show search field if option count exceeds this threshold (ERP default: 5) */
  searchThreshold?: number;
  label?: string;
  error?: string;
  helper?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  wrapperClassName?: string;
}

/**
 * @skyra/ui CustomSelect
 *
 * [B] PLATFORM EXTRACTION from skyra-erp/src/components/ui/forms/CustomSelect.tsx
 *
 * Preserves ERP behavior:
 *   - Full keyboard nav: ArrowDown/Up, Enter, Escape
 *   - Search inside dropdown when >5 options
 *   - Close on outside click
 *   - Focus search on open (50ms delay matches ERP)
 *   - ARIA: listbox/option/haspopup/expanded
 *   - Confirmed visual: trigger padding 0.65rem 0.875rem, radius-md,
 *     selected bg rgba(10,88,202,0.08), focused bg: var(--bg-color),
 *     dropdown maxHeight 260px, shadow-lg, radius-md, fadeInUp 0.15s spring
 */
export function CustomSelect({
  options = [],
  value = '',
  onChange,
  placeholder = 'Select option...',
  searchThreshold = 5,
  label,
  error,
  helper,
  required,
  disabled,
  id,
  wrapperClassName = '',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const uid = useId();
  const selectId = id ?? `skyra-custom-select-${uid}`;
  const listboxId = `${selectId}-listbox`;
  const errorId = `${selectId}-error`;

  const selectedOption = options.find((opt) => opt.value === value);
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const hasError = !!error;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus search when open
  useEffect(() => {
    if (isOpen && options.length > searchThreshold) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
      setFocusedIndex(-1);
    } else if (!isOpen) {
      setSearch('');
    }
  }, [isOpen, options.length, searchThreshold]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const el = listRef.current.children[focusedIndex] as HTMLElement | undefined;
      el?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((p) => (p + 1) % Math.max(1, filteredOptions.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((p) => (p - 1 + filteredOptions.length) % Math.max(1, filteredOptions.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filteredOptions[focusedIndex] ?? (filteredOptions.length === 1 ? filteredOptions[0] : null);
      if (target && !target.disabled) {
        onChange(target.value);
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }
  };

  const selectOption = (opt: SelectOption) => {
    if (opt.disabled) return;
    onChange(opt.value);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className={`skyra-field ${wrapperClassName}`}>
      {label && (
        <label
          className={`skyra-label ${required ? 'skyra-label--required' : ''}`}
          id={`${selectId}-label`}
        >
          {label}
        </label>
      )}
      <div ref={containerRef} onKeyDown={handleKeyDown} style={{ position: 'relative', width: '100%' }}>
        <button
          ref={triggerRef}
          id={selectId}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-labelledby={label ? `${selectId}-label` : undefined}
          aria-describedby={hasError ? errorId : undefined}
          aria-invalid={hasError}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.65rem 0.875rem',         // [CONFIRMED: CustomSelect.tsx:126]
            background: 'var(--skyra-bg)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: hasError
              ? 'var(--skyra-danger)'
              : 'var(--skyra-border)',
            borderRadius: 'var(--skyra-radius-md)',
            fontSize: '0.875rem',
            color: selectedOption ? 'var(--skyra-text)' : 'var(--skyra-text-subtle)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            outline: 'none',
            opacity: disabled ? 0.5 : 1,
            transition: 'border-color 0.15s, box-shadow 0.15s',
            fontFamily: 'inherit',
            textAlign: 'left',
            minHeight: '44px',
          }}
          onFocus={(e) => {
            if (!hasError) {
              e.currentTarget.style.borderColor = 'var(--skyra-primary)';
              e.currentTarget.style.boxShadow = 'var(--skyra-focus-ring)';
            }
          }}
          onBlur={(e) => {
            if (!hasError) {
              e.currentTarget.style.borderColor = 'var(--skyra-border)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            size={16}
            aria-hidden="true"
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.2s',
              color: 'var(--skyra-text-muted)',
              flexShrink: 0,
              marginLeft: '8px',
            }}
          />
        </button>

        {isOpen && (
          <div
            id={listboxId}
            role="listbox"
            aria-labelledby={label ? `${selectId}-label` : undefined}
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              background: 'var(--skyra-surface)',
              border: '1px solid var(--skyra-border)',
              borderRadius: 'var(--skyra-radius-md)',
              boxShadow: 'var(--skyra-shadow-lg)',       // [CONFIRMED: CustomSelect.tsx:178]
              zIndex: 150,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '260px',                        // [CONFIRMED: CustomSelect.tsx:183]
              animation: 'skyra-fadeInUp 0.15s cubic-bezier(0.16, 1, 0.3, 1)',  // [CONFIRMED]
            }}
          >
            <style>{`
              @keyframes skyra-fadeInUp {
                from { opacity: 0; transform: translateY(4px); }
                to   { opacity: 1; transform: translateY(0); }
              }
            `}</style>

            {options.length > searchThreshold && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.5rem 0.75rem',
                  borderBottom: '1px solid var(--skyra-border)',
                  gap: '0.5rem',
                  flexShrink: 0,
                  background: 'var(--skyra-bg)',
                }}
              >
                <Search size={14} aria-hidden="true" style={{ color: 'var(--skyra-text-muted)', flexShrink: 0 }} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  value={search}
                  aria-label="Search options"
                  onChange={(e) => { setSearch(e.target.value); setFocusedIndex(-1); }}
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '0.8rem',
                    color: 'var(--skyra-text)',
                    padding: '2px 0',
                  }}
                />
                {search && (
                  <button type="button" onClick={() => setSearch('')} aria-label="Clear search"
                    style={{ background: 'none', border: 'none', color: 'var(--skyra-text-muted)', cursor: 'pointer', padding: '2px' }}>
                    <X size={12} aria-hidden="true" />
                  </button>
                )}
              </div>
            )}

            <div ref={listRef} style={{ overflowY: 'auto', flex: 1, padding: '4px' }}>
              {filteredOptions.length === 0 ? (
                <div style={{ padding: '0.75rem 1rem', color: 'var(--skyra-text-subtle)', fontSize: '0.85rem', textAlign: 'center' }}>
                  No matches found
                </div>
              ) : (
                filteredOptions.map((opt, idx) => {
                  const isActive = opt.value === value;
                  const isFocused = idx === focusedIndex;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      aria-disabled={opt.disabled}
                      disabled={opt.disabled}
                      onClick={() => selectOption(opt)}
                      onMouseEnter={() => setFocusedIndex(idx)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.55rem 0.75rem',
                        borderRadius: 'var(--skyra-radius-sm)',
                        background: isActive
                          ? 'rgba(10, 88, 202, 0.08)'   // [CONFIRMED: CustomSelect.tsx:289]
                          : isFocused
                          ? 'var(--skyra-bg)'
                          : 'transparent',
                        color: isActive ? 'var(--skyra-primary)' : 'var(--skyra-text)',
                        fontSize: '0.85rem',
                        fontWeight: isActive ? 600 : 400,
                        cursor: opt.disabled ? 'not-allowed' : 'pointer',
                        border: 'none',
                        textAlign: 'left',
                        opacity: opt.disabled ? 0.4 : 1,
                        transition: 'background 0.15s',
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {opt.label}
                      </span>
                      {isActive && <Check size={14} aria-hidden="true" style={{ color: 'var(--skyra-primary)', flexShrink: 0 }} />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {hasError && (
        <span id={errorId} className="skyra-error-msg" role="alert">
          <AlertCircle size={12} aria-hidden="true" />
          {error}
        </span>
      )}
      {helper && !hasError && <span className="skyra-helper-msg">{helper}</span>}
    </div>
  );
}
