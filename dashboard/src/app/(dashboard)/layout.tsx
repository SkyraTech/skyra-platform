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

interface NavSubgroup {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  items: NavItem[];
}

interface NavSection {
  id: string;
  title: string;
  collapsible?: boolean;
  items: (NavItem | NavSubgroup)[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    id: 'platform',
    title: 'Platform',
    collapsible: false,
    items: [
      { href: '/overview',      label: 'Overview',             icon: LayoutDashboard },
      { href: '/packages',      label: 'Packages',             icon: Package },
      { href: '/releases',      label: 'Releases & Changelog', icon: History },
    ]
  },
  {
    id: 'documentation',
    title: 'Documentation',
    collapsible: false,
    items: [
      { href: '/components',         label: 'Components',    icon: Layers },
      { href: '/design-system',      label: 'Design System', icon: Palette },
      {
        id: 'foundation-utils',
        label: 'Foundation & Utilities',
        icon: BookOpen,
        items: [
          { href: '/docs/design-tokens', label: 'Design Tokens', icon: FileCode2 },
          { href: '/docs/utils',         label: 'Utilities',     icon: WrapText },
          { href: '/docs/validation',    label: 'Validation',    icon: FileText },
          { href: '/docs/data-export',   label: 'Data Export',   icon: Download },
        ]
      }
    ]
  },
  {
    id: 'tools-playgrounds',
    title: 'Tools & Playgrounds',
    collapsible: true,
    items: [
      { href: '/ui-components', label: 'UI Playground',         icon: Component },
      { href: '/data-table',    label: 'Data Table',            icon: Table2 },
      { href: '/pdf-viewer',    label: 'PDF & Documents',       icon: FileText },
      { href: '/print',         label: 'Print Studio',          icon: Printer },
      { href: '/qr-code',       label: 'QR Code',               icon: QrCode },
      { href: '/export',        label: 'Data Export Workbench', icon: Download },
    ]
  },
  {
    id: 'quality-accessibility',
    title: 'Quality & Accessibility',
    collapsible: true,
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

  // Track expanded state of collapsible sections and subgroups
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'tools-playgrounds': false,
    'quality-accessibility': false,
  });

  const [openSubgroups, setOpenSubgroups] = useState<Record<string, boolean>>({
    'foundation-utils': false,
  });

  // Auto-expand any section or subgroup when visiting one of its child routes
  useEffect(() => {
    // Check foundation-utils
    const isFoundationActive = [
      '/docs/design-tokens',
      '/docs/utils',
      '/docs/validation',
      '/docs/data-export',
    ].some(h => pathname === h || pathname.startsWith(h + '/'));
    if (isFoundationActive) {
      setOpenSubgroups(prev => ({ ...prev, 'foundation-utils': true }));
    }

    // Check tools-playgrounds
    const isToolsActive = [
      '/ui-components',
      '/data-table',
      '/pdf-viewer',
      '/print',
      '/qr-code',
      '/export',
    ].some(h => pathname === h || pathname.startsWith(h + '/'));
    if (isToolsActive) {
      setOpenSections(prev => ({ ...prev, 'tools-playgrounds': true }));
    }

    // Check quality-accessibility
    const isQualityActive = [
      '/accessibility',
      '/responsive',
    ].some(h => pathname === h || pathname.startsWith(h + '/'));
    if (isQualityActive) {
      setOpenSections(prev => ({ ...prev, 'quality-accessibility': true }));
    }
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

  const toggleSubgroup = (id: string) => {
    setOpenSubgroups(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <skyra-tech-app-shell ref={shellRef}>
      
      {/* Sidebar Slot */}
      <div slot="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
        <DashboardSidebarHeader />

        <div className="skyra-sidebar-navigation" style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.5rem 0' }}>
            {NAV_SECTIONS.map((section) => {
              const isCollapsible = !!section.collapsible;
              const isSectionOpen = isCollapsible ? !!openSections[section.id] : true;

              return (
                <div key={section.id} className="skyra-sidebar-section">
                  {isCollapsible ? (
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      aria-expanded={isSectionOpen}
                      aria-controls={`section-content-${section.id}`}
                      className="skyra-sidebar-section-header"
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
                  ) : (
                    <div className="skyra-sidebar-section-title nav-group-title">
                      {section.title}
                    </div>
                  )}

                  <div
                    id={`section-content-${section.id}`}
                    role={isCollapsible ? 'region' : undefined}
                    aria-label={isCollapsible ? section.title : undefined}
                    className={`skyra-sidebar-section-content ${isCollapsible ? 'skyra-sidebar-collapsible-content' : ''}`}
                    style={{
                      display: isSectionOpen ? 'flex' : 'none',
                      flexDirection: 'column',
                      gap: '0.125rem',
                    }}
                  >
                    {section.items.map((entry) => {
                      // Check if entry is a subgroup
                      if ('items' in entry) {
                        const subgroup = entry as NavSubgroup;
                        const isSubgroupOpen = !!openSubgroups[subgroup.id];
                        const isChildActive = subgroup.items.some(
                          child => pathname === child.href || pathname.startsWith(child.href + '/')
                        );

                        return (
                          <div key={subgroup.id} className="skyra-sidebar-subgroup-container" style={{ display: 'flex', flexDirection: 'column' }}>
                            <button
                              type="button"
                              onClick={() => toggleSubgroup(subgroup.id)}
                              aria-expanded={isSubgroupOpen}
                              aria-controls={`subgroup-content-${subgroup.id}`}
                              className="skyra-sidebar-subgroup-trigger"
                              data-active-child={isChildActive ? 'true' : 'false'}
                              title={subgroup.label}
                            >
                              <span className="skyra-sidebar-item-icon" aria-hidden="true">
                                <subgroup.icon size={17} />
                              </span>
                              <span className="skyra-sidebar-item-label" style={{ flex: 1 }}>
                                {subgroup.label}
                              </span>
                              <ChevronDown
                                size={14}
                                className="nav-group-chevron"
                                style={{
                                  transform: isSubgroupOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                                  transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                  opacity: 0.6,
                                }}
                                aria-hidden="true"
                              />
                            </button>

                            <div
                              id={`subgroup-content-${subgroup.id}`}
                              role="region"
                              aria-label={subgroup.label}
                              className="skyra-sidebar-subgroup-content"
                              style={{
                                display: isSubgroupOpen ? 'flex' : 'none',
                                flexDirection: 'column',
                                gap: '0.125rem',
                                marginLeft: '1.25rem',
                                paddingLeft: '0.75rem',
                                borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                                marginTop: '0.125rem',
                                marginBottom: '0.25rem',
                              }}
                            >
                              {subgroup.items.map((child) => {
                                const active = pathname === child.href || pathname.startsWith(child.href + '/');
                                return (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    prefetch={true}
                                    title={child.label}
                                    className="skyra-sidebar-item skyra-sidebar-subitem"
                                    data-active={active}
                                    onClick={closeMobile}
                                  >
                                    <span className="skyra-sidebar-item-icon" aria-hidden="true">
                                      <child.icon size={15} />
                                    </span>
                                    <span className="skyra-sidebar-item-label">{child.label}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      // Regular NavItem
                      const item = entry as NavItem;
                      const active = pathname === item.href || pathname.startsWith(item.href + '/');
                      const Icon = item.icon;

                      return (
                        <Link 
                          key={item.href}
                          href={item.href}
                          prefetch={true}
                          title={item.label}
                          className="skyra-sidebar-item"
                          data-active={active}
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
              color: rgba(255, 255, 255, 0.45);
              font-family: inherit;
              text-align: left;
              border-radius: var(--skyra-radius-sm, 4px);
              transition: color 0.15s ease, background 0.15s ease;
            }
            .skyra-sidebar-section-header:hover {
              color: rgba(255, 255, 255, 0.85);
              background: rgba(255, 255, 255, 0.04);
            }
            .skyra-sidebar-section-header:focus-visible {
              outline: 2px solid var(--skyra-focus, #3b82f6);
              outline-offset: -2px;
            }
            .skyra-sidebar-subgroup-trigger {
              width: 100%;
              background: transparent;
              border: none;
              border-left: 3px solid transparent;
              display: flex;
              align-items: center;
              gap: 0.75rem;
              padding: 0.6rem 0.875rem;
              border-radius: var(--skyra-radius-md, 6px);
              color: rgba(255, 255, 255, 0.7);
              font-family: inherit;
              font-size: 0.875rem;
              font-weight: 500;
              cursor: pointer;
              text-align: left;
              min-height: 42px;
              transition: background 0.15s ease, color 0.15s ease;
            }
            .skyra-sidebar-subgroup-trigger:hover {
              background: rgba(255, 255, 255, 0.05);
              color: rgba(255, 255, 255, 0.95);
            }
            .skyra-sidebar-subgroup-trigger:focus-visible {
              outline: 2px solid var(--skyra-focus, #3b82f6);
              outline-offset: -2px;
            }
            .skyra-sidebar-subgroup-trigger[data-active-child="true"] {
              color: #ffffff;
              font-weight: 600;
            }
            .skyra-sidebar-subitem {
              font-size: 0.8125rem !important;
              min-height: 38px !important;
              padding: 0.45rem 0.75rem !important;
            }
            skyra-tech-app-shell[collapsed] .nav-group-title { display: none !important; }
            skyra-tech-app-shell[collapsed] .nav-group-chevron { display: none !important; }
            skyra-tech-app-shell[collapsed] .skyra-sidebar-section-header { display: none !important; }
            skyra-tech-app-shell[collapsed] .skyra-sidebar-collapsible-content { display: flex !important; }
            skyra-tech-app-shell[collapsed] .skyra-sidebar-subgroup-trigger .skyra-sidebar-item-label { display: none !important; }
            skyra-tech-app-shell[collapsed] .skyra-sidebar-subgroup-trigger { justify-content: center !important; padding: 0.6rem 0 !important; }
            skyra-tech-app-shell[collapsed] .skyra-sidebar-subgroup-content { 
              display: flex !important;
              margin-left: 0 !important; 
              padding-left: 0 !important; 
              border-left: none !important; 
            }
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
