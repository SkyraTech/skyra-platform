'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  analyzeScanability,
  generateQRCode,
  renderToSVGString,
  QRContentBuilder, 
  QRContactPayload, 
  QRWifiPayload, 
  QREventPayload, 
  QREmailPayload, 
  QRSmsPayload,
  QRGeoPayload,
  QRCodeMatrix
} from '@skyra-tech-platform/qr';
import '@skyra-tech-platform/qr/web-component';
import { 
  Globe, 
  FileText, 
  Phone, 
  MessageSquare, 
  Mail, 
  Wifi, 
  User, 
  Calendar as CalendarIcon, 
  MapPin, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  RotateCcw,
  Check,
  Copy,
  Eye
} from 'lucide-react';

export type QRContentType = 'url' | 'text' | 'phone' | 'sms' | 'email' | 'wifi' | 'vcard' | 'calendar' | 'geo';

interface ContentTabDef {
  id: QRContentType;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
}

const CONTENT_TABS: ContentTabDef[] = [
  { id: 'url', label: 'URL', icon: Globe, description: 'Website links, deep links, or URLs' },
  { id: 'text', label: 'Text', icon: FileText, description: 'Plain text messages or notes' },
  { id: 'phone', label: 'Phone', icon: Phone, description: 'Direct telephone dialer action' },
  { id: 'sms', label: 'SMS', icon: MessageSquare, description: 'Pre-filled text messages' },
  { id: 'email', label: 'Email', icon: Mail, description: 'Pre-addressed email drafts' },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi, description: 'Automatic Wi-Fi network connection' },
  { id: 'vcard', label: 'vCard', icon: User, description: 'Digital business contact card' },
  { id: 'calendar', label: 'Calendar', icon: CalendarIcon, description: 'iCalendar scheduled events' },
  { id: 'geo', label: 'Geo', icon: MapPin, description: 'GPS coordinates and locations' },
];

