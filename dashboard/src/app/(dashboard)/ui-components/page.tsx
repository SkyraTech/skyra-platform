'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  ListFilter, CheckSquare, Radio as RadioIcon, ToggleLeft,
  Type, Calendar, FileText, Printer, Download, ChevronRight,
  Loader2, MessageSquare, Layers, MoreHorizontal, MousePointerClick,
  FolderTree, ListCollapse, ChevronsUpDown, Navigation, ListOrdered,
  UploadCloud, FileUp, Inbox, AlertOctagon, Command as CommandIcon,
  Keyboard, QrCode, Table as TableIcon, ExternalLink, Search,
  CheckCircle2, Sparkles, SlidersHorizontal, RefreshCw
} from 'lucide-react';

import '@skyra-tech-platform/button';
import '@skyra-tech-platform/switch';
import '@skyra-tech-platform/tabs';
import '@skyra-tech-platform/accordion';
import '@skyra-tech-platform/collapsible';
import '@skyra-tech-platform/dynamic-select';

export type ShowcaseType = 'interactive' | 'workbench';

export interface ShowcaseItem {
  id: string;
  title: string;
  desc: string;
  icon: any;
  packageId: string;
  type: ShowcaseType;
  typeLabel: string;
  docsHref?: string;
  showcaseHref: string;
}

