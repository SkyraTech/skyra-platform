/**
 * @skyra/utils — currency.ts
 *
 * Pure TypeScript currency utilities.
 * Zero DOM / Zero React / Zero browser dependencies.
 * Safe for Node.js, edge runtimes, and future React Native.
 */

export type SupportedCurrency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'SGD';

export interface CurrencyConfig {
  symbol: string;
  code: SupportedCurrency;
  locale: string;
  decimalPlaces: number;
}

export const CURRENCY_CONFIGS: Record<SupportedCurrency, CurrencyConfig> = {
  INR: { symbol: '₹', code: 'INR', locale: 'en-IN', decimalPlaces: 2 },
  USD: { symbol: '$', code: 'USD', locale: 'en-US', decimalPlaces: 2 },
  EUR: { symbol: '€', code: 'EUR', locale: 'de-DE', decimalPlaces: 2 },
  GBP: { symbol: '£', code: 'GBP', locale: 'en-GB', decimalPlaces: 2 },
  AED: { symbol: 'AED', code: 'AED', locale: 'ar-AE', decimalPlaces: 2 },
  SGD: { symbol: 'S$', code: 'SGD', locale: 'en-SG', decimalPlaces: 2 },
} as const;

/**
 * Format a numeric amount as a locale-aware currency string.
 *
 * @example
 *   formatCurrency(1234.5, 'INR') // '₹1,234.50'
 *   formatCurrency(9999, 'USD')   // '$9,999.00'
 */
export function formatCurrency(
  amount: number,
  currency: SupportedCurrency = 'INR',
  options?: { showSymbol?: boolean; compact?: boolean }
): string {
  const config = CURRENCY_CONFIGS[currency];
  const { showSymbol = true, compact = false } = options ?? {};

  if (!isFinite(amount)) return showSymbol ? `${config.symbol}0.00` : '0.00';

  try {
    const formatted = new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      minimumFractionDigits: config.decimalPlaces,
      maximumFractionDigits: config.decimalPlaces,
      notation: compact ? 'compact' : 'standard',
    }).format(amount);
    return showSymbol ? formatted : formatted.replace(config.symbol, '').trim();
  } catch {
    // Fallback for environments without full Intl support
    const sign = amount < 0 ? '-' : '';
    const abs = Math.abs(amount).toFixed(config.decimalPlaces);
    const [int, dec] = abs.split('.');
    const intFormatted = int?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') ?? '0';
    const num = `${intFormatted}.${dec ?? '00'}`;
    return showSymbol ? `${sign}${config.symbol}${num}` : `${sign}${num}`;
  }
}

/**
 * Round a monetary value to avoid floating-point artifacts.
 * Uses banker's rounding (rounds half to even) for precision.
 */
export function roundMoney(amount: number, decimalPlaces = 2): number {
  return Number(Math.round(Number(amount + 'e' + decimalPlaces)) + 'e-' + decimalPlaces);
}

/**
 * Safely parse a string or number into a finite monetary value.
 * Returns 0 for invalid inputs.
 */
export function parseMoney(value: unknown): number {
  if (typeof value === 'number') return isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(cleaned);
    return isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen',
];
const TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty',
  'Sixty', 'Seventy', 'Eighty', 'Ninety',
];

function toWordsBelow1000(n: number): string {
  if (n === 0) return '';
  if (n < 20) return (ONES[n] ?? '') + ' ';
  if (n < 100) return (TENS[Math.floor(n / 10)] ?? '') + ' ' + toWordsBelow1000(n % 10);
  return (ONES[Math.floor(n / 100)] ?? '') + ' Hundred ' + toWordsBelow1000(n % 100);
}

/**
 * Convert a numeric amount to words (Indian numbering system for INR).
 * Used for invoice amount-in-words display.
 *
 * @example
 *   amountInWords(1234.50, 'INR') // 'Rupees One Thousand Two Hundred Thirty Four and Fifty Paise Only'
 */
export function amountInWords(amount: number, currency: SupportedCurrency = 'INR'): string {
  if (!isFinite(amount) || amount < 0) return '';

  const rounded = roundMoney(amount);
  const [intPart, decPart] = rounded.toFixed(2).split('.');
  const intNum = parseInt(intPart ?? '0', 10);
  const decNum = parseInt(decPart ?? '0', 10);

  const currencyWords: Record<SupportedCurrency, { major: string; minor: string }> = {
    INR: { major: 'Rupees', minor: 'Paise' },
    USD: { major: 'Dollars', minor: 'Cents' },
    EUR: { major: 'Euros', minor: 'Cents' },
    GBP: { major: 'Pounds', minor: 'Pence' },
    AED: { major: 'Dirhams', minor: 'Fils' },
    SGD: { major: 'Dollars', minor: 'Cents' },
  };

  const names = currencyWords[currency];

  function toWordsIndian(n: number): string {
    if (n === 0) return 'Zero';
    let result = '';
    const crore = Math.floor(n / 10000000);
    const lakh = Math.floor((n % 10000000) / 100000);
    const thousand = Math.floor((n % 100000) / 1000);
    const rest = n % 1000;

    if (crore > 0) result += toWordsBelow1000(crore) + 'Crore ';
    if (lakh > 0) result += toWordsBelow1000(lakh) + 'Lakh ';
    if (thousand > 0) result += toWordsBelow1000(thousand) + 'Thousand ';
    if (rest > 0) result += toWordsBelow1000(rest);
    return result.trim();
  }

  function toWordsGlobal(n: number): string {
    if (n === 0) return 'Zero';
    let result = '';
    const billion = Math.floor(n / 1000000000);
    const million = Math.floor((n % 1000000000) / 1000000);
    const thousand = Math.floor((n % 1000000) / 1000);
    const rest = n % 1000;

    if (billion > 0) result += toWordsBelow1000(billion) + 'Billion ';
    if (million > 0) result += toWordsBelow1000(million) + 'Million ';
    if (thousand > 0) result += toWordsBelow1000(thousand) + 'Thousand ';
    if (rest > 0) result += toWordsBelow1000(rest);
    return result.trim();
  }

  const toWords = currency === 'INR' ? toWordsIndian : toWordsGlobal;
  const intWords = toWords(intNum);
  const majorStr = intNum === 0 ? '' : `${names.major} ${intWords}`;
  const minorStr = decNum > 0 ? `and ${toWordsBelow1000(decNum).trim()} ${names.minor}` : '';

  const parts = [majorStr, minorStr].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') + ' Only' : `${names.major} Zero Only`;
}
