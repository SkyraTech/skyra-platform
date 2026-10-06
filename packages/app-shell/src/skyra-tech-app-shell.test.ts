import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SkyraAppShell, registerAppShell } from './skyra-tech-app-shell';

describe('SkyraAppShell Web Component', () => {
  beforeEach(() => {
    registerAppShell();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should register custom element', () => {
    expect(customElements.get('skyra-tech-app-shell')).toBeDefined();
    expect(customElements.get('skyra-tech-app-shell')).toBe(SkyraAppShell);
  });

  it('should render correctly', () => {
    const el = document.createElement('skyra-tech-app-shell');
    document.body.appendChild(el);
    expect(el.shadowRoot).toBeDefined();
    
    // Check parts
    expect(el.shadowRoot?.querySelector('.skyra-sidebar-container')).toBeTruthy();
    expect(el.shadowRoot?.querySelector('.skyra-main-container')).toBeTruthy();
    expect(el.shadowRoot?.querySelector('.skyra-header-container')).toBeTruthy();
    expect(el.shadowRoot?.querySelector('.skyra-content-container')).toBeTruthy();
  });

  it('should reflect collapsed property to attribute', () => {
    const el = document.createElement('skyra-tech-app-shell') as SkyraAppShell;
    document.body.appendChild(el);
    
    expect(el.collapsed).toBe(false);
    expect(el.hasAttribute('collapsed')).toBe(false);
    
    el.collapsed = true;
    expect(el.hasAttribute('collapsed')).toBe(true);
    
    el.collapsed = false;
    expect(el.hasAttribute('collapsed')).toBe(false);
  });

  it('should reflect mobileOpen property to attribute', () => {
    const el = document.createElement('skyra-tech-app-shell') as SkyraAppShell;
    document.body.appendChild(el);
    
    expect(el.mobileOpen).toBe(false);
    expect(el.hasAttribute('mobile-open')).toBe(false);
    
    el.mobileOpen = true;
    expect(el.hasAttribute('mobile-open')).toBe(true);
    
    el.mobileOpen = false;
    expect(el.hasAttribute('mobile-open')).toBe(false);
  });

  it('should trigger skyra-sidebar-toggle event on toggle', () => {
    const el = document.createElement('skyra-tech-app-shell') as SkyraAppShell;
    document.body.appendChild(el);
    
    const mockFn = vi.fn();
    el.addEventListener('skyra-sidebar-toggle', mockFn);
    
    el.toggle(); // desktop defaults to toggling collapsed
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn.mock.calls[0][0].detail).toEqual({ collapsed: true, isMobile: false });
  });

  it('should close mobile sidebar when backdrop is clicked', () => {
    const el = document.createElement('skyra-tech-app-shell') as SkyraAppShell;
    document.body.appendChild(el);
    
    el.mobileOpen = true;
    expect(el.mobileOpen).toBe(true);
    
    const backdrop = el.shadowRoot?.querySelector('.skyra-sidebar-backdrop') as HTMLElement;
    backdrop.click();
    
    expect(el.mobileOpen).toBe(false);
  });

  it('should close mobile sidebar on Escape key', () => {
    const el = document.createElement('skyra-tech-app-shell') as SkyraAppShell;
    document.body.appendChild(el);
    
    el.mobileOpen = true;
    
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    
    expect(el.mobileOpen).toBe(false);
  });
});
