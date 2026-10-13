'use client';

import React, { useState, useMemo } from 'react';
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

export type ShowcaseType = 'interactive' | 'workbench' | 'documentation';

export interface ShowcaseItem {
  id: string;
  title: string;
  desc: string;
  icon: any;
  packageId: string;
  type: ShowcaseType;
  typeLabel: string;
  targetHref: string;
  docsHref?: string;
  actionLabel: string;
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
    targetHref: '/ui-components/select',
    docsHref: '/components/selection/dynamic-select',
    actionLabel: 'Open Showcase'
  },
  {
    id: 'inputs',
    title: 'Inputs & Textarea',
    desc: 'Text input variants with validation status colors, search, numbers, passwords, and auto-resizing textareas.',
    icon: Type,
    packageId: '@skyra-tech-platform/input',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    targetHref: '/ui-components/inputs',
    docsHref: '/components/basic-controls/input',
    actionLabel: 'Open Showcase'
  },
  {
    id: 'checkbox',
    title: 'Checkbox & Group',
    desc: 'Accessible multi-state checkboxes with tri-state indeterminate support, descriptions, and 44px touch targets.',
    icon: CheckSquare,
    packageId: '@skyra-tech-platform/checkbox',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    targetHref: '/ui-components/checkbox',
    docsHref: '/components/basic-controls/checkbox',
    actionLabel: 'Open Showcase'
  },
  {
    id: 'radio',
    title: 'Radio & RadioGroup',
    desc: 'WAI-ARIA roving tabindex single-selection controls supporting vertical and horizontal layout orchestration.',
    icon: RadioIcon,
    packageId: '@skyra-tech-platform/radio',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    targetHref: '/ui-components/radio',
    docsHref: '/components/basic-controls/radio',
    actionLabel: 'Open Showcase'
  },
  {
    id: 'loaders',
    title: 'Loading System',
    desc: 'Multi-size branded Spinners, Linear & Circular Progress bars, Skeletons, and declarative DataLoader state.',
    icon: Loader2,
    packageId: '@skyra-tech-platform/loader',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    targetHref: '/ui-components/loaders',
    actionLabel: 'Open Showcase'
  },
  {
    id: 'pagination',
    title: 'Pagination',
    desc: 'Navigation landmark with pure page calculation engine, controlled state, ellipsis placement, and table slicing.',
    icon: ListOrdered,
    packageId: 'dashboard/components/ui',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    targetHref: '/ui-components/pagination',
    actionLabel: 'Open Showcase'
  },
  {
    id: 'breadcrumb',
    title: 'Breadcrumbs',
    desc: 'Semantic hierarchical navigation primitive conforming to WAI-ARIA breadcrumbs with custom separators.',
    icon: Navigation,
    packageId: 'dashboard/components/ui',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    targetHref: '/ui-components/breadcrumb',
    actionLabel: 'Open Showcase'
  },
  {
    id: 'tooltip',
    title: 'Tooltips',
    desc: 'Viewport collision-aware floating tooltips supporting directional placements, status badges, and focus triggers.',
    icon: MessageSquare,
    packageId: 'dashboard/components/ui',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    targetHref: '/ui-components/tooltip',
    actionLabel: 'Open Showcase'
  },
  {
    id: 'file-upload',
    title: 'File Upload',
    desc: 'Managed file selection system with strict type validation, pure size/count checks, and progress visualization.',
    icon: UploadCloud,
    packageId: 'dashboard/components/ui',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    targetHref: '/ui-components/file-upload',
    actionLabel: 'Open Showcase'
  },
  {
    id: 'dropzone',
    title: 'Dropzone',
    desc: 'Accessible drag-and-drop surface with nested element event tracking, browse fallback, and keyboard triggers.',
    icon: FileUp,
    packageId: 'dashboard/components/ui',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    targetHref: '/ui-components/dropzone',
    actionLabel: 'Open Showcase'
  },
  {
    id: 'empty-state',
    title: 'Empty State',
    desc: 'Semantic container for empty datasets, tables, or search misses with clear call-to-actions.',
    icon: Inbox,
    packageId: 'dashboard/components/ui',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    targetHref: '/ui-components/empty-state',
    actionLabel: 'Open Showcase'
  },
  {
    id: 'error-state',
    title: 'Error State',
    desc: 'Content-level failure container with retry recovery callbacks, technical details disclosure, and theme support.',
    icon: AlertOctagon,
    packageId: 'dashboard/components/ui',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    targetHref: '/ui-components/error-state',
    actionLabel: 'Open Showcase'
  },
  {
    id: 'keyboard-shortcuts',
    title: 'Keyboard Shortcuts',
    desc: 'Centralized shortcut orchestrator with deterministic normalization, input-element typing safety, and Kbd display.',
    icon: Keyboard,
    packageId: 'dashboard/components/ui',
    type: 'interactive',
    typeLabel: 'Interactive Showcase',
    targetHref: '/ui-components/keyboard-shortcuts',
    actionLabel: 'Open Showcase'
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
    targetHref: '/qr-code',
    docsHref: '/components/utilities/qr',
    actionLabel: 'Open Workbench'
  },
  {
    id: 'data-table',
    title: 'Data Table Grid',
    desc: 'Enterprise high-performance data table with sorting, filtering, selection, and built-in pagination.',
    icon: TableIcon,
    packageId: '@skyra-tech-platform/data-table',
    type: 'workbench',
    typeLabel: 'Dedicated Workbench',
    targetHref: '/data-table',
    docsHref: '/packages/data-table',
    actionLabel: 'Open Workbench'
  },
  {
    id: 'pdf-viewer',
    title: 'PDF & Document Viewer',
    desc: 'Zoom, fullscreen, print, page navigation, and accessible document viewing chrome.',
    icon: FileText,
    packageId: '@skyra-tech-platform/pdf-viewer',
    type: 'workbench',
    typeLabel: 'Dedicated Workbench',
    targetHref: '/pdf-viewer',
    actionLabel: 'Open Workbench'
  },
  {
    id: 'print-studio',
    title: 'Print Studio',
    desc: 'Target container printing with isolated print media sheets, lifecycle hooks, and document export.',
    icon: Printer,
    packageId: 'dashboard/workbench',
    type: 'workbench',
    typeLabel: 'Dedicated Workbench',
    targetHref: '/print',
    actionLabel: 'Open Workbench'
  },
  {
    id: 'data-export',
    title: 'Data Export Engine',
    desc: 'RFC-4180 CSV & Excel XML export engines with ExportButton and ExportMenu adapters.',
    icon: Download,
    packageId: '@skyra-tech-platform/data-export',
    type: 'workbench',
    typeLabel: 'Dedicated Workbench',
    targetHref: '/export',
    docsHref: '/docs/data-export',
    actionLabel: 'Open Workbench'
  },

  // ─── 3. CANONICAL DOCUMENTATION REFERENCES ───
  {
    id: 'tabs',
    title: 'Tabs',
    desc: 'WAI-ARIA tabbed navigation supporting horizontal/vertical layouts, auto/manual activation, and line/pill variants.',
    icon: FolderTree,
    packageId: '@skyra-tech-platform/tabs',
    type: 'documentation',
    typeLabel: 'Documentation Reference',
    targetHref: '/components/navigation/tabs',
    actionLabel: 'View Documentation'
  },
  {
    id: 'accordion',
    title: 'Accordion',
    desc: 'Expandable multi-section container with single/multiple expand modes, collapsible toggling, and smooth transitions.',
    icon: ListCollapse,
    packageId: '@skyra-tech-platform/accordion',
    type: 'documentation',
    typeLabel: 'Documentation Reference',
    targetHref: '/components/disclosure/accordion',
    actionLabel: 'View Documentation'
  },
  {
    id: 'collapsible',
    title: 'Collapsible',
    desc: 'Independent single expandable region primitive for advanced options and developer diagnostics.',
    icon: ChevronsUpDown,
    packageId: '@skyra-tech-platform/collapsible',
    type: 'documentation',
    typeLabel: 'Documentation Reference',
    targetHref: '/components/disclosure/collapsible',
    actionLabel: 'View Documentation'
  },
  {
    id: 'switch',
    title: 'Switch & Toggles',
    desc: '5 design variants (default, compact, labeled, icon, outline) across 3 sizes with spinner thumb and error states.',
    icon: ToggleLeft,
    packageId: '@skyra-tech-platform/switch',
    type: 'documentation',
    typeLabel: 'Documentation Reference',
    targetHref: '/components/basic-controls/switch',
    actionLabel: 'View Documentation'
  },
  {
    id: 'popover',
    title: 'Popover',
    desc: 'Anchored rich content overlay with collision detection, boundary protection, focus restoration, and Escape dismissal.',
    icon: Layers,
    packageId: '@skyra-tech-platform/popover',
    type: 'documentation',
    typeLabel: 'Documentation Reference',
    targetHref: '/components/overlays/popover',
    actionLabel: 'View Documentation'
  },
  {
    id: 'dropdown-menu',
    title: 'Dropdown Menu',
    desc: 'Framework-independent action menu with roving keyboard navigation, collision detection, and checkable items.',
    icon: MoreHorizontal,
    packageId: '@skyra-tech-platform/dropdown-menu',
    type: 'documentation',
    typeLabel: 'Documentation Reference',
    targetHref: '/components/overlays/dropdown-menu',
    actionLabel: 'View Documentation'
  },
  {
    id: 'context-menu',
    title: 'Context Menu',
    desc: 'Framework-independent pointer and keyboard context action menu with virtual collision positioning.',
    icon: MousePointerClick,
    packageId: '@skyra-tech-platform/context-menu',
    type: 'documentation',
    typeLabel: 'Documentation Reference',
    targetHref: '/components/overlays/context-menu',
    actionLabel: 'View Documentation'
  },
  {
    id: 'command-palette',
    title: 'Command Palette',
    desc: 'Enterprise quick-command overlay with fuzzy keyword search, category grouping, and ARIA combobox semantics.',
    icon: CommandIcon,
    packageId: '@skyra-tech-platform/command-palette',
    type: 'documentation',
    typeLabel: 'Documentation Reference',
    targetHref: '/components/overlays/command-palette',
    actionLabel: 'View Documentation'
  },
  {
    id: 'date-time',
    title: 'Date & Time Suite',
    desc: '10-component suite: DateField, DateRangeField, TimeField, TimeRangeField, DateTimeField, and Calendar.',
    icon: Calendar,
    packageId: '@skyra-tech-platform/date-time',
    type: 'documentation',
    typeLabel: 'Documentation Reference',
    targetHref: '/components/forms/date-time',
    actionLabel: 'View Documentation'
  }
];

