'use client';

import React from 'react';
import { PrintButton, DownloadButton } from '@skyra/ui';
import { DemoSection, DemoBlock } from '@/components/demos/DemoSection';

export default function PrintShowcasePage() {
  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', margin: 0 }}>
          Print & Download Capabilities
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Reusable document action buttons supporting target DOM container printing, print lifecycle hooks (<code>onBeforePrint</code> / <code>onAfterPrint</code>), and generic download triggers.
        </p>
      </div>

      <DemoSection title="1. Printable Report Target" desc="Click the Print button to trigger print preview targeting the isolated container below." erpSource="Platform Architecture [C]">
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <PrintButton
              target="printable-audit-report"
              onBeforePrint={() => console.log('Preparing print styles...')}
              onAfterPrint={() => console.log('Print dialog completed.')}
            >
              Print Audit Summary
            </PrintButton>

            <DownloadButton
              url="/sample-document.pdf"
              filename="Q3-2026-Audit.pdf"
              variant="outline"
            >
              Download PDF Report
            </DownloadButton>
          </div>

          <DemoBlock title="Printable Target Container (#printable-audit-report)">
            <div id="printable-audit-report" style={{ width: '100%', padding: '1.5rem', background: 'var(--skyra-bg)', border: '1px dashed var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--skyra-primary)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--skyra-text)', fontSize: '1.1rem' }}>Skyra Enterprise Audit Summary</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--skyra-text-muted)' }}>Generated: 2026-09-09 • Target Branch: Production</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.85rem', fontWeight: 600, color: 'var(--skyra-primary)' }}>
                  CONFIDENTIAL
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'var(--skyra-surface)', textAlign: 'left' }}>
                    <th style={{ padding: '8px', border: '1px solid var(--skyra-border)' }}>Metric</th>
                    <th style={{ padding: '8px', border: '1px solid var(--skyra-border)' }}>Status</th>
                    <th style={{ padding: '8px', border: '1px solid var(--skyra-border)' }}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid var(--skyra-border)' }}>Accessibility (Axe Audit)</td>
                    <td style={{ padding: '8px', border: '1px solid var(--skyra-border)', color: 'var(--skyra-success)' }}>100% PASS</td>
                    <td style={{ padding: '8px', border: '1px solid var(--skyra-border)' }}>0 Violations</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid var(--skyra-border)' }}>Responsive Matrix (320px-1536px)</td>
                    <td style={{ padding: '8px', border: '1px solid var(--skyra-border)', color: 'var(--skyra-success)' }}>100% PASS</td>
                    <td style={{ padding: '8px', border: '1px solid var(--skyra-border)' }}>7 Viewports</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid var(--skyra-border)' }}>Architecture Boundaries</td>
                    <td style={{ padding: '8px', border: '1px solid var(--skyra-border)', color: 'var(--skyra-success)' }}>VERIFIED</td>
                    <td style={{ padding: '8px', border: '1px solid var(--skyra-border)' }}>Zero Coupling</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </DemoBlock>
        </div>
      </DemoSection>

      {/* 24-Point Specification */}
      <div style={{ marginTop: '4rem', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-xl)', padding: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--skyra-font-display)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--skyra-text)' }}>
          24-Point Component Documentation & Verification
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
          <div><strong>1. Name:</strong> PrintButton &amp; DownloadButton</div>
          <div><strong>2. Package:</strong> <code>@skyra/ui</code></div>
          <div><strong>3. Classification:</strong> [C] Platform Action Primitive</div>
          <div><strong>4. Description:</strong> Target-based printable trigger and generic file downloader</div>
          <div><strong>5. Rationale:</strong> Encapsulate print stylesheets and download blob creation</div>
          <div><strong>6. When to Use:</strong> Invoice printing, report export, document downloads</div>
          <div><strong>7. When NOT to Use:</strong> Standard navigation links or form submit buttons</div>
          <div><strong>8. Live Preview:</strong> Interactive demo rendered above</div>
          <div><strong>9. Interactive Controls:</strong> Click to print / download</div>
          <div><strong>10. Variants:</strong> primary, outline, secondary, ghost</div>
          <div><strong>11. Sizes:</strong> sm, md, lg matching standard Button primitives</div>
          <div><strong>12. States:</strong> idle, printing, downloading, disabled</div>
          <div><strong>13. Props/API:</strong> <code>PrintButtonProps</code>, <code>DownloadButtonProps</code></div>
          <div><strong>14. Events:</strong> <code>onBeforePrint</code>, <code>onAfterPrint</code>, <code>onDownload</code></div>
          <div><strong>15. Slots/Children:</strong> Button text, custom print icons</div>
          <div><strong>16. Accessibility:</strong> ARIA label support, keyboard focusable</div>
          <div><strong>17. Keyboard:</strong> Enter / Space to activate</div>
          <div><strong>18. Responsive:</strong> Fluid sizing adapting to toolbars and mobile drawers</div>
          <div><strong>19. Dark Mode:</strong> Theme compliance via standard button tokens</div>
          <div><strong>20. Code:</strong> Zero business logic; isolated target-based DOM printing</div>
          <div><strong>21. Do/Don&apos;t:</strong> Do set target container ID to isolate printable areas</div>
          <div><strong>22. Related:</strong> PdfViewer, ExportButton, ExportMenu</div>
          <div><strong>23. ERP Source:</strong> ERP Invoice &amp; Report Print Actions</div>
          <div><strong>24. Testing:</strong> 5 unit test suites with 100% pass rate</div>
        </div>
      </div>
    </div>
  );
}
