/**
 * @id app-shell-basic
 * @title Basic Application Shell
 * @apiId @skyra/app-shell::ApplicationShell
 * @packageId @skyra/app-shell
 */
import React from 'react';
import { ApplicationShell, MainContent, Header, Sidebar, SidebarNavigation, SidebarItem } from '@skyra/app-shell';
import { LayoutDashboard, Settings } from 'lucide-react';

export default function AppShellBasicExample() {
  return (
    <div style={{ height: '400px', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)', overflow: 'hidden', position: 'relative' }}>
      <ApplicationShell defaultCollapsed={false}>
        <Sidebar>
          <SidebarNavigation>
            <SidebarItem href="#" label="Dashboard" icon={<LayoutDashboard size={18} />} active />
            <SidebarItem href="#" label="Settings" icon={<Settings size={18} />} />
          </SidebarNavigation>
        </Sidebar>
        <MainContent>
          <Header>
            <div style={{ fontWeight: 600 }}>Example Header</div>
          </Header>
          <div style={{ padding: '1.5rem' }}>
            <p style={{ color: 'var(--skyra-text-muted)' }}>Main application content area goes here.</p>
          </div>
        </MainContent>
      </ApplicationShell>
    </div>
  );
}
