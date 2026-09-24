import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, describe, it, vi } from 'vitest';
import { axe } from 'jest-axe';
import {
  ApplicationShell,
  Sidebar,
  SidebarHeader,
  SidebarItem,
  SidebarNavigation,
  Header,
  SidebarToggle,
  MainContent,
  SkipLink,
  useShell,
} from './index';

// Helper component to observe context state
function ContextObserver() {
  const { isCollapsed, isMobileOpen, isMobile } = useShell();
  return (
    <div data-testid="context-observer">
      <span data-testid="collapsed">{isCollapsed ? 'yes' : 'no'}</span>
      <span data-testid="mobile-open">{isMobileOpen ? 'yes' : 'no'}</span>
      <span data-testid="mobile">{isMobile ? 'yes' : 'no'}</span>
    </div>
  );
}

describe('@skyra/app-shell - Application Shell', () => {
  it('renders all layout regions and has no accessibility violations', async () => {
    const { container } = render(
      <ApplicationShell>
        <SkipLink />
        <Sidebar>
          <SidebarHeader>Brand</SidebarHeader>
          <SidebarNavigation>
            <SidebarItem label="Dashboard" active />
            <SidebarItem label="Settings" disabled />
          </SidebarNavigation>
        </Sidebar>
        <MainContent>
          <Header leftNode={<SidebarToggle />} />
          <main>Content</main>
        </MainContent>
      </ApplicationShell>
    );

    // Verify presence of elements
    expect(screen.getByRole('link', { name: /skip to main content/i })).toBeInTheDocument();
    expect(screen.getByRole('complementary', { name: /sidebar navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
    expect(screen.getByRole('main')).toBeInTheDocument(); // Main content
    expect(screen.getByRole('button', { name: /collapse sidebar/i })).toBeInTheDocument();

    // Verify accessibility
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('toggles sidebar on desktop via SidebarToggle', () => {
    // By default, matchMedia returns false for matches (desktop) in jsdom unless mocked
    render(
      <ApplicationShell>
        <ContextObserver />
        <Header leftNode={<SidebarToggle />} />
      </ApplicationShell>
    );
    
    const collapsedEl = screen.getByTestId('collapsed');
    expect(collapsedEl).toHaveTextContent('no');
    
    // Click toggle
    fireEvent.click(screen.getByRole('button', { name: /collapse sidebar/i }));
    
    expect(collapsedEl).toHaveTextContent('yes');
    // Button label should change
    expect(screen.getByRole('button', { name: /expand sidebar/i })).toBeInTheDocument();
  });

  it('sets initial collapsed state properly via defaultCollapsed', () => {
    render(
      <ApplicationShell defaultCollapsed>
        <ContextObserver />
        <Sidebar>Content</Sidebar>
      </ApplicationShell>
    );
    
    expect(screen.getByTestId('collapsed')).toHaveTextContent('yes');
    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveAttribute('data-collapsed', 'true');
  });

  describe('Mobile Behavior', () => {
    let originalMatchMedia: typeof window.matchMedia;
    
    beforeAll(() => {
      originalMatchMedia = window.matchMedia;
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(max-width: 768px)', // Force mobile
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
    });

    afterAll(() => {
      window.matchMedia = originalMatchMedia;
    });

    it('toggles mobile drawer and responds to Escape key', () => {
      render(
        <ApplicationShell>
          <ContextObserver />
          <Sidebar>Menu</Sidebar>
          <Header leftNode={<SidebarToggle />} />
        </ApplicationShell>
      );
      
      expect(screen.getByTestId('mobile')).toHaveTextContent('yes');
      expect(screen.getByTestId('mobile-open')).toHaveTextContent('no');
      
      const toggle = screen.getByRole('button', { name: /open menu/i });
      fireEvent.click(toggle);
      
      expect(screen.getByTestId('mobile-open')).toHaveTextContent('yes');
      expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument();
      
      // Backdrop should appear
      const backdrop = document.querySelector('.skyra-sidebar-backdrop');
      expect(backdrop).toBeInTheDocument();

      // Escape to close
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.getByTestId('mobile-open')).toHaveTextContent('no');
    });
  });
});
