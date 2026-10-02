'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Palette, Component, Table2, WrapText,
  PanelTop, Eye, Monitor, BookOpen, Moon, Sun, ChevronRight,
  FileText, Printer, Download, QrCode, Package, History, Layers
} from 'lucide-react';
import { 
  ApplicationShell, 
  Sidebar, 
  SidebarHeader, 
  SidebarNavigation, 
  SidebarItem, 
  SidebarFooter, 
  Header, 
  SidebarToggle, 
  MainContent, 
  SkipLink,
  useShell
} from '@skyra/app-shell';
import '@skyra/app-shell/styles.css';
import { SearchDialog } from '../../components/docs/SearchDialog';

const NAV_ITEMS = [
  { href: '/overview',      label: 'Overview',             icon: LayoutDashboard },
  { href: '/packages',      label: 'Packages',             icon: Package },
  { href: '/components',    label: 'Components (Docs)',    icon: Layers },
  { href: '/design-system', label: 'Design System',        icon: Palette },
  { href: '/ui-components', label: 'UI Playground',        icon: Component },
  { href: '/data-table',    label: 'Data Table',           icon: Table2 },
  { href: '/dynamic-form',  label: 'Dynamic Form',         icon: WrapText },
  { href: '/dialogs',       label: 'Dialogs & Overlays',   icon: PanelTop },
  { href: '/pdf-viewer',    label: 'PDF & Documents',      icon: FileText },
  { href: '/print',         label: 'Print Studio',         icon: Printer },
  { href: '/export',        label: 'Data Export',          icon: Download },
  { href: '/qr-code',       label: 'QR Code',              icon: QrCode },
  { href: '/accessibility', label: 'Accessibility Studio', icon: Eye },
  { href: '/responsive',    label: 'Viewport Studio',      icon: Monitor },
  { href: '/docs',          label: 'Old Docs',             icon: BookOpen },
  { href: '/releases',      label: 'Releases & Changelog', icon: History },
];

function DashboardSidebarHeader() {
  const { isCollapsed, isMobile } = useShell();
  const collapsed = isCollapsed && !isMobile;

  return (
    <SidebarHeader>
      <div style={{ padding: '0 0.5rem', width: '100%', display: 'flex', flexDirection: 'column', alignItems: collapsed ? 'center' : 'flex-start' }}>
        <div style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: collapsed ? '1.25rem' : '1.125rem', color: '#fff', letterSpacing: '-0.01em' }}>
          {collapsed ? 'SP' : 'Skyra Platform'}
        </div>
        {!collapsed && (
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>
            Design System v0.1.0
          </div>
        )}
      </div>
    </SidebarHeader>
  );
}

function DashboardSidebarFooter({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const { isCollapsed, isMobile } = useShell();
  const collapsed = isCollapsed && !isMobile;

  return (
    <SidebarFooter>
      <button
        onClick={toggleDark}
        aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={collapsed ? (dark ? 'Light Mode' : 'Dark Mode') : undefined}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: '0.5rem',
          background: 'rgba(255,255,255,0.08)', border: 'none',
          borderRadius: 'var(--skyra-radius-md)', padding: collapsed ? '0.5rem' : '0.5rem 0.875rem',
          color: 'rgba(255,255,255,0.8)', cursor: 'pointer',
          fontFamily: 'inherit', fontSize: '0.8125rem', fontWeight: 500,
          width: '100%', minHeight: '44px',
        }}
      >
        {dark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
        {!collapsed && (dark ? 'Light Mode' : 'Dark Mode')}
      </button>
    </SidebarFooter>
  );
}

const NAV_GROUPS = [
  {
    title: 'Platform',
    items: [
      { href: '/overview',      label: 'Overview',             icon: LayoutDashboard },
      { href: '/packages',      label: 'Packages',             icon: Package },
      { href: '/releases',      label: 'Releases & Changelog', icon: History },
    ]
  },
  {
    title: 'Documentation',
    items: [
      { href: '/components',    label: 'Components (Docs)',    icon: Layers },
      { href: '/design-system', label: 'Design System',        icon: Palette },
      { href: '/accessibility', label: 'Accessibility Studio', icon: Eye },
      { href: '/responsive',    label: 'Viewport Studio',      icon: Monitor },
    ]
  },
  {
    title: 'Playgrounds',
    items: [
      { href: '/ui-components', label: 'UI Playground',        icon: Component },
      { href: '/data-table',    label: 'Data Table',           icon: Table2 },
      { href: '/dynamic-form',  label: 'Dynamic Form',         icon: WrapText },
      { href: '/dialogs',       label: 'Dialogs & Overlays',   icon: PanelTop },
      { href: '/pdf-viewer',    label: 'PDF & Documents',      icon: FileText },
      { href: '/print',         label: 'Print Studio',         icon: Printer },
      { href: '/export',        label: 'Data Export',          icon: Download },
      { href: '/qr-code',       label: 'QR Code',              icon: QrCode },
    ]
  }
];

function DashboardSidebarNavigationComponent({ pathname }: { pathname: string }) {
  const { setMobileOpen, isCollapsed, isMobile } = useShell();
  const collapsed = isCollapsed && !isMobile;
  
  return (
    <SidebarNavigation>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '0.5rem 0' }}>
        {NAV_GROUPS.map((group, groupIdx) => (
          <div key={groupIdx}>
            {!collapsed && (
              <div style={{ 
                fontSize: '0.65rem', 
                fontWeight: 700, 
                color: 'rgba(255,255,255,0.4)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                marginBottom: '0.5rem',
                paddingLeft: '0.75rem'
              }}>
                {group.title}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
              {group.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + '/');
                return (
                  <SidebarItem
                    key={href}
                    href={href}
                    label={label}
                    icon={<Icon size={17} />}
                    active={active}
                    as={Link}
                    onClick={() => setMobileOpen(false)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </SidebarNavigation>
  );
}
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem('skyra_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored === 'dark' || (!stored && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('skyra_theme', next ? 'dark' : 'light');
  };

  return (
    <ApplicationShell defaultCollapsed={false}>
      <SkipLink />
      <Sidebar>
        <DashboardSidebarHeader />

        <DashboardSidebarNavigationComponent pathname={pathname} />

        <DashboardSidebarFooter dark={dark} toggleDark={toggleDark} />
      </Sidebar>

      <MainContent>
        <Header 
          leftNode={
            <SidebarToggle 
              aria-label="Toggle Navigation"
              iconDesktop={<LayoutDashboard size={20} />} 
              iconMobile={<LayoutDashboard size={20} />}
            />
          }
          rightNode={
            <span style={{
              fontSize: '0.75rem',
              background: 'var(--skyra-primary)',
              color: '#ffffff',
              padding: '0.25rem 0.625rem',
              borderRadius: 'var(--skyra-radius-full)',
              fontWeight: 600,
            }}>
              v0.1.0-dev
            </span>
          }
        >
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SearchDialog />
          </div>
        </Header>
        <main style={{ flex: 1, position: 'relative' }}>
          {children}
        </main>
      </MainContent>
    </ApplicationShell>
  );
}

