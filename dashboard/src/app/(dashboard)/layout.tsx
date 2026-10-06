'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Palette, Component, Table2, WrapText,
  PanelTop, Eye, Monitor, BookOpen, Moon, Sun, ChevronRight,
  FileText, Printer, Download, QrCode, Package, History, Layers
} from 'lucide-react';
import { registerAppShell } from '@skyra-tech-platform/app-shell';
import '@skyra-tech-platform/app-shell/styles.css';
import { SearchDialog } from '../../components/docs/SearchDialog';

if (typeof window !== 'undefined') {
  registerAppShell();
}




function DashboardSidebarHeader() {
  return (
    <div className="skyra-sidebar-header">
      <div style={{ padding: '0 0.5rem', width: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }} className="dashboard-logo">
          <span className="logo-full" style={{ fontSize: '1.125rem' }}>Skyra Platform</span>
          <span className="logo-short" style={{ fontSize: '1.25rem', display: 'none' }}>SP</span>
        </div>
        <div className="logo-subtitle" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>
          Design System v0.1.0
        </div>
      </div>
      <style>{`
        skyra-tech-app-shell[collapsed] .logo-full { display: none !important; }
        skyra-tech-app-shell[collapsed] .logo-short { display: inline !important; }
        skyra-tech-app-shell[collapsed] .logo-subtitle { display: none !important; }
      `}</style>
    </div>
  );
}

function DashboardSidebarFooter({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  return (
    <div className="skyra-sidebar-footer">
      <button
        onClick={toggleDark}
        aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        className="theme-toggle-btn"
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(255,255,255,0.08)', border: 'none',
          borderRadius: 'var(--skyra-radius-md)', padding: '0.5rem 0.875rem',
          color: 'rgba(255,255,255,0.8)', cursor: 'pointer',
          fontFamily: 'inherit', fontSize: '0.8125rem', fontWeight: 500,
          width: '100%', minHeight: '44px',
        }}
      >
        {dark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
        <span className="theme-text">{dark ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
      <style>{`
        skyra-tech-app-shell[collapsed] .theme-text { display: none !important; }
        skyra-tech-app-shell[collapsed] .theme-toggle-btn { justify-content: center !important; padding: 0.5rem !important; }
      `}</style>
    </div>
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
      { href: '/docs/design-tokens', label: 'Design Tokens',  icon: Palette },
      { href: '/docs/utils',         label: 'Utils',           icon: WrapText },
      { href: '/docs/validation',    label: 'Validation',      icon: FileText },
      { href: '/docs/data-export',   label: 'Data Export',     icon: Download },
    ]
  },
  {
    title: 'Playgrounds',
    items: [
      { href: '/ui-components', label: 'UI Playground',        icon: Component },
      { href: '/data-table',    label: 'Data Table',           icon: Table2 },

      { href: '/pdf-viewer',    label: 'PDF & Documents',      icon: FileText },
      { href: '/print',         label: 'Print Studio',         icon: Printer },
      { href: '/export',        label: 'Data Export',          icon: Download },
      { href: '/qr-code',       label: 'QR Code',              icon: QrCode },
    ]
  }
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  const pathname = usePathname();
  const shellRef = useRef<HTMLElement>(null);

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

  const closeMobile = () => {
    if (shellRef.current) {
      (shellRef.current as any).mobileOpen = false;
    }
  };

  const toggleSidebar = () => {
    if (shellRef.current) {
      (shellRef.current as any).toggle();
    }
  };

  return (
    <skyra-tech-app-shell ref={shellRef}>
      
      {/* Sidebar Slot */}
      <div slot="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <DashboardSidebarHeader />

        <div className="skyra-sidebar-navigation">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '0.5rem 0' }}>
            {NAV_GROUPS.map((group, groupIdx) => (
              <div key={groupIdx} className="skyra-sidebar-section">
                <div className="skyra-sidebar-section-title nav-group-title">
                  {group.title}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                  {group.items.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href || pathname.startsWith(href + '/');
                    return (
                      <Link 
                        key={href}
                        href={href}
                        className="skyra-sidebar-item"
                        data-active={active}
                        onClick={closeMobile}
                      >
                        <span className="skyra-sidebar-item-icon" aria-hidden="true"><Icon size={17} /></span>
                        <span className="skyra-sidebar-item-label">{label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <style>{`
            skyra-tech-app-shell[collapsed] .nav-group-title { display: none !important; }
          `}</style>
        </div>

        <DashboardSidebarFooter dark={dark} toggleDark={toggleDark} />
      </div>

      {/* Header Slot */}
      <div slot="header" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <div className="skyra-header-left">
          <button
            className="skyra-sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <LayoutDashboard size={20} />
          </button>
        </div>
        <div className="skyra-header-content">
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SearchDialog />
          </div>
        </div>
        <div className="skyra-header-right">
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
        </div>
      </div>

      {/* Main Content Slot (default slot) */}
      <div style={{ flex: 1, position: 'relative' }}>
        {children}
      </div>

    </skyra-tech-app-shell>
  );
}
