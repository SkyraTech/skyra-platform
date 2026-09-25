import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest';
import { axe } from 'jest-axe';
import {
  ApplicationShell,
  Sidebar,
  SidebarHeader,
  SidebarItem,
  SidebarSection,
  SidebarFooter,
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

describe('@skyra/app-shell', () => {
  describe('ApplicationShell (Desktop)', () => {
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
            <SidebarFooter>Footer</SidebarFooter>
          </Sidebar>
          <MainContent>
            <Header 
              leftNode={<SidebarToggle />} 
              centerNode={<div data-testid="center">Center</div>}
              rightNode={<div data-testid="right">Right</div>}
            />
            <main>Content</main>
          </MainContent>
        </ApplicationShell>
      );

      // Verify skip link
      expect(screen.getByRole('link', { name: /skip to main content/i })).toBeInTheDocument();
      // Verify Sidebar
      expect(screen.getByRole('complementary', { name: /sidebar navigation/i })).toBeInTheDocument();
      expect(screen.getByText('Brand')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
      
      // Verify Header
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByTestId('center')).toBeInTheDocument();
      expect(screen.getByTestId('right')).toBeInTheDocument();
      
      // Verify Main Content
      expect(screen.getByRole('main')).toBeInTheDocument();

      // Verify accessibility
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('handles uncontrolled toggle state via SidebarToggle', () => {
      render(
        <ApplicationShell>
          <ContextObserver />
          <Sidebar />
          <Header leftNode={<SidebarToggle />} />
        </ApplicationShell>
      );
      
      const collapsedEl = screen.getByTestId('collapsed');
      expect(collapsedEl).toHaveTextContent('no'); // Default expanded
      expect(screen.getByRole('complementary')).toHaveAttribute('data-collapsed', 'false');
      
      // Click toggle
      const toggle = screen.getByRole('button', { name: /collapse sidebar/i });
      fireEvent.click(toggle);
      
      expect(collapsedEl).toHaveTextContent('yes');
      expect(screen.getByRole('complementary')).toHaveAttribute('data-collapsed', 'true');
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
      expect(screen.getByRole('complementary')).toHaveAttribute('data-collapsed', 'true');
    });
  });

  describe('Sidebar Navigation Items', () => {
    it('supports active and disabled states', () => {
      render(
        <ApplicationShell>
          <Sidebar>
            <SidebarItem label="Active Item" active data-testid="active-item" />
            <SidebarItem label="Disabled Item" disabled data-testid="disabled-item" />
          </Sidebar>
        </ApplicationShell>
      );
      
      const active = screen.getByTestId('active-item');
      expect(active).toHaveAttribute('data-active', 'true');
      expect(active).toHaveAttribute('aria-current', 'page');
      
      const disabled = screen.getByTestId('disabled-item');
      expect(disabled).toHaveAttribute('data-disabled', 'true');
      expect(disabled).toHaveAttribute('aria-disabled', 'true');
      expect(disabled).toHaveAttribute('tabindex', '-1');
    });

    it('supports custom slots (as prop)', () => {
      const CustomLink = (props: any) => <button data-testid="custom-link" {...props} />;
      render(
        <ApplicationShell>
          <SidebarItem label="Custom" as={CustomLink} />
        </ApplicationShell>
      );
      expect(screen.getByTestId('custom-link')).toBeInTheDocument();
      expect(screen.getByTestId('custom-link').tagName).toBe('BUTTON');
    });

    it('fires click and keyboard events on items', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <ApplicationShell>
          <SidebarItem label="Clickable" as="button" onClick={onClick} />
        </ApplicationShell>
      );
      
      const btn = screen.getByRole('button', { name: /clickable/i });
      
      await user.click(btn);
      expect(onClick).toHaveBeenCalledTimes(1);
      
      btn.focus();
      await user.keyboard('{Enter}');
      // native button handles Enter by firing click, so it should be called again
      expect(onClick).toHaveBeenCalledTimes(2);
    });

    it('renders SidebarSection correctly', () => {
      render(
        <ApplicationShell>
          <SidebarSection title="Section Title">
            <SidebarItem label="Item" />
          </SidebarSection>
        </ApplicationShell>
      );
      expect(screen.getByText('Section Title')).toBeInTheDocument();
    });
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

    it('toggles mobile drawer, renders backdrop, and responds to Escape', () => {
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

    it('closes mobile drawer when clicking the backdrop', () => {
      render(
        <ApplicationShell>
          <Sidebar>Menu</Sidebar>
          <Header leftNode={<SidebarToggle />} />
        </ApplicationShell>
      );
      
      // Open drawer
      fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
      expect(document.querySelector('.skyra-sidebar-backdrop')).toBeInTheDocument();

      // Click outside (backdrop is outside sidebar)
      fireEvent.mouseDown(document.body);
      expect(document.querySelector('.skyra-sidebar-backdrop')).not.toBeInTheDocument();
    });
  });
});

