'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DemoSection, DemoBlock } from './DemoSection';
import '@skyra-tech-platform/collapsible';
import '@skyra-tech-platform/popover';
import '@skyra-tech-platform/dropdown-menu';
import '@skyra-tech-platform/context-menu';
import '@skyra-tech-platform/command-palette';
import '@skyra-tech-platform/date-time';
import type { SkyraCommandPaletteElement } from '@skyra-tech-platform/command-palette';

function Frame({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <div className="dash-page additional-showcase" style={{ padding: '2rem 1rem', color: 'var(--skyra-text)' }}>
    <h1 style={{ paddingRight: '5rem' }}>{title} Showcase</h1>
    <p style={{ color: 'var(--skyra-text)' }}>{description}</p>
    {mounted ? children : <p role="status">Loading Showcase…</p>}
    <style>{`.additional-showcase button,.additional-showcase select,.additional-showcase input {font:inherit;color:var(--skyra-text);background:var(--skyra-surface);border:1px solid var(--skyra-border);border-radius:var(--skyra-radius-md);padding:.65rem;max-width:100%}
      .additional-showcase :is(button,select,input,[tabindex="0"]):focus-visible {outline:2px solid var(--skyra-primary);outline-offset:3px}
      .additional-showcase label {display:flex;gap:.5rem;align-items:center;flex-wrap:wrap}
      .additional-showcase [slot="trigger"] {display:inline-block;padding:.65rem;border:1px solid var(--skyra-border);border-radius:var(--skyra-radius-md);background:var(--skyra-surface)}
      .additional-showcase output {display:block;overflow-wrap:anywhere;margin:1rem 0}
      .additional-showcase .showcase-fields {display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:1rem;width:100%}
      .additional-showcase skyra-tech-calendar {max-width:100%;overflow:auto}
      .additional-showcase {--skyra-text-muted:var(--skyra-text);min-width:0;overflow-wrap:anywhere}
      .additional-showcase section {min-width:0}
      .additional-showcase section p {color:var(--skyra-text)!important}
      .additional-showcase .showcase-fields > * {min-width:0;max-width:100%}
      @media(max-width:640px) {.additional-showcase section > div:nth-child(2) > div {padding:1rem!important;min-width:0}}`}</style>
  </div>;
}

function useDetail(ref: React.RefObject<HTMLElement | null>, events: string[]) {
  const [detail, setDetail] = useState('No interaction yet');
  useEffect(() => {
    const el = ref.current;
    const listener = (event: Event) => setDetail(JSON.stringify((event as CustomEvent).detail, (_key, value) => value instanceof Node ? undefined : value));
    events.forEach(name => el?.addEventListener(name, listener));
    return () => events.forEach(name => el?.removeEventListener(name, listener));
  });
  return detail;
}

export function CollapsibleShowcase() {
  return <Frame title="Collapsible" description="Expand advanced settings with the trigger, Enter or Space. Disable the region to compare behavior."><CollapsibleDemo /></Frame>;
}
function CollapsibleDemo() {
  const ref = useRef<HTMLElement>(null);
  const [disabled, setDisabled] = useState(false);
  const detail = useDetail(ref, ['skyra-collapsible-change']);
  return <DemoSection title="Advanced settings" desc="The package owns disclosure state, keyboard behavior and ARIA updates.">
    <label><input type="checkbox" checked={disabled} onChange={e => setDisabled(e.target.checked)} />Disable disclosure</label>
    <DemoBlock title="Deployment options">
      <skyra-collapsible ref={ref} disabled={disabled}>
        <span slot="trigger">Advanced deployment settings</span>
        <div><label>Release channel <select defaultValue="stable"><option>stable</option><option>preview</option></select></label><p>Preview deployments can be reviewed before release.</p></div>
      </skyra-collapsible>
    </DemoBlock><output aria-live="polite">Disclosure event: {detail}</output>
  </DemoSection>;
}

export function PopoverShowcase() {
  return <Frame title="Popover" description="Configure placement, edit the content, then dismiss with Escape or an outside click."><PopoverDemo /></Frame>;
}
function PopoverDemo() {
  const ref = useRef<HTMLElement>(null);
  const [placement, setPlacement] = useState('bottom');
  const [name, setName] = useState('Release review');
  const detail = useDetail(ref, ['skyra-popover-change']);
  return <DemoSection title="Anchored editor" desc="Focus restoration and positioning are handled by the reusable Popover.">
    <label>Placement <select value={placement} onChange={e => setPlacement(e.target.value)}>{['bottom','top','left','right'].map(x => <option key={x}>{x}</option>)}</select></label>
    <DemoBlock title="Review details"><skyra-tech-popover ref={ref} placement={placement} panel-width="260px" panel-max-width="calc(100vw - 32px)" aria-label="Review editor">
      <span slot="trigger">Edit review</span>
      <div style={{ padding: '1rem' }}><label>Review name <input value={name} onChange={e => setName(e.target.value)} /></label></div>
    </skyra-tech-popover></DemoBlock>
    <output aria-live="polite">Review: {name}. Popover event: {detail}</output>
  </DemoSection>;
}

export function DropdownMenuShowcase() {
  return <Frame title="Dropdown Menu" description="Use Arrow keys and Enter to choose actions. Compare checkable, disabled and destructive items."><DropdownDemo /></Frame>;
}
function DropdownDemo() {
  const ref = useRef<HTMLElement>(null);
  const [keepOpen, setKeepOpen] = useState(false);
  const detail = useDetail(ref, ['skyra-dropdown-select']);
  return <DemoSection title="Document actions" desc="Selections below come from real menu events.">
    <label><input type="checkbox" checked={keepOpen} onChange={e => setKeepOpen(e.target.checked)} />Keep menu open after selection</label>
    <DemoBlock title="Action menu"><skyra-tech-dropdown-menu ref={ref} close-on-select={keepOpen ? 'false' : 'true'} aria-label="Document actions">
      <span slot="trigger">Document actions</span>
      <skyra-tech-dropdown-item value="duplicate">Duplicate document</skyra-tech-dropdown-item>
      <skyra-tech-dropdown-item value="notifications" type="checkbox">Notifications</skyra-tech-dropdown-item>
      <skyra-tech-dropdown-item value="locked" disabled>Locked action</skyra-tech-dropdown-item>
      <skyra-tech-dropdown-separator />
      <skyra-tech-dropdown-item value="archive" destructive>Archive document</skyra-tech-dropdown-item>
    </skyra-tech-dropdown-menu></DemoBlock><output aria-live="polite">Selected action: {detail}</output>
  </DemoSection>;
}

export function ContextMenuShowcase() {
  return <Frame title="Context Menu" description="Right-click the document, or focus the target and press Shift+F10. Escape dismisses the menu."><ContextDemo /></Frame>;
}
function ContextDemo() {
  const ref = useRef<HTMLElement>(null);
  const [disabled, setDisabled] = useState(false);
  const detail = useDetail(ref, ['skyra-context-menu-select']);
  return <DemoSection title="Document context" desc="Pointer and keyboard opening use the component's native target wrapper.">
    <label><input type="checkbox" checked={disabled} onChange={e => setDisabled(e.target.checked)} />Disable context menu</label>
    <DemoBlock title="Context target"><skyra-tech-context-menu ref={ref} disabled={disabled} aria-label="Document context actions">
      <div slot="target" style={{ padding: '2rem', border: '1px dashed var(--skyra-border)' }}>Quarterly review.pdf — right-click for actions</div>
      <skyra-tech-context-menu-item slot="menu" value="open">Open document</skyra-tech-context-menu-item>
      <skyra-tech-context-menu-item slot="menu" value="copy">Copy link</skyra-tech-context-menu-item>
      <skyra-tech-context-menu-item slot="menu" value="unavailable" disabled>Unavailable action</skyra-tech-context-menu-item>
    </skyra-tech-context-menu></DemoBlock><output aria-live="polite">Context action: {detail}</output>
  </DemoSection>;
}

export function CommandPaletteShowcase() {
  return <Frame title="Command Palette" description="Open with the button or Ctrl/Cmd+Shift+P. Search commands, navigate with Arrow keys, and execute with Enter."><CommandDemo /></Frame>;
}
function CommandDemo() {
  const ref = useRef<SkyraCommandPaletteElement>(null);
  const [result, setResult] = useState('No command executed');
  useEffect(() => {
    if (ref.current) ref.current.commands = [
      { id: 'review', label: 'Start review', group: 'Documents', keywords: ['approve'], onExecute: () => setResult('Review started') },
      { id: 'draft', label: 'Save draft', group: 'Documents', onExecute: () => setResult('Draft saved') },
      { id: 'locked', label: 'Publish (unavailable)', group: 'Documents', disabled: true },
    ];
  }, []);
  return <DemoSection title="Searchable commands" desc="Try an unmatched query for the empty state. Commands update the result without navigating away.">
    <button type="button" onClick={() => { if (ref.current) ref.current.open = true; }}>Open command palette</button>
    <skyra-tech-command-palette ref={ref} shortcut="mod+shift+p" placeholder="Search document commands" empty-text="No matching commands" />
    <output aria-live="polite">Command result: {result}</output>
  </DemoSection>;
}

export function DateTimeShowcase() {
  return <Frame title="Date & Time Suite" description="Plan a review with real date, time, range and calendar controls. Values and events update below."><DateTimeDemo /></Frame>;
}
function DateTimeDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [disabled, setDisabled] = useState(false);
  const [revision, setRevision] = useState(0);
  const detail = useDetail(ref, ['skyra-change']);
  return <DemoSection title="Review schedule" desc="Date bounds and disabled states are component attributes; reset recreates only these demo controls.">
    <label><input type="checkbox" checked={disabled} onChange={e => setDisabled(e.target.checked)} />Disable fields</label>
    <button type="button" onClick={() => setRevision(x => x + 1)}>Reset schedule</button>
    <DemoBlock title="Date and time inputs"><div ref={ref} className="showcase-fields" key={revision}>
      <skyra-tech-date-field label="Review date" value="2026-10-15" min="2026-01-01" max="2026-12-31" disabled={disabled} />
      <skyra-tech-time-field label="Review time" value="09:30" disabled={disabled} />
      <skyra-tech-date-range-field label="Review window" disabled={disabled} />
      <div role="region" aria-label="Office hours controls; scroll horizontally on narrow screens" tabIndex={0} style={{ overflowX: 'auto', maxWidth: '100%' }}>
        <skyra-tech-time-range-field label="Office hours" disabled={disabled} style={{ display: 'block', minWidth: '24rem' }} />
      </div>
      <skyra-tech-date-time-field label="Deadline" disabled={disabled} />
      <skyra-tech-calendar value="2026-10-15" min="2026-01-01" max="2026-12-31" />
    </div></DemoBlock><output aria-live="polite">Schedule event: {detail}</output>
  </DemoSection>;
}
