import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  roundMoney,
  parseMoney,
  amountInWords,
  CURRENCY_CONFIGS,
} from './currency';

// ─── formatCurrency ───────────────────────────────────────────────────────────
describe('formatCurrency', () => {
  it('formats INR correctly with commas', () => {
    expect(formatCurrency(1234.5, 'INR')).toContain('1,234');
  });

  it('formats USD correctly', () => {
    expect(formatCurrency(9999, 'USD')).toContain('9,999');
  });

  it('formats EUR correctly', () => {
    expect(formatCurrency(1000, 'EUR')).toContain('1');
  });

  it('formats GBP correctly', () => {
    expect(formatCurrency(500, 'GBP')).toContain('500');
  });

  it('formats SGD correctly', () => {
    expect(formatCurrency(250.75, 'SGD')).toContain('250');
  });

  it('returns fallback with symbol for NaN', () => {
    const result = formatCurrency(NaN, 'INR');
    expect(result).toContain('0');
    expect(result).toContain('₹');
  });

  it('returns fallback with symbol for Infinity', () => {
    const result = formatCurrency(Infinity, 'INR');
    expect(result).toContain('0');
  });

  it('returns fallback without symbol when showSymbol=false + non-finite', () => {
    const result = formatCurrency(NaN, 'INR', { showSymbol: false });
    expect(result).toBe('0.00');
  });

  it('hides currency symbol when showSymbol=false', () => {
    const result = formatCurrency(100, 'INR', { showSymbol: false });
    expect(result).not.toContain('₹');
  });

  it('handles zero amount', () => {
    const result = formatCurrency(0, 'INR');
    expect(result).toContain('0');
  });

  it('handles negative amounts', () => {
    const result = formatCurrency(-500, 'INR');
    expect(result).toContain('500');
  });

  it('handles large amounts (lakh range)', () => {
    const result = formatCurrency(100000, 'INR');
    expect(result).toContain('1');
  });

  it('handles compact notation', () => {
    const result = formatCurrency(1500000, 'INR', { compact: true });
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('covers all supported currencies', () => {
    const currencies = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD'] as const;
    for (const c of currencies) {
      const result = formatCurrency(100, c);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    }
  });
});

// ─── roundMoney ───────────────────────────────────────────────────────────────
describe('roundMoney', () => {
  it('rounds 1.005 correctly with EPSILON correction', () => {
    expect(roundMoney(1.005)).toBe(1.01);
  });

  it('rounds 2.555 to 2.56', () => {
    expect(roundMoney(2.555)).toBe(2.56);
  });

  it('handles negative values', () => {
    expect(roundMoney(-1.5)).toBe(-1.5);
    expect(roundMoney(-1.456)).toBe(-1.46);
    expect(roundMoney(-2.341)).toBe(-2.34);
  });

  it('handles zero', () => {
    expect(roundMoney(0)).toBe(0);
  });

  it('handles exact values with no rounding needed', () => {
    expect(roundMoney(1.25)).toBe(1.25);
    expect(roundMoney(10.00)).toBe(10.00);
  });

  it('supports custom decimal places: 0', () => {
    expect(roundMoney(3.7, 0)).toBe(4);
  });

  it('supports custom decimal places: 3', () => {
    expect(roundMoney(1.2345, 3)).toBe(1.235);
  });

  it('handles large values', () => {
    expect(roundMoney(9999999.995)).toBe(10000000.00);
  });
});

// ─── parseMoney ───────────────────────────────────────────────────────────────
describe('parseMoney', () => {
  it('parses numeric strings with commas', () => {
    expect(parseMoney('1,234.56')).toBe(1234.56);
  });

  it('parses currency-prefixed strings', () => {
    expect(parseMoney('₹500')).toBe(500);
    expect(parseMoney('$99.99')).toBe(99.99);
  });

  it('passes through plain numbers', () => {
    expect(parseMoney(99.99)).toBe(99.99);
    expect(parseMoney(0)).toBe(0);
  });

  it('returns 0 for Infinity', () => {
    expect(parseMoney(Infinity)).toBe(0);
  });

  it('returns 0 for -Infinity', () => {
    expect(parseMoney(-Infinity)).toBe(0);
  });

  it('returns 0 for null', () => {
    expect(parseMoney(null)).toBe(0);
  });

  it('returns 0 for undefined', () => {
    expect(parseMoney(undefined)).toBe(0);
  });

  it('returns 0 for non-numeric strings', () => {
    expect(parseMoney('abc')).toBe(0);
    expect(parseMoney('')).toBe(0);
  });

  it('returns 0 for objects', () => {
    expect(parseMoney({})).toBe(0);
    expect(parseMoney([])).toBe(0);
  });

  it('parses negative string values', () => {
    expect(parseMoney('-250.50')).toBe(-250.50);
  });
});

// ─── amountInWords ────────────────────────────────────────────────────────────
describe('amountInWords', () => {
  it('converts zero to "Zero"', () => {
    expect(amountInWords(0, 'INR')).toContain('Zero');
  });

  it('returns empty string for negative values', () => {
    expect(amountInWords(-1, 'INR')).toBe('');
  });

  it('returns empty string for Infinity', () => {
    expect(amountInWords(Infinity, 'INR')).toBe('');
  });

  it('returns empty string for NaN', () => {
    expect(amountInWords(NaN, 'INR')).toBe('');
  });

  it('converts simple whole number: 100 INR', () => {
    const result = amountInWords(100, 'INR');
    expect(result).toContain('Rupees');
    expect(result).toContain('Hundred');
    expect(result).toContain('Only');
  });

  it('handles paise (decimals)', () => {
    const result = amountInWords(100.50, 'INR');
    expect(result).toContain('Paise');
    expect(result).toContain('Fifty');
  });

  it('handles whole number with no paise', () => {
    const result = amountInWords(500, 'INR');
    expect(result).not.toContain('Paise');
    expect(result).toContain('Only');
  });

  // Indian numbering
  it('uses Thousand for 1000', () => {
    const result = amountInWords(1000, 'INR');
    expect(result).toContain('Thousand');
  });

  it('uses Lakh for 100000', () => {
    const result = amountInWords(100000, 'INR');
    expect(result).toContain('Lakh');
  });

  it('uses Crore for 10000000', () => {
    const result = amountInWords(10000000, 'INR');
    expect(result).toContain('Crore');
  });

  it('handles multi-part Indian amount: 1 Crore 50 Lakh', () => {
    const result = amountInWords(15000000, 'INR');
    expect(result).toContain('Crore');
    expect(result).toContain('Lakh');
  });

  // Global (non-INR)
  it('uses Dollars for USD', () => {
    const result = amountInWords(1000, 'USD');
    expect(result).toContain('Dollars');
    expect(result).toContain('Thousand');
  });

  it('uses Million for USD million amounts', () => {
    const result = amountInWords(1000000, 'USD');
    expect(result).toContain('Million');
  });

  it('uses Billion for USD billion amounts', () => {
    const result = amountInWords(1000000000, 'USD');
    expect(result).toContain('Billion');
  });

  it('uses Euros for EUR', () => {
    const result = amountInWords(500, 'EUR');
    expect(result).toContain('Euros');
  });

  it('uses Pounds / Pence for GBP', () => {
    const result = amountInWords(1.50, 'GBP');
    expect(result).toContain('Pounds');
    expect(result).toContain('Pence');
  });

  it('uses Dirhams for AED', () => {
    const result = amountInWords(100, 'AED');
    expect(result).toContain('Dirhams');
  });

  // Fallback branch test
  it('handles Intl.NumberFormat exception fallback branch gracefully', () => {
    const origIntl = Intl.NumberFormat;
    // @ts-ignore
    Intl.NumberFormat = function () {
      throw new Error('Simulated Intl failure');
    };
    try {
      expect(formatCurrency(1250.5, 'USD')).toBe('$1,250.50');
      expect(formatCurrency(-500, 'USD')).toBe('-$500.00');
      expect(formatCurrency(100, 'USD', { showSymbol: false })).toBe('100.00');
    } finally {
      Intl.NumberFormat = origIntl;
    }
  });

  // CURRENCY_CONFIGS export check
  it('exports CURRENCY_CONFIGS with all 6 currencies', () => {
    expect(Object.keys(CURRENCY_CONFIGS)).toHaveLength(6);
    expect(CURRENCY_CONFIGS.INR.symbol).toBe('₹');
    expect(CURRENCY_CONFIGS.USD.symbol).toBe('$');
  });
});

describe('index.ts barrel exports', () => {
  it('re-exports all string, date, and currency functions', async () => {
    const barrel = await import('./index');
    expect(barrel.formatCurrency).toBeDefined();
    expect(barrel.formatDate).toBeDefined();
    expect(barrel.truncate).toBeDefined();
  });
});

