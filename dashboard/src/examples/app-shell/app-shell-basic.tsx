/**
 * @id app-shell-basic
 * @title Basic Application Shell
 * @apiId @skyra-tech-platform/app-shell::skyra-tech-app-shell
 * @packageId @skyra-tech-platform/app-shell
 */
import React from 'react';
import { LayoutDashboard, Settings } from 'lucide-react';

export default function AppShellBasicExample() {
  return (
    <div style={{ height: '400px', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)', overflow: 'hidden', position: 'relative' }}>
      <skyra-tech-app-shell>
        <div slot="sidebar" className="skyra-sidebar-navigation" style={{ height: '100%', backgroundColor: 'var(--skyra-sidebar-bg)' }}>
          <a href="#" className="skyra-sidebar-item" data-active="true" onClick={(e) => e.preventDefault()}>
            <span className="skyra-sidebar-item-icon"><LayoutDashboard size={18} /></span>
            <span className="skyra-sidebar-item-label">Dashboard</span>
          </a>
          <a href="#" className="skyra-sidebar-item" onClick={(e) => e.preventDefault()}>
            <span className="skyra-sidebar-item-icon"><Settings size={18} /></span>
            <span className="skyra-sidebar-item-label">Settings</span>
          </a>
        </div>
        
        <div slot="header" style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '0 1rem' }}>
          <div style={{ fontWeight: 600 }}>Example Header</div>
        </div>
        
        <div style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--skyra-text-muted)' }}>Main application content area goes here.</p>
        </div>
      </skyra-tech-app-shell>
    </div>
  );
}