export default function QRStudio() {
  const [activeType, setActiveType] = useState<QRContentType>('url');

  // ─── 9 Content Type States ────────────────────────────────────────────────
  const [url, setUrl] = useState('https://skyra.tech');
  const [text, setText] = useState('Welcome to Skyra Tech Platform');
  const [phone, setPhone] = useState('+1 555-0199');
  const [sms, setSms] = useState<QRSmsPayload>({ number: '+1 555-0199', message: 'Hello from Skyra Tech!' });
  const [email, setEmail] = useState<QREmailPayload>({ address: 'hello@skyra.tech', subject: 'Platform Inquiry', body: 'Hello Skyra Team,' });
  const [wifi, setWifi] = useState<QRWifiPayload>({ ssid: 'Skyra_Office', password: 'PlatformPassword123', encryption: 'WPA', hidden: false });
  const [contact, setContact] = useState<QRContactPayload>({
    firstName: 'Jane',
    lastName: 'Doe',
    organization: 'Skyra Technologies',
    phone: '+1 555-0199',
    email: 'jane.doe@skyra.tech',
    website: 'https://skyra.tech',
    address: '100 Innovation Way, Tech City'
  });
  const [event, setEvent] = useState<QREventPayload>({
    title: 'Skyra Platform Launch',
    start: '2026-10-20T10:00',
    end: '2026-10-20T11:00',
    location: 'Skyra HQ, Innovation Hall',
    description: 'Product rollout and developer demonstration',
    allDay: false
  });
  const [geo, setGeo] = useState<QRGeoPayload>({ latitude: 37.7749, longitude: -122.4194 });

  // ─── Customization Appearance State ───────────────────────────────────────
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [margin, setMargin] = useState(4);
  const [previewWidth, setPreviewWidth] = useState(260);
  const [darkColor, setDarkColor] = useState('#0f172a');
  const [lightColor, setLightColor] = useState('#ffffff');
  const [isTransparentBg, setIsTransparentBg] = useState(false);
  const [moduleShape, setModuleShape] = useState<'square' | 'rounded' | 'dot'>('square');
  const [finderShape, setFinderShape] = useState<'square' | 'rounded'>('square');
  const [finderColor, setFinderColor] = useState('#0f172a');

  // ─── Operational & Feedback State ─────────────────────────────────────────
  const [generatedPayload, setGeneratedPayload] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Effective light background color taking transparency into account
  const effectiveLightColor = isTransparentBg ? 'transparent' : lightColor;

  // ─── Payload Construction & Validation ───────────────────────────────────
  useEffect(() => {
    let payload = '';
    let error: string | null = null;

    try {
      switch (activeType) {
        case 'url':
          if (!url.trim()) error = 'Please enter a valid website URL.';
          else payload = QRContentBuilder.url(url.trim());
          break;
        case 'text':
          if (!text.trim()) error = 'Please enter text content.';
          else payload = QRContentBuilder.text(text);
          break;
        case 'phone':
          if (!phone.trim()) error = 'Please enter a telephone number.';
          else payload = QRContentBuilder.phone(phone.trim());
          break;
        case 'sms':
          if (!sms.number.trim()) error = 'Please enter a recipient phone number.';
          else payload = QRContentBuilder.sms(sms);
          break;
        case 'email':
          if (!email.address.trim()) error = 'Please enter a recipient email address.';
          else payload = QRContentBuilder.email(email);
          break;
        case 'wifi':
          if (!wifi.ssid.trim()) error = 'Please enter a Wi-Fi network name (SSID).';
          else payload = QRContentBuilder.wifi(wifi);
          break;
        case 'vcard':
          if (!contact.firstName?.trim() && !contact.lastName?.trim() && !contact.organization?.trim()) {
            error = 'Please provide at least a name or an organization for the contact card.';
          } else {
            payload = QRContentBuilder.vcard(contact);
          }
          break;
        case 'calendar':
          if (!event.title.trim()) {
            error = 'Please provide an event title.';
          } else {
            payload = QRContentBuilder.calendar(event);
          }
          break;
        case 'geo':
          if (isNaN(geo.latitude) || isNaN(geo.longitude)) {
            error = 'Latitude and Longitude must be valid numbers.';
          } else if (geo.latitude < -90 || geo.latitude > 90) {
            error = 'Latitude must be between -90 and 90.';
          } else if (geo.longitude < -180 || geo.longitude > 180) {
            error = 'Longitude must be between -180 and 180.';
          } else {
            payload = QRContentBuilder.geo(geo);
          }
          break;
      }
    } catch (err: any) {
      error = err?.message || 'Failed to construct payload.';
    }

    setValidationError(error);
    setGeneratedPayload(error ? '' : payload);
  }, [activeType, url, text, phone, sms, email, wifi, contact, event, geo]);

  // ─── Scanability Analysis ────────────────────────────────────────────────
  const scanStatus = useMemo(() => {
    if (!generatedPayload) return null;

    let matrix: QRCodeMatrix | null = null;
    try {
      matrix = generateQRCode(generatedPayload, { errorCorrectionLevel: errorCorrection });
    } catch {
      // Fallback matrix estimation if payload density is high
      const estVersion = Math.min(40, Math.max(1, Math.ceil(generatedPayload.length / 25)));
      matrix = {
        size: 21 + (estVersion - 1) * 4,
        version: estVersion,
        modules: [],
        errorCorrectionLevel: errorCorrection
      };
    }

    return analyzeScanability(
      matrix,
      margin,
      errorCorrection,
      darkColor,
      effectiveLightColor
    );
  }, [generatedPayload, margin, errorCorrection, darkColor, effectiveLightColor]);

  // ─── Toast Feedback Timer ────────────────────────────────────────────────
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // ─── Export Handlers ─────────────────────────────────────────────────────
  const handleDownloadSVG = useCallback(() => {
    if (!generatedPayload) return;

    try {
      const qrEl = previewContainerRef.current?.querySelector('skyra-tech-qr-code') as any;
      let svgMarkup = '';

      if (qrEl && typeof qrEl.getSVG === 'function') {
        svgMarkup = qrEl.getSVG();
      }

      if (!svgMarkup) {
        const matrix = generateQRCode(generatedPayload, { errorCorrectionLevel: errorCorrection });
        svgMarkup = renderToSVGString(matrix, {
          margin,
          scale: 4,
          color: { dark: darkColor, light: effectiveLightColor },
          style: { moduleShape, finderShape, finderColor },
          responsive: true
        });
      }

      const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `skyra-qr-${activeType}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      setToastMessage({ text: 'SVG exported successfully.', type: 'success' });
    } catch (err: any) {
      console.error('Failed to export SVG:', err);
      setToastMessage({ text: 'Failed to export SVG.', type: 'error' });
    }
  }, [generatedPayload, errorCorrection, margin, darkColor, effectiveLightColor, moduleShape, finderShape, finderColor, activeType]);

  const handleDownloadPNG = useCallback(() => {
    if (!generatedPayload) return;

    try {
      const matrix = generateQRCode(generatedPayload, { errorCorrectionLevel: errorCorrection });
      const svgMarkup = renderToSVGString(matrix, {
        margin,
        scale: 4,
        color: { dark: darkColor, light: effectiveLightColor },
        style: { moduleShape, finderShape, finderColor },
        responsive: true
      });

      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not acquire 2D canvas context.');

      const img = new Image();
      const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        if (!isTransparentBg) {
          ctx.fillStyle = lightColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);

        canvas.toBlob((blob) => {
          if (!blob) return;
          const pngUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = pngUrl;
          a.download = `skyra-qr-${activeType}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(pngUrl);
          setToastMessage({ text: 'High-resolution PNG exported successfully.', type: 'success' });
        }, 'image/png');
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        setToastMessage({ text: 'Failed to rasterize PNG image.', type: 'error' });
      };

      img.src = url;
    } catch (err: any) {
      console.error('Failed to export PNG:', err);
      setToastMessage({ text: 'Failed to generate PNG export.', type: 'error' });
    }
  }, [generatedPayload, errorCorrection, margin, darkColor, effectiveLightColor, isTransparentBg, lightColor, moduleShape, finderShape, finderColor, activeType]);

  const handlePrint = useCallback(() => {
    if (!generatedPayload) return;
    setToastMessage({ text: 'Opening system print dialog...', type: 'info' });
    setTimeout(() => {
      window.print();
    }, 150);
  }, [generatedPayload]);

  const handleCopyPayload = useCallback(() => {
    if (!generatedPayload) return;
    navigator.clipboard.writeText(generatedPayload).then(() => {
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2000);
      setToastMessage({ text: 'QR Payload copied to clipboard.', type: 'success' });
    });
  }, [generatedPayload]);

  const handleResetDefaults = () => {
    setErrorCorrection('M');
    setMargin(4);
    setPreviewWidth(260);
    setDarkColor('#0f172a');
    setLightColor('#ffffff');
    setIsTransparentBg(false);
    setModuleShape('square');
    setFinderShape('square');
    setFinderColor('#0f172a');
    setToastMessage({ text: 'Design options reset to defaults.', type: 'info' });
  };

  return (
    <div className="qr-studio-root">
      
      {/* ─── PRINT SHEET (Visible only during window.print()) ────────────────── */}
      <div className="qr-print-sheet" aria-hidden="true">
        <div className="qr-print-card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#0f172a' }}>
            Skyra Tech QR Studio
          </h2>
          <p style={{ margin: '0 0 1.5rem 0', color: '#334155', fontSize: '0.9rem' }}>
            Content Type: <strong>{CONTENT_TABS.find(t => t.id === activeType)?.label}</strong>
          </p>

          <div style={{ width: '320px', height: '320px', margin: '0 auto 1.5rem auto' }}>
            {generatedPayload && (
              <skyra-tech-qr-code
                value={generatedPayload}
                error-correction-level={errorCorrection}
                margin={margin}
                scale={6}
                width="320"
                color-dark={darkColor}
                color-light={isTransparentBg ? '#ffffff' : lightColor}
                module-shape={moduleShape}
                finder-shape={finderShape}
                finder-color={finderColor}
              />
            )}
          </div>

          <div style={{ fontSize: '0.8rem', color: '#1e293b', wordBreak: 'break-all', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
            <div><strong>Payload:</strong> {generatedPayload.length > 120 ? `${generatedPayload.slice(0, 120)}...` : generatedPayload}</div>
            <div style={{ marginTop: '0.25rem', color: '#475569' }}>Generated via @skyra-tech-platform/qr</div>
          </div>
        </div>
      </div>

      {/* ─── MAIN WORKSPACE GRID ────────────────────────────────────────────── */}
      <div className="qr-workspace-grid">
        
        {/* ── LEFT COLUMN: Configuration Workspace ───────────────────────────── */}
        <div className="qr-config-column">
          
          {/* Section 1: Content Type Selector */}
          <section className="qr-card" aria-labelledby="content-type-heading">
            <div className="qr-card-header">
              <h2 id="content-type-heading" className="qr-section-title">
                1. Select Content Type
              </h2>
              <span className="qr-section-badge">9 Standard Formats</span>
            </div>

            <div className="qr-type-pills" role="tablist" aria-label="QR Code Content Types">
              {CONTENT_TABS.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeType === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`qr-tab-${tab.id}`}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`qr-panel-${tab.id}`}
                    className={`qr-type-pill ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveType(tab.id)}
                    type="button"
                  >
                    <IconComponent size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="qr-tab-desc" id={`qr-panel-${activeType}`} role="tabpanel" aria-labelledby={`qr-tab-${activeType}`}>
              <p>{CONTENT_TABS.find(t => t.id === activeType)?.description}</p>
            </div>

            {/* Form Fields for Active Content Type */}
            <div className="qr-fields-container">
              {activeType === 'url' && (
                <div className="qr-form-group">
                  <label htmlFor="qr-field-url" className="qr-label">Website URL <span className="req">*</span></label>
                  <input
                    id="qr-field-url"
                    aria-label="Website URL"
                    type="url"
                    className="qr-input"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                  <span className="qr-help">Standard web address, deep link, or scheme (e.g. https://skyra.tech).</span>
                </div>
              )}

              {activeType === 'text' && (
                <div className="qr-form-group">
                  <label htmlFor="qr-field-text" className="qr-label">Plain Text Content <span className="req">*</span></label>
                  <textarea
                    id="qr-field-text"
                    aria-label="Plain Text Content"
                    className="qr-textarea"
                    rows={4}
                    placeholder="Enter any text, instructions, or notes..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                  />
                  <span className="qr-help">Any arbitrary UTF-8 text string (length: {text.length} characters).</span>
                </div>
              )}

              {activeType === 'phone' && (
                <div className="qr-form-group">
                  <label htmlFor="qr-field-phone" className="qr-label">Telephone Number <span className="req">*</span></label>
                  <input
                    id="qr-field-phone"
                    aria-label="Telephone Number"
                    type="tel"
                    className="qr-input"
                    placeholder="+1 555-0199"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  <span className="qr-help">Includes country code prefix for international compatibility.</span>
                </div>
              )}

              {activeType === 'sms' && (
                <div className="qr-form-row">
                  <div className="qr-form-group">
                    <label htmlFor="qr-field-sms-num" className="qr-label">Recipient Phone Number <span className="req">*</span></label>
                    <input
                      id="qr-field-sms-num"
                      aria-label="Recipient Phone Number"
                      type="tel"
                      className="qr-input"
                      placeholder="+1 555-0199"
                      value={sms.number}
                      onChange={(e) => setSms({ ...sms, number: e.target.value })}
                      required
                    />
                  </div>
                  <div className="qr-form-group">
                    <label htmlFor="qr-field-sms-msg" className="qr-label">Message Content</label>
                    <textarea
                      id="qr-field-sms-msg"
                      aria-label="Message Content"
                      className="qr-textarea"
                      rows={2}
                      placeholder="Pre-filled text message..."
                      value={sms.message || ''}
                      onChange={(e) => setSms({ ...sms, message: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {activeType === 'email' && (
                <div className="qr-form-row">
                  <div className="qr-form-group">
                    <label htmlFor="qr-field-email-addr" className="qr-label">Recipient Email Address <span className="req">*</span></label>
                    <input
                      id="qr-field-email-addr"
                      aria-label="Recipient Email Address"
                      type="email"
                      className="qr-input"
                      placeholder="support@skyra.tech"
                      value={email.address}
                      onChange={(e) => setEmail({ ...email, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="qr-form-group">
                    <label htmlFor="qr-field-email-sub" className="qr-label">Subject Line</label>
                    <input
                      id="qr-field-email-sub"
                      aria-label="Subject Line"
                      type="text"
                      className="qr-input"
                      placeholder="Feedback on Skyra Platform"
                      value={email.subject || ''}
                      onChange={(e) => setEmail({ ...email, subject: e.target.value })}
                    />
                  </div>
                  <div className="qr-form-group full-width">
                    <label htmlFor="qr-field-email-body" className="qr-label">Message Body</label>
                    <textarea
                      id="qr-field-email-body"
                      aria-label="Message Body"
                      className="qr-textarea"
                      rows={3}
                      placeholder="Pre-filled email draft..."
                      value={email.body || ''}
                      onChange={(e) => setEmail({ ...email, body: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {activeType === 'wifi' && (
                <div className="qr-form-grid-2">
                  <div className="qr-form-group full-width">
                    <label htmlFor="qr-field-wifi-ssid" className="qr-label">Network Name (SSID) <span className="req">*</span></label>
                    <input
                      id="qr-field-wifi-ssid"
                      aria-label="Network Name (SSID)"
                      type="text"
                      className="qr-input"
                      placeholder="Skyra_Guest"
                      value={wifi.ssid}
                      onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
                      required
                    />
                  </div>
                  <div className="qr-form-group">
                    <label htmlFor="qr-field-wifi-pass" className="qr-label">Password</label>
                    <input
                      id="qr-field-wifi-pass"
                      aria-label="Wi-Fi Password"
                      type="text"
                      className="qr-input"
                      placeholder="Network security key"
                      value={wifi.password || ''}
                      onChange={(e) => setWifi({ ...wifi, password: e.target.value })}
                    />
                  </div>
                  <div className="qr-form-group">
                    <label htmlFor="qr-field-wifi-enc" className="qr-label">Security Protocol</label>
                    <select
                      id="qr-field-wifi-enc"
                      aria-label="Security Protocol"
                      className="qr-select"
                      value={wifi.encryption || 'WPA'}
                      onChange={(e) => setWifi({ ...wifi, encryption: e.target.value as any })}
                    >
                      <option value="WPA">WPA / WPA2 / WPA3 (Recommended)</option>
                      <option value="WEP">WEP (Legacy)</option>
                      <option value="nopass">None (Open Network)</option>
                    </select>
                  </div>
                  <div className="qr-form-group full-width">
                    <label className="qr-checkbox-label" htmlFor="qr-field-wifi-hidden">
                      <input
                        id="qr-field-wifi-hidden"
                        type="checkbox"
                        aria-label="Hidden SSID Network"
                        checked={!!wifi.hidden}
                        onChange={(e) => setWifi({ ...wifi, hidden: e.target.checked })}
                      />
                      <span>Hidden SSID Network</span>
                    </label>
                  </div>
                </div>
              )}

              {activeType === 'vcard' && (
                <div className="qr-form-grid-2">
                  <div className="qr-form-group">
                    <label htmlFor="qr-field-vc-fn" className="qr-label">First Name</label>
                    <input
                      id="qr-field-vc-fn"
                      aria-label="First Name"
                      type="text"
                      className="qr-input"
                      placeholder="Jane"
                      value={contact.firstName || ''}
                      onChange={(e) => setContact({ ...contact, firstName: e.target.value })}
                    />
                  </div>
                  <div className="qr-form-group">
                    <label htmlFor="qr-field-vc-ln" className="qr-label">Last Name</label>
                    <input
                      id="qr-field-vc-ln"
                      aria-label="Last Name"
                      type="text"
                      className="qr-input"
                      placeholder="Doe"
                      value={contact.lastName || ''}
                      onChange={(e) => setContact({ ...contact, lastName: e.target.value })}
                    />
                  </div>
                  <div className="qr-form-group">
                    <label htmlFor="qr-field-vc-org" className="qr-label">Organization / Company</label>
                    <input
                      id="qr-field-vc-org"
                      aria-label="Organization or Company"
                      type="text"
                      className="qr-input"
                      placeholder="Skyra Technologies"
                      value={contact.organization || ''}
                      onChange={(e) => setContact({ ...contact, organization: e.target.value })}
                    />
                  </div>
                  <div className="qr-form-group">
                    <label htmlFor="qr-field-vc-tel" className="qr-label">Phone Number</label>
                    <input
                      id="qr-field-vc-tel"
                      aria-label="Phone Number"
                      type="tel"
                      className="qr-input"
                      placeholder="+1 555-0199"
                      value={contact.phone || ''}
                      onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    />
                  </div>
                  <div className="qr-form-group">
                    <label htmlFor="qr-field-vc-mail" className="qr-label">Email Address</label>
                    <input
                      id="qr-field-vc-mail"
                      aria-label="Email Address"
                      type="email"
                      className="qr-input"
                      placeholder="jane.doe@skyra.tech"
                      value={contact.email || ''}
                      onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    />
                  </div>
                  <div className="qr-form-group">
                    <label htmlFor="qr-field-vc-web" className="qr-label">Website</label>
                    <input
                      id="qr-field-vc-web"
                      aria-label="Website"
                      type="url"
                      className="qr-input"
                      placeholder="https://skyra.tech"
                      value={contact.website || ''}
                      onChange={(e) => setContact({ ...contact, website: e.target.value })}
                    />
                  </div>
                  <div className="qr-form-group full-width">
                    <label htmlFor="qr-field-vc-adr" className="qr-label">Postal / Office Address</label>
                    <input
                      id="qr-field-vc-adr"
                      aria-label="Postal or Office Address"
                      type="text"
                      className="qr-input"
                      placeholder="100 Innovation Way, Tech City"
                      value={contact.address || ''}
                      onChange={(e) => setContact({ ...contact, address: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {activeType === 'calendar' && (
                <div className="qr-form-grid-2">
                  <div className="qr-form-group full-width">
                    <label htmlFor="qr-field-cal-title" className="qr-label">Event Title <span className="req">*</span></label>
                    <input
                      id="qr-field-cal-title"
                      aria-label="Event Title"
                      type="text"
                      className="qr-input"
                      placeholder="Skyra Platform Keynote"
                      value={event.title}
                      onChange={(e) => setEvent({ ...event, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="qr-form-group">
                    <label htmlFor="qr-field-cal-start" className="qr-label">Start Time</label>
                    <input
                      id="qr-field-cal-start"
                      aria-label="Start Time"
                      type="datetime-local"
                      className="qr-input"
                      value={typeof event.start === 'string' ? event.start : event.start.toISOString().slice(0, 16)}
                      onChange={(e) => setEvent({ ...event, start: e.target.value })}
                    />
                  </div>
                  <div className="qr-form-group">
                    <label htmlFor="qr-field-cal-end" className="qr-label">End Time</label>
                    <input
                      id="qr-field-cal-end"
                      aria-label="End Time"
                      type="datetime-local"
                      className="qr-input"
                      value={typeof event.end === 'string' ? event.end : event.end.toISOString().slice(0, 16)}
                      onChange={(e) => setEvent({ ...event, end: e.target.value })}
                    />
                  </div>
                  <div className="qr-form-group full-width">
                    <label htmlFor="qr-field-cal-loc" className="qr-label">Event Location</label>
                    <input
                      id="qr-field-cal-loc"
                      aria-label="Event Location"
                      type="text"
                      className="qr-input"
                      placeholder="Skyra HQ, Innovation Hall"
                      value={event.location || ''}
                      onChange={(e) => setEvent({ ...event, location: e.target.value })}
                    />
                  </div>
                  <div className="qr-form-group full-width">
                    <label htmlFor="qr-field-cal-desc" className="qr-label">Event Description</label>
                    <textarea
                      id="qr-field-cal-desc"
                      aria-label="Event Description"
                      className="qr-textarea"
                      rows={2}
                      placeholder="Event details, schedule or agenda..."
                      value={event.description || ''}
                      onChange={(e) => setEvent({ ...event, description: e.target.value })}
                    />
                  </div>
                  <div className="qr-form-group full-width">
                    <label className="qr-checkbox-label" htmlFor="qr-field-cal-allday">
                      <input
                        id="qr-field-cal-allday"
                        type="checkbox"
                        aria-label="All-Day Event"
                        checked={!!event.allDay}
                        onChange={(e) => setEvent({ ...event, allDay: e.target.checked })}
                      />
                      <span>All-Day Event</span>
                    </label>
                  </div>
                </div>
              )}

              {activeType === 'geo' && (
                <div className="qr-form-grid-2">
                  <div className="qr-form-group">
                    <label htmlFor="qr-field-geo-lat" className="qr-label">Latitude (-90 to +90) <span className="req">*</span></label>
                    <input
                      id="qr-field-geo-lat"
                      aria-label="Latitude"
                      type="number"
                      step="0.0001"
                      min="-90"
                      max="90"
                      className="qr-input"
                      value={geo.latitude}
                      onChange={(e) => setGeo({ ...geo, latitude: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div className="qr-form-group">
                    <label htmlFor="qr-field-geo-lng" className="qr-label">Longitude (-180 to +180) <span className="req">*</span></label>
                    <input
                      id="qr-field-geo-lng"
                      aria-label="Longitude"
                      type="number"
                      step="0.0001"
                      min="-180"
                      max="180"
                      className="qr-input"
                      value={geo.longitude}
                      onChange={(e) => setGeo({ ...geo, longitude: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div className="qr-form-group full-width">
                    <div className="qr-quick-locations">
                      <span className="qr-quick-label">Presets:</span>
                      <button type="button" className="qr-pill-btn" onClick={() => setGeo({ latitude: 37.7749, longitude: -122.4194 })}>San Francisco</button>
                      <button type="button" className="qr-pill-btn" onClick={() => setGeo({ latitude: 51.5074, longitude: -0.1278 })}>London</button>
                      <button type="button" className="qr-pill-btn" onClick={() => setGeo({ latitude: 35.6762, longitude: 139.6503 })}>Tokyo</button>
                      <button type="button" className="qr-pill-btn" onClick={() => setGeo({ latitude: 12.9716, longitude: 77.5946 })}>Bengaluru</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Validation Feedback Warning */}
            {validationError && (
              <div className="qr-validation-banner" role="alert">
                <AlertCircle size={16} />
                <span>{validationError}</span>
              </div>
            )}
          </section>

          {/* Section 2: Customization & Appearance Controls */}
          <section className="qr-card" aria-labelledby="customization-heading">
            <div className="qr-card-header">
              <h2 id="customization-heading" className="qr-section-title">
                2. Design & Error Correction
              </h2>
              <button 
                type="button" 
                className="qr-text-action" 
                onClick={handleResetDefaults}
                title="Reset appearance settings to default values"
              >
                <RotateCcw size={13} />
                <span>Reset Defaults</span>
              </button>
            </div>

            <div className="qr-custom-grid">
              {/* Error Correction */}
              <div className="qr-form-group">
                <label htmlFor="qr-opt-ec" className="qr-label">Error Correction Level</label>
                <select
                  id="qr-opt-ec"
                  aria-label="Error Correction Level"
                  className="qr-select"
                  value={errorCorrection}
                  onChange={(e) => setErrorCorrection(e.target.value as any)}
                >
                  <option value="L">L — Low (~7% recovery)</option>
                  <option value="M">M — Medium (~15% recovery, standard)</option>
                  <option value="Q">Q — Quartile (~25% recovery)</option>
                  <option value="H">H — High (~30% recovery, maximum resilience)</option>
                </select>
                <span className="qr-help">Higher levels increase scan resilience when printed on physical materials.</span>
              </div>

              {/* Quiet Zone Margin */}
              <div className="qr-form-group">
                <label htmlFor="qr-opt-margin" className="qr-label">
                  Quiet Zone Margin: <strong>{margin} modules</strong>
                </label>
                <input
                  id="qr-opt-margin"
                  aria-label="Quiet Zone Margin"
                  type="range"
                  min="0"
                  max="8"
                  step="1"
                  className="qr-range"
                  value={margin}
                  onChange={(e) => setMargin(parseInt(e.target.value, 10))}
                />
                <span className="qr-help">Standard recommendation is 4 modules to prevent border interference.</span>
              </div>

              {/* Module Shape */}
              <div className="qr-form-group">
                <label htmlFor="qr-opt-module-shape" className="qr-label">Module (Dot) Styling</label>
                <select
                  id="qr-opt-module-shape"
                  aria-label="Module Dot Styling"
                  className="qr-select"
                  value={moduleShape}
                  onChange={(e) => setModuleShape(e.target.value as any)}
                >
                  <option value="square">Square (Classic)</option>
                  <option value="rounded">Rounded Modules</option>
                  <option value="dot">Circular Dots</option>
                </select>
              </div>

              {/* Finder Shape */}
              <div className="qr-form-group">
                <label htmlFor="qr-opt-finder-shape" className="qr-label">Finder Corner Pattern</label>
                <select
                  id="qr-opt-finder-shape"
                  aria-label="Finder Corner Pattern"
                  className="qr-select"
                  value={finderShape}
                  onChange={(e) => setFinderShape(e.target.value as any)}
                >
                  <option value="square">Square Corners</option>
                  <option value="rounded">Rounded Corners</option>
                </select>
              </div>

              {/* Foreground Color */}
              <div className="qr-form-group">
                <label htmlFor="qr-opt-fg-color" className="qr-label">Foreground (Module) Color</label>
                <div className="qr-color-row">
                  <input
                    type="color"
                    id="qr-opt-fg-color"
                    aria-label="Foreground Color Swatch"
                    className="qr-color-swatch"
                    value={darkColor}
                    onChange={(e) => setDarkColor(e.target.value)}
                  />
                  <input
                    type="text"
                    id="qr-opt-fg-hex"
                    aria-label="Foreground Color Hex Code"
                    className="qr-input"
                    value={darkColor}
                    onChange={(e) => setDarkColor(e.target.value)}
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                  />
                </div>
              </div>

              {/* Background Color */}
              <div className="qr-form-group">
                <label htmlFor="qr-opt-bg-color" className="qr-label">Background Color</label>
                <div className="qr-color-row">
                  <input
                    type="color"
                    id="qr-opt-bg-color"
                    aria-label="Background Color Swatch"
                    className="qr-color-swatch"
                    value={lightColor}
                    disabled={isTransparentBg}
                    onChange={(e) => setLightColor(e.target.value)}
                  />
                  <input
                    type="text"
                    id="qr-opt-bg-hex"
                    aria-label="Background Color Hex Code"
                    className="qr-input"
                    value={isTransparentBg ? 'transparent' : lightColor}
                    disabled={isTransparentBg}
                    onChange={(e) => setLightColor(e.target.value)}
                  />
                </div>
                <label className="qr-checkbox-label" htmlFor="qr-opt-bg-trans" style={{ marginTop: '0.4rem' }}>
                  <input
                    id="qr-opt-bg-trans"
                    type="checkbox"
                    aria-label="Transparent Background"
                    checked={isTransparentBg}
                    onChange={(e) => setIsTransparentBg(e.target.checked)}
                  />
                  <span>Transparent Background (SVG overlay)</span>
                </label>
              </div>

              {/* Finder Pattern Color */}
              <div className="qr-form-group">
                <label htmlFor="qr-opt-finder-color" className="qr-label">Finder Accent Color</label>
                <div className="qr-color-row">
                  <input
                    type="color"
                    id="qr-opt-finder-color"
                    aria-label="Finder Accent Color Swatch"
                    className="qr-color-swatch"
                    value={finderColor}
                    onChange={(e) => setFinderColor(e.target.value)}
                  />
                  <input
                    type="text"
                    id="qr-opt-finder-hex"
                    aria-label="Finder Accent Color Hex Code"
                    className="qr-input"
                    value={finderColor}
                    onChange={(e) => setFinderColor(e.target.value)}
                  />
                </div>
              </div>

              {/* Preview Size Display Slider */}
              <div className="qr-form-group">
                <label htmlFor="qr-opt-size" className="qr-label">
                  Preview Canvas Size: <strong>{previewWidth}px</strong>
                </label>
                <input
                  id="qr-opt-size"
                  aria-label="Preview Canvas Size"
                  type="range"
                  min="180"
                  max="360"
                  step="10"
                  className="qr-range"
                  value={previewWidth}
                  onChange={(e) => setPreviewWidth(parseInt(e.target.value, 10))}
                />
              </div>
            </div>
          </section>
        </div>

        {/* ── RIGHT COLUMN: Live Preview, Validation & Export Actions ────────── */}
        <div className="qr-preview-column">
          
          {/* Live Preview Surface Card */}
          <section className="qr-card qr-preview-card" aria-label="QR Code Preview">
            <div className="qr-card-header">
              <h2 className="qr-section-title">Live QR Preview</h2>
              {generatedPayload && (
                <button
                  type="button"
                  className="qr-pill-btn"
                  onClick={handleCopyPayload}
                  title="Copy formatted QR payload text to clipboard"
                >
                  {copiedPayload ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                  <span>{copiedPayload ? 'Copied' : 'Copy Payload'}</span>
                </button>
              )}
            </div>

            {/* High Contrast Preview Target */}
            <div 
              className="qr-preview-stage"
              ref={previewContainerRef}
              style={{
                backgroundColor: isTransparentBg ? 'transparent' : lightColor,
                minHeight: '280px'
              }}
            >
              {generatedPayload ? (
                <div className="qr-component-wrapper" style={{ width: `${previewWidth}px`, maxWidth: '100%' }}>
                  <skyra-tech-qr-code
                    value={generatedPayload}
                    error-correction-level={errorCorrection}
                    margin={margin}
                    scale={5}
                    width={String(previewWidth)}
                    color-dark={darkColor}
                    color-light={effectiveLightColor}
                    module-shape={moduleShape}
                    finder-shape={finderShape}
                    finder-color={finderColor}
                    aria-label={`QR Code for ${CONTENT_TABS.find(t => t.id === activeType)?.label}`}
                  />
                </div>
              ) : (
                <div className="qr-empty-stage">
                  <AlertCircle size={36} className="qr-empty-icon" />
                  <p className="qr-empty-title">Enter content to generate a QR code</p>
                  <p className="qr-empty-desc">
                    {validationError || 'Select a content type and provide the required information in the form.'}
                  </p>
                </div>
              )}
            </div>

            {/* Scanability Analysis Assessment */}
            {scanStatus && (
              <div 
                className={`qr-scan-badge status-${scanStatus.overallStatus.toLowerCase()}`}
                role="status"
                aria-live="polite"
              >
                <div className="qr-scan-header">
                  {scanStatus.overallStatus === 'PASS' && <CheckCircle2 size={16} className="icon-pass" />}
                  {scanStatus.overallStatus === 'WARNING' && <AlertTriangle size={16} className="icon-warn" />}
                  {scanStatus.overallStatus === 'FAIL' && <AlertCircle size={16} className="icon-fail" />}
                  <span className="qr-scan-status-title">
                    {scanStatus.overallStatus === 'PASS' && 'Optimal Scanability'}
                    {scanStatus.overallStatus === 'WARNING' && 'Scanability Caution'}
                    {scanStatus.overallStatus === 'FAIL' && 'Low Scanability Risk'}
                  </span>
                  <span className="qr-contrast-tag">Contrast {scanStatus.contrast}:1</span>
                </div>

                {scanStatus.issues.length > 0 ? (
                  <ul className="qr-scan-issues">
                    {scanStatus.issues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="qr-scan-ok-text">
                    High contrast ratio ({scanStatus.contrast}:1) with sufficient quiet zone ({margin} modules).
                  </p>
                )}
              </div>
            )}

            {/* Output Actions Bar */}
            <div className="qr-actions-group">
              <button
                type="button"
                className="qr-btn qr-btn-primary"
                onClick={handleDownloadSVG}
                disabled={!generatedPayload}
                title="Download high-resolution scalable vector graphic"
              >
                <Download size={16} />
                <span>Download SVG</span>
              </button>

              <button
                type="button"
                className="qr-btn qr-btn-secondary"
                onClick={handleDownloadPNG}
                disabled={!generatedPayload}
                title="Download 1024x1024 raster PNG image"
              >
                <Download size={16} />
                <span>Download PNG</span>
              </button>

              <button
                type="button"
                className="qr-btn qr-btn-outline"
                onClick={handlePrint}
                disabled={!generatedPayload}
                title="Print QR code via application print sheet"
              >
                <Printer size={16} />
                <span>Print</span>
              </button>
            </div>

            {/* Toast Feedback Banner */}
            {toastMessage && (
              <div className={`qr-toast qr-toast-${toastMessage.type}`} role="alert">
                {toastMessage.type === 'success' && <CheckCircle2 size={15} />}
                {toastMessage.type === 'info' && <Eye size={15} />}
                {toastMessage.type === 'error' && <AlertCircle size={15} />}
                <span>{toastMessage.text}</span>
              </div>
            )}
          </section>

          {/* Quick Technical Specs Summary */}
          <section className="qr-card qr-tech-card" aria-label="Generation Diagnostics">
            <h3 className="qr-tech-title">Generation Diagnostics</h3>
            <div className="qr-tech-grid">
              <div className="qr-tech-item">
                <span className="qr-tech-label">Payload Format</span>
                <span className="qr-tech-val">{CONTENT_TABS.find(t => t.id === activeType)?.label}</span>
              </div>
              <div className="qr-tech-item">
                <span className="qr-tech-label">Byte Length</span>
                <span className="qr-tech-val">{generatedPayload.length} bytes</span>
              </div>
              <div className="qr-tech-item">
                <span className="qr-tech-label">Error Correction</span>
                <span className="qr-tech-val">{errorCorrection} Level</span>
              </div>
              <div className="qr-tech-item">
                <span className="qr-tech-label">Quiet Margin</span>
                <span className="qr-tech-val">{margin} modules</span>
              </div>
              <div className="qr-tech-item">
                <span className="qr-tech-label">Module Style</span>
                <span className="qr-tech-val">{moduleShape} / {finderShape}</span>
              </div>
              <div className="qr-tech-item">
                <span className="qr-tech-label">Engine Namespace</span>
                <span className="qr-tech-val">@skyra-tech-platform/qr</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ─── STYLES: CSS TOKENS & RESPONSIVE BEHAVIOR ───────────────────────── */}
      <style>{`
        .qr-studio-root {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        /* ── WORKSPACE GRID ── */
        .qr-workspace-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
          gap: 1.5rem;
          align-items: start;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 1024px) {
          .qr-workspace-grid {
            grid-template-columns: 1fr;
          }
        }

        .qr-config-column, .qr-preview-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          min-width: 0;
        }

        .qr-preview-column {
          position: sticky;
          top: 1.5rem;
        }

        @media (max-width: 1024px) {
          .qr-preview-column {
            position: static;
          }
        }

        /* ── CARD SURFACES ── */
        .qr-card {
          background: var(--skyra-surface, #ffffff);
          border: 1px solid var(--skyra-border, #e2e8f0);
          border-radius: var(--skyra-radius-lg, 12px);
          padding: 1.5rem;
          box-shadow: var(--skyra-shadow-sm, 0 1px 3px rgba(0,0,0,0.05));
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }

        .qr-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--skyra-border, #e2e8f0);
          padding-bottom: 0.85rem;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .qr-section-title {
          font-family: var(--skyra-font-display, inherit);
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--skyra-text, #0f172a);
          margin: 0;
        }

        .qr-section-badge {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          background: var(--skyra-primary-light, rgba(10,88,202,0.1));
          color: var(--skyra-primary, #0A58CA);
          white-space: nowrap;
        }

        .qr-text-action {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: transparent;
          border: none;
          color: var(--skyra-text-muted, #475569);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: var(--skyra-radius-sm, 4px);
          transition: color 0.15s, background-color 0.15s;
        }

        .qr-text-action:hover {
          color: var(--skyra-primary, #0A58CA);
          background-color: var(--skyra-surface-hover, rgba(0,0,0,0.04));
        }

        /* ── CONTENT TYPE PILLS ── */
        .qr-type-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          width: 100%;
          box-sizing: border-box;
        }

        .qr-type-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.75rem;
          border-radius: var(--skyra-radius-md, 8px);
          border: 1px solid var(--skyra-border, #e2e8f0);
          background: var(--skyra-bg, #f8fafc);
          color: var(--skyra-text, #0f172a);
          font-size: 0.825rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease-in-out;
          white-space: nowrap;
        }

        .qr-type-pill:hover {
          border-color: var(--skyra-primary, #0A58CA);
          color: var(--skyra-primary, #0A58CA);
          background: var(--skyra-surface, #ffffff);
        }

        .qr-type-pill.active {
          border-color: var(--skyra-primary, #0A58CA);
          background: var(--skyra-primary, #0A58CA);
          color: #ffffff;
          box-shadow: 0 2px 6px rgba(10, 88, 202, 0.25);
        }

        .qr-type-pill:focus-visible {
          outline: 2px solid var(--skyra-primary, #0A58CA);
          outline-offset: 2px;
        }

        .qr-tab-desc {
          font-size: 0.85rem;
          color: var(--skyra-text-muted, #475569);
          margin-top: -0.25rem;
        }

        .qr-tab-desc p {
          margin: 0;
        }

        /* ── FORM ELEMENTS ── */
        .qr-fields-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
          box-sizing: border-box;
        }

        .qr-form-row {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
          box-sizing: border-box;
        }

        .qr-form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 640px) {
          .qr-form-grid-2 {
            grid-template-columns: 1fr;
          }
        }

        .qr-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .qr-form-group.full-width {
          grid-column: 1 / -1;
        }

        .qr-label {
          font-size: 0.825rem;
          font-weight: 600;
          color: var(--skyra-text, #0f172a);
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .qr-label .req {
          color: var(--skyra-danger, #ef4444);
        }

        .qr-input, .qr-select, .qr-textarea {
          width: 100%;
          max-width: 100%;
          padding: 0.6rem 0.8rem;
          border-radius: var(--skyra-radius-md, 8px);
          border: 1px solid var(--skyra-border, #e2e8f0);
          background: var(--skyra-bg, #f8fafc);
          color: var(--skyra-text, #0f172a);
          font-size: 0.875rem;
          font-family: inherit;
          transition: border-color 0.15s, box-shadow 0.15s;
          box-sizing: border-box;
          min-width: 0;
        }

        .qr-input:focus, .qr-select:focus, .qr-textarea:focus {
          outline: none;
          border-color: var(--skyra-primary, #0A58CA);
          box-shadow: 0 0 0 3px rgba(10, 88, 202, 0.12);
        }

        .qr-textarea {
          resize: vertical;
          min-height: 72px;
        }

        .qr-help {
          font-size: 0.75rem;
          color: var(--skyra-text-muted, #475569);
          line-height: 1.4;
        }

        .qr-checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--skyra-text, #0f172a);
          cursor: pointer;
        }

        .qr-color-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .qr-color-swatch {
          width: 40px;
          height: 38px;
          padding: 2px;
          border-radius: var(--skyra-radius-md, 8px);
          border: 1px solid var(--skyra-border, #e2e8f0);
          cursor: pointer;
          background: transparent;
          flex-shrink: 0;
        }

        .qr-range {
          width: 100%;
          accent-color: var(--skyra-primary, #0A58CA);
          cursor: pointer;
        }

        .qr-custom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem 1rem;
          width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 640px) {
          .qr-custom-grid {
            grid-template-columns: 1fr;
          }
        }

        .qr-quick-locations {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          flex-wrap: wrap;
        }

        .qr-quick-label {
          font-size: 0.775rem;
          color: #334155;
          font-weight: 600;
        }

        .qr-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.25rem 0.5rem;
          border-radius: var(--skyra-radius-sm, 4px);
          border: 1px solid var(--skyra-border, #e2e8f0);
          background: var(--skyra-bg, #f8fafc);
          color: var(--skyra-text, #0f172a);
          font-size: 0.775rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.15s;
          white-space: nowrap;
        }

        .qr-pill-btn:hover {
          background-color: var(--skyra-surface-hover, rgba(0,0,0,0.06));
          border-color: var(--skyra-primary, #0A58CA);
        }

        /* ── VALIDATION BANNER ── */
        .qr-validation-banner {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem 1rem;
          border-radius: var(--skyra-radius-md, 8px);
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #b91c1c;
          font-size: 0.85rem;
          font-weight: 600;
        }

        /* ── PREVIEW STAGE ── */
        .qr-preview-stage {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem 1rem;
          border-radius: var(--skyra-radius-lg, 12px);
          border: 1px dashed var(--skyra-border, #cbd5e1);
          overflow: hidden;
          transition: background-color 0.2s ease;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        .qr-component-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 100%;
          overflow: hidden;
        }

        .qr-empty-stage {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem 1rem;
          gap: 0.5rem;
        }

        .qr-empty-icon {
          color: var(--skyra-text-muted, #64748b);
          margin-bottom: 0.25rem;
        }

        .qr-empty-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--skyra-text, #0f172a);
          margin: 0;
        }

        .qr-empty-desc {
          font-size: 0.825rem;
          color: var(--skyra-text-muted, #475569);
          margin: 0;
          max-width: 280px;
        }

        /* ── SCANABILITY BADGE ── */
        .qr-scan-badge {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0.85rem 1rem;
          border-radius: var(--skyra-radius-md, 8px);
          font-size: 0.85rem;
          width: 100%;
          box-sizing: border-box;
        }

        .qr-scan-badge.status-pass {
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #064e3b;
        }

        .qr-scan-badge.status-warning {
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.35);
          color: #78350f;
        }

        .qr-scan-badge.status-fail {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.35);
          color: #7f1d1d;
        }

        .qr-scan-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
        }

        .qr-scan-status-title {
          flex: 1;
        }

        .qr-contrast-tag {
          font-size: 0.75rem;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          background: rgba(0,0,0,0.08);
          font-weight: 600;
        }

        .icon-pass { color: #059669; }
        .icon-warn { color: #d97706; }
        .icon-fail { color: #dc2626; }

        .qr-scan-issues {
          margin: 0;
          padding-left: 1.25rem;
          font-size: 0.8rem;
          color: inherit;
        }

        .qr-scan-ok-text {
          margin: 0;
          font-size: 0.8rem;
          color: inherit;
        }

        /* ── ACTIONS GROUP ── */
        .qr-actions-group {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0.5rem;
          width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 520px) {
          .qr-actions-group {
            grid-template-columns: 1fr;
          }
        }

        .qr-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          padding: 0.65rem 0.75rem;
          border-radius: var(--skyra-radius-md, 8px);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease-in-out;
          border: 1px solid transparent;
          white-space: nowrap;
        }

        .qr-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .qr-btn-primary {
          background: var(--skyra-primary, #0A58CA);
          color: #ffffff;
        }

        .qr-btn-primary:hover:not(:disabled) {
          background: var(--skyra-primary-hover, #0847a8);
        }

        .qr-btn-secondary {
          background: var(--skyra-navy, #002B66);
          color: #ffffff;
        }

        .qr-btn-secondary:hover:not(:disabled) {
          opacity: 0.9;
        }

        .qr-btn-outline {
          background: transparent;
          border-color: var(--skyra-border, #cbd5e1);
          color: var(--skyra-text, #0f172a);
        }

        .qr-btn-outline:hover:not(:disabled) {
          background: var(--skyra-bg, #f1f5f9);
          border-color: var(--skyra-primary, #0A58CA);
          color: var(--skyra-primary, #0A58CA);
        }

        /* ── TOAST ── */
        .qr-toast {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 0.85rem;
          border-radius: var(--skyra-radius-md, 8px);
          font-size: 0.825rem;
          font-weight: 600;
          animation: qr-fade-in 0.2s ease;
          width: 100%;
          box-sizing: border-box;
        }

        @keyframes qr-fade-in {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .qr-toast-success {
          background: rgba(16, 185, 129, 0.12);
          color: #064e3b;
          border: 1px solid rgba(16, 185, 129, 0.35);
        }

        .qr-toast-info {
          background: rgba(10, 88, 202, 0.12);
          color: #0A58CA;
          border: 1px solid rgba(10, 88, 202, 0.35);
        }

        .qr-toast-error {
          background: rgba(239, 68, 68, 0.12);
          color: #7f1d1d;
          border: 1px solid rgba(239, 68, 68, 0.35);
        }

        /* ── TECHNICAL SPECS CARD ── */
        .qr-tech-card {
          padding: 1.25rem;
        }

        .qr-tech-title {
          font-size: 0.825rem;
          font-weight: 700;
          color: var(--skyra-text, #0f172a);
          margin: 0 0 0.85rem 0;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .qr-tech-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.65rem 1rem;
          width: 100%;
          box-sizing: border-box;
        }

        .qr-tech-item {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .qr-tech-label {
          font-size: 0.725rem;
          color: var(--skyra-text-muted, #475569);
          font-weight: 500;
        }

        .qr-tech-val {
          font-size: 0.825rem;
          font-weight: 600;
          color: var(--skyra-text, #0f172a);
          font-family: monospace;
          word-break: break-all;
        }

        /* ── RESPONSIVE COMPACT RULES ── */
        @media (max-width: 640px) {
          .qr-card {
            padding: 1rem;
          }
          .qr-type-pill {
            padding: 0.4rem 0.65rem;
            font-size: 0.8rem;
          }
        }

        @media (max-width: 380px) {
          .qr-card {
            padding: 0.85rem 0.65rem;
          }
          .qr-type-pill {
            padding: 0.35rem 0.55rem;
            font-size: 0.775rem;
          }
          .qr-section-title {
            font-size: 1rem;
          }
        }

        /* ── DARK THEME CONTRAST OVERRIDES ── */
        .dark .qr-section-badge {
          background: rgba(59, 130, 246, 0.2);
          color: #93c5fd;
        }

        .dark .qr-scan-badge.status-pass {
          background: rgba(16, 185, 129, 0.16);
          border-color: rgba(16, 185, 129, 0.4);
          color: #6ee7b7;
        }

        .dark .qr-scan-badge.status-pass .qr-contrast-tag {
          background: rgba(255, 255, 255, 0.15);
          color: #6ee7b7;
        }

        .dark .qr-scan-badge.status-warning {
          background: rgba(245, 158, 11, 0.16);
          border-color: rgba(245, 158, 11, 0.4);
          color: #fde68a;
        }

        .dark .qr-scan-badge.status-warning .qr-contrast-tag {
          background: rgba(255, 255, 255, 0.15);
          color: #fde68a;
        }

        .dark .qr-scan-badge.status-fail {
          background: rgba(239, 68, 68, 0.16);
          border-color: rgba(239, 68, 68, 0.4);
          color: #fca5a5;
        }

        .dark .qr-scan-badge.status-fail .qr-contrast-tag {
          background: rgba(255, 255, 255, 0.15);
          color: #fca5a5;
        }

        .dark .qr-validation-banner {
          background: rgba(239, 68, 68, 0.16);
          border-color: rgba(239, 68, 68, 0.4);
          color: #fca5a5;
        }

        .dark .qr-toast-success {
          background: rgba(16, 185, 129, 0.2);
          color: #6ee7b7;
          border-color: rgba(16, 185, 129, 0.4);
        }

        .dark .qr-toast-info {
          background: rgba(59, 130, 246, 0.2);
          color: #93c5fd;
          border-color: rgba(59, 130, 246, 0.4);
        }

        .dark .qr-toast-error {
          background: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
          border-color: rgba(239, 68, 68, 0.4);
        }

        /* ── SCREEN VIEW: HIDE PRINT SHEET ── */
        .qr-print-sheet {
          display: none;
        }

        /* ── APPLICATION-LEVEL PRINT STYLES ── */
        @media print {
          /* Hide app shell, navigation, header, sidebar, buttons, controls */
          body * {
            visibility: hidden !important;
          }

          /* Display exclusively the clean print card */
          .qr-print-sheet, .qr-print-sheet * {
            visibility: visible !important;
          }

          .qr-print-sheet {
            display: flex !important;
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            background: #ffffff !important;
            align-items: center;
            justify-content: center;
            z-index: 999999;
          }

          .qr-print-card {
            border: 2px solid #0f172a !important;
            border-radius: 12px;
            padding: 2.5rem;
            text-align: center;
            background: #ffffff !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
