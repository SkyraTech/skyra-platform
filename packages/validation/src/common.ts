/**
 * @skyra/validation — common.ts
 *
 * Authoritative Zod schemas for common field types.
 * Zero DOM / Zero React / Zero browser dependencies.
 * Safe for Node.js, edge runtimes, and future React Native.
 */
import { z } from 'zod';

/* ── Email ── */
export const emailSchema = z
  .string({ required_error: 'Email is required' })
  .min(1, 'Email is required')
  .email('Enter a valid email address')
  .max(254, 'Email must be 254 characters or fewer')
  .toLowerCase()
  .trim();

/* ── Phone ── */
export const phoneSchema = z
  .string({ required_error: 'Phone number is required' })
  .min(7, 'Phone number must be at least 7 digits')
  .max(15, 'Phone number must be 15 digits or fewer')
  .regex(/^[+]?[0-9\s\-().]+$/, 'Enter a valid phone number');

/* ── URL ── */
export const urlSchema = z
  .string()
  .url('Enter a valid URL')
  .max(2048, 'URL is too long')
  .optional()
  .or(z.literal(''));

/* ── Name (person/org) ── */
export const nameSchema = z
  .string({ required_error: 'Name is required' })
  .min(1, 'Name is required')
  .max(100, 'Name must be 100 characters or fewer')
  .trim();

/* ── Short text ── */
export const shortTextSchema = (label = 'This field') =>
  z
    .string()
    .max(255, `${label} must be 255 characters or fewer`)
    .trim();

/* ── Long text / notes ── */
export const longTextSchema = (label = 'Notes', maxLength = 5000) =>
  z
    .string()
    .max(maxLength, `${label} must be ${maxLength} characters or fewer`)
    .trim()
    .optional()
    .or(z.literal(''));

/* ── Positive monetary amount ── */
export const positiveAmountSchema = z
  .number({ required_error: 'Amount is required', invalid_type_error: 'Amount must be a number' })
  .nonnegative('Amount must be zero or positive')
  .finite('Amount must be a finite number');

/* ── Non-negative integer ── */
export const nonNegativeIntSchema = z
  .number()
  .int('Must be a whole number')
  .nonnegative('Must be zero or positive');

/* ── Percentage (0-100) ── */
export const percentageSchema = z
  .number()
  .min(0, 'Percentage must be 0 or greater')
  .max(100, 'Percentage cannot exceed 100');

/* ── GSTIN (India) ── */
export const gstinSchema = z
  .string()
  .regex(
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    'Enter a valid 15-character GSTIN'
  )
  .optional()
  .or(z.literal(''));

/* ── PAN (India) ── */
export const panSchema = z
  .string()
  .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Enter a valid 10-character PAN')
  .optional()
  .or(z.literal(''));

/* ── PIN Code (India) ── */
export const pinCodeSchema = z
  .string()
  .regex(/^[1-9][0-9]{5}$/, 'Enter a valid 6-digit PIN code')
  .optional()
  .or(z.literal(''));

/* ── ISO 4217 currency code ── */
export const currencyCodeSchema = z.enum(['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD'], {
  errorMap: () => ({ message: 'Select a supported currency' }),
});

/* ── Color hex ── */
export const hexColorSchema = z
  .string()
  .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Enter a valid hex color (e.g. #FF6B00)')
  .optional();

/* ── ISO date string (YYYY-MM-DD) ── */
export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a date in YYYY-MM-DD format')
  .optional()
  .or(z.literal(''));

/* ── Address ── */
export const addressSchema = z.object({
  line1:    z.string().min(1, 'Address line 1 is required').max(200).trim(),
  line2:    z.string().max(200).trim().optional(),
  city:     z.string().min(1, 'City is required').max(100).trim(),
  state:    z.string().min(1, 'State is required').max(100).trim(),
  country:  z.string().min(1, 'Country is required').max(100).trim(),
  pinCode:  pinCodeSchema,
});

export type AddressInput = z.infer<typeof addressSchema>;
