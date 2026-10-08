export interface QRWifiPayload {
  ssid: string;
  password?: string;
  encryption?: 'WEP' | 'WPA' | 'nopass';
  hidden?: boolean;
}

export interface QRContactPayload {
  firstName?: string;
  lastName?: string;
  organization?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
}

export interface QREventPayload {
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
  allDay?: boolean;
}

export interface QRGeoPayload {
  latitude: number;
  longitude: number;
}

export interface QREmailPayload {
  address: string;
  subject?: string;
  body?: string;
}

export interface QRSmsPayload {
  number: string;
  message?: string;
}

/**
 * Builders for standard QR formats
 */
export const QRContentBuilder = {
  text: (value: string) => value,
  url: (url: string) => {
    try {
      new URL(url);
      return url;
    } catch {
      return `https://${url}`;
    }
  },
  phone: (number: string) => `tel:${number}`,
  sms: (payload: QRSmsPayload) => {
    let result = `smsto:${payload.number}`;
    if (payload.message) result += `:${payload.message}`;
    return result;
  },
  email: (payload: QREmailPayload) => {
    let result = `mailto:${payload.address}`;
    const params = [];
    if (payload.subject) params.push(`subject=${encodeURIComponent(payload.subject)}`);
    if (payload.body) params.push(`body=${encodeURIComponent(payload.body)}`);
    if (params.length > 0) result += `?${params.join('&')}`;
    return result;
  },
  geo: (payload: QRGeoPayload) => `geo:${payload.latitude},${payload.longitude}`,
  wifi: (payload: QRWifiPayload) => {
    const enc = payload.encryption || 'nopass';
    const hidden = payload.hidden ? 'true' : 'false';
    const pwd = payload.password ? `P:${payload.password};` : '';
    return `WIFI:T:${enc};S:${payload.ssid};${pwd}H:${hidden};;`;
  },
  vcard: (payload: QRContactPayload) => {
    let vcard = 'BEGIN:VCARD\\nVERSION:3.0\\n';
    const name = [payload.lastName || '', payload.firstName || ''].join(';').replace(/^;/, '').replace(/;$/, '');
    const fn = [payload.firstName, payload.lastName].filter(Boolean).join(' ');
    
    if (name) vcard += `N:${name}\\n`;
    if (fn) vcard += `FN:${fn}\\n`;
    if (payload.organization) vcard += `ORG:${payload.organization}\\n`;
    if (payload.phone) vcard += `TEL:${payload.phone}\\n`;
    if (payload.email) vcard += `EMAIL:${payload.email}\\n`;
    if (payload.website) vcard += `URL:${payload.website}\\n`;
    if (payload.address) vcard += `ADR:;;${payload.address};;;;\\n`;
    
    vcard += 'END:VCARD';
    return vcard;
  },
  calendar: (payload: QREventPayload) => {
    const format = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0]! + 'Z';
    const formatAllDay = (d: Date) => d.toISOString().split('T')[0]!.replace(/-/g, '');
    
    let result = 'BEGIN:VEVENT\\n';
    result += `SUMMARY:${payload.title}\\n`;
    
    if (payload.allDay) {
      result += `DTSTART;VALUE=DATE:${formatAllDay(payload.start)}\\n`;
      result += `DTEND;VALUE=DATE:${formatAllDay(payload.end)}\\n`;
    } else {
      result += `DTSTART:${format(payload.start)}\\n`;
      result += `DTEND:${format(payload.end)}\\n`;
    }

    if (payload.location) result += `LOCATION:${payload.location}\\n`;
    if (payload.description) result += `DESCRIPTION:${payload.description}\\n`;
    result += 'END:VEVENT';
    return result;
  }
};
