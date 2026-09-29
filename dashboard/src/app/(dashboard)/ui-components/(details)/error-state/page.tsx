'use client';

import React, { useState } from 'react';
import {
  ErrorState,
  ErrorStateIcon,
  ErrorStateTitle,
  ErrorStateDescription,
  ErrorStateActions,
  ErrorStateDetails,
  Button,
  Card,
  Badge,
  Spinner,
} from '@skyra/ui';
import { DemoSection, DemoBlock } from '@/components/demos/DemoSection';

export default function ErrorStateShowcasePage() {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retrySuccess, setRetrySuccess] = useState(false);

  const handleSimulatedRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      setRetrySuccess(true);
    }, 1500);
  };

  const handleReset = () => {
    setRetrySuccess(false);
    setIsRetrying(false);
  };

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', margin: 0 }}>
          Error State Component
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Semantic, accessible error state container for persistent content-level and route-level failures. Supports user recovery actions, optional safe technical details, and full theme integration.
        </p>
      </div>

      {/* 1. Basic & Interactive Error States */}
      <DemoSection title="1. Content Load Failures & Recovery" desc="Persistent error representation when a service or data fetch fails, equipped with retry action callbacks." erpSource="Platform Foundation">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Network Connection Failure">
            {retrySuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                <h4 style={{ margin: 0, color: 'var(--skyra-success, #10b981)' }}>Data Reloaded Successfully</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--skyra-text-muted)', marginTop: '4px' }}>
                  The simulated network connection was restored.
                </p>
                <Button variant="outline" size="sm" onClick={handleReset} style={{ marginTop: '1rem' }}>
                  Simulate Failure Again
                </Button>
              </div>
            ) : (
              <ErrorState variant="outline">
                <ErrorStateIcon />
                <ErrorStateTitle>Unable to Load Invoices</ErrorStateTitle>
                <ErrorStateDescription>
                  We were unable to establish a secure connection to the billing service. Please check your internet connection and try again.
                </ErrorStateDescription>
                <ErrorStateActions>
                  <Button variant="primary" onClick={handleSimulatedRetry} disabled={isRetrying}>
                    {isRetrying ? (
                      <>
                        <Spinner size="sm" style={{ marginRight: '6px' }} />
                        Connecting...
                      </>
                    ) : (
                      'Try Again'
                    )}
                  </Button>
                  <Button variant="ghost">Report Issue</Button>
                </ErrorStateActions>
              </ErrorState>
            )}
          </DemoBlock>

          <DemoBlock title="Technical Error with Safe Disclosure Details">
            <ErrorState variant="outline">
              <ErrorStateIcon />
              <ErrorStateTitle>Failed to Process Batch Export</ErrorStateTitle>
              <ErrorStateDescription>
                The server encountered an unexpected error while preparing your export file.
              </ErrorStateDescription>
              <ErrorStateActions>
                <Button variant="primary" onClick={() => {}}>Retry Export</Button>
              </ErrorStateActions>
              <ErrorStateDetails
                errorCode="ERR_STREAM_TERMINATED"
                requestId="req_8f9c2d1e0b5a"
                technicalMessage="Upstream service disconnected before payload stream completed (HTTP 502 Bad Gateway)"
              />
            </ErrorState>
          </DemoBlock>
        </div>
      </DemoSection>

      {/* 2. Embedded Table & Compact View */}
      <DemoSection title="2. Embedded Table Failure & Banner Variant" desc="Used inside card containers, widget views, and data tables when an inline component fails to load." erpSource="Platform Foundation">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Embedded DataTable Failure">
            <Card style={{ overflow: 'hidden' }}>
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--skyra-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--skyra-text)' }}>Live Analytics Feed</span>
                <Badge variant="danger">Offline</Badge>
              </div>
              <ErrorState compact style={{ padding: '2.5rem 1rem' }}>
                <ErrorStateIcon />
                <ErrorStateTitle as="h4">Failed to Fetch Stream</ErrorStateTitle>
                <ErrorStateDescription>
                  WebSocket connection dropped unexpectedly.
                </ErrorStateDescription>
                <ErrorStateActions>
                  <Button variant="outline" size="sm">Reconnect</Button>
                </ErrorStateActions>
              </ErrorState>
            </Card>
          </DemoBlock>

          <DemoBlock title="Banner Variant">
            <ErrorState variant="banner">
              <ErrorStateIcon />
              <ErrorStateTitle as="h4">Permissions Restricted</ErrorStateTitle>
              <ErrorStateDescription>
                You do not have administrative privileges to view or modify this ledger section.
              </ErrorStateDescription>
              <ErrorStateActions>
                <Button variant="outline" size="sm">Request Access</Button>
              </ErrorStateActions>
            </ErrorState>
          </DemoBlock>
        </div>
      </DemoSection>
    </div>
  );
}
