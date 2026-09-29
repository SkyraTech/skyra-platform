'use client';

import React, { useState } from 'react';
import { NotificationBar, Button } from '@skyra/ui';
import { DemoSection, DemoBlock } from '@/components/demos/DemoSection';
import { CheckCircle2, AlertOctagon, Info, AlertTriangle, Bell } from 'lucide-react';

export default function NotificationsShowcasePage() {
  const [show2s, setShow2s] = useState(true);
  const [show5s, setShow5s] = useState(true);
  const [showManual, setShowManual] = useState(true);

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', margin: 0 }}>
          Notification & Response Bar
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Standardized enterprise feedback bars featuring timed auto-dismissal, top countdown progress bar, pause-on-hover, semantic status colors, and optional system error/status codes.
        </p>
      </div>

      {/* 1. Semantic Status Types */}
      <DemoSection title="1. Semantic Status Types" desc="Visual hierarchy across all 5 semantic feedback categories." erpSource="ERP Response Feedback">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <NotificationBar
            type="success"
            title="Invoice Generated Successfully"
            message="Sales invoice #INV-2026-0892 has been generated and queued for email dispatch."
            code="SUCCESS_200"
          />

          <NotificationBar
            type="info"
            title="Scheduled Maintenance Notice"
            message="System database migration scheduled for Sunday at 02:00 UTC. Expected downtime is under 3 minutes."
            code="INFO_100"
          />

          <NotificationBar
            type="warning"
            title="API Rate Limit Approaching Threshold"
            message="Your organization has consumed 88% of your monthly API allocation. Consider upgrading to prevent throttling."
            code="WARN_429"
          />

          <NotificationBar
            type="error"
            title="Transaction Settlement Failed"
            message="Payment gateway rejected transaction #TX-8910 due to insufficient merchant funds on the connected account."
            code="ERR_PAYMENT_REJECTED"
          />

          <NotificationBar
            type="neutral"
            title="Draft Automatically Saved"
            message="Your invoice draft was preserved locally at 14:32:01."
          />
        </div>
      </DemoSection>

      {/* 2. Timed Auto-Dismissal & Hover-Pause */}
      <DemoSection title="2. Timed Auto-Dismissal with Progress Countdown" desc="Synchronized countdown bar pausing on hover/focus and resuming seamlessly on mouse leave." erpSource="Platform Foundation">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button size="sm" onClick={() => setShow2s(true)}>Spawn 2s Notification</Button>
            <Button size="sm" onClick={() => setShow5s(true)}>Spawn 5s Notification</Button>
            <Button size="sm" variant="outline" onClick={() => setShowManual(true)}>Reset Manual Persistent</Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            {show2s && (
              <NotificationBar
                type="success"
                title="Quick Action Completed (2s Auto-Dismiss)"
                message="Preferences updated. Hover over this bar to pause the dismissal countdown."
                duration={2000}
                onClose={() => setShow2s(false)}
              />
            )}

            {show5s && (
              <NotificationBar
                type="info"
                title="Telemetry Synchronized (5s Auto-Dismiss)"
                message="Cluster status metrics updated. Watch the animated top progress bar reflect remaining time."
                duration={5000}
                onClose={() => setShow5s(false)}
              />
            )}

            {showManual && (
              <NotificationBar
                type="warning"
                title="Persistent Action Required (duration={0})"
                message="Your fiscal certificate expires in 3 days. Please renew to avoid transaction processing interruption."
                code="WARN_CERT_EXPIRING"
                duration={0}
                onClose={() => setShowManual(false)}
              />
            )}
          </div>
        </div>
      </DemoSection>

      {/* 24-Point Specification */}
      <div style={{ marginTop: '4rem', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-xl)', padding: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--skyra-font-display)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--skyra-text)' }}>
          24-Point Component Documentation & Verification
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
          <div><strong>1. Name:</strong> NotificationBar</div>
          <div><strong>2. Package:</strong> <code>@skyra/ui</code></div>
          <div><strong>3. Classification:</strong> [C] Platform UI Primitive</div>
          <div><strong>4. Description:</strong> Enterprise notification banner with synchronized progress timer</div>
          <div><strong>5. Rationale:</strong> Consistent user feedback with pause-on-hover auto-dismiss</div>
          <div><strong>6. When to Use:</strong> Form submissions, async job completions, warning notices</div>
          <div><strong>7. When NOT to Use:</strong> Blocking confirmation dialogs (use Modal/Dialog)</div>
          <div><strong>8. Live Preview:</strong> Interactive demos rendered above</div>
          <div><strong>9. Interactive Controls:</strong> Manual close button, hover pause, resume on leave</div>
          <div><strong>10. Variants:</strong> success, error, warning, info, neutral</div>
          <div><strong>11. Sizes:</strong> Responsive fluid banner layout</div>
          <div><strong>12. States:</strong> active, hovered (paused), dismiss animation, closed</div>
          <div><strong>13. Props/API:</strong> <code>NotificationBarProps</code></div>
          <div><strong>14. Events:</strong> <code>onClose</code>, <code>onDurationEnd</code></div>
          <div><strong>15. Slots/Children:</strong> Title, message, code badge, action links</div>
          <div><strong>16. Accessibility:</strong> <code>role=&quot;alert&quot;</code> or <code>role=&quot;status&quot;</code>, <code>aria-live</code></div>
          <div><strong>17. Keyboard:</strong> Close button reachable via Tab, Space/Enter to close</div>
          <div><strong>18. Responsive:</strong> Stacks gracefully on mobile viewports down to 320px</div>
          <div><strong>19. Dark Mode:</strong> Theme-token backgrounds with calibrated semantic text colors</div>
          <div><strong>20. Code:</strong> Zero external dependencies; precise interval timer hooks</div>
          <div><strong>21. Do/Don&apos;t:</strong> Don&apos;t auto-dismiss critical errors that require immediate action</div>
          <div><strong>22. Related:</strong> Alert, StatusBadge, Dialog</div>
          <div><strong>23. ERP Source:</strong> ERP Toast &amp; Notification bars</div>
          <div><strong>24. Testing:</strong> 4 unit test suites verifying timers, codes, and alert roles</div>
        </div>
      </div>
    </div>
  );
}
