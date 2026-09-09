'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Palette, Component, Table2, WrapText,
  PanelTop, Eye, Monitor, BookOpen, Moon, Sun, ChevronRight, Menu, X,
  FileText, Printer, Download,
} from 'lucide-react';

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
  { href: '/accessibility', label: 'Accessibility Studio', icon: Eye },
  { href: '/responsive',    label: 'Viewport Studio',      icon: Monitor },
  { href: '/docs',          label: 'Documentation',        icon: BookOpen },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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

  const sidebarContent = (
    <nav aria-label="Platform navigation" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.125rem', color: '#fff', letterSpacing: '-0.01em' }}>
          Skyra Platform
        </div>
        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
          Design System v0.1.0
        </div>
      </div>

      {/* Nav links */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 0.75rem' }}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              aria-current={active ? 'page' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.6rem 0.875rem',
                borderRadius: 'var(--skyra-radius-md)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: active ? 600 : 400,
                color: active ? '#fff' : 'rgba(255,255,255,0.65)',
                background: active
                  ? 'rgba(255,255,255,0.12)'    // [CONFIRMED: sidebar-active]
                  : 'transparent',
                borderLeft: active ? '3px solid var(--skyra-primary)' : '3px solid transparent',
                marginBottom: '2px',
                transition: 'background 0.15s, color 0.15s',
                minHeight: '44px',
              }}
            >
              <Icon size={17} aria-hidden="true" />
              {label}
              {active && <ChevronRight size={14} aria-hidden="true" style={{ marginLeft: 'auto', opacity: 0.6 }} />}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
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
      </div>
    </nav>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: 'var(--skyra-bg)' }}>
      {/* Desktop Sidebar [CONFIRMED: 280px, navy bg] */}
      <aside
        aria-label="Sidebar navigation"
        style={{
          width: '280px',                              // [CONFIRMED: sidebar-width]
          flexShrink: 0,
          background: 'var(--skyra-sidebar-bg)',       // [CONFIRMED: #002B66 light / #0B111E dark]
          position: 'fixed',
          top: 0, left: 0, bottom: 0,
          zIndex: 10,
          overflowY: 'auto',
          display: 'none',
        }}
        id="desktop-sidebar"
      >
        <style>{`
          @media (min-width: 769px) { #desktop-sidebar { display: flex !important; flex-direction: column; } }
          @media (max-width: 768px) { #main-content { margin-left: 0 !important; } }
        `}</style>
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 19 }}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        aria-label="Mobile navigation"
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0,
          width: '280px',
          background: 'var(--skyra-sidebar-bg)',
          zIndex: 20,
          display: 'flex', flexDirection: 'column',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',  // [CONFIRMED: ERP mobile behavior]
          transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',       // [CONFIRMED: animation curve]
          overflowY: 'auto',
        }}
      >
        {sidebarContent}
      </aside>

      {/* Main */}
      <div
        id="main-content"
        style={{ flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}
      >
        {/* Header [CONFIRMED: 64px height] */}
        <header style={{
          height: '64px',                              // [CONFIRMED: header-height]
          background: 'var(--skyra-surface)',
          borderBottom: '1px solid var(--skyra-border)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1.5rem',
          gap: '1rem',
          position: 'sticky', top: 0, zIndex: 9,
          boxShadow: 'var(--skyra-shadow-sm)',
        }}>
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            style={{
              background: 'none', border: 'none',
              cursor: 'pointer', color: 'var(--skyra-text-muted)',
              display: 'none', padding: '4px',
              borderRadius: 'var(--skyra-radius-sm)',
            }}
            id="mobile-menu-btn"
          >
            <style>{`@media (max-width: 768px) { #mobile-menu-btn { display: flex !important; } }`}</style>
            {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>

          <div style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--skyra-text)' }}>
            Skyra Platform
          </div>
          <div style={{ flex: 1 }} />
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
        </header>

        {/* Page content */}
        <main style={{ flex: 1 }} id="main">
          {children}
        </main>
      </div>
    </div>
  );
}
