import { describe, it, expect } from 'vitest';
import {
  emailSchema,
  phoneSchema,
  positiveAmountSchema,
  percentageSchema,
  gstinSchema,
  panSchema,
  shortTextSchema,
  longTextSchema,
} from './common';

describe('emailSchema', () => {
  it('accepts valid emails', () => {
    expect(emailSchema.parse('user@example.com')).toBe('user@example.com');
  });
  it('rejects invalid emails', () => {
    expect(() => emailSchema.parse('not-email')).toThrow();
  });
  it('lowercases email', () => {
    expect(emailSchema.parse('USER@EXAMPLE.COM')).toBe('user@example.com');
  });
  it('rejects empty string', () => {
    expect(() => emailSchema.parse('')).toThrow();
  });
});

describe('phoneSchema', () => {
  it('accepts valid phone numbers', () => {
    expect(() => phoneSchema.parse('+91 9876543210')).not.toThrow();
    expect(() => phoneSchema.parse('9876543210')).not.toThrow();
  });
  it('rejects too-short numbers', () => {
    expect(() => phoneSchema.parse('123')).toThrow();
  });
});

describe('positiveAmountSchema', () => {
  it('accepts zero', () => {
    expect(positiveAmountSchema.parse(0)).toBe(0);
  });
  it('accepts positive numbers', () => {
    expect(positiveAmountSchema.parse(1234.56)).toBe(1234.56);
  });
  it('rejects negative numbers', () => {
    expect(() => positiveAmountSchema.parse(-1)).toThrow();
  });
  it('rejects strings', () => {
    expect(() => positiveAmountSchema.parse('100')).toThrow();
  });
});

describe('percentageSchema', () => {
  it('accepts 0-100', () => {
    expect(() => percentageSchema.parse(18)).not.toThrow();
    expect(() => percentageSchema.parse(0)).not.toThrow();
    expect(() => percentageSchema.parse(100)).not.toThrow();
  });
  it('rejects > 100', () => {
    expect(() => percentageSchema.parse(101)).toThrow();
  });
});

describe('gstinSchema', () => {
  it('accepts valid GSTIN', () => {
    expect(() => gstinSchema.parse('22AAAAA0000A1Z5')).not.toThrow();
  });
  it('accepts empty string', () => {
    expect(() => gstinSchema.parse('')).not.toThrow();
  });
  it('rejects invalid GSTIN', () => {
    expect(() => gstinSchema.parse('INVALID')).toThrow();
  });
});

describe('panSchema', () => {
  it('accepts valid PAN', () => {
    expect(() => panSchema.parse('ABCDE1234F')).not.toThrow();
  });
  it('rejects invalid PAN', () => {
    expect(() => panSchema.parse('INVALID')).toThrow();
  });
});

describe('textSchemas and barrel exports', () => {
  it('validates shortTextSchema and longTextSchema', () => {
    const short = shortTextSchema('Custom Field');
    expect(short.parse('Hello')).toBe('Hello');
    expect(() => short.parse('a'.repeat(256))).toThrow();

    const long = longTextSchema('Custom Notes', 100);
    expect(long.parse('Valid note')).toBe('Valid note');
    expect(long.parse('')).toBe('');
    expect(long.parse(undefined)).toBeUndefined();
    expect(() => long.parse('a'.repeat(101))).toThrow();
  });

  it('barrel exports everything from index.ts', async () => {
    const barrel = await import('./index');
    expect(barrel.emailSchema).toBeDefined();
    expect(barrel.orgSchema).toBeDefined();
  });
});

