'use client';

import React, { useState } from 'react';
import {
  KeyboardShortcutProvider,
  useKeyboardShortcut,
  Kbd,
  Button,
  Card,
  Badge,
  Input,
} from '@skyra/ui';
import { DemoSection, DemoBlock } from '@/components/demos/DemoSection';
import {
  Keyboard,
  Shield,
  Zap,
} from 'lucide-react';

function ShortcutListenerSection({ onTrigger }: { onTrigger: (key: string) => void }) {
  useKeyboardShortcut('ctrl+s', () => onTrigger('Ctrl+S (Save Document)'));
  useKeyboardShortcut('alt+n', () => onTrigger('Alt+N (New Record)'));
  useKeyboardShortcut('mod+shift+p', () => onTrigger('Mod+Shift+P (Quick Action)'));
  useKeyboardShortcut('mod+enter', () => onTrigger('Mod+Enter (Inside Input Allowed)'), {
    allowInInput: true,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--skyra-bg-muted)', borderRadius: 'var(--skyra-radius-md)' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Save Changes</span>
        <Kbd shortcut="ctrl+s" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--skyra-bg-muted)', borderRadius: 'var(--skyra-radius-md)' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Create New Record</span>
        <Kbd shortcut="alt+n" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--skyra-bg-muted)', borderRadius: 'var(--skyra-radius-md)' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Command Quick Action</span>
        <Kbd shortcut="mod+shift+p" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--skyra-bg-muted)', borderRadius: 'var(--skyra-radius-md)' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Submit from Input (allowInInput)</span>
        <Kbd shortcut="mod+enter" />
      </div>
    </div>
  );
}

export default function KeyboardShortcutsShowcase() {
  const [lastEvent, setLastEvent] = useState<string | null>(null);
  const [textInputVal, setTextInputVal] = useState('');

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Keyboard size={28} style={{ color: 'var(--skyra-primary)' }} />
          <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', margin: 0 }}>
            Keyboard Shortcut System
          </h1>
        </div>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', margin: 0 }}>
          Centralized cross-platform shortcut orchestrator with deterministic normalization, input-element typing safety, platform-aware formatting, and conflict detection.
        </p>
      </div>

      {lastEvent && (
        <div
          style={{
            marginBottom: '1.5rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--skyra-radius-md)',
            backgroundColor: 'rgba(10, 88, 202, 0.08)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--skyra-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={16} style={{ color: 'var(--skyra-primary)' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--skyra-text)' }}>
              Shortcut Triggered: {lastEvent}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setLastEvent(null)}>
            Clear
          </Button>
        </div>
      )}

      <KeyboardShortcutProvider>
        <DemoSection
          title="1. Live Shortcut Listeners"
          desc="Active shortcuts registered via useKeyboardShortcut hook. Press keys to test."
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <DemoBlock title="Registered Shortcuts">
              <ShortcutListenerSection onTrigger={(msg) => setLastEvent(msg)} />
            </DemoBlock>

            <DemoBlock title="Input Safety Protection">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)', margin: 0 }}>
                  Typing inside text inputs does NOT trigger global shortcuts like <Kbd shortcut="ctrl+s" size="xs" /> or <Kbd shortcut="alt+n" size="xs" />. Try typing here:
                </p>
                <Input
                  value={textInputVal}
                  onChange={(e) => setTextInputVal(e.target.value)}
                  placeholder="Type here and press Ctrl+S (no global hijack)..."
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--skyra-text-muted)' }}>
                  <Shield size={14} style={{ color: 'var(--skyra-success)' }} />
                  <span>Inputs are isolated unless explicit allowInInput is enabled</span>
                </div>
              </div>
            </DemoBlock>
          </div>
        </DemoSection>
      </KeyboardShortcutProvider>

      <DemoSection
        title="2. Semantic Kbd Display & Platform Formatting"
        desc="Standardized platform representation for Windows, macOS, and Linux."
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <Card style={{ padding: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Windows / Linux Rendering</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem' }}>mod+k</span>
                <Kbd shortcut="mod+k" platform="windows" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem' }}>mod+shift+p</span>
                <Kbd shortcut="mod+shift+p" platform="windows" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem' }}>alt+f4</span>
                <Kbd shortcut="alt+f4" platform="windows" />
              </div>
            </div>
          </Card>

          <Card style={{ padding: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>macOS Rendering</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem' }}>mod+k</span>
                <Kbd shortcut="mod+k" platform="mac" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem' }}>mod+shift+p</span>
                <Kbd shortcut="mod+shift+p" platform="mac" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem' }}>option+enter</span>
                <Kbd shortcut="alt+enter" platform="mac" />
              </div>
            </div>
          </Card>
        </div>
      </DemoSection>
    </div>
  );
}
