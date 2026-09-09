'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Button, Input, Checkbox, Card, Alert } from '@skyra/ui';

export default function AccessibilityStudioPage() {
  const [results, setResults] = useState<any>(null);
  const [running, setRunning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const runAudit = async () => {
    setRunning(true);
    try {
      // Dynamically import axe-core to avoid SSR issues
      const axe = (await import('axe-core')).default;
      if (containerRef.current) {
        const auditResults = await axe.run(containerRef.current);
        setResults(auditResults);
      }
    } catch (e) {
      console.error('Axe core failed', e);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="dash-page" style={{ maxWidth: '1000px' }}>
      <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', marginBottom: '0.5rem' }}>
        Accessibility Studio
      </h1>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '2rem' }}>
        Automated runtime accessibility audits using <code>axe-core</code>. Target: Zero Violations.
      </p>

      <div style={{ marginBottom: '2rem' }}>
        <Button onClick={runAudit} isLoading={running}>Run Axe-Core Audit</Button>
      </div>

      {results && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Audit Results</h2>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <Card style={{ flex: 1, borderLeft: '4px solid var(--skyra-success)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--skyra-success)' }}>{results.passes.length}</div>
              <div style={{ color: 'var(--skyra-text-muted)' }}>Passed Rules</div>
            </Card>
            <Card style={{ flex: 1, borderLeft: results.violations.length > 0 ? '4px solid var(--skyra-danger)' : '4px solid var(--skyra-success)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: results.violations.length > 0 ? 'var(--skyra-danger)' : 'var(--skyra-success)' }}>{results.violations.length}</div>
              <div style={{ color: 'var(--skyra-text-muted)' }}>Violations</div>
            </Card>
            <Card style={{ flex: 1, borderLeft: '4px solid var(--skyra-warning-dark)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--skyra-warning-dark)' }}>{results.incomplete.length}</div>
              <div style={{ color: 'var(--skyra-text-muted)' }}>Incomplete (Manual Check Required)</div>
            </Card>
          </div>

          {results.violations.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {results.violations.map((v: any) => (
                <Alert key={v.id} variant="danger" title={v.id}>
                  {v.description} <br />
                  <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Impact: {v.impact} | Elements affected: {v.nodes.length}</span>
                </Alert>
              ))}
            </div>
          )}
          {results.violations.length === 0 && (
            <Alert variant="success" title="Zero Violations!">
              The rendered components passed all automated axe-core accessibility checks.
            </Alert>
          )}
        </div>
      )}

      {/* Target Test Area */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Test Target Surface</h2>
      <div ref={containerRef} style={{ padding: '2rem', background: 'var(--skyra-surface)', border: '1px dashed var(--skyra-border)', borderRadius: 'var(--skyra-radius-xl)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
          <Input label="Email Address" required placeholder="name@example.com" />
          <Input label="Search" placeholder="Search..." aria-label="Search" />
          <Checkbox label="I agree to the terms and conditions" />
          <Button variant="primary">Submit Form</Button>
        </div>
      </div>

    </div>
  );
}