const CATALOGUE_ITEMS: ShowcaseItem[] = [
  // ─── 1. INTERACTIVE SHOWCASES (Sub-pages in /ui-components) ───
  {
    id: 'select',
    title: 'DynamicSelect',
    desc: 'Unified single/multi select with search, option grouping, select-all, and dynamic +N chips.',
    icon: ListFilter,
    packageId: '@skyra-tech-platform/dynamic-select',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    docsHref: '/components/selection/dynamic-select',
    showcaseHref: '/ui-components/select',
  },
  {
    id: 'inputs',
    title: 'Inputs & Textarea',
    desc: 'Text input variants with validation status colors, search, numbers, passwords, and auto-resizing textareas.',
    icon: Type,
    packageId: '@skyra-tech-platform/input',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    docsHref: '/components/basic-controls/input',
    showcaseHref: '/ui-components/inputs',
  },
  {
    id: 'checkbox',
    title: 'Checkbox & Group',
    desc: 'Accessible multi-state checkboxes with tri-state indeterminate support, descriptions, and 44px touch targets.',
    icon: CheckSquare,
    packageId: '@skyra-tech-platform/checkbox',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    docsHref: '/components/basic-controls/checkbox',
    showcaseHref: '/ui-components/checkbox',
  },
  {
    id: 'radio',
    title: 'Radio & RadioGroup',
    desc: 'WAI-ARIA roving tabindex single-selection controls supporting vertical and horizontal layout orchestration.',
    icon: RadioIcon,
    packageId: '@skyra-tech-platform/radio',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    docsHref: '/components/basic-controls/radio',
    showcaseHref: '/ui-components/radio',
  },
  {
    id: 'loaders',
    title: 'Loading System',
    desc: 'Multi-size branded Spinners, Linear & Circular Progress bars, Skeletons, and declarative DataLoader state.',
    icon: Loader2,
    packageId: '@skyra-tech-platform/loader',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    docsHref: '/packages/loader',
    showcaseHref: '/ui-components/loaders',
  },
  {
    id: 'pagination',
    title: 'Pagination',
    desc: 'Navigation landmark with pure page calculation engine, controlled state, ellipsis placement, and table slicing.',
    icon: ListOrdered,
    packageId: 'dashboard/components/ui',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    showcaseHref: '/ui-components/pagination',
  },
  {
    id: 'breadcrumb',
    title: 'Breadcrumbs',
    desc: 'Semantic hierarchical navigation primitive conforming to WAI-ARIA breadcrumbs with custom separators.',
    icon: Navigation,
    packageId: 'dashboard/components/ui',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    showcaseHref: '/ui-components/breadcrumb',
  },
  {
    id: 'tooltip',
    title: 'Tooltips',
    desc: 'Viewport collision-aware floating tooltips supporting directional placements, status badges, and focus triggers.',
    icon: MessageSquare,
    packageId: 'dashboard/components/ui',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    showcaseHref: '/ui-components/tooltip',
  },
  {
    id: 'file-upload',
    title: 'File Upload',
    desc: 'Managed file selection system with strict type validation, pure size/count checks, and progress visualization.',
    icon: UploadCloud,
    packageId: 'dashboard/components/ui',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    showcaseHref: '/ui-components/file-upload',
  },
  {
    id: 'dropzone',
    title: 'Dropzone',
    desc: 'Accessible drag-and-drop surface with nested element event tracking, browse fallback, and keyboard triggers.',
    icon: FileUp,
    packageId: 'dashboard/components/ui',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    showcaseHref: '/ui-components/dropzone',
  },
  {
    id: 'empty-state',
    title: 'Empty State',
    desc: 'Semantic container for empty datasets, tables, or search misses with clear call-to-actions.',
    icon: Inbox,
    packageId: 'dashboard/components/ui',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    showcaseHref: '/ui-components/empty-state',
  },
  {
    id: 'error-state',
    title: 'Error State',
    desc: 'Content-level failure container with retry recovery callbacks, technical details disclosure, and theme support.',
    icon: AlertOctagon,
    packageId: 'dashboard/components/ui',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    showcaseHref: '/ui-components/error-state',
  },
  {
    id: 'keyboard-shortcuts',
    title: 'Keyboard Shortcuts',
    desc: 'Centralized shortcut orchestrator with deterministic normalization, input-element typing safety, and Kbd display.',
    icon: Keyboard,
    packageId: 'dashboard/components/ui',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    showcaseHref: '/ui-components/keyboard-shortcuts',
  },

  // ─── 2. DEDICATED WORKBENCHES ───
  {
    id: 'qr-studio',
    title: 'QR Code Studio',
    desc: 'Framework-agnostic vector QR generation supporting 9 content types, custom shapes, telemetry, and SVG/PNG export.',
    icon: QrCode,
    packageId: '@skyra-tech-platform/qr',
    type: 'workbench',
    typeLabel: 'Dedicated Workbench',
    docsHref: '/components/utilities/qr',
    showcaseHref: '/qr-code',
  },
  {
    id: 'data-table',
    title: 'Data Table Grid',
    desc: 'Enterprise high-performance data table with sorting, filtering, selection, and built-in pagination.',
    icon: TableIcon,
    packageId: '@skyra-tech-platform/data-table',
    type: 'workbench',
    typeLabel: 'Dedicated Workbench',
    docsHref: '/packages/data-table',
    showcaseHref: '/data-table',
  },
  {
    id: 'pdf-viewer',
    title: 'PDF & Document Viewer',
    desc: 'Zoom, fullscreen, print, page navigation, and accessible document viewing chrome.',
    icon: FileText,
    packageId: '@skyra-tech-platform/pdf-viewer',
    type: 'workbench',
    typeLabel: 'Dedicated Workbench',
    docsHref: '/packages/pdf-viewer',
    showcaseHref: '/pdf-viewer',
  },
  {
    id: 'data-export',
    title: 'Data Export Engine',
    desc: 'RFC-4180 CSV & Excel XML export engines with ExportButton and ExportMenu adapters.',
    icon: Download,
    packageId: '@skyra-tech-platform/data-export',
    type: 'workbench',
    typeLabel: 'Dedicated Workbench',
    docsHref: '/docs/data-export',
    showcaseHref: '/export',
  },

  // ─── 3. COMPONENT SHOWCASES ───
  {
    id: 'tabs',
    title: 'Tabs',
    desc: 'WAI-ARIA tabbed navigation supporting horizontal/vertical layouts, auto/manual activation, and line/pill variants.',
    icon: FolderTree,
    packageId: '@skyra-tech-platform/tabs',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    docsHref: '/components/navigation/tabs',
    showcaseHref: '/ui-components/tabs',
  },
  {
    id: 'accordion',
    title: 'Accordion',
    desc: 'Expandable multi-section container with single/multiple expand modes, collapsible toggling, and smooth transitions.',
    icon: ListCollapse,
    packageId: '@skyra-tech-platform/accordion',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    docsHref: '/components/disclosure/accordion',
    showcaseHref: '/ui-components/accordion',
  },
  {
    id: 'collapsible',
    title: 'Collapsible',
    desc: 'Independent single expandable region primitive for advanced options and developer diagnostics.',
    icon: ChevronsUpDown,
    packageId: '@skyra-tech-platform/collapsible',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    docsHref: '/components/disclosure/collapsible',
    showcaseHref: '/ui-components/collapsible',
  },
  {
    id: 'switch',
    title: 'Switch & Toggles',
    desc: '5 design variants (default, compact, labeled, icon, outline) across 3 sizes with spinner thumb and error states.',
    icon: ToggleLeft,
    packageId: '@skyra-tech-platform/switch',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    docsHref: '/components/basic-controls/switch',
    showcaseHref: '/ui-components/switch',
  },
  {
    id: 'popover',
    title: 'Popover',
    desc: 'Anchored rich content overlay with collision detection, boundary protection, focus restoration, and Escape dismissal.',
    icon: Layers,
    packageId: '@skyra-tech-platform/popover',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    docsHref: '/components/overlays/popover',
    showcaseHref: '/ui-components/popover',
  },
  {
    id: 'dropdown-menu',
    title: 'Dropdown Menu',
    desc: 'Framework-independent action menu with roving keyboard navigation, collision detection, and checkable items.',
    icon: MoreHorizontal,
    packageId: '@skyra-tech-platform/dropdown-menu',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    docsHref: '/components/overlays/dropdown-menu',
    showcaseHref: '/ui-components/dropdown-menu',
  },
  {
    id: 'context-menu',
    title: 'Context Menu',
    desc: 'Framework-independent pointer and keyboard context action menu with virtual collision positioning.',
    icon: MousePointerClick,
    packageId: '@skyra-tech-platform/context-menu',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    docsHref: '/components/overlays/context-menu',
    showcaseHref: '/ui-components/context-menu',
  },
  {
    id: 'command-palette',
    title: 'Command Palette',
    desc: 'Enterprise quick-command overlay with fuzzy keyword search, category grouping, and ARIA combobox semantics.',
    icon: CommandIcon,
    packageId: '@skyra-tech-platform/command-palette',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    docsHref: '/components/overlays/command-palette',
    showcaseHref: '/ui-components/command-palette',
  },
  {
    id: 'date-time',
    title: 'Date & Time Suite',
    desc: 'Date, time, range and calendar controls with live schedule updates.',
    icon: Calendar,
    packageId: '@skyra-tech-platform/date-time',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    docsHref: '/components/forms/date-time',
    showcaseHref: '/ui-components/date-time',
  }
];

