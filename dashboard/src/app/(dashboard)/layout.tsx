'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Palette, Component, Table2, WrapText,
  PanelTop, Eye, Monitor, BookOpen, Moon, Sun, ChevronRight, ChevronDown,
  FileText, Printer, Download, QrCode, Package, History, Layers,
  FileCode2
} from 'lucide-react';
import { registerAppShell } from '@skyra-tech-platform/app-shell';
import '@skyra-tech-platform/app-shell/styles.css';
import { SearchDialog } from '../../components/docs/SearchDialog';

if (typeof window !== 'undefined') {
  registerAppShell();
}




function DashboardSidebarHeader() {
  return (
    <div className="skyra-sidebar-header" style={{ flexShrink: 0 }}>
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
    <div className="skyra-sidebar-footer" style={{ flexShrink: 0 }}>
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

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
}

interface NavSection {
  id: string;
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    id: 'platform',
    title: 'Platform',
    items: [
      { href: '/overview',      label: 'Overview',             icon: LayoutDashboard },
      { href: '/packages',      label: 'Packages',             icon: Package },
      { href: '/releases',      label: 'Releases & Changelog', icon: History },
    ]
  },
  {
    id: 'documentation',
    title: 'Developer Documentation',
    items: [
      { href: '/components',         label: 'Components',             icon: Layers },
      { href: '/design-system',      label: 'Design System',          icon: Palette },
      { href: '/docs/design-tokens', label: 'Design Tokens',          icon: FileCode2 },
      { href: '/docs/utils',         label: 'Utilities',              icon: WrapText },
      { href: '/docs/validation',    label: 'Validation',             icon: FileText },
      { href: '/docs/data-export',   label: 'Data Export Docs',       icon: Download },
    ]
  },
  {
    id: 'playgrounds-workbenches',
    title: 'Playground & Workbenches',
    items: [
      { href: '/ui-components', label: 'UI Playground',         icon: Component },
      { href: '/data-table',    label: 'Data Table',            icon: Table2 },
      { href: '/pdf-viewer',    label: 'PDF Viewer',            icon: FileText },
      { href: '/print',         label: 'Print Studio',          icon: Printer },
      { href: '/qr-code',       label: 'QR Studio',             icon: QrCode },
      { href: '/export',        label: 'Data Export Workbench', icon: Download },
    ]
  },
  {
    id: 'quality-tools',
    title: 'Quality Tools',
    items: [
      { href: '/accessibility', label: 'Accessibility Studio', icon: Eye },
      { href: '/responsive',    label: 'Viewport Studio',      icon: Monitor },
    ]
  }
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  const pathname = usePathname();
  const shellRef = useRef<HTMLElement>(null);

  // Default all sections open for immediate scanability, with user collapse toggle
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'platform': true,
    'documentation': true,
    'playgrounds-workbenches': true,
    'quality-tools': true,
  });

  const isItemActive = (href: string): boolean => {
    if (href === '/overview') {
      return pathname === '/overview';
    }
    if (href === '/components') {
      return pathname === '/components' || pathname.startsWith('/components/');
    }
    if (href === '/packages') {
      return pathname === '/packages' || pathname.startsWith('/packages/');
    }
    if (href === '/ui-components') {
      return pathname === '/ui-components' || pathname.startsWith('/ui-components/');
    }
    if (href === '/releases') {
      return pathname === '/releases' || pathname.startsWith('/releases/');
    }
    if (href === '/design-system') {
      return pathname === '/design-system' || pathname.startsWith('/design-system/');
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  // Auto-expand any collapsed section if a child route within it becomes active
  useEffect(() => {
    NAV_SECTIONS.forEach((section) => {
      const hasActiveChild = section.items.some(item => isItemActive(item.href));
      if (hasActiveChild) {
        setOpenSections(prev => (prev[section.id] ? prev : { ...prev, [section.id]: true }));
      }
    });
  }, [pathname]);

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

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <skyra-tech-app-shell ref={shellRef}>
      
      {/* Sidebar Slot */}
      <div slot="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
        <DashboardSidebarHeader />

        <div className="skyra-sidebar-navigation" style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0' }}>
            {NAV_SECTIONS.map((section) => {
              const isSectionOpen = openSections[section.id] !== false;
              const hasActiveChild = section.items.some(item => isItemActive(item.href));

              return (
                <div key={section.id} className="skyra-sidebar-section">
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    aria-expanded={isSectionOpen}
                    aria-controls={`section-content-${section.id}`}
                    className="skyra-sidebar-section-header"
                    data-has-active-child={hasActiveChild ? 'true' : 'false'}
                  >
                    <span className="skyra-sidebar-section-title nav-group-title" style={{ padding: 0 }}>
                      {section.title}
                    </span>
                    <ChevronDown
                      size={14}
                      className="nav-group-chevron"
                      style={{
                        transform: isSectionOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        opacity: 0.6,
                      }}
                      aria-hidden="true"
                    />
                  </button>

                  <div
                    id={`section-content-${section.id}`}
                    role="region"
                    aria-label={section.title}
                    className="skyra-sidebar-section-content"
                    style={{
                      display: isSectionOpen ? 'flex' : 'none',
                      flexDirection: 'column',
                      gap: '0.125rem',
                      marginTop: '0.125rem',
                    }}
                  >
                    {section.items.map((item) => {
                      const active = isItemActive(item.href);
                      const Icon = item.icon;

                      return (
                        <Link 
                          key={item.href}
                          href={item.href}
                          prefetch={true}
                          title={item.label}
                          className="skyra-sidebar-item"
                          data-active={active ? 'true' : 'false'}
                          onClick={closeMobile}
                        >
                          <span className="skyra-sidebar-item-icon" aria-hidden="true">
                            <Icon size={17} />
                          </span>
                          <span className="skyra-sidebar-item-label">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <style>{`
            .skyra-sidebar-section-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;
              background: none;
              border: none;
              padding: 0.5rem 0.875rem;
              cursor: pointer;
              color: rgba(255, 255, 255, 0.5);
              font-family: inherit;
              text-align: left;
              border-radius: var(--skyra-radius-sm, 4px);
              transition: color 0.15s ease, background 0.15s ease;
            }
            .skyra-sidebar-section-header:hover {
              color: rgba(255, 255, 255, 0.9);
              background: rgba(255, 255, 255, 0.05);
            }
            .skyra-sidebar-section-header:focus-visible {
              outline: 2px solid var(--skyra-focus, #3b82f6);
              outline-offset: -2px;
            }
            .skyra-sidebar-section-header[data-has-active-child="true"] {
              color: rgba(255, 255, 255, 0.75);
            }
            .skyra-sidebar-item {
              display: flex;
              align-items: center;
              gap: 0.75rem;
              padding: 0.6rem 0.875rem;
              border-radius: var(--skyra-radius-md, 6px);
              text-decoration: none;
              font-size: 0.875rem;
              font-weight: 400;
              color: rgba(255, 255, 255, 0.7);
              background: transparent;
              border-left: 3px solid transparent;
              transition: background 0.15s, color 0.15s;
              min-height: 44px;
              cursor: pointer;
            }
            .skyra-sidebar-item:hover {
              background: rgba(255, 255, 255, 0.06);
              color: #ffffff;
            }
            .skyra-sidebar-item:focus-visible {
              outline: 2px solid var(--skyra-focus, #3b82f6);
              outline-offset: -2px;
            }
            .skyra-sidebar-item[data-active="true"] {
              font-weight: 600;
              color: #ffffff;
              background: rgba(255, 255, 255, 0.12);
              border-left-color: var(--skyra-primary, #0A58CA);
            }
            .skyra-sidebar-item-icon {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 20px;
              height: 20px;
              flex-shrink: 0;
            }
            .skyra-sidebar-item-label {
              flex: 1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            skyra-tech-app-shell[collapsed] .nav-group-title { display: none !important; }
            skyra-tech-app-shell[collapsed] .nav-group-chevron { display: none !important; }
            skyra-tech-app-shell[collapsed] .skyra-sidebar-section-header { display: none !important; }
            skyra-tech-app-shell[collapsed] .skyra-sidebar-section-content { display: flex !important; }
            skyra-tech-app-shell[collapsed] .skyra-sidebar-item { justify-content: center !important; padding: 0.6rem 0 !important; }
            skyra-tech-app-shell[collapsed] .skyra-sidebar-item-label { display: none !important; }
            @media (prefers-reduced-motion: reduce) {
              .nav-group-chevron { transition: none !important; }
            }
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
