import { describe, it, expect } from 'vitest';
import { QRContentBuilder } from './content-types';

describe('QRContentBuilder', () => {
  it('builds standard url', () => {
    expect(QRContentBuilder.url('https://skyra.tech')).toBe('https://skyra.tech');
    expect(QRContentBuilder.url('skyra.tech')).toBe('https://skyra.tech'); // Auto-adds protocol
  });

  it('builds phone', () => {
    expect(QRContentBuilder.phone('+1234567890')).toBe('tel:+1234567890');
  });

  it('builds email', () => {
    expect(QRContentBuilder.email({ address: 'test@skyra.tech' })).toBe('mailto:test@skyra.tech');
    expect(QRContentBuilder.email({ address: 'test@skyra.tech', subject: 'Hello', body: 'World' }))
      .toBe('mailto:test@skyra.tech?subject=Hello&body=World');
  });

  it('builds sms', () => {
    expect(QRContentBuilder.sms({ number: '123' })).toBe('smsto:123');
    expect(QRContentBuilder.sms({ number: '123', message: 'Hi' })).toBe('smsto:123:Hi');
  });

  it('builds wifi', () => {
    expect(QRContentBuilder.wifi({ ssid: 'Net', password: '123' }))
      .toBe('WIFI:T:nopass;S:Net;P:123;H:false;;');
    expect(QRContentBuilder.wifi({ ssid: 'Net', encryption: 'WPA' }))
      .toBe('WIFI:T:WPA;S:Net;H:false;;');
  });

  it('builds geo', () => {
    expect(QRContentBuilder.geo({ latitude: 12.34, longitude: 56.78 })).toBe('geo:12.34,56.78');
  });

  it('builds vcard', () => {
    const vcard = QRContentBuilder.vcard({ firstName: 'Jane', lastName: 'Doe', email: 'jane@test.com' });
    expect(vcard).toContain('BEGIN:VCARD');
    expect(vcard).toContain('N:Doe;Jane');
    expect(vcard).toContain('FN:Jane Doe');
    expect(vcard).toContain('EMAIL:jane@test.com');
    expect(vcard).toContain('END:VCARD');
  });

  it('builds calendar event', () => {
    const start = new Date('2026-01-01T10:00:00Z');
    const end = new Date('2026-01-01T11:00:00Z');
    const cal = QRContentBuilder.calendar({ title: 'Meeting', start, end });
    expect(cal).toContain('BEGIN:VEVENT');
    expect(cal).toContain('SUMMARY:Meeting');
    expect(cal).toContain('DTSTART:20260101T100000Z');
    expect(cal).toContain('END:VEVENT');
  });
});
