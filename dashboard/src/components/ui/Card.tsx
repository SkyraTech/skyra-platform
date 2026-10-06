'use client';

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  flat?: boolean;
  children?: React.ReactNode;
}

export interface CardSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

/**
 * @skyra/ui Card
 *
 * [B] PLATFORM EXTRACTION from skyra-erp (confirmed: radius-xl, shadow-sm, surface bg)
 * [C] PLATFORM ENHANCEMENT: Added sub-component slots (Header, Title, Description,
 *     Content, Footer) to support QR consumer pages that compose structured cards.
 *
 * Usage — simple:
 *   <Card>content</Card>
 *
 * Usage — composed:
 *   <Card>
 *     <CardHeader>
 *       <CardTitle>My Title</CardTitle>
 *       <CardDescription>A short description</CardDescription>
 *     </CardHeader>
 *     <CardContent>body</CardContent>
 *     <CardFooter>actions</CardFooter>
 *   </Card>
 */
export function Card({ size = 'md', flat = false, className = '', children, ...rest }: CardProps) {
  return (
    <div
      className={[
        'skyra-card',
        size === 'sm' ? 'skyra-card--sm' : size === 'lg' ? 'skyra-card--lg' : '',
        flat ? 'skyra-card--flat' : '',
        className,
      ].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardSectionProps>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={['skyra-card__header', className].filter(Boolean).join(' ')}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem',
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid var(--skyra-border)' }}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', ...props }, ref) => (
    <h3
      ref={ref}
      className={['skyra-card__title', className].filter(Boolean).join(' ')}
      style={{
        fontSize: '1rem',
        fontWeight: 600,
        color: 'var(--skyra-text)',
        fontFamily: 'var(--skyra-font-display)',
        margin: 0,
        lineHeight: 1.3 }}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', ...props }, ref) => (
    <p
      ref={ref}
      className={['skyra-card__description', className].filter(Boolean).join(' ')}
      style={{
        fontSize: '0.8125rem',
        color: 'var(--skyra-text-muted)',
        margin: 0,
        lineHeight: 1.5 }}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, CardSectionProps>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={['skyra-card__content', className].filter(Boolean).join(' ')}
      style={{ padding: '1.25rem 1.5rem' }}
      {...props}
    />
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, CardSectionProps>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={['skyra-card__footer', className].filter(Boolean).join(' ')}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '1rem 1.5rem',
        borderTop: '1px solid var(--skyra-border)',
        gap: '0.75rem' }}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';
