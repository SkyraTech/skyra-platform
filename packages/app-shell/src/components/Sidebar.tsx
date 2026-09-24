import React, { ReactNode, useEffect, useRef } from 'react';
import { useShell } from '../context/ShellContext';

// ── Sidebar Container ──
export interface SidebarProps {
  children: ReactNode;
  /** Custom ID for the sidebar (useful for aria-controls) */
  id?: string;
  /** Accessible label for the sidebar */
  'aria-label'?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Sidebar({
  children,
  id = 'skyra-sidebar',
  'aria-label': ariaLabel = 'Sidebar navigation',
  className,
  style,
}: SidebarProps) {
  const { isCollapsed, isMobileOpen, isMobile, setMobileOpen } = useShell();
  const sidebarRef = useRef<HTMLElement>(null);

  // Handle click outside on mobile
  useEffect(() => {
    if (!isMobile || !isMobileOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    
    // Use capture phase to ensure it triggers before other things prevent default
    document.addEventListener('mousedown', handleOutsideClick, true);
    return () => document.removeEventListener('mousedown', handleOutsideClick, true);
  }, [isMobile, isMobileOpen, setMobileOpen]);

  // Handle Escape on mobile
  useEffect(() => {
    if (!isMobile || !isMobileOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobile, isMobileOpen, setMobileOpen]);

  return (
    <>
      {isMobile && isMobileOpen && (
        <div 
          className="skyra-sidebar-backdrop"
          aria-hidden="true"
        />
      )}
      <aside
        id={id}
        ref={sidebarRef}
        aria-label={ariaLabel}
        className={`skyra-sidebar ${className || ''}`}
        data-collapsed={isCollapsed && !isMobile ? 'true' : 'false'}
        data-mobile-open={isMobileOpen ? 'true' : 'false'}
        style={style}
      >
        {children}
      </aside>
    </>
  );
}

// ── Sidebar Regions ──
export function SidebarHeader({ children, className, style }: { children: ReactNode, className?: string, style?: React.CSSProperties }) {
  const { isCollapsed, isMobile } = useShell();
  return (
    <div className={`skyra-sidebar-header ${className || ''}`} data-collapsed={isCollapsed && !isMobile ? 'true' : 'false'} style={style}>
      {children}
    </div>
  );
}

export function SidebarNavigation({ children, className, style }: { children: ReactNode, className?: string, style?: React.CSSProperties }) {
  return (
    <div className={`skyra-sidebar-navigation ${className || ''}`} style={style}>
      {children}
    </div>
  );
}

export function SidebarFooter({ children, className, style }: { children: ReactNode, className?: string, style?: React.CSSProperties }) {
  const { isCollapsed, isMobile } = useShell();
  return (
    <div className={`skyra-sidebar-footer ${className || ''}`} data-collapsed={isCollapsed && !isMobile ? 'true' : 'false'} style={style}>
      {children}
    </div>
  );
}

export function SidebarSection({ 
  children, 
  title, 
  className, 
  style 
}: { 
  children: ReactNode, 
  title?: string, 
  className?: string, 
  style?: React.CSSProperties 
}) {
  const { isCollapsed, isMobile } = useShell();
  const actuallyCollapsed = isCollapsed && !isMobile;
  
  return (
    <div className={`skyra-sidebar-section ${className || ''}`} style={style}>
      {title && !actuallyCollapsed && (
        <div className="skyra-sidebar-section-title">{title}</div>
      )}
      {children}
    </div>
  );
}

// ── Sidebar Item ──
export interface SidebarItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  badge?: ReactNode;
  /** Render prop or slot approach if consumers want to use Next.js <Link> or router */
  as?: React.ElementType;
}

export function SidebarItem({
  icon,
  label,
  active,
  disabled,
  badge,
  as: Component = 'a',
  className,
  style,
  ...rest
}: SidebarItemProps) {
  const { isCollapsed, isMobile } = useShell();
  const actuallyCollapsed = isCollapsed && !isMobile;

  const content = (
    <>
      {icon && <span className="skyra-sidebar-item-icon" aria-hidden="true">{icon}</span>}
      {!actuallyCollapsed && <span className="skyra-sidebar-item-label">{label}</span>}
      {!actuallyCollapsed && badge && <span className="skyra-sidebar-item-badge">{badge}</span>}
    </>
  );

  return (
    <Component
      className={`skyra-sidebar-item ${className || ''}`}
      data-active={active ? 'true' : 'false'}
      data-disabled={disabled ? 'true' : 'false'}
      data-collapsed={actuallyCollapsed ? 'true' : 'false'}
      aria-current={active ? 'page' : undefined}
      aria-disabled={disabled}
      title={actuallyCollapsed ? label : undefined}
      tabIndex={disabled ? -1 : 0}
      style={style}
      {...rest}
    >
      {content}
    </Component>
  );
}
