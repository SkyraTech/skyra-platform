'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import QRStudio from './QRStudio';

export default function QRCodeStudioPage() {
  return (
    <main className="dash-page qr-page-wrapper" id="main-content">
      <div className="qr-page-header">
        <div style={{ marginBottom: '0.75rem' }}>
          <Link
            href="/ui-components"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--skyra-primary)',
              fontSize: '0.875rem',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            <span>Back to UI Playground</span>
          </Link>
        </div>
        <h1 className="qr-page-title">
          QR Code Studio
        </h1>
        <p className="qr-page-desc">
          Create, customize, and export production-ready vector QR codes with real-time scanability validation, customizable styles, and multi-format payloads.
        </p>
      </div>

      <QRStudio />

      <style>{`
        .qr-page-wrapper {
          max-width: 1440px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
          padding-bottom: 3rem;
        }
        .qr-page-header {
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .qr-page-title {
          font-family: var(--skyra-font-display, inherit);
          font-weight: 800;
          font-size: 2rem;
          color: var(--skyra-text, #0f172a);
          margin: 0;
          letter-spacing: -0.02em;
        }
        .qr-page-desc {
          color: #334155;
          max-width: 800px;
          font-size: 0.95rem;
          margin: 0;
          line-height: 1.5;
        }
        :global(.dark) .qr-page-desc {
          color: #cbd5e1;
        }
        @media (max-width: 640px) {
          .qr-page-wrapper {
            padding-left: 0.75rem !important;
            padding-right: 0.75rem !important;
          }
          .qr-page-title {
            font-size: 1.5rem;
          }
        }
        @media (max-width: 380px) {
          .qr-page-wrapper {
            padding-left: 0.35rem !important;
            padding-right: 0.35rem !important;
          }
        }
      `}</style>
    </main>
  );
}
