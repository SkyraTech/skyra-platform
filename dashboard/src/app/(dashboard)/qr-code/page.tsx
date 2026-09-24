'use client';

import React, { useState } from 'react';
import { Input, Badge } from '@skyra/ui';
import { QRCode } from '@skyra/qr/react';

export default function QRCodeShowcase() {
  const [value, setValue] = useState('https://skyra.tech/demo-qr');
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<'L' | 'M' | 'Q' | 'H'>('Q');
  const [margin, setMargin] = useState(2);
  const [scale, setScale] = useState(4);
  const [darkColor, setDarkColor] = useState('#0f172a');
  const [lightColor, setLightColor] = useState('#ffffff');

  return (
    <div className="dash-page" style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto', paddingBottom: '3rem' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.85rem', color: 'var(--skyra-text)', margin: 0 }}>
            QR Code Showcase
          </h1>
          <Badge variant="primary" style={{ fontFamily: 'monospace' }}>@skyra/qr</Badge>
        </div>
        <p style={{ color: 'var(--skyra-text-muted)', maxWidth: '800px', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
          Generate and preview highly scannable QR codes using Skyra Platform's reusable QR engine. Fully accessible SVG output.
        </p>
      </header>

      {/* Main Layout: 2 columns */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Left Col: Config */}
        <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <section 
            aria-label="Configuration Panel"
            style={{ 
              background: 'var(--skyra-surface)', 
              border: '1px solid var(--skyra-border)', 
              borderRadius: 'var(--skyra-radius-lg)', 
              padding: '1.5rem', 
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--skyra-text)', margin: 0 }}>Configuration</h2>
            
            {/* Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--skyra-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Content</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--skyra-text)' }}>Payload Value</label>
                <Input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter URL or text..."
                  style={{ fontFamily: 'monospace', height: '2.5rem' }}
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--skyra-border)' }} />

            {/* Rendering */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--skyra-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Rendering Options</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--skyra-text)' }}>Error Correction</label>
                  <select
                    value={errorCorrectionLevel}
                    onChange={(e) => setErrorCorrectionLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                    style={{
                      height: '2.5rem',
                      width: '100%',
                      borderRadius: 'var(--skyra-radius-md)',
                      border: '1px solid var(--skyra-border)',
                      background: 'var(--skyra-bg)',
                      color: 'var(--skyra-text)',
                      padding: '0 0.75rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="L">Low (7%)</option>
                    <option value="M">Medium (15%)</option>
                    <option value="Q">Quartile (25%)</option>
                    <option value="H">High (30%)</option>
                  </select>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--skyra-text)' }}>Scale (px/mod)</label>
                  <Input
                    type="number"
                    value={scale}
                    min={1}
                    max={20}
                    onChange={(e) => setScale(Number(e.target.value))}
                    style={{ height: '2.5rem' }}
                  />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--skyra-text)' }}>Quiet Zone</label>
                  <Input
                    type="number"
                    value={margin}
                    min={0}
                    max={10}
                    onChange={(e) => setMargin(Number(e.target.value))}
                    style={{ height: '2.5rem' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--skyra-border)' }} />

            {/* Styling */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--skyra-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Colors</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--skyra-text)' }}>Foreground</label>
                  <Input
                    type="text"
                    value={darkColor}
                    onChange={(e) => setDarkColor(e.target.value)}
                    className="font-mono uppercase"
                    prefix={
                      <div style={{
                        width: '1.25rem',
                        height: '1.25rem',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        border: '1px solid var(--skyra-border)',
                        position: 'relative',
                        boxShadow: 'var(--skyra-shadow-sm)',
                        pointerEvents: 'auto', // Must re-enable pointer events since prefix container has pointer-events: none
                      }}>
                        <input
                          type="color"
                          value={darkColor}
                          onChange={(e) => setDarkColor(e.target.value)}
                          style={{
                            width: '200%',
                            height: '200%',
                            margin: '-50%',
                            padding: 0,
                            border: 'none',
                            cursor: 'pointer',
                            background: 'none'
                          }}
                        />
                      </div>
                    }
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--skyra-text)' }}>Background</label>
                  <Input
                    type="text"
                    value={lightColor}
                    onChange={(e) => setLightColor(e.target.value)}
                    className="font-mono uppercase"
                    prefix={
                      <div style={{
                        width: '1.25rem',
                        height: '1.25rem',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        border: '1px solid var(--skyra-border)',
                        position: 'relative',
                        boxShadow: 'var(--skyra-shadow-sm)',
                        pointerEvents: 'auto',
                      }}>
                        <input
                          type="color"
                          value={lightColor}
                          onChange={(e) => setLightColor(e.target.value)}
                          style={{
                            width: '200%',
                            height: '200%',
                            margin: '-50%',
                            padding: 0,
                            border: 'none',
                            cursor: 'pointer',
                            background: 'none'
                          }}
                        />
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Capabilities */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1.25rem', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--skyra-text)', margin: '0 0 0.35rem 0' }}>SVG Matrix Rendering</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--skyra-text-muted)', margin: 0, lineHeight: 1.4 }}>Lightweight, infinitely scalable vector output via <code>&lt;svg&gt;</code> elements.</p>
            </div>
            <div style={{ padding: '1.25rem', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--skyra-text)', margin: '0 0 0.35rem 0' }}>Error Correction</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--skyra-text-muted)', margin: 0, lineHeight: 1.4 }}>Up to 30% structural damage recovery ensures scannability.</p>
            </div>
          </div>
        </div>

        {/* Right Col: Preview */}
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '100px' }}>
          
          <section 
            aria-label="Live Preview"
            style={{ 
              background: 'var(--skyra-surface)', 
              border: '1px solid var(--skyra-border)', 
              borderRadius: 'var(--skyra-radius-lg)', 
              overflow: 'hidden',
              boxShadow: 'var(--skyra-shadow-sm)',
            }}
          >
            {/* Window bar */}
            <div style={{ 
              background: 'var(--skyra-bg)', 
              padding: '0.75rem 1.25rem', 
              borderBottom: '1px solid var(--skyra-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--skyra-text)' }}>Live Preview Stage</span>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--skyra-border)' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--skyra-border)' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--skyra-border)' }} />
              </div>
            </div>

            {/* Stage */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '4rem 2rem', 
              minHeight: '360px',
              background: 'var(--skyra-bg)',
              backgroundImage: 'radial-gradient(var(--skyra-border) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}>
              <div style={{ 
                padding: '1.25rem', 
                background: '#fff', 
                borderRadius: '0.75rem', 
                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
                border: '1px solid rgba(0,0,0,0.05)',
                transition: 'transform 0.2s ease',
              }}>
                {value ? (
                  <div style={{ display: 'block' }}>
                    <QRCode
                      value={value}
                      errorCorrectionLevel={errorCorrectionLevel}
                      margin={margin}
                      scale={scale}
                      color={{ dark: darkColor, light: lightColor }}
                      aria-label={`QR Code encoding: ${value}`}
                    />
                  </div>
                ) : (
                  <div style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)', background: 'var(--skyra-surface)' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--skyra-text-muted)', fontWeight: 500 }}>No payload</span>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div style={{ 
              padding: '1rem 1.25rem', 
              background: 'var(--skyra-surface)', 
              borderTop: '1px solid var(--skyra-border)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--skyra-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Encoded Data</span>
                <Badge variant="neutral" style={{ fontSize: '0.7rem' }}>EC: {errorCorrectionLevel}</Badge>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--skyra-text)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {value || 'Empty'}
              </div>
            </div>
          </section>

          {/* Code */}
          <section style={{ 
            background: 'var(--skyra-surface)', 
            border: '1px solid var(--skyra-border)', 
            borderRadius: 'var(--skyra-radius-lg)', 
            overflow: 'hidden' 
          }}>
            <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--skyra-border)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--skyra-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Implementation code</span>
            </div>
            <pre style={{ 
              margin: 0, 
              padding: '1.25rem', 
              background: '#0B111E', 
              color: '#E2E8F0', 
              fontSize: '0.85rem', 
              fontFamily: 'monospace', 
              overflowX: 'auto',
              lineHeight: 1.6
            }}>