export default function UIComponentsPlaygroundPage() {
  const [mounted, setMounted] = useState(false);
  const [filterType, setFilterType] = useState<'all' | ShowcaseType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Live Arena State
  const [activeArenaTab, setActiveArenaTab] = useState<'tabs' | 'accordion' | 'switch' | 'button'>('tabs');
  const [tabsVariant, setTabsVariant] = useState<'line' | 'pill'>('line');
  const [switchChecked, setSwitchChecked] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [accordionMode, setAccordionMode] = useState<'single' | 'multiple'>('single');

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredItems = useMemo(() => {
    return CATALOGUE_ITEMS.filter((item) => {
      const matchesType = filterType === 'all' || item.type === filterType;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query) ||
        item.packageId.toLowerCase().includes(query);
      return matchesType && matchesQuery;
    });
  }, [filterType, searchQuery]);

  return (
    <main id="main-content" className="dash-page qr-playground-root" data-playground-ready={mounted}>
      {/* ─── 1. PAGE HEADER ──────────────────────────────────────────────── */}
      <header className="playground-header">
        <div className="playground-header-title-row">
          <div className="playground-icon-badge">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="playground-title">UI Component Playground</h1>
            <p className="playground-subtitle">
              Interactive testing environment for Skyra Platform components (<code>@skyra-tech-platform/*</code>). Test live behaviors, inspect states, and navigate directly to dedicated workbenches or canonical documentation.
            </p>
          </div>
        </div>
      </header>

      {/* ─── 2. LIVE INTERACTIVE TESTING ARENA ───────────────────────────── */}
      <section id="live-arena" className="arena-card" aria-label="Interactive Component Testing Arena">
        <div className="arena-header">
          <div className="arena-title-group">
            <SlidersHorizontal size={18} className="arena-title-icon" />
            <h2 className="arena-title">Live Component Quick-Tester</h2>
            <span className="arena-badge">Direct Web Component Rendering</span>
          </div>
          <div className="arena-tab-bar" role="tablist" aria-label="Interactive Component Demos">
            {(['tabs', 'accordion', 'switch', 'button'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeArenaTab === tab}
                className={`arena-tab-btn ${activeArenaTab === tab ? 'active' : ''}`}
                onClick={() => setActiveArenaTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="arena-body">
          {!mounted ? (
            <div className="arena-stage" style={{ minHeight: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.875rem' }}>Loading live interactive preview...</span>
            </div>
          ) : (
            <>
              {/* TABS LIVE DEMO */}
              {activeArenaTab === 'tabs' && (
                <div className="arena-stage">
                  <div className="arena-controls">
                    <span className="control-label">Variant:</span>
                    <button
                      type="button"
                      className={`arena-control-pill ${tabsVariant === 'line' ? 'active' : ''}`}
                      onClick={() => setTabsVariant('line')}
                    >
                      Line Variant
                    </button>
                    <button
                      type="button"
                      className={`arena-control-pill ${tabsVariant === 'pill' ? 'active' : ''}`}
                      onClick={() => setTabsVariant('pill')}
                    >
                      Pill Variant
                    </button>
                    <Link href="/components/navigation/tabs" className="arena-docs-link">
                      View Full Docs <ExternalLink size={12} />
                    </Link>
                  </div>

                  <div className="arena-render-box">
                    <skyra-tabs variant={tabsVariant} default-value="overview" suppressHydrationWarning>
                      <skyra-tab slot="tab" value="overview" suppressHydrationWarning>Overview</skyra-tab>
                      <skyra-tab slot="tab" value="analytics" suppressHydrationWarning>Analytics</skyra-tab>
                      <skyra-tab slot="tab" value="reports" suppressHydrationWarning>Audit Reports</skyra-tab>

                      <skyra-tab-panel slot="panel" value="overview" suppressHydrationWarning>
                        <div className="arena-panel-content">
                          <strong>Overview Tab Active:</strong> System status is operational across all 14 node clusters.
                        </div>
                      </skyra-tab-panel>
                      <skyra-tab-panel slot="panel" value="analytics" suppressHydrationWarning>
                        <div className="arena-panel-content">
                          <strong>Analytics Tab Active:</strong> Throughput peaked at 24,500 operations/sec at 16:00 UTC.
                        </div>
                      </skyra-tab-panel>
                      <skyra-tab-panel slot="panel" value="reports" suppressHydrationWarning>
                        <div className="arena-panel-content">
                          <strong>Audit Reports Active:</strong> SOC-2 Type II audit report generated successfully.
                        </div>
                      </skyra-tab-panel>
                    </skyra-tabs>
                  </div>
                </div>
              )}

              {/* ACCORDION LIVE DEMO */}
              {activeArenaTab === 'accordion' && (
                <div className="arena-stage">
                  <div className="arena-controls">
                    <span className="control-label">Mode:</span>
                    <button
                      type="button"
                      className={`arena-control-pill ${accordionMode === 'single' ? 'active' : ''}`}
                      onClick={() => setAccordionMode('single')}
                    >
                      Single Expand
                    </button>
                    <button
                      type="button"
                      className={`arena-control-pill ${accordionMode === 'multiple' ? 'active' : ''}`}
                      onClick={() => setAccordionMode('multiple')}
                    >
                      Multiple Expand
                    </button>
                    <Link href="/components/disclosure/accordion" className="arena-docs-link">
                      View Full Docs <ExternalLink size={12} />
                    </Link>
                  </div>

                  <div className="arena-render-box">
                    <skyra-accordion mode={accordionMode} suppressHydrationWarning>
                      <skyra-accordion-item value="sec-1" open suppressHydrationWarning>
                        <span slot="trigger">Security & Compliance Policies</span>
                        <div slot="content" className="arena-panel-content">
                          End-to-end TLS 1.3 encryption, automatic key rotation every 90 days, and zero unauthenticated endpoints.
                        </div>
                      </skyra-accordion-item>
                      <skyra-accordion-item value="sec-2" suppressHydrationWarning>
                        <span slot="trigger">Database Replicas & Failover</span>
                        <div slot="content" className="arena-panel-content">
                          Cross-region active-passive replication with sub-5-second automated failover orchestrators.
                        </div>
                      </skyra-accordion-item>
                    </skyra-accordion>
                  </div>
                </div>
              )}

              {/* SWITCH LIVE DEMO */}
              {activeArenaTab === 'switch' && (
                <div className="arena-stage">
                  <div className="arena-controls">
                    <span className="control-label">State:</span>
                    <span className="status-indicator">
                      Checked: <strong>{switchChecked ? 'TRUE' : 'FALSE'}</strong>
                    </span>
                    <button
                      type="button"
                      className="arena-control-pill"
                      onClick={() => setSwitchChecked(!switchChecked)}
                    >
                      Toggle Switch
                    </button>
                    <Link href="/components/basic-controls/switch" className="arena-docs-link">
                      View Full Docs <ExternalLink size={12} />
                    </Link>
                  </div>

                  <div className="arena-render-box">
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <skyra-tech-switch
                        label="Two-Factor Authentication"
                        checked={switchChecked}
                        onChange={(e: any) => setSwitchChecked(e.target.checked)}
                        suppressHydrationWarning
                      />
                      <skyra-tech-switch
                        label="Compact Size"
                        size="sm"
                        checked={switchChecked}
                        suppressHydrationWarning
                      />
                      <skyra-tech-switch
                        label="Disabled Switch"
                        disabled
                        checked
                        suppressHydrationWarning
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* BUTTON LIVE DEMO */}
              {activeArenaTab === 'button' && (
                <div className="arena-stage">
                  <div className="arena-controls">
                    <span className="control-label">Interactive Actions:</span>
                    <button
                      type="button"
                      className="arena-control-pill"
                      onClick={() => {
                        setBtnLoading(true);
                        setTimeout(() => setBtnLoading(false), 1500);
                      }}
                    >
                      Simulate Async Click
                    </button>
                    <Link href="/components/basic-controls/button" className="arena-docs-link">
                      View Full Docs <ExternalLink size={12} />
                    </Link>
                  </div>

                  <div className="arena-render-box">
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <skyra-tech-button variant="primary" loading={btnLoading} suppressHydrationWarning>Primary Action</skyra-tech-button>
                      <skyra-tech-button variant="orange" suppressHydrationWarning>Orange Brand</skyra-tech-button>
                      <skyra-tech-button variant="outline" suppressHydrationWarning>Outline Action</skyra-tech-button>
                      <skyra-tech-button variant="ghost" suppressHydrationWarning>Ghost Button</skyra-tech-button>
                      <skyra-tech-button variant="danger" suppressHydrationWarning>Danger Variant</skyra-tech-button>
                      <skyra-tech-button disabled suppressHydrationWarning>Disabled</skyra-tech-button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ─── 3. CATALOGUE FILTER & SEARCH BAR ────────────────────────────── */}
      <section className="catalogue-filter-section" aria-label="Component Filtering">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            id="playground-search-input"
            type="search"
            aria-label="Filter components by name or package"
            placeholder="Filter components (e.g. tabs, input, qr, table)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="playground-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear filter search"
            >
              Clear
            </button>
          )}
        </div>

        <div className="filter-pill-row" role="tablist" aria-label="Filter by component type">
          {[
            { id: 'all', label: `All (${CATALOGUE_ITEMS.length})` },
            { id: 'interactive', label: `Interactive Showcases (${CATALOGUE_ITEMS.filter(i => i.type === 'interactive').length})` },
            { id: 'workbench', label: `Dedicated Workbenches (${CATALOGUE_ITEMS.filter(i => i.type === 'workbench').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={filterType === tab.id}
              className={`filter-pill ${filterType === tab.id ? 'active' : ''}`}
              onClick={() => setFilterType(tab.id as any)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* ─── 4. CATALOGUE COMPONENT GRID ─────────────────────────────────── */}
      <section className="catalogue-grid-section" aria-label="Component Catalogue">
        {filteredItems.length === 0 ? (
          <div className="no-results-card">
            <Inbox size={36} className="no-results-icon" />
            <h3 className="no-results-title">No matching components</h3>
            <p className="no-results-desc">
              No components matched your search query &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              type="button"
              className="reset-search-btn"
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="showcase-grid">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.id} className="showcase-card">
                  {/* Top Bar: Icon + Type Badge */}
                  <div className="card-top-bar">
                    <div className="card-icon-container">
                      <Icon size={18} />
                    </div>
                    <span className={`card-type-badge badge-${item.type}`}>
                      {item.typeLabel}
                    </span>
                  </div>

                  {/* Title & Package */}
                  <div className="card-meta-block">
                    <h3 className="card-title">{item.title}</h3>
                    <code className="card-package-code">{item.packageId}</code>
                  </div>

                  {/* Description */}
                  <p className="card-desc">{item.desc}</p>

                  {/* Actions Bar: Standardized Two-Action Footer */}
                  <div className="card-actions-bar">
                    {item.docsHref ? (
                      <Link
                        href={item.docsHref}
                        className="card-action-btn card-docs-btn"
                        title={`View canonical documentation for ${item.title}`}
                      >
                        <span>Docs</span>
                      </Link>
                    ) : (
                      <span
                        className="card-action-btn card-docs-btn card-action-disabled"
                        aria-disabled="true"
                        title="Canonical documentation currently in development"
                      >
                        <span>Docs</span>
                      </span>
                    )}

                    {(
                      <Link
                        href={item.showcaseHref}
                        className={`card-action-btn card-showcase-btn action-${item.type}`}
                        title={`Open interactive demonstration for ${item.title}`}
                      >
                        <span>Showcase</span>
                        <ChevronRight size={14} aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ─── STYLES: CSS TOKENS, DARK THEME & RESPONSIVE BEHAVIOR ────────── */}
      <style>{`
        .qr-playground-root {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          width: 100%;
          max-width: 1360px;
          margin: 0 auto;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        /* ── PAGE HEADER ── */
        .playground-header {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          border-bottom: 1px solid var(--skyra-border, #e2e8f0);
          padding-bottom: 1.5rem;
        }

        .playground-header-title-row {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .playground-icon-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: var(--skyra-radius-md, 8px);
          background: var(--skyra-primary-light, rgba(10, 88, 202, 0.1));
          color: var(--skyra-primary, #0A58CA);
          flex-shrink: 0;
          margin-top: 0.25rem;
        }

        .playground-title {
          font-family: var(--skyra-font-display, inherit);
          font-weight: 800;
          font-size: 1.85rem;
          color: var(--skyra-text, #0f172a);
          margin: 0 0 0.4rem 0;
          letter-spacing: -0.02em;
        }

        .playground-subtitle {
          color: var(--skyra-text-muted, #475569);
          font-size: 0.95rem;
          line-height: 1.5;
          margin: 0;
          max-width: 820px;
        }

        .playground-subtitle code {
          font-family: monospace;
          background: var(--skyra-bg-muted, rgba(0,0,0,0.05));
          padding: 0.15rem 0.35rem;
          border-radius: 4px;
          font-size: 0.85em;
        }

        /* ── LIVE INTERACTIVE ARENA ── */
        .arena-card {
          background: var(--skyra-surface, #ffffff);
          border: 1px solid var(--skyra-border, #e2e8f0);
          border-radius: var(--skyra-radius-lg, 12px);
          box-shadow: var(--skyra-shadow-sm, 0 1px 3px rgba(0,0,0,0.05));
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .arena-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--skyra-border, #e2e8f0);
          background: var(--skyra-bg, #f8fafc);
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .arena-title-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .arena-title-icon {
          color: var(--skyra-primary, #0A58CA);
        }

        .arena-title {
          font-family: var(--skyra-font-display, inherit);
          font-size: 1rem;
          font-weight: 700;
          color: var(--skyra-text, #0f172a);
          margin: 0;
        }

        .arena-badge {
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.15rem 0.5rem;
          border-radius: 999px;
          background: rgba(16, 185, 129, 0.12);
          color: #064e3b;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .arena-tab-bar {
          display: flex;
          gap: 0.35rem;
          background: var(--skyra-surface, #ffffff);
          padding: 0.25rem;
          border-radius: var(--skyra-radius-md, 8px);
          border: 1px solid var(--skyra-border, #e2e8f0);
        }

        .arena-tab-btn {
          background: transparent;
          border: none;
          padding: 0.35rem 0.75rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--skyra-text-muted, #475569);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .arena-tab-btn:hover {
          color: var(--skyra-text, #0f172a);
        }

        .arena-tab-btn.active {
          background: var(--skyra-primary, #0A58CA);
          color: #ffffff;
        }

        .arena-body {
          padding: 1.25rem;
        }

        .arena-stage {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .arena-controls {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
          padding-bottom: 0.75rem;
          border-bottom: 1px dashed var(--skyra-border, #cbd5e1);
        }

        .control-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--skyra-text-muted, #475569);
        }

        .arena-control-pill {
          background: var(--skyra-bg, #f8fafc);
          border: 1px solid var(--skyra-border, #e2e8f0);
          color: var(--skyra-text, #0f172a);
          padding: 0.3rem 0.65rem;
          border-radius: 6px;
          font-size: 0.775rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .arena-control-pill:hover {
          border-color: var(--skyra-primary, #0A58CA);
          color: var(--skyra-primary, #0A58CA);
        }

        .arena-control-pill.active {
          background: var(--skyra-primary, #0A58CA);
          border-color: var(--skyra-primary, #0A58CA);
          color: #ffffff;
        }

        .status-indicator {
          font-size: 0.8rem;
          color: var(--skyra-text, #0f172a);
          background: var(--skyra-bg, #f8fafc);
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          border: 1px solid var(--skyra-border, #e2e8f0);
        }

        .arena-docs-link {
          margin-left: auto;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.775rem;
          font-weight: 600;
          color: var(--skyra-primary, #0A58CA);
          text-decoration: none;
        }

        .arena-docs-link:hover {
          text-decoration: underline;
        }

        .arena-render-box {
          padding: 1.5rem;
          background: var(--skyra-bg, #f8fafc);
          border: 1px solid var(--skyra-border, #e2e8f0);
          border-radius: var(--skyra-radius-md, 8px);
          min-height: 100px;
        }

        .arena-panel-content {
          padding: 1rem;
          background: var(--skyra-surface, #ffffff);
          border: 1px solid var(--skyra-border, #e2e8f0);
          border-radius: 6px;
          font-size: 0.875rem;
          color: var(--skyra-text, #0f172a);
          margin-top: 0.75rem;
        }

        /* ── FILTER & SEARCH ── */
        .catalogue-filter-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          color: var(--skyra-text-muted, #64748b);
          pointer-events: none;
        }

        .playground-search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border-radius: var(--skyra-radius-md, 8px);
          border: 1px solid var(--skyra-border, #cbd5e1);
          background: var(--skyra-surface, #ffffff);
          color: var(--skyra-text, #0f172a);
          font-size: 0.9rem;
          font-family: inherit;
          box-sizing: border-box;
          transition: border-color 0.15s, box-shadow 0.15s;
        }

        .playground-search-input:focus {
          outline: none;
          border-color: var(--skyra-primary, #0A58CA);
          box-shadow: 0 0 0 3px rgba(10, 88, 202, 0.15);
        }

        .clear-search-btn {
          position: absolute;
          right: 0.75rem;
          background: transparent;
          border: none;
          color: var(--skyra-text-muted, #64748b);
          font-size: 0.8rem;
          cursor: pointer;
          font-weight: 500;
        }

        .filter-pill-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .filter-pill {
          display: inline-flex;
          align-items: center;
          padding: 0.45rem 0.85rem;
          border-radius: 999px;
          border: 1px solid var(--skyra-border, #e2e8f0);
          background: var(--skyra-surface, #ffffff);
          color: var(--skyra-text-muted, #475569);
          font-size: 0.825rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .filter-pill:hover {
          border-color: var(--skyra-primary, #0A58CA);
          color: var(--skyra-primary, #0A58CA);
        }

        .filter-pill.active {
          background: var(--skyra-primary, #0A58CA);
          border-color: var(--skyra-primary, #0A58CA);
          color: #ffffff;
        }

        /* ── SHOWCASE GRID ── */
        .showcase-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.25rem;
          width: 100%;
          box-sizing: border-box;
        }

        .showcase-card {
          display: flex;
          flex-direction: column;
          padding: 1.25rem;
          background: var(--skyra-surface, #ffffff);
          border: 1px solid var(--skyra-border, #e2e8f0);
          border-radius: var(--skyra-radius-lg, 12px);
          box-shadow: var(--skyra-shadow-sm, 0 1px 3px rgba(0,0,0,0.04));
          transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
          box-sizing: border-box;
        }

        .showcase-card:hover {
          transform: translateY(-2px);
          border-color: var(--skyra-primary, #0A58CA);
          box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
        }

        .card-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .card-icon-container {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: var(--skyra-radius-md, 8px);
          background: var(--skyra-primary-light, rgba(10, 88, 202, 0.1));
          color: var(--skyra-primary, #0A58CA);
        }

        .card-type-badge {
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.15rem 0.55rem;
          border-radius: 999px;
          white-space: nowrap;
        }

        .badge-interactive {
          background: rgba(16, 185, 129, 0.12);
          color: #064e3b;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .badge-workbench {
          background: rgba(10, 88, 202, 0.12);
          color: #0A58CA;
          border: 1px solid rgba(10, 88, 202, 0.3);
        }

        .badge-documentation {
          background: rgba(100, 116, 139, 0.12);
          color: #334155;
          border: 1px solid rgba(100, 116, 139, 0.3);
        }

        .card-meta-block {
          margin-bottom: 0.5rem;
        }

        .card-title {
          font-family: var(--skyra-font-display, inherit);
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--skyra-text, #0f172a);
          margin: 0 0 0.25rem 0;
        }

        .card-package-code {
          font-family: monospace;
          font-size: 0.725rem;
          color: var(--skyra-text-muted, #64748b);
          background: var(--skyra-bg, #f8fafc);
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
          border: 1px solid var(--skyra-border, #e2e8f0);
        }

        .card-desc {
          font-size: 0.85rem;
          line-height: 1.45;
          color: var(--skyra-text-muted, #475569);
          margin: 0 0 1.25rem 0;
          flex: 1;
        }

        /* ── STANDARDIZED CARD ACTIONS BAR ── */
        .card-actions-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.85rem;
          border-top: 1px solid var(--skyra-border, #f1f5f9);
          margin-top: auto;
          gap: 0.5rem;
        }

        .card-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.825rem;
          font-weight: 600;
          text-decoration: none;
          padding: 0.35rem 0.65rem;
          border-radius: var(--skyra-radius-md, 6px);
          transition: all 0.15s ease;
          white-space: nowrap;
          min-height: 32px;
          box-sizing: border-box;
        }

        /* Docs (Left) */
        .card-docs-btn {
          color: var(--skyra-text-muted, #475569);
          background: transparent;
          border: 1px solid transparent;
        }

        .card-docs-btn:not(.card-action-disabled):hover {
          color: var(--skyra-primary, #0A58CA);
          background: var(--skyra-bg-muted, rgba(10, 88, 202, 0.08));
          border-color: var(--skyra-primary-light, rgba(10, 88, 202, 0.2));
        }

        /* Showcase (Right) */
        .card-showcase-btn {
          color: var(--skyra-primary, #0A58CA);
          background: var(--skyra-bg-muted, rgba(10, 88, 202, 0.06));
          border: 1px solid rgba(10, 88, 202, 0.2);
        }

        .card-showcase-btn:not(.card-action-disabled):hover {
          background: var(--skyra-primary, #0A58CA);
          color: #ffffff;
          border-color: var(--skyra-primary, #0A58CA);
          gap: 0.55rem;
        }

        .action-workbench {
          color: #0284c7;
          background: rgba(2, 132, 199, 0.06);
          border-color: rgba(2, 132, 199, 0.2);
        }

        .action-workbench:not(.card-action-disabled):hover {
          background: #0284c7;
          color: #ffffff;
          border-color: #0284c7;
        }

        .action-documentation {
          color: #475569;
          background: rgba(71, 85, 105, 0.06);
          border-color: rgba(71, 85, 105, 0.2);
        }

        .action-documentation:not(.card-action-disabled):hover {
          background: #475569;
          color: #ffffff;
          border-color: #475569;
        }

        /* Disabled Action State */
        .card-action-disabled {
          opacity: 0.45;
          cursor: not-allowed;
          color: var(--skyra-text-subtle, #94a3b8) !important;
          background: transparent !important;
          border-color: transparent !important;
        }

        /* ── NO RESULTS STATE ── */
        .no-results-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
          text-align: center;
          background: var(--skyra-surface, #ffffff);
          border: 1px dashed var(--skyra-border, #cbd5e1);
          border-radius: var(--skyra-radius-lg, 12px);
        }

        .no-results-icon {
          color: var(--skyra-text-muted, #94a3b8);
          margin-bottom: 0.75rem;
        }

        .no-results-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--skyra-text, #0f172a);
          margin: 0 0 0.35rem 0;
        }

        .no-results-desc {
          font-size: 0.875rem;
          color: var(--skyra-text-muted, #64748b);
          margin: 0 0 1rem 0;
        }

        .reset-search-btn {
          background: var(--skyra-primary, #0A58CA);
          color: #ffffff;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: var(--skyra-radius-md, 8px);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }

        /* ── DARK THEME OVERRIDES ── */
        .dark .playground-icon-badge {
          background: rgba(59, 130, 246, 0.2);
          color: #93c5fd;
        }

        .dark .arena-badge {
          background: rgba(16, 185, 129, 0.2);
          color: #6ee7b7;
          border-color: rgba(16, 185, 129, 0.4);
        }

        .dark .badge-interactive {
          background: rgba(16, 185, 129, 0.2);
          color: #6ee7b7;
          border-color: rgba(16, 185, 129, 0.4);
        }

        .dark .badge-workbench {
          background: rgba(59, 130, 246, 0.2);
          color: #93c5fd;
          border-color: rgba(59, 130, 246, 0.4);
        }

        .dark .badge-documentation {
          background: rgba(148, 163, 184, 0.16);
          color: #cbd5e1;
          border-color: rgba(148, 163, 184, 0.3);
        }

        .dark .card-icon-container {
          background: rgba(59, 130, 246, 0.2);
          color: #93c5fd;
        }

        .dark .card-package-code {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
          color: #cbd5e1;
        }

        .dark .card-actions-bar {
          border-top-color: var(--skyra-border, #334155);
        }

        .dark .card-docs-btn {
          color: #94a3b8;
        }

        .dark .card-docs-btn:not(.card-action-disabled):hover {
          color: #60a5fa;
          background: rgba(96, 165, 250, 0.12);
          border-color: rgba(96, 165, 250, 0.3);
        }

        .dark .card-showcase-btn {
          color: #60a5fa;
          background: rgba(96, 165, 250, 0.1);
          border-color: rgba(96, 165, 250, 0.25);
        }

        .dark .card-showcase-btn:not(.card-action-disabled):hover {
          background: #2563eb;
          color: #ffffff;
          border-color: #2563eb;
        }

        .dark .action-workbench {
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.1);
          border-color: rgba(56, 189, 248, 0.25);
        }

        .dark .action-workbench:not(.card-action-disabled):hover {
          background: #0284c7;
          color: #ffffff;
          border-color: #0284c7;
        }

        .dark .action-documentation {
          color: #cbd5e1;
          background: rgba(203, 213, 225, 0.08);
          border-color: rgba(203, 213, 225, 0.2);
        }

        .dark .action-documentation:not(.card-action-disabled):hover {
          background: #64748b;
          color: #ffffff;
          border-color: #64748b;
        }

        .dark .card-action-disabled {
          color: #64748b !important;
        }

        .dark .arena-tab-bar {
          background: rgba(255, 255, 255, 0.05);
        }

        .dark .arena-header {
          background: rgba(255, 255, 255, 0.02);
        }

        .dark .arena-render-box {
          background: rgba(255, 255, 255, 0.02);
        }

        .dark .arena-panel-content {
          background: rgba(255, 255, 255, 0.04);
        }

        /* ── RESPONSIVE COMPACT RULES ── */
        @media (max-width: 640px) {
          .showcase-grid {
            grid-template-columns: 1fr;
          }
          .playground-header-title-row {
            flex-direction: column;
            gap: 0.75rem;
          }
          .playground-title {
            font-size: 1.5rem;
          }
          .arena-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 380px) {
          .showcase-card {
            padding: 1rem 0.85rem;
          }
          .arena-tab-bar {
            width: 100%;
            overflow-x: auto;
          }
        }
      `}</style>
    </main>
  );
}
