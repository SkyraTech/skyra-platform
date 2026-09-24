import React, { ReactNode } from 'react';
import { ShellProvider } from '../context/ShellContext';

export interface ApplicationShellProps {
  /** The content of the application, usually consisting of Sidebar, Header, and MainContent */
  children: ReactNode;
  /** Initial collapsed state on desktop */
  defaultCollapsed?: boolean;
  /** Optional class name */
  className?: string;
  /** Optional inline styles */
  style?: React.CSSProperties;
}

export function ApplicationShell({
  children,
  defaultCollapsed,
  className,
  style,
}: ApplicationShellProps) {
  return (
    <ShellProvider defaultCollapsed={defaultCollapsed}>
      <div 
        className={`skyra-app-shell ${className || ''}`} 
        style={style}
      >
        {children}
      </div>
    </ShellProvider>
  );
}