<span style={{ color: '#38BDF8' }}>import</span> {'{ '} <span style={{ color: '#FDE047' }}>QRCode</span> {' }'} <span style={{ color: '#38BDF8' }}>from</span> <span style={{ color: '#34D399' }}>'@skyra/qr/react'</span>;{'\n\n'}
<span style={{ color: '#64748B' }}>// React Usage</span>{'\n'}
{'<'}<span style={{ color: '#FDE047' }}>QRCode</span>{'\n'}
{'  '}<span style={{ color: '#38BDF8' }}>value</span>={'{'}<span style={{ color: '#34D399' }}>'{value}'</span>{'}'}{'\n'}
{'  '}<span style={{ color: '#38BDF8' }}>errorCorrectionLevel</span>={'{'}<span style={{ color: '#34D399' }}>'{errorCorrectionLevel}'</span>{'}'}{'\n'}
{'  '}<span style={{ color: '#38BDF8' }}>margin</span>={'{'}<span style={{ color: '#FB923C' }}>{margin}</span>{'}'}{'\n'}
{'  '}<span style={{ color: '#38BDF8' }}>scale</span>={'{'}<span style={{ color: '#FB923C' }}>{scale}</span>{'}'}{'\n'}
{'  '}<span style={{ color: '#38BDF8' }}>color</span>={'{'}{'{ '}{'\n'}
{'    '}<span style={{ color: '#38BDF8' }}>dark</span>: <span style={{ color: '#34D399' }}>'{darkColor}'</span>,{'\n'}
{'    '}<span style={{ color: '#38BDF8' }}>light</span>: <span style={{ color: '#34D399' }}>'{lightColor}'</span>{'\n'}
{'  '}{'}'}{'}'}{'\n'}
{'/>'}
            </pre>
          </section>

        </div>
      </div>
    </div>
  );
}