export default function UIComponentsPlaygroundPage() {
  const [filterType, setFilterType] = useState<'all' | ShowcaseType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Live Arena State
  const [activeArenaTab, setActiveArenaTab] = useState<'tabs' | 'accordion' | 'switch' | 'button'>('tabs');
  const [tabsVariant, setTabsVariant] = useState<'line' | 'pill'>('line');
  const [switchChecked, setSwitchChecked] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [accordionMode, setAccordionMode] = useState<'single' | 'multiple'>('single');

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
    <main id="main-content" className="dash-page qr-playground-root">
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
      <section className="arena-card" aria-label="Interactive Component Testing Arena">
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
                <skyra-tabs variant={tabsVariant} default-value="overview">
                  <skyra-tab slot="tab" value="overview">Overview</skyra-tab>
                  <skyra-tab slot="tab" value="analytics">Analytics</skyra-tab>
                  <skyra-tab slot="tab" value="reports">Audit Reports</skyra-tab>

                  <skyra-tab-panel slot="panel" value="overview">
                    <div className="arena-panel-content">
                      <strong>Overview Tab Active:</strong> System status is operational across all 14 node clusters.
                    </div>
                  </skyra-tab-panel>
                  <skyra-tab-panel slot="panel" value="analytics">
                    <div className="arena-panel-content">
                      <strong>Analytics Tab Active:</strong> Throughput peaked at 24,500 operations/sec at 16:00 UTC.
                    </div>
                  </skyra-tab-panel>
                  <skyra-tab-panel slot="panel" value="reports">
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
                <skyra-accordion mode={accordionMode}>
                  <skyra-accordion-item value="sec-1" open>
                    <span slot="trigger">Security & Compliance Policies</span>
                    <div slot="content" className="arena-panel-content">
                      End-to-end TLS 1.3 encryption, automatic key rotation every 90 days, and zero unauthenticated endpoints.
                    </div>
                  </skyra-accordion-item>
                  <skyra-accordion-item value="sec-2">
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
                  />
                  <skyra-tech-switch
                    label="Compact Size"
                    size="sm"
                    checked={switchChecked}
                  />
                  <skyra-tech-switch
                    label="Disabled Switch"
                    disabled
                    checked
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
                  <skyra-tech-button variant="primary" loading={btnLoading}>Primary Action</skyra-tech-button>
                  <skyra-tech-button variant="orange">Orange Brand</skyra-tech-button>
                  <skyra-tech-button variant="outline">Outline Action</skyra-tech-button>
                  <skyra-tech-button variant="ghost">Ghost Button</skyra-tech-button>
                  <skyra-tech-button variant="danger">Danger Variant</skyra-tech-button>
                  <skyra-tech-button disabled>Disabled</skyra-tech-button>
                </div>
              </div>
            </div>
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
            { id: 'documentation', label: `Documentation (${CATALOGUE_ITEMS.filter(i => i.type === 'documentation').length})` },
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

                  {/* Actions Bar */}
                  <div className="card-actions-bar">
                    <Link href={item.targetHref} className={`card-action-btn action-${item.type}`}>
                      <span>{item.actionLabel}</span>
                      <ChevronRight size={14} />
                    </Link>

                    {item.docsHref && (
                      <Link href={item.docsHref} className="card-docs-secondary" title="View canonical documentation">
                        Docs <ExternalLink size={12} />
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

        .card-actions-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px solid var(--skyra-border, #f1f5f9);
          margin-top: auto;
        }

        .card-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.825rem;
          font-weight: 600;
          text-decoration: none;
          color: var(--skyra-primary, #0A58CA);
          transition: gap 0.15s ease;
        }

        .card-action-btn:hover {
          gap: 0.55rem;
        }

        .action-workbench {
          color: #0284c7;
        }

        .action-documentation {
          color: #475569;
        }

        .card-docs-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--skyra-text-muted, #64748b);
          text-decoration: none;
        }

        .card-docs-secondary:hover {
          color: var(--skyra-primary, #0A58CA);
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

        .dark .action-documentation {
          color: #94a3b8;
        }

        .dark .action-workbench {
          color: #38bdf8;
        }

        .dark .card-action-btn {
          color: #60a5fa;
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
