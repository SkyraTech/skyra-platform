import React, { useState, useRef, useEffect } from 'react';
import { Filter, X, Search, ChevronDown, Check } from 'lucide-react';
import { ColumnDef, ColumnFilter, FilterOperator } from './types';

interface ColumnFilterUIProps<TData> {
  column: ColumnDef<TData, any>;
  filterState?: ColumnFilter;
  onFilterChange: (filter: ColumnFilter | null) => void;
}

export function ColumnFilterUI<TData>({ column, filterState, onFilterChange }: ColumnFilterUIProps<TData>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cfg = column.filterConfig || { type: 'text' };
  
  const initialOp = filterState?.operator || (cfg.type === 'number' ? 'equals' : 'contains');
  const [operator, setOperator] = useState<FilterOperator>(initialOp);
  const [value, setValue] = useState<string>(filterState?.value ? String(filterState.value) : '');

  useEffect(() => {
    if (filterState) {
      setOperator(filterState.operator || initialOp);
      setValue(filterState.value ? String(filterState.value) : '');
    }
  }, [filterState, initialOp]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const apply = () => {
    if ((operator === 'isEmpty' || operator === 'isNotEmpty')) {
      onFilterChange({ id: column.id || (column.accessor as string), value: '', operator });
      setIsOpen(false);
      return;
    }
    
    if (!value && value !== '0') {
      onFilterChange(null);
      setIsOpen(false);
      return;
    }
    
    let parsedValue: unknown = value;
    if (cfg.type === 'number') {
      parsedValue = Number(value);
      if (isNaN(parsedValue as number)) return; // Don't apply malformed numbers
    } else if (cfg.type === 'boolean') {
      parsedValue = value === 'true';
    }

    onFilterChange({
      id: column.id || (column.accessor as string),
      value: parsedValue,
      operator
    });
    setIsOpen(false);
  };

  const clear = () => {
    onFilterChange(null);
    setValue('');
    setIsOpen(false);
  };

  const textOperators = [
    { value: 'contains', label: 'Contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'startsWith', label: 'Starts with' },
    { value: 'endsWith', label: 'Ends with' },
    { value: 'doesNotContain', label: 'Does not contain' },
    { value: 'isEmpty', label: 'Is empty' },
    { value: 'isNotEmpty', label: 'Is not empty' },
  ];

  const numberOperators = [
    { value: 'equals', label: '=' },
    { value: 'notEquals', label: '!=' },
    { value: 'greaterThan', label: '>' },
    { value: 'greaterThanOrEqual', label: '>=' },
    { value: 'lessThan', label: '<' },
    { value: 'lessThanOrEqual', label: '<=' },
    { value: 'isEmpty', label: 'Is empty' },
    { value: 'isNotEmpty', label: 'Is not empty' },
  ];
  
  const dateOperators = [
    { value: 'equals', label: 'Is' },
    { value: 'before', label: 'Before' },
    { value: 'after', label: 'After' },
    { value: 'onOrBefore', label: 'On or before' },
    { value: 'onOrAfter', label: 'On or after' },
  ];

  let opList = textOperators;
  if (cfg.type === 'number') opList = numberOperators;
  if (cfg.type === 'date') opList = dateOperators;
  if (cfg.type === 'select') opList = [{ value: 'equals', label: 'Is' }, { value: 'notEquals', label: 'Is not' }];

  const noInputValue = operator === 'isEmpty' || operator === 'isNotEmpty';

  return (
    <div ref={containerRef} style={{ display: 'inline-block', position: 'relative' }}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        aria-label={`Filter ${column.header}`}
        aria-expanded={isOpen}
        style={{
          background: filterState ? 'var(--skyra-primary-light)' : 'none',
          color: filterState ? 'var(--skyra-primary)' : 'inherit',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: 'var(--skyra-radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: filterState ? 1 : 0.6,
        }}
      >
        <Filter size={13} aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '4px',
            background: 'var(--skyra-surface)',
            border: '1px solid var(--skyra-border)',
            borderRadius: 'var(--skyra-radius-md)',
            boxShadow: 'var(--skyra-shadow-lg)',
            zIndex: 100,
            padding: '1rem',
            width: '240px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            fontWeight: 'normal',
            textTransform: 'none',
            letterSpacing: 'normal',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--skyra-text)' }}>
              Filter {column.header}
            </span>
            {filterState && (
              <button 
                onClick={clear} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--skyra-text-muted)', padding: '2px' }}
                title="Clear filter"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <select
            value={operator}
            onChange={(e) => setOperator(e.target.value as FilterOperator)}
            style={{
              width: '100%',
              padding: '0.4rem 0.5rem',
              borderRadius: 'var(--skyra-radius-sm)',
              border: '1px solid var(--skyra-border)',
              background: 'var(--skyra-bg)',
              color: 'var(--skyra-text)',
              fontSize: '0.8125rem',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          >
            {opList.map((op) => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </select>

          {!noInputValue && (
            cfg.type === 'select' && cfg.options ? (
              <select
                value={value}
                onChange={(e) => setValue(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.4rem 0.5rem',
                  borderRadius: 'var(--skyra-radius-sm)',
                  border: '1px solid var(--skyra-border)',
                  background: 'var(--skyra-bg)',
                  color: 'var(--skyra-text)',
                  fontSize: '0.8125rem',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              >
                <option value="">Any</option>
                {cfg.options.map((opt) => (
                  <option key={String(opt.value)} value={String(opt.value)}>{opt.label}</option>
                ))}
              </select>
            ) : cfg.type === 'date' ? (
              <input
                type="date"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.4rem 0.5rem',
                  borderRadius: 'var(--skyra-radius-sm)',
                  border: '1px solid var(--skyra-border)',
                  background: 'var(--skyra-bg)',
                  color: 'var(--skyra-text)',
                  fontSize: '0.8125rem',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            ) : (
              <input
                type={cfg.type === 'number' ? 'number' : 'text'}
                placeholder="Value..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') apply();
                }}
                style={{
                  width: '100%',
                  padding: '0.4rem 0.5rem',
                  borderRadius: 'var(--skyra-radius-sm)',
                  border: '1px solid var(--skyra-border)',
                  background: 'var(--skyra-bg)',
                  color: 'var(--skyra-text)',
                  fontSize: '0.8125rem',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            )
          )}

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 500,
                background: 'var(--skyra-surface)',
                color: 'var(--skyra-text)',
                border: '1px solid var(--skyra-border)',
                borderRadius: 'var(--skyra-radius-sm)',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={apply}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: 'var(--skyra-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--skyra-radius-sm)',
                cursor: 'pointer'
              }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
