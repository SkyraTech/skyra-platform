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
  ({ showSearchIcon = true, clearable = true, placeholder = 'Search...', onSearch, onKeyDown, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch((e.currentTarget as HTMLInputElement).value);
      }
      onKeyDown?.(e);
    };

    return (
      <Input
        ref={ref}
        type="search"
        placeholder={placeholder}
        clearable={clearable}
        leftAdornment={showSearchIcon ? <Search size={16} /> : undefined}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';
