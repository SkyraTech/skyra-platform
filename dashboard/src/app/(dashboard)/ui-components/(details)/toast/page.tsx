'use client';

import React, { useState } from 'react';
import {
  ToastProvider,
  useToast,
  toast,
  Button,
  DynamicSelect,
  Card,
  Badge,
} from '@skyra/ui';
import { DemoSection, DemoBlock } from '@/components/demos/DemoSection';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Bell,
  Trash2,
  Play,
  RotateCcw,
} from 'lucide-react';

function ToastShowcaseInner() {
  const { toast: addToast, dismissAll, toasts } = useToast();
  const [position, setPosition] = useState('top-right');

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', margin: 0 }}>
          Toast Manager
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Lifecycle orchestration layer built directly on the NotificationBar primitive. Features auto-dismiss countdown timer, hover pause/resume, interactive action buttons, stacking, max-visible limits, and accessible live-regions.
        </p>
      </div>

      {/* 1. Notification Tone Triggers */}
      <DemoSection title="1. Notification Types &amp; Tones" desc="Trigger toasts matching the five standard Skyra notification categories." erpSource="skyra-erp/src/components/ui/NotificationBar">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Standard Feedback Toasts">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.5rem 0' }}>
              <Button
                variant="primary"
                onClick={() =>
                  addToast({
                    type: 'success',
                    title: 'Invoice Saved',
                    message: 'Invoice #INV-2026-0042 has been committed.',
                    code: 'SUCCESS_200',
                    duration: 5000,
                  })
                }
              >
                <CheckCircle2 size={16} />
                <span>Trigger Success (5s)</span>
              </Button>

              <Button
                variant="danger"
                onClick={() =>
                  addToast({
                    type: 'error',
                    title: 'Database Sync Failed',
                    message: 'Connection timed out while writing ledger record.',
                    code: 'ERR_504',
                    duration: 6000,
                  })
                }
              >
                <AlertCircle size={16} />
                <span>Trigger Error (6s)</span>
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  addToast({
                    type: 'warning',
                    title: 'Storage Limit Warning',
                    message: 'Account storage capacity is at 88%.',
                    code: 'WARN_QUOTA',
                    duration: 7000,
                  })
                }
              >
                <AlertTriangle size={16} />
                <span>Trigger Warning (7s)</span>
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  addToast({
                    type: 'info',
                    title: 'Export Generation Queued',
                    message: 'Your requested GST report is generating in background.',
                    code: 'INFO_JOB_88',
                    duration: 4000,
                  })
                }
              >
                <Info size={16} />
                <span>Trigger Info (4s)</span>
              </Button>

              <Button
                variant="ghost"
                onClick={() =>
                  addToast({
                    type: 'neutral',
                    title: 'Session Notice',
                    message: 'System scheduled maintenance at 02:00 AM IST.',
                    duration: 5000,
                  })
                }
              >
                <Bell size={16} />
                <span>Trigger Neutral (5s)</span>
              </Button>
            </div>
          </DemoBlock>

          <DemoBlock title="Actions &amp; Persistent Notifications">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.5rem 0' }}>
              <Button
                variant="outline"
                onClick={() =>
                  addToast({
                    type: 'error',
                    title: 'Webhook Delivery Failed',
                    message: 'Endpoint returned status code 503.',
                    persistent: true,
                    action: {
                      label: 'Retry Delivery',
                      onClick: () => {
                        toast({
                          type: 'success',
                          title: 'Webhook Retried',
                          message: 'Delivery successfully acknowledged.',
                          duration: 3000,
                        });
                      },
                    },
                  })
                }
              >
                <RotateCcw size={16} />
                <span>Persistent Error + Action Button</span>
              </Button>

              <Button
                variant="primary"
                onClick={() => {
                  const id = toast({
                    type: 'info',
                    title: 'Uploading Media Asset...',
                    message: 'Progress: 45% (2.4MB / 5.2MB)',
                    persistent: true,
                  });

                  setTimeout(() => {
                    toast.update(id, {
                      type: 'success',
                      title: 'Upload Complete',
                      message: 'Asset verified and encrypted in bucket.',
                      duration: 4000,
                      persistent: false,
                    });
                  }, 2000);
                }}
              >
                <Play size={16} />
                <span>Async Toast Update Flow</span>
              </Button>

              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--skyra-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--skyra-text-muted)' }}>
                    Active Toasts: <Badge variant="primary" size="sm">{toasts.length}</Badge>
                  </span>
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={toasts.length === 0}
                    onClick={dismissAll}
                  >
                    <Trash2 size={14} />
                    <span>Dismiss All</span>
                  </Button>
                </div>
              </div>
            </div>
          </DemoBlock>
        </div>
      </DemoSection>

      {/* 2. Positioning & Configuration */}
      <DemoSection title="2. Viewport Positions &amp; Stacking" desc="Configure toast placement across all 6 standard viewport anchor positions." erpSource="Platform Foundation">
        <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--skyra-text)' }}>
              Change Viewport Position:
            </span>
            <div style={{ width: '220px' }}>
              <DynamicSelect
                value={position}
                onChange={(val) => {
                  if (val && !Array.isArray(val) && 'value' in val) {
                    setPosition(val.value);
                  }
                }}
                options={[
                  { value: 'top-right', label: 'Top Right (Default)' },
                  { value: 'top-left', label: 'Top Left' },
                  { value: 'top-center', label: 'Top Center' },
                  { value: 'bottom-right', label: 'Bottom Right' },
                  { value: 'bottom-left', label: 'Bottom Left' },
                  { value: 'bottom-center', label: 'Bottom Center' },
                ]}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                addToast({
                  type: 'info',
                  title: `Position: ${position}`,
                  message: `This toast is placed in the ${position} viewport.`,
                  duration: 4000,
                })
              }
            >
              Test Selected Position
            </Button>
          </div>
        </Card>
      </DemoSection>
    </div>
  );
}

export default function ToastShowcasePage() {
  return (
    <ToastProvider position="top-right" maxVisible={5}>
      <ToastShowcaseInner />
    </ToastProvider>
  );
}
