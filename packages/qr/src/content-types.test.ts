import { describe, it, expect } from 'vitest';
import { QRContentBuilder } from './content-types';

describe('QRContentBuilder — All 9 Content Types', () => {
  it('1. builds text payload', () => {
    expect(QRContentBuilder.text('Plain text message')).toBe('Plain text message');
  });

  it('2. builds standard url', () => {
    expect(QRContentBuilder.url('https://skyra.tech')).toBe('https://skyra.tech');
    expect(QRContentBuilder.url('skyra.tech')).toBe('https://skyra.tech'); // Auto-adds protocol
  });

  it('3. builds phone payload', () => {
    expect(QRContentBuilder.phone('+1234567890')).toBe('tel:+1234567890');
  });

  it('4. builds sms payload', () => {
    expect(QRContentBuilder.sms({ number: '+1234567890' })).toBe('smsto:+1234567890');
    expect(QRContentBuilder.sms({ number: '+1234567890', message: 'Hello Skyra' })).toBe('smsto:+1234567890:Hello Skyra');
  });

  it('5. builds email payload', () => {
    expect(QRContentBuilder.email({ address: 'test@skyra.tech' })).toBe('mailto:test@skyra.tech');
    expect(QRContentBuilder.email({ address: 'test@skyra.tech', subject: 'Hello', body: 'World' }))
      .toBe('mailto:test@skyra.tech?subject=Hello&body=World');
  });

  it('6. builds wifi payload', () => {
    expect(QRContentBuilder.wifi({ ssid: 'Skyra_Guest', password: 'secretpassword' }))
      .toBe('WIFI:T:nopass;S:Skyra_Guest;P:secretpassword;H:false;;');
    expect(QRContentBuilder.wifi({ ssid: 'Skyra_Secure', password: 'pass', encryption: 'WPA', hidden: true }))
      .toBe('WIFI:T:WPA;S:Skyra_Secure;P:pass;H:true;;');
    expect(QRContentBuilder.wifi({ ssid: 'Skyra_Open', encryption: 'nopass' }))
      .toBe('WIFI:T:nopass;S:Skyra_Open;H:false;;');
  });

  it('7. builds vcard payload with complete contact details', () => {
    const vcard = QRContentBuilder.vcard({
      firstName: 'Jane',
      lastName: 'Doe',
      organization: 'Skyra Technologies',
      phone: '+1234567890',
      email: 'jane@skyra.tech',
      website: 'https://skyra.tech',
      address: '100 Innovation Way, Tech City'
    });
    expect(vcard).toContain('BEGIN:VCARD\n');
    expect(vcard).toContain('VERSION:3.0\n');
    expect(vcard).toContain('N:Doe;Jane\n');
    expect(vcard).toContain('FN:Jane Doe\n');
    expect(vcard).toContain('ORG:Skyra Technologies\n');
    expect(vcard).toContain('TEL:+1234567890\n');
    expect(vcard).toContain('EMAIL:jane@skyra.tech\n');
    expect(vcard).toContain('URL:https://skyra.tech\n');
    expect(vcard).toContain('ADR:;;100 Innovation Way, Tech City;;;;\n');
    expect(vcard).toContain('END:VCARD');
  });

  it('8. builds calendar event payload with Date and string inputs', () => {
    const start = new Date('2026-06-15T09:00:00Z');
    const end = new Date('2026-06-15T10:00:00Z');
    const cal = QRContentBuilder.calendar({
      title: 'Skyra Platform Keynote',
      start,
      end,
      location: 'Auditorium 1',
      description: 'Annual platform release briefing'
    });
    expect(cal).toContain('BEGIN:VEVENT\n');
    expect(cal).toContain('SUMMARY:Skyra Platform Keynote\n');
    expect(cal).toContain('DTSTART:20260615T090000Z\n');
    expect(cal).toContain('DTEND:20260615T100000Z\n');
    expect(cal).toContain('LOCATION:Auditorium 1\n');
    expect(cal).toContain('DESCRIPTION:Annual platform release briefing\n');
    expect(cal).toContain('END:VEVENT');

    // All-day event support
    const allDayCal = QRContentBuilder.calendar({
      title: 'Company Holiday',
      start: '2026-12-25T00:00:00Z',
      end: '2026-12-26T00:00:00Z',
      allDay: true
    });
    expect(allDayCal).toContain('DTSTART;VALUE=DATE:20261225\n');
    expect(allDayCal).toContain('DTEND;VALUE=DATE:20261226\n');
  });

  it('9. builds geo coordinates payload', () => {
    expect(QRContentBuilder.geo({ latitude: 37.7749, longitude: -122.4194 }))
      .toBe('geo:37.7749,-122.4194');
  });
});
