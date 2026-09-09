import { describe, it, expect } from 'vitest';
import {
  orgSchema,
  userProfileSchema,
  clientSchema,
  bankAccountSchema,
} from './org';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function valid<T>(schema: { safeParse: (v: unknown) => { success: boolean; error?: unknown } }, data: T) {
  const result = schema.safeParse(data);
  expect(result.success).toBe(true);
}

function invalid<T>(schema: { safeParse: (v: unknown) => { success: boolean } }, data: T) {
  expect(schema.safeParse(data).success).toBe(false);
}

// ─── orgSchema ────────────────────────────────────────────────────────────────
describe('orgSchema', () => {
  const base = {
    name: 'Skyra Tech Pvt Ltd',
    currency: 'INR',
  };

  it('accepts minimal valid org (name + currency)', () => {
    valid(orgSchema, base);
  });

  it('accepts complete valid org', () => {
    valid(orgSchema, {
      name: 'Skyra Tech Pvt Ltd',
      displayName: 'Skyra Tech',
      email: 'contact@skyratech.in',
      phone: '+919876543210',
      website: 'https://skyratech.in',
      gstin: '27AAPFU0939F1ZV',
      pan: 'AAPFU0939F',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      brandColor: '#FF6B00',
      invoicePrefix: 'INV-',
      invoiceFooter: 'Thank you for your business.',
    });
  });

  it('rejects empty name', () => {
    invalid(orgSchema, { ...base, name: '' });
  });

  it('rejects name exceeding 100 characters', () => {
    invalid(orgSchema, { ...base, name: 'A'.repeat(101) });
  });

  it('rejects invalid email', () => {
    invalid(orgSchema, { ...base, email: 'not-an-email' });
  });

  it('accepts empty email string (optional)', () => {
    valid(orgSchema, { ...base, email: '' });
  });

  it('accepts undefined email (optional)', () => {
    valid(orgSchema, { ...base });
  });

  it('rejects invalid currency code', () => {
    invalid(orgSchema, { ...base, currency: 'XYZ' });
  });

  it('accepts all supported currencies', () => {
    for (const c of ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD']) {
      valid(orgSchema, { ...base, currency: c });
    }
  });

  it('accepts valid website URL', () => {
    valid(orgSchema, { ...base, website: 'https://example.com' });
  });

  it('accepts empty website string', () => {
    valid(orgSchema, { ...base, website: '' });
  });

  it('rejects invalid website URL', () => {
    invalid(orgSchema, { ...base, website: 'not-a-url' });
  });

  it('accepts valid GSTIN', () => {
    valid(orgSchema, { ...base, gstin: '27AAPFU0939F1ZV' });
  });

  it('accepts empty GSTIN (optional)', () => {
    valid(orgSchema, { ...base, gstin: '' });
  });

  it('rejects invalid GSTIN format', () => {
    invalid(orgSchema, { ...base, gstin: 'BADGSTIN' });
  });

  it('accepts valid PAN', () => {
    valid(orgSchema, { ...base, pan: 'AAPFU0939F' });
  });

  it('accepts empty PAN (optional)', () => {
    valid(orgSchema, { ...base, pan: '' });
  });

  it('rejects invalid PAN format', () => {
    invalid(orgSchema, { ...base, pan: '12345ABCDE' });
  });

  it('accepts valid hex brandColor', () => {
    valid(orgSchema, { ...base, brandColor: '#FF6B00' });
    valid(orgSchema, { ...base, brandColor: '#FFF' });
  });

  it('rejects invalid hex color', () => {
    invalid(orgSchema, { ...base, brandColor: 'red' });
  });

  it('accepts undefined brandColor (optional)', () => {
    valid(orgSchema, { ...base, brandColor: undefined });
  });

  it('accepts invoicePrefix within 255 chars', () => {
    valid(orgSchema, { ...base, invoicePrefix: 'INV-2024-' });
  });

  it('rejects invoicePrefix over 255 chars', () => {
    invalid(orgSchema, { ...base, invoicePrefix: 'A'.repeat(256) });
  });

  it('accepts invoiceFooter within 500 chars', () => {
    valid(orgSchema, { ...base, invoiceFooter: 'Thank you!' });
  });

  it('rejects invoiceFooter over 500 chars', () => {
    invalid(orgSchema, { ...base, invoiceFooter: 'A'.repeat(501) });
  });

  it('accepts timezone string', () => {
    valid(orgSchema, { ...base, timezone: 'Asia/Kolkata' });
  });

  it('rejects timezone over 50 chars', () => {
    invalid(orgSchema, { ...base, timezone: 'A'.repeat(51) });
  });

  it('accepts a valid address object', () => {
    valid(orgSchema, {
      ...base,
      address: {
        line1: '123 Tech Park',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
      },
    });
  });

  it('rejects address missing required city', () => {
    invalid(orgSchema, {
      ...base,
      address: {
        line1: '123 Tech Park',
        city: '',
        state: 'Maharashtra',
        country: 'India',
      },
    });
  });
});

