'use client';

import React, { useState, useId } from 'react';
import { Copy, Check, RotateCcw, Terminal, Sliders, Sun, Moon, Trash2 } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

export type EventCategory = 'NATIVE_DOM_EVENT' | 'PLATFORM_CUSTOM_EVENT' | 'PLAYGROUND_DEMO_EVENT';

export function classifyEvent(name: string): EventCategory {
  const nativeEvents = new Set([
    'click', 'change', 'input', 'focus', 'blur', 'keydown', 'keyup', 'keypress',
    'submit', 'reset', 'mouseenter', 'mouseleave', 'mouseover', 'mouseout'
  ]);
  const demoEvents = new Set([
    'badge-interact', 'loader-interact', 'confirm-drawer', 'action-click',
    'demo-action', 'demo-event', 'trigger-demo', 'playground-action'
  ]);

  const lower = name.toLowerCase();
  if (nativeEvents.has(lower)) {
    return 'NATIVE_DOM_EVENT';
  }
  if (demoEvents.has(lower) || lower.startsWith('demo-') || lower.includes('interact') || lower.includes('demo')) {
    return 'PLAYGROUND_DEMO_EVENT';
  }
  return 'PLATFORM_CUSTOM_EVENT';
}

export type ControlType = 'select' | 'boolean' | 'text' | 'number';

export interface PlaygroundOption {
  label: string;
  value: any;
}

export interface PlaygroundControlDef {
  name: string;
  label: string;
  type: ControlType;
  options?: PlaygroundOption[];
  defaultValue: any;
  help?: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface ComponentPlaygroundProps<T extends Record<string, any>> {
  title?: string;
  description?: string;
  controls: PlaygroundControlDef[];
  render: (values: T, logEvent: (name: string, detail?: any) => void) => React.ReactNode;
  generateCode: (values: T) => string;
  codeLanguage?: string;
}

interface EventLogEntry {
  id: string;
  timestamp: string;
  name: string;
  category: EventCategory;
  detail?: any;
}

export function ComponentPlayground<T extends Record<string, any>>({
  title = 'Interactive Playground',
  description = 'Customize properties and view live updates in both the component preview and the generated code.',
  controls,
  render,
  generateCode,
  codeLanguage = 'html'
}: ComponentPlaygroundProps<T>) {
  const baseId = useId();

  // Initialize state with default values
  const getInitialState = (): T => {
    const state: Record<string, any> = {};
    for (const ctrl of controls) {
      state[ctrl.name] = ctrl.defaultValue;
    }
    return state as T;
  };

  const [values, setValues] = useState<T>(getInitialState);
  const [events, setEvents] = useState<EventLogEntry[]>([]);
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  const updateValue = (name: string, val: any) => {
    setValues((prev) => ({ ...prev, [name]: val }));
  };

  const resetValues = () => {
    setValues(getInitialState());
  };

  const logEvent = (name: string, detail?: any) => {
    const entry: EventLogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      name,
      category: classifyEvent(name),
      detail: detail !== undefined ? (typeof detail === 'object' ? JSON.stringify(detail) : String(detail)) : undefined
    };
    setEvents((prev) => [entry, ...prev.slice(0, 19)]);
  };

  const clearEvents = () => {
    setEvents([]);
  };

