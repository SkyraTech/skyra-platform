'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Input, InputProps } from './Input';

export interface SearchInputProps extends Omit<InputProps, 'type' | 'leftAdornment' | 'prefix'> {
  /** Optional search icon */
  showSearchIcon?: boolean;
  /** Callback triggered when user submits search (e.g. presses Enter) */
  onSearch?: (query: string) => void;
}

/**
 * @skyra/ui SearchInput
 *
 * Specialized search input with search icon, clear button, and accessible semantics.
 */
export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      showSearchIcon = true,
      clearable = true,
      placeholder = 'Search...',
      onSearch,
      onKeyDown,
      onClear,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch((e.currentTarget as HTMLInputElement).value);
      } else if (e.key === 'Escape') {
        if (onClear) {
          onClear();
        } else if (onChange) {
          // Synthetic clear event
          onChange({
            target: { value: '' },
            currentTarget: { value: '' },
          } as unknown as React.ChangeEvent<HTMLInputElement>);
        }
      }
      onKeyDown?.(e);
    };

    return (
      <Input
        ref={ref}
        type="search"
        placeholder={placeholder}
        clearable={clearable}
        value={value}
        onChange={onChange}
        onClear={onClear}
        leftAdornment={showSearchIcon ? <Search size={16} /> : undefined}
        onKeyDown={handleKeyDown}
        aria-label={props['aria-label'] ?? placeholder}
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';
