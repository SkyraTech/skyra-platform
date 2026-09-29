'use client';

import React, { useState } from 'react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  Button,
  Input,
  Switch,
} from '@skyra/ui';
import { DemoSection, DemoBlock } from '@/components/demos/DemoSection';
import {
  ChevronDown,
  ChevronRight,
  Sliders,
  Code,
  HelpCircle,
} from 'lucide-react';

export default function CollapsibleShowcasePage() {
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', margin: 0 }}>
          Collapsible Primitive
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Independent single expandable region primitive (e.g. Advanced Search Options, Developer Diagnostics).
        </p>
      </div>

      {/* 1. Basic Collapsible */}
      <DemoSection title="1. Basic &amp; Advanced Options Collapsible" desc="Single independent collapsible region with accessible trigger button." erpSource="Platform Foundation">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Advanced Search Filter Region">
            <div style={{ padding: '1rem 0' }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <Input placeholder="Search records..." />
              </div>

              <Collapsible defaultOpen={false}>
                <CollapsibleTrigger>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer', color: 'var(--skyra-primary)' }}>
                    <Sliders size={14} />
                    <span>Advanced Filter Options</span>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div style={{ background: 'var(--skyra-bg)', padding: '1rem', borderRadius: 'var(--skyra-radius-md)', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.85rem' }}>Case Sensitive Search</span>
                      <Switch variant="compact" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.85rem' }}>Include Archived Items</span>
                      <Switch variant="compact" />
                    </div>
                    <Input placeholder="Filter by batch UUID..." />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </DemoBlock>

          <DemoBlock title="Developer Payload Inspector">
            <div style={{ padding: '1rem 0' }}>
              <Collapsible defaultOpen={true}>
                <CollapsibleTrigger>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer', color: 'var(--skyra-primary)' }}>
                    <Code size={14} />
                    <span>API Response Payload</span>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <pre style={{
                    background: 'var(--skyra-card-bg)',
                    border: '1px solid var(--skyra-border)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--skyra-radius-md)',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    overflowX: 'auto',
                    margin: '0.5rem 0 0 0',
                  }}>
{`{
  "status": 200,
  "data": {
    "organizationId": "org_98a72",
    "tier": "enterprise",
    "activeFeatures": ["sso", "audit_log", "api_keys"]
  }
}`}
                  </pre>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </DemoBlock>
        </div>
      </DemoSection>

      {/* 2. Controlled State */}
      <DemoSection title="2. Controlled State &amp; Disabled State" desc="Programmatic toggling and disabled collapsible container." erpSource="Platform Foundation">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Controlled Programmatic Toggling">
            <div style={{ padding: '1rem 0' }}>
              <div style={{ marginBottom: '1rem' }}>
                <Button size="sm" variant="outline" onClick={() => setControlledOpen(!controlledOpen)}>
                  {controlledOpen ? 'Collapse External' : 'Expand External'}
                </Button>
              </div>

              <Collapsible open={controlledOpen} onOpenChange={setControlledOpen}>
                <CollapsibleTrigger>
                  <span>Controlled Trigger ({controlledOpen ? 'Open' : 'Closed'})</span>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div style={{ padding: '0.5rem 0', color: 'var(--skyra-text-muted)', fontSize: '0.875rem' }}>
                    This collapsible region is bound to parent component React state.
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </DemoBlock>

          <DemoBlock title="Disabled Collapsible">
            <div style={{ padding: '1rem 0' }}>
              <Collapsible disabled>
                <CollapsibleTrigger>
                  <span>Locked Administrative Controls (Disabled)</span>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div>This should remain inaccessible.</div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </DemoBlock>
        </div>
      </DemoSection>
    </div>
  );
}
