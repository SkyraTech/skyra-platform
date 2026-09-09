/**
 * @skyra/validation — org.ts
 *
 * Organization and settings validation schemas.
 * Cross-product — used by ERP, CRM, Billing.
 */
import { z } from 'zod';
import {
  nameSchema,
  emailSchema,
  phoneSchema,
  urlSchema,
  gstinSchema,
  panSchema,
  addressSchema,
  currencyCodeSchema,
  hexColorSchema,
  shortTextSchema,
} from './common';

/* ── Organization Creation / Update ── */
export const orgSchema = z.object({
  name:             nameSchema,
  displayName:      nameSchema.optional(),
  email:            emailSchema.optional().or(z.literal('')),
  phone:            phoneSchema.optional().or(z.literal('')),
  website:          urlSchema,
  gstin:            gstinSchema,
  pan:              panSchema,
  currency:         currencyCodeSchema,
  timezone:         z.string().max(50).optional(),
  address:          addressSchema.optional(),
  logo:             urlSchema,
  brandColor:       hexColorSchema,
  invoicePrefix:    shortTextSchema('Invoice prefix').optional(),
  invoiceFooter:    z.string().max(500).optional().or(z.literal('')),
});

export type OrgInput = z.infer<typeof orgSchema>;
export type OrgUpdateInput = Partial<OrgInput>;

/* ── User Profile ── */
export const userProfileSchema = z.object({
  name:    nameSchema,
  email:   emailSchema,
  phone:   phoneSchema.optional().or(z.literal('')),
  role:    z.string().max(50).optional(),
  avatar:  urlSchema,
});

export type UserProfileInput = z.infer<typeof userProfileSchema>;

/* ── Client / Contact ── */
export const clientSchema = z.object({
  name:         nameSchema,
  email:        emailSchema.optional().or(z.literal('')),
  phone:        phoneSchema.optional().or(z.literal('')),
  gstin:        gstinSchema,
  pan:          panSchema,
  address:      addressSchema.optional(),
  notes:        z.string().max(2000).optional().or(z.literal('')),
  currency:     currencyCodeSchema.optional(),
  paymentTerms: z.number().int().min(0).max(365).optional(),
});

export type ClientInput = z.infer<typeof clientSchema>;

/* ── Bank Account ── */
export const bankAccountSchema = z.object({
  bankName:      z.string().min(1, 'Bank name is required').max(100).trim(),
  accountName:   z.string().min(1, 'Account name is required').max(100).trim(),
  accountNumber: z.string().min(5).max(30).trim(),
  ifscCode:      z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Enter a valid IFSC code').optional().or(z.literal('')),
  upiId:         z.string().max(50).optional().or(z.literal('')),
  isDefault:     z.boolean().optional(),
});

export type BankAccountInput = z.infer<typeof bankAccountSchema>;
