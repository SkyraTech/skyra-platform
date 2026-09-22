'use client';

import React, { forwardRef, ComponentPropsWithoutRef, ReactNode } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';

/* ─── Pure Pagination Calculation Engine ─── */

export interface PaginationRangeOptions {
  page: number;
  pageCount: number;
  siblingCount?: number;
  boundaryCount?: number;
}

export type PaginationItemValue = number | 'ellipsis';

/**
 * Pure platform-neutral engine to compute page numbers with ellipsis.
 * Completely deterministic with zero DOM/React dependencies.
 */
export function getPaginationRange({
  page,
  pageCount,
  siblingCount = 1,
  boundaryCount = 1,
}: PaginationRangeOptions): PaginationItemValue[] {
  const safePageCount = Math.max(1, Math.floor(pageCount));
  const safeCurrentPage = Math.min(Math.max(1, Math.floor(page)), safePageCount);
  const safeSibling = Math.max(0, Math.floor(siblingCount));
  const safeBoundary = Math.max(0, Math.floor(boundaryCount));

  // Range helper: [start ... end]
  const range = (start: number, end: number): number[] => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  // Total items to show if everything fits: boundary * 2 + sibling * 2 + 1 (current) + 2 (ellipsis placeholders)
  const totalItemCount = safeBoundary * 2 + safeSibling * 2 + 3;

  if (safePageCount <= totalItemCount) {
    return range(1, safePageCount);
  }

  const leftSiblingIndex = Math.max(safeCurrentPage - safeSibling, 1);
  const rightSiblingIndex = Math.min(safeCurrentPage + safeSibling, safePageCount);

  const shouldShowLeftEllipsis = leftSiblingIndex > safeBoundary + 2;
  const shouldShowRightEllipsis = rightSiblingIndex < safePageCount - (safeBoundary + 1);

  const startBoundary = range(1, safeBoundary);
  const endBoundary = range(safePageCount - safeBoundary + 1, safePageCount);

  if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    const leftItemCount = safeBoundary + 2 * safeSibling + 2;
    const leftRange = range(1, leftItemCount);
    return [...leftRange, 'ellipsis', ...endBoundary];
  }

  if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
    const rightItemCount = safeBoundary + 2 * safeSibling + 2;
    const rightRange = range(safePageCount - rightItemCount + 1, safePageCount);
    return [...startBoundary, 'ellipsis', ...rightRange];
  }

  if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [...startBoundary, 'ellipsis', ...middleRange, 'ellipsis', ...endBoundary];
  }

  return range(1, safePageCount);
}

/* ─── Pagination Primitives ─── */

export type PaginationSize = 'sm' | 'md' | 'lg';
export type PaginationVariant = 'default' | 'outline' | 'compact';

export interface PaginationProps extends ComponentPropsWithoutRef<'nav'> {
  /** Current active page (1-based) */
  page?: number;
  /** Total number of pages */
  pageCount?: number;
  /** Callback fired when page changes */
  onPageChange?: (page: number) => void;
  /** Number of siblings on each side of current page */
  siblingCount?: number;
  /** Number of boundary pages always shown at start and end */
  boundaryCount?: number;
  /** Whether to show First and Last page jump buttons */
  showFirstLast?: boolean;
  /** Whether to show Previous and Next page buttons */
  showPrevNext?: boolean;
  /** Visual variant */
  variant?: PaginationVariant;
  /** Size variant */
  size?: PaginationSize;
  /** Whether all pagination controls are disabled */
  disabled?: boolean;
  /** Custom children for composable usage */
  children?: ReactNode;
  className?: string;
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      page,
      pageCount,
      onPageChange,
      siblingCount = 1,
      boundaryCount = 1,
      showFirstLast = false,
      showPrevNext = true,
      variant = 'default',
      size = 'md',
      disabled = false,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    // If children are provided, render as composable container
    if (children) {
      return (
        <nav
          ref={ref}
          role="navigation"
          aria-label="Pagination"
          className={`skyra-pagination skyra-pagination--${variant} skyra-pagination--${size} ${className}`}
          {...props}
        >
          {children}
        </nav>
      );
    }

    // Otherwise, render full managed pagination UI
    const currentPage = page ?? 1;
    const totalPages = Math.max(1, pageCount ?? 1);
    const isFirstPage = currentPage <= 1;
    const isLastPage = currentPage >= totalPages;

    const items = getPaginationRange({
      page: currentPage,
      pageCount: totalPages,
      siblingCount,
      boundaryCount,
    });

    const handlePageSelect = (newPage: number) => {
      if (disabled) return;
      const safeNewPage = Math.min(Math.max(1, newPage), totalPages);
      if (safeNewPage !== currentPage) {
        onPageChange?.(safeNewPage);
      }
    };

    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label="Pagination"
        className={`skyra-pagination skyra-pagination--${variant} skyra-pagination--${size} ${className}`}
        {...props}
      >
        <PaginationContent>
          {/* Jump to First Page */}
          {showFirstLast && (
            <PaginationItem>
              <PaginationFirst
                size={size}
                disabled={disabled || isFirstPage}
                onClick={() => handlePageSelect(1)}
              />
            </PaginationItem>
          )}

          {/* Previous Page */}
          {showPrevNext && (
            <PaginationItem>
              <PaginationPrevious
                size={size}
                disabled={disabled || isFirstPage}
                onClick={() => handlePageSelect(currentPage - 1)}
              />
            </PaginationItem>
          )}