// ─── userProfileSchema ────────────────────────────────────────────────────────
describe('userProfileSchema', () => {
  const base = {
    name: 'Arjun Kumar',
    email: 'arjun@skyratech.in',
  };

  it('accepts valid profile', () => {
    valid(userProfileSchema, base);
  });

  it('accepts full profile with optional fields', () => {
    valid(userProfileSchema, {
      ...base,
      phone: '+919876543210',
      role: 'admin',
      avatar: 'https://example.com/avatar.png',
    });
  });

  it('rejects empty name', () => {
    invalid(userProfileSchema, { ...base, name: '' });
  });

  it('rejects invalid email', () => {
    invalid(userProfileSchema, { ...base, email: 'bad-email' });
  });

  it('accepts empty phone (optional)', () => {
    valid(userProfileSchema, { ...base, phone: '' });
  });

  it('rejects phone too short', () => {
    invalid(userProfileSchema, { ...base, phone: '123' });
  });

  it('accepts valid avatar URL', () => {
    valid(userProfileSchema, { ...base, avatar: 'https://cdn.example.com/img.jpg' });
  });

  it('accepts empty avatar URL', () => {
    valid(userProfileSchema, { ...base, avatar: '' });
  });

  it('rejects invalid avatar URL', () => {
    invalid(userProfileSchema, { ...base, avatar: 'not-a-url' });
  });
});

// ─── clientSchema ─────────────────────────────────────────────────────────────
describe('clientSchema', () => {
  const base = { name: 'ACME Corp' };

  it('accepts minimal valid client', () => {
    valid(clientSchema, base);
  });

  it('accepts full client', () => {
    valid(clientSchema, {
      name: 'ACME Corp',
      email: 'info@acme.com',
      phone: '+1 800-555-0100',
      gstin: '27AAPFU0939F1ZV',
      pan: 'AAPFU0939F',
      notes: 'Key strategic client.',
      currency: 'USD',
      paymentTerms: 30,
      address: {
        line1: '100 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
      },
    });
  });

  it('rejects empty name', () => {
    invalid(clientSchema, { name: '' });
  });

  it('accepts empty email (optional)', () => {
    valid(clientSchema, { ...base, email: '' });
  });

  it('rejects invalid email', () => {
    invalid(clientSchema, { ...base, email: 'bad' });
  });

  it('accepts paymentTerms in range 0-365', () => {
    valid(clientSchema, { ...base, paymentTerms: 0 });
    valid(clientSchema, { ...base, paymentTerms: 365 });
  });

  it('rejects paymentTerms below 0', () => {
    invalid(clientSchema, { ...base, paymentTerms: -1 });
  });

  it('rejects paymentTerms above 365', () => {
    invalid(clientSchema, { ...base, paymentTerms: 366 });
  });

  it('rejects non-integer paymentTerms', () => {
    invalid(clientSchema, { ...base, paymentTerms: 15.5 });
  });

  it('accepts notes within 2000 chars', () => {
    valid(clientSchema, { ...base, notes: 'A'.repeat(2000) });
  });

  it('rejects notes over 2000 chars', () => {
    invalid(clientSchema, { ...base, notes: 'A'.repeat(2001) });
  });
});

// ─── bankAccountSchema ────────────────────────────────────────────────────────
describe('bankAccountSchema', () => {
  const base = {
    bankName: 'HDFC Bank',
    accountName: 'Skyra Tech Pvt Ltd',
    accountNumber: '123456789012',
  };

  it('accepts minimal valid bank account', () => {
    valid(bankAccountSchema, base);
  });

  it('accepts full bank account', () => {
    valid(bankAccountSchema, {
      ...base,
      ifscCode: 'HDFC0001234',
      upiId: 'skyratech@hdfcbank',
      isDefault: true,
    });
  });

  it('rejects empty bankName', () => {
    invalid(bankAccountSchema, { ...base, bankName: '' });
  });

  it('rejects bankName over 100 chars', () => {
    invalid(bankAccountSchema, { ...base, bankName: 'B'.repeat(101) });
  });

  it('rejects empty accountName', () => {
    invalid(bankAccountSchema, { ...base, accountName: '' });
  });

  it('rejects accountNumber too short (< 5)', () => {
    invalid(bankAccountSchema, { ...base, accountNumber: '1234' });
  });

  it('rejects accountNumber too long (> 30)', () => {
    invalid(bankAccountSchema, { ...base, accountNumber: '1'.repeat(31) });
  });

  it('accepts valid IFSC code', () => {
    valid(bankAccountSchema, { ...base, ifscCode: 'HDFC0001234' });
  });

  it('accepts empty IFSC code (optional)', () => {
    valid(bankAccountSchema, { ...base, ifscCode: '' });
  });

  it('rejects malformed IFSC code', () => {
    invalid(bankAccountSchema, { ...base, ifscCode: 'BADIFSC' });
  });

  it('accepts undefined isDefault', () => {
    valid(bankAccountSchema, { ...base });
  });

  it('accepts false isDefault', () => {
    valid(bankAccountSchema, { ...base, isDefault: false });
  });
});
