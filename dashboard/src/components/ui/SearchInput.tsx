'use client';

import React from 'react';
import { Search } from 'lucide-react';
import '@skyra-tech-platform/input';

export interface SearchInputProps extends Omit<React.ComponentProps<'skyra-tech-input'>, 'type' | 'leftAdornment' | 'prefix'> {
  /** Optional search icon */
  showSearchIcon?: boolean;
  /** Callback triggered when user submits search (e.g. presses Enter) */
  onSearch?: (query: string) => void;
}

/**
 * @skyra-tech-platform/input SearchInput
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
      <skyra-tech-input
        ref={ref}
        type="search"
        placeholder={placeholder}
        clearable={clearable}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        aria-label={props['aria-label'] ?? placeholder}
        {...props}
      >
        {showSearchIcon && <Search size={16} slot="left-icon" />}
      </skyra-tech-input>
    );
  }
);

SearchInput.displayName = 'SearchInput';
