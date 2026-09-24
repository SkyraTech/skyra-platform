import React, { ReactNode } from 'react';
import { useShell } from '../context/ShellContext';

export interface MainContentProps {
  children: ReactNode;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function MainContent({
  children,
  id = 'main-content',
  className,
  style,
}: MainContentProps) {
  const { isCollapsed, isMobile } = useShell();

  return (
    <div 
      id={id}
      className={`skyra-main-content ${className || ''}`}
      data-collapsed={isCollapsed && !isMobile ? 'true' : 'false'}
      style={style}
    >
      {children}
    </div>
  );
}

export function SkipLink({ targetId = 'main-content', label = 'Skip to main content' }: { targetId?: string, label?: string }) {
  return (
    <a href={`#${targetId}`} className="skyra-skip-link">
      {label}
    </a>
  );
}
