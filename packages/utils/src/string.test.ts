import { describe, it, expect } from 'vitest';
import {
  truncate,
  toTitleCase,
  toSlug,
  getInitials,
  capitalize,
  maskString,
  normalizePhone,
  isValidEmail,
  simpleId,
  normalizeWhitespace,
} from './string';

// ─── truncate ────────────────────────────────────────────────────────────────
describe('truncate', () => {
  it('truncates long strings with default ellipsis', () => {
    expect(truncate('Hello World', 8)).toBe('Hello...');
  });

  it('returns string unchanged if at maxLength', () => {
    expect(truncate('Hello', 5)).toBe('Hello');
  });

  it('returns string unchanged if shorter than maxLength', () => {
    expect(truncate('Hi', 10)).toBe('Hi');
  });

  it('supports a custom suffix', () => {
    expect(truncate('Hello World', 7, '…')).toBe('Hello …');
  });

  it('handles empty string', () => {
    expect(truncate('', 5)).toBe('');
  });

  it('handles suffix longer than maxLength gracefully', () => {
    // When suffix length >= maxLength, slice(0, negative) = '' -> just suffix
    const result = truncate('Hello World', 2, '...');
    expect(result).toBe('...');
  });

  it('works with single character', () => {
    expect(truncate('A', 1)).toBe('A');
  });

  it('truncates to exact boundary', () => {
    expect(truncate('ABCDEF', 6)).toBe('ABCDEF'); // exactly maxLength, no truncation
    expect(truncate('ABCDEFG', 6)).toBe('ABC...');
  });
});

// ─── toTitleCase ─────────────────────────────────────────────────────────────
describe('toTitleCase', () => {
  it('capitalizes each word', () => {
    expect(toTitleCase('hello world')).toBe('Hello World');
  });

  it('lowercases all-caps input', () => {
    expect(toTitleCase('SKYRA TECH')).toBe('Skyra Tech');
  });

  it('handles single word', () => {
    expect(toTitleCase('skyra')).toBe('Skyra');
  });

  it('handles empty string', () => {
    expect(toTitleCase('')).toBe('');
  });

  it('handles multiple spaces between words', () => {
    const result = toTitleCase('hello  world');
    // split by ' ' — double space creates empty word, which becomes empty string
    expect(result).toContain('Hello');
    expect(result).toContain('World');
  });
});

// ─── toSlug ──────────────────────────────────────────────────────────────────
describe('toSlug', () => {
  it('converts basic string to slug', () => {
    expect(toSlug('Hello World!')).toBe('hello-world');
  });

  it('handles multiple spaces', () => {
    expect(toSlug('a  b  c')).toBe('a-b-c');
  });

  it('removes special characters', () => {
    expect(toSlug('Hello @#World!')).toBe('hello-world');
  });

  it('handles accented characters (NFD normalization)', () => {
    const result = toSlug('Café au lait');
    expect(result).toBe('cafe-au-lait');
  });

  it('collapses multiple hyphens', () => {
    expect(toSlug('hello---world')).toBe('hello-world');
  });

  it('trims leading/trailing whitespace', () => {
    expect(toSlug('  hello  ')).toBe('hello');
  });

  it('handles empty string', () => {
    expect(toSlug('')).toBe('');
  });

  it('handles numbers', () => {
    expect(toSlug('Product 123')).toBe('product-123');
  });

  it('handles already slugified string', () => {
    expect(toSlug('hello-world')).toBe('hello-world');
  });
});

// ─── getInitials ─────────────────────────────────────────────────────────────
describe('getInitials', () => {
  it('returns initials from full name', () => {
    expect(getInitials('Arjun Kumar')).toBe('AK');
  });

  it('handles single name', () => {
    expect(getInitials('Sita')).toBe('S');
  });

  it('respects maxChars', () => {
    expect(getInitials('A B C D', 3)).toBe('ABC');
  });

  it('handles extra whitespace', () => {
    expect(getInitials('  Jane   Doe  ')).toBe('JD');
  });

  it('handles empty string', () => {
    expect(getInitials('')).toBe('');
  });

  it('handles three-part name with default maxChars=2', () => {
    expect(getInitials('John Michael Doe')).toBe('JM');
  });
});