          {/* Page numbers and ellipsis */}
          {items.map((item, index) => {
            if (item === 'ellipsis') {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis size={size} />
                </PaginationItem>
              );
            }

            const isPageActive = item === currentPage;
            return (
              <PaginationItem key={item}>
                <PaginationLink
                  size={size}
                  isActive={isPageActive}
                  disabled={disabled}
                  aria-label={`Go to page ${item}`}
                  onClick={() => handlePageSelect(item)}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {/* Next Page */}
          {showPrevNext && (
            <PaginationItem>
              <PaginationNext
                size={size}
                disabled={disabled || isLastPage}
                onClick={() => handlePageSelect(currentPage + 1)}
              />
            </PaginationItem>
          )}

          {/* Jump to Last Page */}
          {showFirstLast && (
            <PaginationItem>
              <PaginationLast
                size={size}
                disabled={disabled || isLastPage}
                onClick={() => handlePageSelect(totalPages)}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </nav>
    );
  }
);
Pagination.displayName = 'Pagination';

/* ─── PaginationContent ─── */

export interface PaginationContentProps extends ComponentPropsWithoutRef<'ul'> {
  className?: string;
  children: ReactNode;
}

export const PaginationContent = forwardRef<HTMLUListElement, PaginationContentProps>(
  ({ className = '', children, ...props }, ref) => (
    <ul ref={ref} className={`skyra-pagination-content ${className}`} {...props}>
      {children}
    </ul>
  )
);
PaginationContent.displayName = 'PaginationContent';

/* ─── PaginationItem ─── */

export interface PaginationItemProps extends ComponentPropsWithoutRef<'li'> {
  className?: string;
  children: ReactNode;
}

export const PaginationItem = forwardRef<HTMLLIElement, PaginationItemProps>(
  ({ className = '', children, ...props }, ref) => (
    <li ref={ref} className={`skyra-pagination-item ${className}`} {...props}>
      {children}
    </li>
  )
);
PaginationItem.displayName = 'PaginationItem';

/* ─── PaginationLink ─── */

export interface PaginationLinkProps extends ComponentPropsWithoutRef<'button'> {
  isActive?: boolean;
  size?: PaginationSize;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

export const PaginationLink = forwardRef<HTMLButtonElement, PaginationLinkProps>(
  ({ isActive = false, size = 'md', disabled = false, className = '', children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      aria-current={isActive ? 'page' : undefined}
      className={`skyra-pagination-link ${isActive ? 'skyra-pagination-link--active' : ''} skyra-pagination-link--${size} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
);
PaginationLink.displayName = 'PaginationLink';

/* ─── PaginationPrevious ─── */

export interface PaginationPreviousProps extends PaginationLinkProps {
  label?: string;
}

export const PaginationPrevious = forwardRef<HTMLButtonElement, PaginationPreviousProps>(
  ({ label = 'Previous', className = '', ...props }, ref) => (
    <PaginationLink
      ref={ref}
      aria-label="Go to previous page"
      className={`skyra-pagination-prev ${className}`}
      {...props}
    >
      <ChevronLeft size={16} aria-hidden="true" />
      <span className="skyra-pagination-prev-label">{label}</span>
    </PaginationLink>
  )
);
PaginationPrevious.displayName = 'PaginationPrevious';

/* ─── PaginationNext ─── */

export interface PaginationNextProps extends PaginationLinkProps {
  label?: string;
}

export const PaginationNext = forwardRef<HTMLButtonElement, PaginationNextProps>(
  ({ label = 'Next', className = '', ...props }, ref) => (
    <PaginationLink
      ref={ref}
      aria-label="Go to next page"
      className={`skyra-pagination-next ${className}`}
      {...props}
    >
      <span className="skyra-pagination-next-label">{label}</span>
      <ChevronRight size={16} aria-hidden="true" />
    </PaginationLink>
  )
);
PaginationNext.displayName = 'PaginationNext';

/* ─── PaginationFirst ─── */

export interface PaginationFirstProps extends PaginationLinkProps {
  label?: string;
}

export const PaginationFirst = forwardRef<HTMLButtonElement, PaginationFirstProps>(
  ({ label = 'First', className = '', ...props }, ref) => (
    <PaginationLink
      ref={ref}
      aria-label="Go to first page"
      className={`skyra-pagination-first ${className}`}
      {...props}
    >
      <ChevronsLeft size={16} aria-hidden="true" />
      <span className="skyra-pagination-first-label">{label}</span>
    </PaginationLink>
  )
);
PaginationFirst.displayName = 'PaginationFirst';

/* ─── PaginationLast ─── */

export interface PaginationLastProps extends PaginationLinkProps {
  label?: string;
}

export const PaginationLast = forwardRef<HTMLButtonElement, PaginationLastProps>(
  ({ label = 'Last', className = '', ...props }, ref) => (
    <PaginationLink
      ref={ref}
      aria-label="Go to last page"
      className={`skyra-pagination-last ${className}`}
      {...props}
    >
      <span className="skyra-pagination-last-label">{label}</span>
      <ChevronsRight size={16} aria-hidden="true" />
    </PaginationLink>
  )
);
PaginationLast.displayName = 'PaginationLast';

/* ─── PaginationEllipsis ─── */

export interface PaginationEllipsisProps extends ComponentPropsWithoutRef<'span'> {
  size?: PaginationSize;
  className?: string;
}

export const PaginationEllipsis = forwardRef<HTMLSpanElement, PaginationEllipsisProps>(
  ({ size = 'md', className = '', ...props }, ref) => (
    <span
      ref={ref}
      aria-hidden="true"
      className={`skyra-pagination-ellipsis skyra-pagination-ellipsis--${size} ${className}`}
      {...props}
    >
      <MoreHorizontal size={16} />
      <span className="skyra-sr-only">More pages</span>
    </span>
  )
);
PaginationEllipsis.displayName = 'PaginationEllipsis';
