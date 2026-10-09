'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Badge, Tabs, Card, StatusBadge } from '@/components/ui';
import { 
  analyzeScanability, 
  QRContentBuilder, 
  QRContactPayload, 
  QRWifiPayload, 
  QREventPayload, 
  QREmailPayload, 
  QRSmsPayload 
} from '@skyra-tech-platform/qr';
import { jsPDF } from 'jspdf';
import '@skyra-tech-platform/qr/web-component';
import '@skyra-tech-platform/dynamic-select';
import '@skyra-tech-platform/input';
import '@skyra-tech-platform/textarea';
import '@skyra-tech-platform/button';
import '@skyra-tech-platform/notification';
import '@skyra-tech-platform/pdf-viewer';
import '@skyra-tech-platform/dialog';

type QRType = 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi' | 'vcard' | 'calendar';



export default function QRStudio() {
  const [activeType, setActiveType] = useState<QRType>('url');
  
  // Data State
  const [url, setUrl] = useState('https://skyra.tech/demo-qr');
  const [text, setText] = useState('Hello World');
  const [email, setEmail] = useState<QREmailPayload>({ address: 'hello@skyra.tech', subject: '', body: '' });
  const [phone, setPhone] = useState('+1234567890');
  const [sms, setSms] = useState<QRSmsPayload>({ number: '+1234567890', message: 'Hello' });
  const [wifi, setWifi] = useState<QRWifiPayload>({ ssid: 'Skyra_Guest', password: '', encryption: 'WPA', hidden: false });
  const [contact, setContact] = useState<QRContactPayload>({ firstName: 'Jane', lastName: 'Doe', organization: 'Skyra Tech', phone: '+1234567890', email: 'jane.doe@skyra.tech' });
  
  const [event, setEvent] = useState<QREventPayload>({ 
    title: 'Platform Launch', 
    start: new Date(new Date().setHours(10, 0, 0, 0)), 
    end: new Date(new Date().setHours(11, 0, 0, 0)),
    location: 'Skyra HQ',
    description: 'V2.2 Release',
    allDay: false
  });

  // Config State
  const [errorCorrection, setErrorCorrection] = useState<'L'|'M'|'Q'|'H'>('Q');
  const [margin, setMargin] = useState(4);
  const [scale, setScale] = useState(4);
  const [darkColor, setDarkColor] = useState('#0f172a');
  const [lightColor, setLightColor] = useState('#ffffff');
  const [moduleShape, setModuleShape] = useState<'square'|'rounded'|'dot'>('square');
  const [finderShape, setFinderShape] = useState<'square'|'rounded'>('square');
  const [finderColor, setFinderColor] = useState('#0f172a');
  
  const [generatedValue, setGeneratedValue] = useState('');
  
  // Analysis
  const [scanStatus, setScanStatus] = useState<any>(null);
  
  // Notification and Print
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  const [printPdfUrl, setPrintPdfUrl] = useState<string | null>(null);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);

  // Generate payload
  useEffect(() => {
    let payload = '';
    try {
      switch (activeType) {
        case 'url': payload = QRContentBuilder.url(url); break;
        case 'text': payload = QRContentBuilder.text(text); break;
        case 'email': payload = QRContentBuilder.email(email); break;
        case 'phone': payload = QRContentBuilder.phone(phone); break;
        case 'sms': payload = QRContentBuilder.sms(sms); break;
        case 'wifi': payload = QRContentBuilder.wifi(wifi); break;
        case 'vcard': payload = QRContentBuilder.vcard(contact); break;
        case 'calendar': payload = QRContentBuilder.calendar(event); break;
      }
    } catch (e) {
      console.warn('Failed to build payload', e);
    }
    setGeneratedValue(payload);
  }, [activeType, url, text, email, phone, sms, wifi, contact, event]);

  useEffect(() => {
    // We simulate matrix size for basic density analysis (a real app would use the matrix directly)
    // We'll pass a dummy matrix size estimation for now.
    const estVersion = Math.min(40, Math.max(1, Math.ceil(generatedValue.length / 20)));
    
    const analysis = analyzeScanability(
      { size: 21 + (estVersion - 1) * 4, version: estVersion, modules: [], errorCorrectionLevel: errorCorrection }, 
      margin, 
      errorCorrection, 
      darkColor, 
      lightColor
    );
    setScanStatus(analysis);
  }, [generatedValue, margin, errorCorrection, darkColor, lightColor]);

  // Export handlers
  const handleDownloadSVG = () => {
    const qrElement = document.querySelector('skyra-tech-qr-code');
    if (!qrElement || !qrElement.shadowRoot) return;
    const svg = qrElement.shadowRoot.querySelector('svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'skyra-qr.svg';
    a.click();
    URL.revokeObjectURL(url);
    
    setNotification({ message: 'SVG downloaded successfully.', type: 'success' });
  };

  const handleDownloadPNG = () => {
    const qrElement = document.querySelector('skyra-tech-qr-code');
    if (!qrElement || !qrElement.shadowRoot) return;
    const svg = qrElement.shadowRoot.querySelector('svg');
    if (!svg) return;
    
    const svgClone = svg.cloneNode(true) as SVGSVGElement;
    svgClone.setAttribute('width', '1024');
    svgClone.setAttribute('height', '1024');
    const svgData = new XMLSerializer().serializeToString(svgClone);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    // Convert to base64
    const svg64 = btoa(unescape(encodeURIComponent(svgData)));
    const b64Start = 'data:image/svg+xml;base64,';
    const image64 = b64Start + svg64;

    img.onload = () => {
      // High resolution size
      canvas.width = 1024;
      canvas.height = 1024;
      if (ctx) {
        ctx.fillStyle = lightColor === 'transparent' ? '#ffffff' : lightColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = 'skyra-qr.png';
        a.click();
        
        setNotification({ message: 'PNG downloaded successfully.', type: 'success' });
      }
    };
    img.src = image64;
  };

  const handlePrint = () => {
    const qrElement = document.querySelector('skyra-tech-qr-code')?.shadowRoot?.querySelector('svg');
    if (!qrElement) {
      setNotification({ message: 'QR Code not ready', type: 'error' });
      return;
    }
    const svgClone = qrElement.cloneNode(true) as SVGSVGElement;
    svgClone.setAttribute('width', '1024');
    svgClone.setAttribute('height', '1024');
    const svgData = new XMLSerializer().serializeToString(svgClone);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const svg64 = btoa(unescape(encodeURIComponent(svgData)));
    const image64 = 'data:image/svg+xml;base64,' + svg64;

    img.onload = () => {
      canvas.width = 1024;
      canvas.height = 1024;
      if (ctx) {
        ctx.fillStyle = lightColor === 'transparent' ? '#ffffff' : lightColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        try {
          const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          });
          const imgData = canvas.toDataURL('image/png');
          
          doc.setFontSize(24);
          doc.setTextColor(30);
          doc.text('Skyra Platform QR Studio', 105, 50, { align: 'center' });
          
          doc.setFontSize(14);
          doc.setTextColor(100);
          const activeLabel = tabs.find(t => t.id === activeType)?.label || activeType;
          doc.text(`Content Type: ${activeLabel}`, 105, 60, { align: 'center' });
          
          doc.addImage(imgData, 'PNG', 55, 80, 100, 100);
          
          const pdfBlob = doc.output('blob');
          const url = URL.createObjectURL(pdfBlob);
          setPrintPdfUrl(url);
          setIsPrintDialogOpen(true);
        } catch (e) {
          console.error(e);
          setNotification({ message: 'Failed to generate PDF', type: 'error' });
        }
      }
    };
    img.src = image64;
  };

  const tabs = [
    { id: 'url', label: 'URL' },
    { id: 'text', label: 'Text' },
    { id: 'vcard', label: 'vCard' },
    { id: 'wifi', label: 'Wi-Fi' },
    { id: 'email', label: 'Email' },
    { id: 'sms', label: 'SMS' },
    { id: 'calendar', label: 'Calendar' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1.2fr) minmax(300px, 0.8fr)', gap: '2rem', alignItems: 'start' }} className="qr-studio-grid">
      
      {/* LEFT: Configuration */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Data Type */}
        <section style={{ background: 'var(--skyra-surface)', padding: '1.5rem', borderRadius: 'var(--skyra-radius-lg)', border: '1px solid var(--skyra-border)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1rem 0' }}>Content Type</h2>
          <div style={{ marginBottom: '1.5rem' }}>
            <skyra-tech-dynamic-select
              options={tabs.map(t => ({ value: t.id, label: t.label }))}
              value={tabs.find(t => t.id === activeType) ? { value: activeType, label: tabs.find(t => t.id === activeType)?.label } : null}
              onChange={(e: any) => e?.target?.value && setActiveType(e.target.value.value as QRType)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activeType === 'url' && (
              <skyra-tech-input type="url" label="Website URL" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
            )}

            {activeType === 'text' && (
              <skyra-tech-textarea label="Text Content" value={text} onChange={e => setText(e.target.value)} rows={4} />
            )}

            {activeType === 'vcard' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <skyra-tech-input label="First Name" type="text" value={contact.firstName} onChange={e => setContact({...contact, firstName: e.target.value})} />
                <skyra-tech-input label="Last Name" type="text" value={contact.lastName} onChange={e => setContact({...contact, lastName: e.target.value})} />
                <skyra-tech-input label="Organization" type="text" value={contact.organization} onChange={e => setContact({...contact, organization: e.target.value})} />
                <skyra-tech-input label="Phone" type="tel" value={contact.phone} onChange={e => setContact({...contact, phone: e.target.value})} />
                <div style={{ gridColumn: '1 / -1' }}>
                  <skyra-tech-input label="Email" type="email" value={contact.email} onChange={e => setContact({...contact, email: e.target.value})} />
                </div>
              </div>
            )}

            {activeType === 'wifi' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <skyra-tech-input label="Network Name (SSID)" type="text" value={wifi.ssid} onChange={e => setWifi({...wifi, ssid: e.target.value})} />
                </div>
                <skyra-tech-input label="Password" type="text" value={wifi.password} onChange={e => setWifi({...wifi, password: e.target.value})} />
                <skyra-tech-dynamic-select
                  label="Encryption"
                  options={[{ value: 'WPA', label: 'WPA/WPA2' }, { value: 'WEP', label: 'WEP' }, { value: 'nopass', label: 'None' }]}
                  value={{ value: wifi.encryption, label: wifi.encryption === 'WPA' ? 'WPA/WPA2' : wifi.encryption === 'WEP' ? 'WEP' : 'None' }}
                  onChange={(e: any) => e?.target?.value && setWifi({...wifi, encryption: e.target.value.value as any})}
                />
              </div>
            )}

            {activeType === 'email' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <skyra-tech-input label="Email Address" type="email" value={email.address} onChange={e => setEmail({...email, address: e.target.value})} />
                <skyra-tech-input label="Subject" type="text" value={email.subject} onChange={e => setEmail({...email, subject: e.target.value})} />
                <skyra-tech-textarea label="Body" value={email.body} onChange={e => setEmail({...email, body: e.target.value})} rows={3} />
              </div>
            )}

            {activeType === 'sms' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <skyra-tech-input label="Phone Number" type="tel" value={sms.number} onChange={e => setSms({...sms, number: e.target.value})} />
                <skyra-tech-textarea label="Message" value={sms.message} onChange={e => setSms({...sms, message: e.target.value})} rows={3} />
              </div>
            )}

            {activeType === 'calendar' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <skyra-tech-input label="Event Title" type="text" value={event.title} onChange={e => setEvent({...event, title: e.target.value})} />
                <skyra-tech-input label="Location" type="text" value={event.location} onChange={e => setEvent({...event, location: e.target.value})} />
                <skyra-tech-textarea label="Description" value={event.description} onChange={e => setEvent({...event, description: e.target.value})} rows={2} />
              </div>
            )}
          </div>
        </section>

        {/* Design / Configuration */}
        <section style={{ background: 'var(--skyra-surface)', padding: '1.5rem', borderRadius: 'var(--skyra-radius-lg)', border: '1px solid var(--skyra-border)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1rem 0' }}>Design & Validation</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            
            <skyra-tech-dynamic-select
              label="Error Correction"
              options={[
                { value: 'L', label: 'Low (~7%)' },
                { value: 'M', label: 'Medium (~15%)' },
                { value: 'Q', label: 'Quartile (~25%)' },
                { value: 'H', label: 'High (~30%)' }
              ]}
              value={{ value: errorCorrection, label: errorCorrection === 'L' ? 'Low (~7%)' : errorCorrection === 'M' ? 'Medium (~15%)' : errorCorrection === 'Q' ? 'Quartile (~25%)' : 'High (~30%)' }}
              onChange={(e: any) => e?.target?.value && setErrorCorrection(e.target.value.value as any)}
            />
            
            <skyra-tech-input 
              label="Quiet Zone (Margin)" 
              type="number" 
              min="0" max="10" 
              value={String(margin)} 
              onChange={e => setMargin(parseInt(e.target.value, 10)||0)} 
            />

            <div className="input-group">
              <label>Foreground Color</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="color" value={darkColor} onChange={e => setDarkColor(e.target.value)} style={{ width: '40px', height: '40px', padding: '0', border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
                <skyra-tech-input type="text" value={darkColor} onChange={e => setDarkColor(e.target.value)} style={{ flex: 1 }} />
              </div>
            </div>

            <div className="input-group">
              <label>Background Color</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="color" value={lightColor} onChange={e => setLightColor(e.target.value)} style={{ width: '40px', height: '40px', padding: '0', border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
                <skyra-tech-input type="text" value={lightColor} onChange={e => setLightColor(e.target.value)} style={{ flex: 1 }} />
              </div>
            </div>

            <skyra-tech-dynamic-select
              label="Module Shape"
              options={[
                { value: 'square', label: 'Square' },
                { value: 'rounded', label: 'Rounded' },
                { value: 'dot', label: 'Dot' }
              ]}
              value={{ value: moduleShape, label: moduleShape.charAt(0).toUpperCase() + moduleShape.slice(1) }}
              onChange={(e: any) => e?.target?.value && setModuleShape(e.target.value.value as any)}
            />

            <skyra-tech-dynamic-select
              label="Finder Shape"
              options={[
                { value: 'square', label: 'Square' },
                { value: 'rounded', label: 'Rounded' }
              ]}
              value={{ value: finderShape, label: finderShape.charAt(0).toUpperCase() + finderShape.slice(1) }}
              onChange={(e: any) => e?.target?.value && setFinderShape(e.target.value.value as any)}
            />

            <div className="input-group">
              <label>Finder Color</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="color" value={finderColor} onChange={e => setFinderColor(e.target.value)} style={{ width: '40px', height: '40px', padding: '0', border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
                <skyra-tech-input type="text" value={finderColor} onChange={e => setFinderColor(e.target.value)} style={{ flex: 1 }} />
              </div>
            </div>
            
          </div>
        </section>
      </div>

      {/* RIGHT: Live Preview */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '2rem' }}>
        <div 
          className="qr-print-container"
          style={{ 
            background: 'var(--skyra-surface)', 
            padding: '2rem', 
            borderRadius: 'var(--skyra-radius-lg)', 
            border: '1px solid var(--skyra-border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px'
          }}
        >
          {generatedValue ? (
            // @ts-ignore - Web component
            <skyra-tech-qr-code
              value={generatedValue}
              error-correction-level={errorCorrection}
              margin={margin}
              scale={scale}
              color-dark={darkColor}
              color-light={lightColor}
              module-shape={moduleShape}
              finder-shape={finderShape}
              finder-color={finderColor}
            />
          ) : (
            <div style={{ color: 'var(--skyra-text-muted)', textAlign: 'center' }}>
              <p>Enter data to generate QR</p>
            </div>
          )}
        </div>

        {/* Scanability Status */}
        {scanStatus && (
          <div style={{ 
            padding: '1rem', 
            borderRadius: 'var(--skyra-radius-md)', 
            border: `1px solid ${scanStatus.overallStatus === 'PASS' ? 'var(--skyra-success)' : scanStatus.overallStatus === 'WARNING' ? 'var(--skyra-warning)' : 'var(--skyra-error)'}`,
            background: `var(--skyra-${scanStatus.overallStatus === 'PASS' ? 'success' : scanStatus.overallStatus === 'WARNING' ? 'warning' : 'error'}-alpha-10)`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ 
                width: '12px', height: '12px', borderRadius: '50%', 
                background: `var(--skyra-${scanStatus.overallStatus === 'PASS' ? 'success' : scanStatus.overallStatus === 'WARNING' ? 'warning' : 'error'})` 
              }} />
              <strong style={{ fontSize: '0.95rem' }}>
                {scanStatus.overallStatus === 'PASS' ? 'Highly Scannable' : scanStatus.overallStatus === 'WARNING' ? 'Needs Attention' : 'Likely Difficult to Scan'}
              </strong>
            </div>
            
            {scanStatus.issues.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.85rem', color: 'var(--skyra-text-muted)' }}>
                {scanStatus.issues.map((iss: string, i: number) => <li key={i}>{iss}</li>)}
              </ul>
            ) : (
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--skyra-text-muted)' }}>Contrast ratio is {scanStatus.contrast}:1. Margins are sufficient.</p>
            )}
          </div>
        )}

        {/* Export Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <skyra-tech-button onClick={handleDownloadSVG} variant="outline" style={{ flex: 1 }}>Download SVG</skyra-tech-button>
          <skyra-tech-button onClick={handleDownloadPNG} variant="outline" style={{ flex: 1 }}>Download PNG</skyra-tech-button>
          <skyra-tech-button onClick={handlePrint} variant="outline" style={{ flex: 1 }}>Print</skyra-tech-button>
        </div>
        
        {notification && (
          <div style={{ marginTop: '0.5rem' }}>
            <skyra-notification-bar 
              type={notification.type} 
              duration="3000" 
              // @ts-ignore
              onSkyra-close={() => setNotification(null)}
            >
              <span slot="title">{notification.type === 'success' ? 'Success' : 'Info'}</span>
              {notification.message}
            </skyra-notification-bar>
          </div>
        )}

        <skyra-tech-dialog 
          open={isPrintDialogOpen}
          size="xl" 
          // @ts-ignore
          onSkyra-close={() => setIsPrintDialogOpen(false)}
          title="Print Preview"
        >
          <div style={{ height: '75vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {printPdfUrl ? (
              <skyra-tech-pdf-viewer 
                src={printPdfUrl} 
                style={{ flex: 1, width: '100%', height: '100%', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)' }}
              />
            ) : (
              <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                Generating Print Preview...
              </div>
            )}
          </div>
          <div slot="footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', padding: '1rem', borderTop: '1px solid var(--skyra-border)' }}>
            <skyra-tech-button onClick={() => setIsPrintDialogOpen(false)} variant="ghost">Close</skyra-tech-button>
            <skyra-tech-button onClick={() => {
              if (printPdfUrl) {
                const a = document.createElement('a');
                a.href = printPdfUrl;
                a.download = 'skyra-qr.pdf';
                a.click();
              }
            }}>Download PDF</skyra-tech-button>
          </div>
        </skyra-tech-dialog>
      </div>
      
      {/* GLOBAL STYLES FOR THE PAGE */}
      <style>{`
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .input-group label {
          font-size: 0.85rem;
          color: var(--skyra-text-muted);
          font-weight: 500;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          .qr-print-container, .qr-print-container * {
            visibility: visible;
          }
          .qr-print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            border: none !important;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

const inputStyle = {
  padding: '0.6rem 0.75rem',
  borderRadius: 'var(--skyra-radius-md)',
  border: '1px solid var(--skyra-border)',
  background: 'var(--skyra-bg)',
  color: 'var(--skyra-text)',
  fontSize: '0.9rem',
  outline: 'none',
  fontFamily: 'inherit'
};

const btnStyle = {
  padding: '0.6rem 1rem',
  borderRadius: 'var(--skyra-radius-md)',
  border: '1px solid var(--skyra-border)',
  background: 'var(--skyra-surface)',
  color: 'var(--skyra-text)',
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontWeight: 500,
  flex: 1
};
