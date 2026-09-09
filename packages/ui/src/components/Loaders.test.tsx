import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';
import { Progress } from './Progress';
import { CircularProgress } from './CircularProgress';
import { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard, SkeletonTable } from './Skeleton';
import { DataLoader } from './DataLoader';
import { PageLoader } from './PageLoader';
import { OverlayLoader } from './OverlayLoader';

describe('Skyra Loading System', () => {
  describe('Spinner', () => {
    it('renders with accessible role status', () => {
      render(<Spinner size="lg" label="Saving data..." showLabel />);
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Saving data...')).toBeInTheDocument();
    });
  });

  describe('Progress', () => {
    it('renders linear progress with percentage', () => {
      render(<Progress value={65} showLabel label="Upload Progress" />);
      const bar = screen.getByRole('progressbar');
      expect(bar).toHaveAttribute('aria-valuenow', '65');
      expect(screen.getByText('Upload Progress')).toBeInTheDocument();
      expect(screen.getByText('65%')).toBeInTheDocument();
    });

    it('renders indeterminate progress without value attribute', () => {
      render(<Progress showLabel />);
      const bar = screen.getByRole('progressbar');
      expect(bar).not.toHaveAttribute('aria-valuenow');
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('CircularProgress', () => {
    it('renders circular progress with percentage text', () => {
      render(<CircularProgress value={75} showValue />);
      const bar = screen.getByRole('progressbar');
      expect(bar).toHaveAttribute('aria-valuenow', '75');
      expect(screen.getByText('75%')).toBeInTheDocument();
    });
  });

  describe('Skeleton Primitives', () => {
    it('renders text, avatar, card and table skeletons', () => {
      const { container } = render(
        <div>
          <Skeleton width="100px" height="20px" />
          <SkeletonText lines={3} />
          <SkeletonAvatar size={40} />
          <SkeletonCard />
          <SkeletonTable rows={2} columns={3} />
        </div>
      );
      expect(container.querySelector('.skyra-skeleton-card')).toBeInTheDocument();
      expect(container.querySelector('.skyra-skeleton-table')).toBeInTheDocument();
    });
  });

  describe('DataLoader', () => {
    it('renders loading state', () => {
      render(
        <DataLoader loading={true} data={null}>
          {(data: any) => <div>{data.name}</div>}
        </DataLoader>
      );
      expect(screen.getByText(/loading data/i)).toBeInTheDocument();
    });

    it('renders error state', () => {
      render(
        <DataLoader loading={false} error="Failed to fetch records" data={null}>
          {(data: any) => <div>{data.name}</div>}
        </DataLoader>
      );
      expect(screen.getByRole('alert')).toHaveTextContent(/failed to fetch records/i);
    });

    it('renders empty state when data is empty array', () => {
      render(
        <DataLoader loading={false} error={null} data={[]}>
          {(data: any[]) => <div>Items: {data.length}</div>}
        </DataLoader>
      );
      expect(screen.getByText(/no records found/i)).toBeInTheDocument();
    });

    it('renders success children when data is present', () => {
      render(
        <DataLoader loading={false} error={null} data={{ title: 'Report Data' }}>
          {(data: { title: string }) => <div>Title: {data.title}</div>}
        </DataLoader>
      );
      expect(screen.getByText('Title: Report Data')).toBeInTheDocument();
    });
  });

  describe('PageLoader & OverlayLoader', () => {
    it('renders page loader with custom message', () => {
      render(<PageLoader message="Initializing workspace..." description="Please wait" />);
      expect(screen.getAllByRole('status')[0]).toBeInTheDocument();
      expect(screen.getByText('Initializing workspace...')).toBeInTheDocument();
      expect(screen.getByText('Please wait')).toBeInTheDocument();
    });

    it('renders overlay loader over children', () => {
      render(
        <OverlayLoader loading={true} message="Saving changes...">
          <div data-testid="underlying-content">Dashboard Content</div>
        </OverlayLoader>
      );
      expect(screen.getByTestId('underlying-content')).toBeInTheDocument();
      expect(screen.getByText('Saving changes...')).toBeInTheDocument();
    });
  });
});
