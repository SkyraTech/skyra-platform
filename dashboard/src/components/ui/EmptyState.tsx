'use client';

import React, { forwardRef, ComponentPropsWithoutRef, ReactNode } from 'react';
import { Inbox } from 'lucide-react';

export type EmptyStateVariant = 'default' | 'compact' | 'outline' | 'dashed';

export interface EmptyStateProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  /** Visual display variant */
  variant?: EmptyStateVariant;
  /** Whether to render in compact layout */
  compact?: boolean;
  /** Primary headline title */
  title?: ReactNode;
  /** Explanatory description */
  description?: ReactNode;
  /** Decorative or themed icon */
  icon?: ReactNode;
  /** Action slot (e.g. Button or button group) */
  action?: ReactNode;
  /** Composable sub-elements */
  children?: ReactNode;
  className?: string;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      variant = 'default',
      compact = false,
      title,
      description,
      icon,
      action,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const compactClass = compact || variant === 'compact' ? 'skyra-empty-state--compact' : '';
    const variantClass = `skyra-empty-state--${variant}`;

    if (children) {
      return (
        <div
          ref={ref}
          className={`skyra-empty-state ${variantClass} ${compactClass} ${className}`}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`skyra-empty-state ${variantClass} ${compactClass} ${className}`}
        {...props}
      >
        <EmptyStateIcon>{icon ?? <Inbox size={36} />}</EmptyStateIcon>
        {title && <EmptyStateTitle>{title}</EmptyStateTitle>}
        {description && <EmptyStateDescription>{description}</EmptyStateDescription>}
        {action && <EmptyStateActions>{action}</EmptyStateActions>}
      </div>
    );
  }
);
EmptyState.displayName = 'EmptyState';

/* ─── EmptyStateIcon ─── */

export interface EmptyStateIconProps extends ComponentPropsWithoutRef<'div'> {
  children?: ReactNode;
  className?: string;
}

export const EmptyStateIcon = forwardRef<HTMLDivElement, EmptyStateIconProps>(
  ({ children, className = '', ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={`skyra-empty-state-icon ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);
EmptyStateIcon.displayName = 'EmptyStateIcon';

/* ─── EmptyStateTitle ─── */

export type EmptyStateHeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p';

export interface EmptyStateTitleProps extends ComponentPropsWithoutRef<'h3'> {
  as?: EmptyStateHeadingLevel;
  children?: ReactNode;
  className?: string;
}

export const EmptyStateTitle = forwardRef<HTMLHeadingElement, EmptyStateTitleProps>(
  ({ as: Component = 'h3', children, className = '', ...props }, ref) => {
    const Tag = Component as React.ElementType;
    return (
      <Tag
        ref={ref}
        className={`skyra-empty-state-title ${className}`}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);
EmptyStateTitle.displayName = 'EmptyStateTitle';

/* ─── EmptyStateDescription ─── */

export interface EmptyStateDescriptionProps extends ComponentPropsWithoutRef<'p'> {
  children?: ReactNode;
  className?: string;
}

export const EmptyStateDescription = forwardRef<HTMLParagraphElement, EmptyStateDescriptionProps>(
  ({ children, className = '', ...props }, ref) => (
    <p
      ref={ref}
      className={`skyra-empty-state-desc ${className}`}
      {...props}
    >
      {children}
    </p>
  )
);
EmptyStateDescription.displayName = 'EmptyStateDescription';

/* ─── EmptyStateActions ─── */

export interface EmptyStateActionsProps extends ComponentPropsWithoutRef<'div'> {
  children?: ReactNode;
  className?: string;
}

export const EmptyStateActions = forwardRef<HTMLDivElement, EmptyStateActionsProps>(
  ({ children, className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`skyra-empty-state-actions ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);
EmptyStateActions.displayName = 'EmptyStateActions';
