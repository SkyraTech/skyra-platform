import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
  PaginationEllipsis,
  getPaginationRange,
} from './Pagination';

describe('Pagination Engine (getPaginationRange)', () => {
  it('returns exact range for small page counts (<= totalItemCount)', () => {
    expect(getPaginationRange({ page: 1, pageCount: 5 })).toEqual([1, 2, 3, 4, 5]);
    expect(getPaginationRange({ page: 3, pageCount: 7 })).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('handles near-start pages with right ellipsis', () => {
    const range = getPaginationRange({ page: 2, pageCount: 20 });
    expect(range).toEqual([1, 2, 3, 4, 5, 'ellipsis', 20]);
  });

  it('handles near-end pages with left ellipsis', () => {
    const range = getPaginationRange({ page: 19, pageCount: 20 });
    expect(range).toEqual([1, 'ellipsis', 16, 17, 18, 19, 20]);
  });

  it('handles middle pages with both left and right ellipsis', () => {
    const range = getPaginationRange({ page: 10, pageCount: 20 });
    expect(range).toEqual([1, 'ellipsis', 9, 10, 11, 'ellipsis', 20]);
  });

  it('handles custom boundaryCount and siblingCount', () => {
    const range = getPaginationRange({
      page: 10,
      pageCount: 30,
      siblingCount: 2,
      boundaryCount: 2,
    });
    expect(range).toEqual([1, 2, 'ellipsis', 8, 9, 10, 11, 12, 'ellipsis', 29, 30]);
  });

  it('handles invalid inputs and clamps cleanly', () => {
    expect(getPaginationRange({ page: -5, pageCount: 0 })).toEqual([1]);
    expect(getPaginationRange({ page: 50, pageCount: 10 })).toEqual([1, 'ellipsis', 6, 7, 8, 9, 10]);
  });
});

describe('Pagination Component', () => {
  it('renders semantic navigation landmark with aria-label', () => {
    render(<Pagination page={1} pageCount={5} onPageChange={vi.fn()} />);
    const nav = screen.getByRole('navigation', { name: 'Pagination' });
    expect(nav).toBeInTheDocument();
  });

  it('marks current page with aria-current="page"', () => {
    render(<Pagination page={3} pageCount={5} onPageChange={vi.fn()} />);
    const activePage = screen.getByRole('button', { name: 'Go to page 3' });
    expect(activePage).toHaveAttribute('aria-current', 'page');
    expect(activePage).toHaveClass('skyra-pagination-link--active');
  });

  it('calls onPageChange when a page number is clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination page={2} pageCount={5} onPageChange={onPageChange} />);
    const page4 = screen.getByRole('button', { name: 'Go to page 4' });
    fireEvent.click(page4);
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('disables previous button on first page and next button on last page', () => {
    const { rerender } = render(
      <Pagination page={1} pageCount={5} onPageChange={vi.fn()} />
    );
    const prevBtn = screen.getByRole('button', { name: 'Go to previous page' });
    expect(prevBtn).toBeDisabled();

    rerender(<Pagination page={5} pageCount={5} onPageChange={vi.fn()} />);
    const nextBtn = screen.getByRole('button', { name: 'Go to next page' });
    expect(nextBtn).toBeDisabled();
  });

  it('navigates with next and previous buttons', () => {
    const onPageChange = vi.fn();
    render(<Pagination page={3} pageCount={5} onPageChange={onPageChange} />);

    const prevBtn = screen.getByRole('button', { name: 'Go to previous page' });
    fireEvent.click(prevBtn);
    expect(onPageChange).toHaveBeenCalledWith(2);

    const nextBtn = screen.getByRole('button', { name: 'Go to next page' });
    fireEvent.click(nextBtn);
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('supports showFirstLast navigation controls', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination page={5} pageCount={10} onPageChange={onPageChange} showFirstLast />
    );
    const firstBtn = screen.getByRole('button', { name: 'Go to first page' });
    const lastBtn = screen.getByRole('button', { name: 'Go to last page' });

    fireEvent.click(firstBtn);
    expect(onPageChange).toHaveBeenCalledWith(1);

    fireEvent.click(lastBtn);
    expect(onPageChange).toHaveBeenCalledWith(10);
  });

  it('disables all buttons when disabled prop is true', () => {
    const onPageChange = vi.fn();
    render(<Pagination page={3} pageCount={5} onPageChange={onPageChange} disabled />);
    const page2 = screen.getByRole('button', { name: 'Go to page 2' });
    expect(page2).toBeDisabled();
    fireEvent.click(page2);
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('renders correctly with composable primitives', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>10</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('More pages')).toBeInTheDocument();
  });
});
