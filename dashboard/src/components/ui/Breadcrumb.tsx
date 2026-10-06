'use client';

import React, { ReactNode, forwardRef, ComponentPropsWithoutRef } from 'react';
import { ChevronRight, MoreHorizontal } from 'lucide-react';

/* ============================================================
   BREADCRUMB NAV CONTAINER
   ============================================================ */

export interface BreadcrumbProps extends ComponentPropsWithoutRef<'nav'> {
  children: ReactNode;
  className?: string;
  separator?: ReactNode;
}

/**
 * @skyra/ui Breadcrumb
 *
 * Semantic navigation hierarchy primitive following WAI-ARIA breadcrumb guidelines.
 */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={`skyra-breadcrumb ${className}`}
        {...props}
      >
        {children}
      </nav>
    );
  }
);
Breadcrumb.displayName = 'Breadcrumb';

/* ============================================================
   BREADCRUMB LIST
   ============================================================ */

export interface BreadcrumbListProps extends ComponentPropsWithoutRef<'ol'> {
  children: ReactNode;
  className?: string;
}

export const BreadcrumbList = forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <ol ref={ref} className={`skyra-breadcrumb-list ${className}`} {...props}>
        {children}
      </ol>
    );
  }
);
BreadcrumbList.displayName = 'BreadcrumbList';

/* ============================================================
   BREADCRUMB ITEM
   ============================================================ */

export interface BreadcrumbItemProps extends ComponentPropsWithoutRef<'li'> {
  children: ReactNode;
  className?: string;
}

export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <li ref={ref} className={`skyra-breadcrumb-item ${className}`} {...props}>
        {children}
      </li>
    );
  }
);
BreadcrumbItem.displayName = 'BreadcrumbItem';

/* ============================================================
   BREADCRUMB LINK
   ============================================================ */

export interface BreadcrumbLinkProps extends ComponentPropsWithoutRef<'a'> {
  asChild?: boolean;
  className?: string;
  children: ReactNode;
}

export const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ asChild = false, className = '', children, ...props }, ref) => {
    if (asChild && React.isValidElement<{ className?: string }>(children)) {
      return React.cloneElement(children, {
        className: `skyra-breadcrumb-link ${className} ${children.props.className || ''}`.trim(),
        ref,
        ...props,
      } as React.LiHTMLAttributes<HTMLLIElement>);
    }

    return (
      <a ref={ref} className={`skyra-breadcrumb-link ${className}`} {...props}>
        {children}
      </a>
    );
  }
);
BreadcrumbLink.displayName = 'BreadcrumbLink';

/* ============================================================
   BREADCRUMB PAGE (CURRENT ITEM)
   ============================================================ */

export interface BreadcrumbPageProps extends ComponentPropsWithoutRef<'span'> {
  children: ReactNode;
  className?: string;
}

export const BreadcrumbPage = forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <span
        ref={ref}
        role="link"
        aria-disabled="true"
        aria-current="page"
        className={`skyra-breadcrumb-page ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);
BreadcrumbPage.displayName = 'BreadcrumbPage';

/* ============================================================
   BREADCRUMB SEPARATOR
   ============================================================ */

export interface BreadcrumbSeparatorProps extends ComponentPropsWithoutRef<'li'> {
  children?: ReactNode;
  className?: string;
}

export function BreadcrumbSeparator({
  children,
  className = '',
  ...props
}: BreadcrumbSeparatorProps) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={`skyra-breadcrumb-separator ${className}`}
      {...props}
    >
      {children || <ChevronRight size={14} className="skyra-breadcrumb-separator-icon" />}
    </li>
  );
}

/* ============================================================
   BREADCRUMB ELLIPSIS (FOR COLLAPSED MIDDLE ITEMS)
   ============================================================ */

export interface BreadcrumbEllipsisProps extends ComponentPropsWithoutRef<'span'> {
  className?: string;
}

export function BreadcrumbEllipsis({ className = '', ...props }: BreadcrumbEllipsisProps) {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={`skyra-breadcrumb-ellipsis ${className}`}
      {...props}
    >
      <MoreHorizontal size={14} />
      <span className="skyra-sr-only">More links</span>
    </span>
  );
}
