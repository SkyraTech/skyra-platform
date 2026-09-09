import React from 'react';
import { ButtonDemo } from '@/components/demos/ButtonDemo';
import { InputDemo } from '@/components/demos/InputDemo';
import { SelectDemo } from '@/components/demos/SelectDemo';
import { BadgeDemo } from '@/components/demos/BadgeDemo';
import { MiscDemo } from '@/components/demos/MiscDemo';

import Link from 'next/link';
import {
  ListFilter, CheckSquare, Radio as RadioIcon, ToggleLeft,
  Type, Calendar, FileText, Printer, Download, ChevronRight,
  Loader2, MessageSquare, Bell
} from 'lucide-react';

export const metadata = { title: 'UI Components — Skyra Platform Dashboard' };

const SPECIALIZED_PAGES = [
  { href: '/ui-components/select', title: 'DynamicSelect', desc: 'Unified single/multi select with search, select all, creatable, and dynamic +N chips', icon: ListFilter, badge: 'Phase 2' },
  { href: '/ui-components/inputs', title: 'Inputs & Textarea', desc: 'Input variants (status, helper, prefix/suffix), SearchInput, NumberInput, PasswordInput, and auto-resizing Textarea', icon: Type, badge: 'Phase 3' },
  { href: '/ui-components/date-fields', title: 'Date & Time Suite', desc: '10-component suite: DateField, DateRangeField, TimeField, TimeRangeField, DateTimeField, DateTimeRangeField, MonthField, YearField, WeekField, Calendar', icon: Calendar, badge: 'Phase 3' },
  { href: '/ui-components/loaders', title: 'Loading System', desc: 'Multi-size Spinners, Linear & Circular Progress, Skeletons (Text, Avatar, Card, Table), DataLoader & OverlayLoader', icon: Loader2, badge: 'Phase 3' },
  { href: '/ui-components/tooltip', title: 'Rich Tooltips', desc: 'Viewport collision-aware tooltips supporting plain text, rich React subtrees, status badges, and keyboard focus triggers', icon: MessageSquare, badge: 'Phase 3' },
  { href: '/ui-components/switch', title: 'Switch & Toggles', desc: '5 design variants (default, compact, labeled, icon, outline), 3 sizes (sm/md/lg), loading spinner thumb, error, and disabled states', icon: ToggleLeft, badge: 'Phase 3' },
  { href: '/ui-components/notifications', title: 'Notification Bar', desc: '5 semantic types, synchronized animated countdown timer, hover-pause/resume, manual close, and error/status codes', icon: Bell, badge: 'Phase 3' },
  { href: '/ui-components/checkbox', title: 'Checkbox & Group', desc: 'Accessible multi-state checkboxes with indeterminate support and 44px touch targets', icon: CheckSquare, badge: 'Phase 2' },
  { href: '/ui-components/radio', title: 'Radio & RadioGroup', desc: 'WAI-ARIA roving tabindex single selection controls in vertical/horizontal layouts', icon: RadioIcon, badge: 'Phase 2' },
  { href: '/pdf-viewer', title: 'PDF & Document Viewer', desc: 'Zoom, fullscreen, print, page navigation, and accessible document viewing chrome', icon: FileText, badge: 'Phase 2' },
  { href: '/print', title: 'Print & Download Studio', desc: 'Target container printing, before/after lifecycle hooks, and file downloads', icon: Printer, badge: 'Phase 2' },
  { href: '/export', title: 'Data Export Engine', desc: 'RFC-4180 CSV & Excel XML export engines with ExportButton and ExportMenu', icon: Download, badge: 'Phase 2' },
];

export default function UIComponentsPage() {
  return (
    <div className="dash-page" style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', marginBottom: '0.5rem' }}>
        UI Components Showcase
      </h1>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '2rem', maxWidth: '800px', fontSize: '0.95rem' }}>
        Complete suite of reusable platform UI primitives from <code>@skyra/ui</code> and pure engines from <code>@skyra/data-export</code>. 
        All components are strictly typed, theme-aware, fully accessible (zero axe violations), and verified across all 7 canonical viewport breakpoints.
      </p>

      {/* Navigation Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '3.5rem' }}>
        {SPECIALIZED_PAGES.map(({ href, title, desc, icon: Icon, badge }) => (
          <Link
            key={href}
            href={href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '1.25rem',
              background: 'var(--skyra-surface)',
              border: '1px solid var(--skyra-border)',
              borderRadius: 'var(--skyra-radius-lg)',
              textDecoration: 'none',
              transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
              boxShadow: 'var(--skyra-shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{
                  padding: '0.5rem',
                  borderRadius: 'var(--skyra-radius-md)',
                  background: 'var(--skyra-primary-light)',
                  color: 'var(--skyra-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={18} />
                </div>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--skyra-text)', fontFamily: 'var(--skyra-font-display)' }}>
                  {title}
                </span>
              </div>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--skyra-radius-full)',
                background: badge === 'Phase 3' ? 'var(--skyra-primary)' : 'var(--skyra-bg-muted)',
                color: badge === 'Phase 3' ? '#fff' : 'var(--skyra-text-muted)',
              }}>
                {badge}
              </span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--skyra-text-muted)', margin: 0, flex: 1, lineHeight: 1.4 }}>
              {desc}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--skyra-primary)' }}>
              Explore Showcase <ChevronRight size={14} />
            </div>
          </Link>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--skyra-border)', paddingTop: '2.5rem' }}>
        <h2 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--skyra-text)', marginBottom: '1.5rem' }}>
          Baseline UI Primitives
        </h2>
        <ButtonDemo />
        <InputDemo />
        <SelectDemo />
        <BadgeDemo />
        <MiscDemo />
      </div>
    </div>
  );
}
