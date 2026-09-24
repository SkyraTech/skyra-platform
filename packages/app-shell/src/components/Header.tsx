import React, { ReactNode } from 'react';
import { useShell } from '../context/ShellContext';

export interface HeaderProps {
  children?: ReactNode;
  /** Component to render the left region (often title or toggle) */
  leftNode?: ReactNode;
  /** Component to render in the center (often breadcrumbs or search) */
  centerNode?: ReactNode;
  /** Component to render on the right (often actions/profile) */
  rightNode?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Header({
  children,
  leftNode,
  centerNode,
  rightNode,
  className,
  style,
}: HeaderProps) {
  const { isMobile } = useShell();
  
  return (
    <header className={`skyra-header ${className || ''}`} style={style}>
      {leftNode && <div className="skyra-header-left">{leftNode}</div>}
      {centerNode && <div className="skyra-header-center">{centerNode}</div>}
      {children && <div className="skyra-header-content">{children}</div>}
      {rightNode && <div className="skyra-header-right">{rightNode}</div>}
    </header>
  );
}

/** Pre-built toggle button to place in the header leftNode */
export function SidebarToggle({ 
  iconDesktop, 
  iconMobile,
  className,
  style,
}: { 
  iconDesktop?: ReactNode, 
  iconMobile?: ReactNode,
  className?: string,
  style?: React.CSSProperties
}) {
  const { isMobile, isMobileOpen, isCollapsed, toggleSidebar } = useShell();

  return (
    <button
      className={`skyra-sidebar-toggle ${className || ''}`}
      onClick={toggleSidebar}
      aria-label={isMobile 
        ? (isMobileOpen ? 'Close menu' : 'Open menu') 
        : (isCollapsed ? 'Expand sidebar' : 'Collapse sidebar')}
      aria-expanded={isMobile ? isMobileOpen : undefined}
      aria-controls="skyra-sidebar"
      style={style}
    >
      {isMobile ? iconMobile : iconDesktop}
    </button>
  );
}
