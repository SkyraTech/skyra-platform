import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ShellContextValue {
  /** True if sidebar is collapsed on desktop */
  isCollapsed: boolean;
  setCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  /** True if sidebar is open on mobile */
  isMobileOpen: boolean;
  setMobileOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  /** True if the viewport is currently < 768px */
  isMobile: boolean;
  /** Toggles the sidebar on desktop, or opens the drawer on mobile */
  toggleSidebar: () => void;
}

const ShellContext = createContext<ShellContextValue | undefined>(undefined);

export interface ShellProviderProps {
  children: ReactNode;
  defaultCollapsed?: boolean;
}

export function ShellProvider({ children, defaultCollapsed = false }: ShellProviderProps) {
  const [isCollapsed, setCollapsed] = useState(defaultCollapsed);
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    setIsMobile(mql.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
      if (!e.matches) {
        // If we switch to desktop, always close the mobile overlay
        setMobileOpen(false);
      }
    };
    
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen((o) => !o);
    } else {
      setCollapsed((c) => !c);
    }
  };

  return (
    <ShellContext.Provider
      value={{
        isCollapsed,
        setCollapsed,
        isMobileOpen,
        setMobileOpen,
        isMobile,
        toggleSidebar,
      }}
    >
      {children}
    </ShellContext.Provider>
  );
}

export function useShell() {
  const ctx = useContext(ShellContext);
  if (!ctx) {
    throw new Error('useShell must be used within a ShellProvider');
  }
  return ctx;
}
