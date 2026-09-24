'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Palette, Component, Table2, WrapText,
  PanelTop, Eye, Monitor, BookOpen, Moon, Sun, ChevronRight,
  FileText, Printer, Download, QrCode
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
  SkipLink 
} from '@skyra/app-shell';
import '@skyra/app-shell/styles.css';

const NAV_ITEMS = [
  { href: '/overview',      label: 'Overview',             icon: LayoutDashboard },
  { href: '/design-system', label: 'Design System',        icon: Palette },
  { href: '/ui-components', label: 'UI Components',        icon: Component },
  { href: '/data-table',    label: 'Data Table',           icon: Table2 },
  { href: '/dynamic-form',  label: 'Dynamic Form',         icon: WrapText },
  { href: '/dialogs',       label: 'Dialogs & Overlays',   icon: PanelTop },
  { href: '/pdf-viewer',    label: 'PDF & Documents',      icon: FileText },
  { href: '/print',         label: 'Print Studio',         icon: Printer },
  { href: '/export',        label: 'Data Export',          icon: Download },
  { href: '/qr-code',       label: 'QR Code',              icon: QrCode },
  { href: '/accessibility', label: 'Accessibility Studio', icon: Eye },
  { href: '/responsive',    label: 'Viewport Studio',      icon: Monitor },
  { href: '/docs',          label: 'Documentation',        icon: BookOpen },
];

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
        <SidebarHeader>
          <div style={{ padding: '0 0.5rem', width: '100%' }}>
            <div style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.125rem', color: '#fff', letterSpacing: '-0.01em' }}>
              Skyra Platform
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
              Design System v0.1.0
            </div>
          </div>
        </SidebarHeader>

        <SidebarNavigation>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <SidebarItem
                key={href}
                href={href}
                label={label}
                icon={<Icon size={17} />}
                active={active}
                as={Link}
              />
            );
          })}
        </SidebarNavigation>

        <SidebarFooter>
          <button
            onClick={toggleDark}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(255,255,255,0.08)', border: 'none',
              borderRadius: 'var(--skyra-radius-md)', padding: '0.5rem 0.875rem',
              color: 'rgba(255,255,255,0.8)', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: '0.8125rem', fontWeight: 500,
              width: '100%', minHeight: '44px',
            }}
          >
            {dark ? <Sun size={15} aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />}
            {dark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </SidebarFooter>
      </Sidebar>

      <MainContent>
        <Header 
          leftNode={
            <SidebarToggle 
              iconDesktop={<LayoutDashboard size={20} />} 
              iconMobile={<LayoutDashboard size={20} />}
            />
          }
          rightNode={
            <span style={{
              fontSize: '0.75rem',
              background: 'var(--skyra-primary-light)',
              color: 'var(--skyra-primary)',
              padding: '0.25rem 0.625rem',
              borderRadius: 'var(--skyra-radius-full)',
              fontWeight: 600,
            }}>
              v0.1.0-dev
            </span>
          }
        >
          <div style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--skyra-text)', marginLeft: '1rem' }}>
            Application Shell
          </div>
        </Header>
        <main style={{ flex: 1, position: 'relative' }}>
          {children}
        </main>
      </MainContent>
    </ApplicationShell>
  );
}