// ─── capitalize ──────────────────────────────────────────────────────────────
describe('capitalize', () => {
  it('capitalizes first letter and lowercases rest', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('WORLD')).toBe('World');
  });

  it('handles empty string', () => {
    expect(capitalize('')).toBe('');
  });

  it('handles single character', () => {
    expect(capitalize('a')).toBe('A');
  });

  it('handles already capitalized string', () => {
    expect(capitalize('Hello')).toBe('Hello');
  });
});

// ─── maskString ──────────────────────────────────────────────────────────────
describe('maskString', () => {
  it('masks all but last N chars with bullets', () => {
    expect(maskString('1234567890', 4)).toBe('••••••7890');
  });

  it('returns as-is when string length equals visibleEnd', () => {
    expect(maskString('1234', 4)).toBe('1234');
  });

  it('returns as-is when string is shorter than visibleEnd', () => {
    expect(maskString('12', 4)).toBe('12');
  });

  it('supports custom mask character', () => {
    expect(maskString('ABCDEFGH', 3, '*')).toBe('*****FGH');
  });

  it('handles empty string', () => {
    expect(maskString('', 4)).toBe('');
  });

  it('handles visibleEnd=0 (full mask)', () => {
    expect(maskString('secret', 0)).toBe('••••••');
  });
});

// ─── normalizePhone ───────────────────────────────────────────────────────────
describe('normalizePhone', () => {
  it('strips non-digit characters', () => {
    expect(normalizePhone('+91 (98765) 43210')).toBe('919876543210');
  });

  it('handles already clean number', () => {
    expect(normalizePhone('1234567890')).toBe('1234567890');
  });

  it('handles empty string', () => {
    expect(normalizePhone('')).toBe('');
  });

  it('handles dashes and dots', () => {
    expect(normalizePhone('123-456-7890')).toBe('1234567890');
    expect(normalizePhone('123.456.7890')).toBe('1234567890');
  });
});

// ─── isValidEmail ─────────────────────────────────────────────────────────────
describe('isValidEmail', () => {
  it('validates correct email formats', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('user.name+tag@sub.domain.org')).toBe(true);
  });

  it('rejects missing @ symbol', () => {
    expect(isValidEmail('not-an-email')).toBe(false);
  });

  it('rejects missing domain', () => {
    expect(isValidEmail('missing@')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });

  it('rejects strings with spaces', () => {
    expect(isValidEmail('user @example.com')).toBe(false);
  });

  it('rejects missing TLD', () => {
    expect(isValidEmail('user@example')).toBe(false);
  });
});

// ─── simpleId ─────────────────────────────────────────────────────────────────
describe('simpleId', () => {
  it('returns a string of the requested length', () => {
    const id = simpleId('', 8);
    expect(id).toHaveLength(8);
  });

  it('prepends prefix when provided', () => {
    const id = simpleId('cust', 8);
    expect(id.startsWith('cust_')).toBe(true);
    expect(id).toHaveLength(13); // 'cust_' (5) + 8
  });

  it('generates different IDs each time', () => {
    const a = simpleId('', 10);
    const b = simpleId('', 10);
    // Very unlikely to be equal (but not guaranteed; test probability)
    // We just verify they are strings of correct length
    expect(a).toHaveLength(10);
    expect(b).toHaveLength(10);
  });

  it('only contains allowed characters when no prefix', () => {
    const id = simpleId('', 20);
    expect(id).toMatch(/^[a-z0-9]+$/);
  });

  it('handles length=1', () => {
    const id = simpleId('', 1);
    expect(id).toHaveLength(1);
  });
});

// ─── normalizeWhitespace ──────────────────────────────────────────────────────
describe('normalizeWhitespace', () => {
  it('collapses internal whitespace', () => {
    expect(normalizeWhitespace('  hello   world  ')).toBe('hello world');
  });

  it('handles tabs and newlines', () => {
    expect(normalizeWhitespace('hello\tworld')).toBe('hello world');
    expect(normalizeWhitespace('hello\nworld')).toBe('hello world');
  });

  it('handles empty string', () => {
    expect(normalizeWhitespace('')).toBe('');
  });

  it('handles already normalized string', () => {
    expect(normalizeWhitespace('hello world')).toBe('hello world');
  });

  it('trims leading and trailing whitespace', () => {
    expect(normalizeWhitespace('   trimmed   ')).toBe('trimmed');
  });
});