  const generatedCode = generateCode(values);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      border: '1px solid var(--skyra-border)',
      borderRadius: 'var(--skyra-radius-lg, 12px)',
      background: 'var(--skyra-surface)',
      marginBottom: '2.5rem',
      overflow: 'hidden',
      boxShadow: 'var(--skyra-shadow-sm, 0 1px 3px rgba(0,0,0,0.05))'
    }}>
      {/* Playground Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.25rem',
        borderBottom: '1px solid var(--skyra-border)',
        background: 'var(--skyra-bg-muted)',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sliders size={18} style={{ color: 'var(--skyra-primary)' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--skyra-text)' }}>
              {title}
            </div>
            {description && (
              <div style={{ fontSize: '0.75rem', color: 'var(--skyra-text-muted)', marginTop: '0.125rem' }}>
                {description}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Canvas Theme Toggle */}
          <button
            type="button"
            onClick={() => setPreviewTheme((t) => (t === 'light' ? 'dark' : 'light'))}
            title={`Preview in ${previewTheme === 'light' ? 'Dark' : 'Light'} Canvas`}
            aria-label={`Preview in ${previewTheme === 'light' ? 'Dark' : 'Light'} Canvas`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.65rem',
              fontSize: '0.75rem',
              fontWeight: 500,
              background: 'var(--skyra-surface)',
              border: '1px solid var(--skyra-border)',
              borderRadius: 'var(--skyra-radius-sm, 6px)',
              color: 'var(--skyra-text)',
              cursor: 'pointer'
            }}
          >
            {previewTheme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
            <span>{previewTheme === 'light' ? 'Dark Canvas' : 'Light Canvas'}</span>
          </button>

          {/* Reset to Defaults */}
          <button
            type="button"
            onClick={resetValues}
            title="Reset to default settings"
            aria-label="Reset to default settings"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.65rem',
              fontSize: '0.75rem',
              fontWeight: 500,
              background: 'var(--skyra-surface)',
              border: '1px solid var(--skyra-border)',
              borderRadius: 'var(--skyra-radius-sm, 6px)',
              color: 'var(--skyra-text-muted)',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Controls + Preview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        borderBottom: '1px solid var(--skyra-border)'
      }}>
        {/* Left: Controls Panel */}
        <div style={{
          padding: '1.25rem',
          borderRight: '1px solid var(--skyra-border)',
          background: 'var(--skyra-surface)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          maxHeight: '480px',
          overflowY: 'auto'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--skyra-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Properties &amp; Attributes
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.875rem' }}>
            {controls.map((ctrl) => {
              const inputId = `${baseId}-${ctrl.name}`;
              return (
                <div key={ctrl.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label 
                      htmlFor={inputId}
                      style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--skyra-text)' }}
                    >
                      {ctrl.label}
                    </label>
                    <code style={{ fontSize: '0.7rem', color: 'var(--skyra-primary)', fontFamily: 'var(--skyra-font-mono)' }}>
                      {ctrl.name}
                    </code>
                  </div>

                  {ctrl.type === 'select' && (
                    <select
                      id={inputId}
                      value={values[ctrl.name]}
                      onChange={(e) => updateValue(ctrl.name, e.target.value)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 'var(--skyra-radius-sm, 6px)',
                        border: '1px solid var(--skyra-border)',
                        background: 'var(--skyra-bg)',
                        color: 'var(--skyra-text)',
                        fontSize: '0.85rem',
                        fontFamily: 'inherit'
                      }}
                    >
                      {ctrl.options?.map((opt) => (
                        <option key={opt.label} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {ctrl.type === 'boolean' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.125rem' }}>
                      <input
                        type="checkbox"
                        id={inputId}
                        checked={Boolean(values[ctrl.name])}
                        onChange={(e) => updateValue(ctrl.name, e.target.checked)}
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: 'var(--skyra-primary)',
                          cursor: 'pointer'
                        }}
                      />
                      <span style={{ fontSize: '0.8125rem', color: 'var(--skyra-text-muted)' }}>
                        {values[ctrl.name] ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  )}

                  {ctrl.type === 'text' && (
                    <input
                      type="text"
                      id={inputId}
                      value={values[ctrl.name] ?? ''}
                      onChange={(e) => updateValue(ctrl.name, e.target.value)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 'var(--skyra-radius-sm, 6px)',
                        border: '1px solid var(--skyra-border)',
                        background: 'var(--skyra-bg)',
                        color: 'var(--skyra-text)',
                        fontSize: '0.85rem',
                        fontFamily: 'inherit'
                      }}
                    />
                  )}

                  {ctrl.type === 'number' && (
                    <input
                      type="number"
                      id={inputId}
                      value={values[ctrl.name]}
                      min={ctrl.min}
                      max={ctrl.max}
                      step={ctrl.step ?? 1}
                      onChange={(e) => updateValue(ctrl.name, parseFloat(e.target.value))}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 'var(--skyra-radius-sm, 6px)',
                        border: '1px solid var(--skyra-border)',
                        background: 'var(--skyra-bg)',
                        color: 'var(--skyra-text)',
                        fontSize: '0.85rem',
                        fontFamily: 'inherit'
                      }}
                    />
                  )}

                  {ctrl.help && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--skyra-text-muted)' }}>
                      {ctrl.help}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Preview Canvas */}
        <div 
          className={previewTheme === 'dark' ? 'dark' : ''}
          style={{
            minHeight: '340px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2.5rem 1.5rem',
            position: 'relative',
            background: previewTheme === 'dark' ? 'var(--skyra-bg-dark, #0B111E)' : 'var(--skyra-bg, #F4F7FC)',
            backgroundImage: previewTheme === 'dark' 
              ? 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)' 
              : 'radial-gradient(var(--skyra-border) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
            color: previewTheme === 'dark' ? 'var(--skyra-text-dark, #F8FAFC)' : 'var(--skyra-text, #0f172a)',
            transition: 'background-color 0.2s ease'
          }}
        >
          <div style={{ maxWidth: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {render(values, logEvent)}
          </div>
        </div>
      </div>

      {/* Dynamic Code Output */}
      <div style={{ borderBottom: '1px solid var(--skyra-border)', background: 'var(--skyra-bg-muted)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 1rem',
          borderBottom: '1px solid var(--skyra-border)'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--skyra-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Generated Code
          </span>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy generated code"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: copied ? 'var(--skyra-success)' : 'var(--skyra-text-muted)'
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
        <div style={{ margin: '-1rem 0 -1.5rem 0', padding: '0 0.5rem' }}>
          <CodeBlock code={generatedCode.trim()} language={codeLanguage} />
        </div>
      </div>

      {/* Live Events Console */}
      <div style={{ background: 'var(--skyra-surface)', padding: '0.75rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--skyra-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Terminal size={14} style={{ color: 'var(--skyra-primary)' }} />
            <span>Events Console</span>
          </div>
          {events.length > 0 && (
            <button
              type="button"
              onClick={clearEvents}
              aria-label="Clear event console"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.72rem',
                color: 'var(--skyra-text-muted)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Trash2 size={12} />
              <span>Clear</span>
            </button>
          )}
        </div>

        {events.length === 0 ? (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--skyra-radius-sm, 6px)',
            background: 'var(--skyra-bg)',
            border: '1px dashed var(--skyra-border)',
            fontSize: '0.8rem',
            color: 'var(--skyra-text-muted)',
            textAlign: 'center'
          }}>
            Interact with the component above to observe dispatched custom events in real time.
          </div>
        ) : (
          <div 
            tabIndex={0}
            aria-label="Captured live event logs"
            style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            maxHeight: '130px',
            overflowY: 'auto',
            padding: '0.5rem',
            borderRadius: 'var(--skyra-radius-sm, 6px)',
            background: 'var(--skyra-bg)',
            border: '1px solid var(--skyra-border)',
            fontFamily: 'var(--skyra-font-mono)',
            fontSize: '0.78rem'
          }}>
            {events.map((evt) => {
              const badgeTheme = evt.category === 'NATIVE_DOM_EVENT'
                ? { bg: 'rgba(59, 130, 246, 0.1)', color: '#2563eb', border: 'rgba(59, 130, 246, 0.25)' }
                : evt.category === 'PLATFORM_CUSTOM_EVENT'
                ? { bg: 'rgba(16, 185, 129, 0.1)', color: '#059669', border: 'rgba(16, 185, 129, 0.25)' }
                : { bg: 'rgba(245, 158, 11, 0.1)', color: '#d97706', border: 'rgba(245, 158, 11, 0.25)' };

              return (
                <div key={evt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ color: 'var(--skyra-text-muted)', fontSize: '0.7rem' }}>[{evt.timestamp}]</span>
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    padding: '0.1rem 0.35rem',
                    borderRadius: '4px',
                    background: badgeTheme.bg,
                    color: badgeTheme.color,
                    border: `1px solid ${badgeTheme.border}`
                  }}>
                    [{evt.category}]
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--skyra-primary)' }}>{evt.name}</span>
                  {evt.detail && (
                    <span style={{ color: 'var(--skyra-text)', opacity: 0.85 }}>{evt.detail}</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

