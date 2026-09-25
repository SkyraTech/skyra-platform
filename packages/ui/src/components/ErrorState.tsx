'use client';

import React, { forwardRef, useState, ComponentPropsWithoutRef, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { Button } from './Button';

export type ErrorStateVariant = 'default' | 'compact' | 'card' | 'subtle' | 'outline' | 'banner';

export interface ErrorStateProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  /** Visual variant */
  variant?: ErrorStateVariant;
  /** Whether to render in compact layout */
  compact?: boolean;
  /** Primary error title */
  title?: ReactNode;
  /** Explanatory message */
  description?: ReactNode;
  /** Optional error code or reference identifier (e.g. ERR_500, REQ_9981) */
  code?: string;
  /** Technical error message or stack detail (safely encapsulated in disclosure) */
  technicalDetails?: string;
  /** Custom icon override */
  icon?: ReactNode;
  /** Action slot override */
  action?: ReactNode;
  /** Convenience callback for retry action */
  onRetry?: () => void;
  /** Label for retry button */
  retryLabel?: string;
  /** Composable sub-elements */
  children?: ReactNode;
  className?: string;
}

export const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    {
      variant = 'default',
      compact = false,
      title = 'Something went wrong',
      description = 'An unexpected error occurred while loading content. Please try again.',
      code,
      technicalDetails,
      icon,
      action,
      onRetry,
      retryLabel = 'Try Again',
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const compactClass = compact || variant === 'compact' ? 'skyra-error-state--compact' : '';
    const variantClass = `skyra-error-state--${variant}`;

    if (children) {
      return (
        <div
          ref={ref}
          className={`skyra-error-state ${variantClass} ${compactClass} ${className}`}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`skyra-error-state ${variantClass} ${compactClass} ${className}`}
        {...props}
      >
        <ErrorStateIcon>{icon ?? <AlertTriangle size={36} />}</ErrorStateIcon>
        <ErrorStateTitle>{title}</ErrorStateTitle>
        <ErrorStateDescription>{description}</ErrorStateDescription>

        {(code || technicalDetails) && (
          <ErrorStateDetails code={code} details={technicalDetails} />
        )}

        {(action || onRetry) && (
          <ErrorStateActions>
            {action ?? (
              onRetry && (
                <Button variant="primary" onClick={onRetry}>
                  <RotateCcw size={15} />
                  <span>{retryLabel}</span>
                </Button>
              )
            )}
          </ErrorStateActions>
        )}
      </div>
    );
  }
);
ErrorState.displayName = 'ErrorState';

/* ─── ErrorStateIcon ─── */

export interface ErrorStateIconProps extends ComponentPropsWithoutRef<'div'> {
  children?: ReactNode;
  className?: string;
}

export const ErrorStateIcon = forwardRef<HTMLDivElement, ErrorStateIconProps>(
  ({ children, className = '', ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={`skyra-error-state-icon ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);
ErrorStateIcon.displayName = 'ErrorStateIcon';

/* ─── ErrorStateTitle ─── */

export type ErrorStateHeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p';

export interface ErrorStateTitleProps extends ComponentPropsWithoutRef<'h3'> {
  as?: ErrorStateHeadingLevel;
  children?: ReactNode;
  className?: string;
}

export const ErrorStateTitle = forwardRef<HTMLHeadingElement, ErrorStateTitleProps>(
  ({ as: Component = 'h3', children, className = '', ...props }, ref) => {
    const Tag = Component as React.ElementType;
    return (
      <Tag
        ref={ref}
        className={`skyra-error-state-title ${className}`}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);
ErrorStateTitle.displayName = 'ErrorStateTitle';

/* ─── ErrorStateDescription ─── */

export interface ErrorStateDescriptionProps extends ComponentPropsWithoutRef<'p'> {
  children?: ReactNode;
  className?: string;
}

export const ErrorStateDescription = forwardRef<HTMLParagraphElement, ErrorStateDescriptionProps>(
  ({ children, className = '', ...props }, ref) => (
    <p
      ref={ref}
      className={`skyra-error-state-desc ${className}`}
      {...props}
    >
      {children}
    </p>
  )
);
ErrorStateDescription.displayName = 'ErrorStateDescription';

export interface ErrorStateDetailsProps extends ComponentPropsWithoutRef<'div'> {
  code?: string;
  errorCode?: string;
  requestId?: string;
  details?: string;
  technicalMessage?: string;
  className?: string;
  children?: ReactNode;
}

export const ErrorStateDetails = forwardRef<HTMLDivElement, ErrorStateDetailsProps>(
  (
    {
      code,
      errorCode,
      requestId,
      details,
      technicalMessage,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const effectiveCode = errorCode ?? code;
    const effectiveDetails = technicalMessage ?? details;

    const copyDetails = () => {
      const parts: string[] = [];
      if (effectiveCode) parts.push(`Error Code: ${effectiveCode}`);
      if (requestId) parts.push(`Request ID: ${requestId}`);
      if (effectiveDetails) parts.push(`Details: ${effectiveDetails}`);

      const textToCopy = parts.join('\n') || 'N/A';
      navigator.clipboard?.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    const hasContent = effectiveCode || requestId || effectiveDetails || children;
    if (!hasContent) return null;

    return (
      <div ref={ref} className={`skyra-error-state-details ${className}`} {...props}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {effectiveCode && (
            <span className="skyra-error-state-code" title="Response Code">
              {effectiveCode}
            </span>
          )}
          {requestId && (
            <span className="skyra-error-state-code" title="Request ID">
              {requestId}
            </span>
          )}
          {(effectiveDetails || children) && (
            <button
              type="button"
              className="skyra-error-state-toggle"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
            >
              <span>{isOpen ? 'Hide technical details' : 'Show technical details'}</span>
              {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </div>

        {isOpen && (effectiveDetails || children) && (
          <div className="skyra-error-state-panel">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.25rem' }}>
              <button
                type="button"
                className="skyra-error-state-copy"
                onClick={copyDetails}
                aria-label="Copy error details"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            {effectiveDetails && <pre className="skyra-error-state-pre">{effectiveDetails}</pre>}
            {children}
          </div>
        )}
      </div>
    );
  }
);
ErrorStateDetails.displayName = 'ErrorStateDetails';

/* ─── ErrorStateActions ─── */

export interface ErrorStateActionsProps extends ComponentPropsWithoutRef<'div'> {
  children?: ReactNode;
  className?: string;
}

export const ErrorStateActions = forwardRef<HTMLDivElement, ErrorStateActionsProps>(
  ({ children, className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`skyra-error-state-actions ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);
ErrorStateActions.displayName = 'ErrorStateActions';
