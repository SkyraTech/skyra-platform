/**
 * @skyra/utils — string.ts
 *
 * Pure TypeScript string utilities.
 * Zero DOM / Zero React / Zero browser dependencies.
 */

/**
 * Truncate a string to a maximum length, appending an ellipsis if needed.
 *
 * @example
 *   truncate('Hello World', 8) // 'Hello...'
 */
export function truncate(str: string, maxLength: number, suffix = '...'): string {
  if (str.length <= maxLength) return str;
  if (maxLength <= suffix.length) return suffix;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Convert a string to title case.
 *
 * @example
 *   toTitleCase('hello world') // 'Hello World'
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Convert a string to a URL-safe slug.
 *
 * @example
 *   toSlug('Hello World!') // 'hello-world'
 */
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Generate a user's initials from a full name (max 2 letters).
 *
 * @example
 *   getInitials('Arjun Kumar') // 'AK'
 *   getInitials('Sita') // 'S'
 */
export function getInitials(name: string, maxChars = 2): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts
    .slice(0, maxChars)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

/**
 * Capitalize the first letter of a string.
 *
 * @example
 *   capitalize('hello') // 'Hello'
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Mask a string, showing only the last N characters.
 * Useful for API keys, account numbers.
 *
 * @example
 *   maskString('1234567890', 4) // '••••••7890'
 */
export function maskString(str: string, visibleEnd = 4, maskChar = '•'): string {
  if (str.length <= visibleEnd) return str;
  return maskChar.repeat(str.length - visibleEnd) + (visibleEnd > 0 ? str.slice(-visibleEnd) : '');
}

/**
 * Normalize a phone number to digits only.
 */
export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Check if a string is a valid email address (basic RFC pattern).
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Generate a simple unique ID string (not cryptographically secure).
 * Use nanoid for crypto-grade IDs in production.
 */
export function simpleId(prefix = '', length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < length; i++) {
    id += chars[Math.floor(Math.random() * chars.length)] ?? 'a';
  }
  return prefix ? `${prefix}_${id}` : id;
}

/**
 * Remove leading/trailing whitespace and collapse internal whitespace.
 */
export function normalizeWhitespace(str: string): string {
  return str.trim().replace(/\s+/g, ' ');
}
